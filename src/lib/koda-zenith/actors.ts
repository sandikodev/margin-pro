/**
 * Koda Zenith - Actor System
 * Elixir/OTP + NestJS inspired enterprise patterns
 */

import { kodaContext } from './context';

export interface ActorMessage {
  type: string;
  payload?: any;
  sender?: string;
  timestamp: number;
}

export interface ActorState {
  [key: string]: any;
}

export abstract class Actor<TState extends ActorState = ActorState> {
  protected state: TState;
  private messageQueue: Array<{
    message: ActorMessage;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;

  constructor(initialState: TState) {
    this.state = initialState;
  }

  /**
   * Send message to actor (async)
   */
  async call(type: string, payload?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const message: ActorMessage = {
        type,
        payload,
        sender: kodaContext.current()?.requestId,
        timestamp: Date.now()
      };

      this.messageQueue.push({ message, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Send message without waiting for response
   */
  cast(type: string, payload?: any): void {
    const message: ActorMessage = {
      type,
      payload,
      sender: kodaContext.current()?.requestId,
      timestamp: Date.now()
    };

    this.messageQueue.push({
      message,
      resolve: () => {},
      reject: () => {}
    });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.messageQueue.length > 0) {
      const { message, resolve, reject } = this.messageQueue.shift()!;
      
      try {
        const handlerName = `handle${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`;
        const handler = (this as any)[handlerName];

        if (handler && typeof handler === 'function') {
          const result = await handler.call(this, message.payload, message);
          resolve(result);
        } else {
          reject(new Error(`No handler for message type: ${message.type}`));
        }
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  /**
   * Update actor state (immutable)
   */
  protected setState(updates: Partial<TState>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Get current state (readonly)
   */
  getState(): Readonly<TState> {
    return this.state;
  }

  /**
   * Broadcast event to global event system
   */
  protected broadcast(event: string, data: any): void {
    if (typeof globalThis !== 'undefined') {
      globalThis.dispatchEvent(new CustomEvent(`koda:${event}`, { detail: data }));
    }
  }

  /**
   * Subscribe to global events
   */
  protected subscribe(event: string, handler: (data: any) => void): () => void {
    if (typeof globalThis === 'undefined') return () => {};

    const eventHandler = (e: CustomEvent) => handler(e.detail);
    globalThis.addEventListener(`koda:${event}`, eventHandler as EventListener);
    
    return () => {
      globalThis.removeEventListener(`koda:${event}`, eventHandler as EventListener);
    };
  }
}

/**
 * Supervisor for managing multiple actors (OTP-style)
 */
export class Supervisor {
  private actors = new Map<string, Actor>();
  private restartStrategies = new Map<string, 'permanent' | 'temporary' | 'transient'>();

  /**
   * Start actor under supervision
   */
  startActor<T extends Actor>(
    id: string, 
    actorClass: new (...args: any[]) => T, 
    args: any[] = [],
    strategy: 'permanent' | 'temporary' | 'transient' = 'permanent'
  ): T {
    const actor = new actorClass(...args);
    this.actors.set(id, actor);
    this.restartStrategies.set(id, strategy);
    return actor;
  }

  /**
   * Get actor by ID
   */
  getActor<T extends Actor>(id: string): T | undefined {
    return this.actors.get(id) as T;
  }

  /**
   * Stop actor
   */
  stopActor(id: string): void {
    this.actors.delete(id);
    this.restartStrategies.delete(id);
  }

  /**
   * Restart actor (fault tolerance)
   */
  async restartActor(id: string): Promise<void> {
    const strategy = this.restartStrategies.get(id);
    if (strategy === 'temporary') {
      this.stopActor(id);
      return;
    }

    // Implement restart logic based on strategy
    kodaContext.log('warn', 'Actor restarted', { actorId: id, strategy });
  }
}

// Global supervisor instance
export const supervisor = new Supervisor();

/**
 * React hook for actor integration
 */
export function useActor<T extends Actor, R = any>(
  actor: T,
  messageType: string,
  payload?: any,
  deps: any[] = []
): { data: R | null; loading: boolean; error: Error | null } {
  const [state, setState] = React.useState<{
    data: R | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  React.useEffect(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    actor.call(messageType, payload)
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, [actor, messageType, JSON.stringify(payload), ...deps]);

  return state;
}

/**
 * Convert actor to Hono route handler
 */
export function actorToHono(actor: Actor) {
  return {
    async post(c: any) {
      try {
        const { messageType, payload } = await c.req.json();
        const result = await actor.call(messageType, payload);
        return c.json({ success: true, data: result });
      } catch (error) {
        return c.json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }, 500);
      }
    }
  };
}
