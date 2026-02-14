/**
 * Koda Zenith - Spatial Computing & Future Interfaces
 * Vision Pro, BCI, Gesture Recognition ready
 */

export namespace Spatial {
  export interface SpatialGesture {
    type: 'pinch' | 'swipe_left' | 'swipe_right' | 'air_tap' | 'grab' | 'release' | 'point';
    position: [number, number, number]; // 3D coordinates
    velocity?: [number, number, number];
    scale?: number;
    confidence: number;
    timestamp: number;
  }

  export interface BCISignal {
    type: 'focus' | 'intent_buy' | 'intent_sell' | 'query' | 'navigate' | 'select';
    intensity: number; // 0-1
    confidence: number; // 0-1
    timestamp: number;
    metadata?: {
      brainwave?: 'alpha' | 'beta' | 'gamma' | 'theta' | 'delta';
      emotion?: 'neutral' | 'excited' | 'focused' | 'stressed';
    };
  }

  export interface SpatialEntity {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    visible: boolean;
    interactive: boolean;
  }

  export class Space {
    private entities = new Map<string, Entity>();
    private gestureHandlers = new Map<string, (gesture: SpatialGesture) => void>();
    private bciHandlers = new Map<string, (signal: BCISignal) => void>();

    constructor(public dimensions: [number, number, number] = [10, 10, 10]) {}

    addEntity(entity: Entity): void {
      this.entities.set(entity.id, entity);
    }

    removeEntity(id: string): void {
      this.entities.delete(id);
    }

    getEntity(id: string): Entity | undefined {
      return this.entities.get(id);
    }

    onGesture(type: SpatialGesture['type'], handler: (gesture: SpatialGesture) => void): void {
      this.gestureHandlers.set(type, handler);
    }

    onBCISignal(type: BCISignal['type'], handler: (signal: BCISignal) => void): void {
      this.bciHandlers.set(type, handler);
    }

    // Simulate gesture input (for development)
    simulateGesture(gesture: SpatialGesture): void {
      const handler = this.gestureHandlers.get(gesture.type);
      if (handler) {
        handler(gesture);
      }

      // Broadcast to all entities
      for (const entity of this.entities.values()) {
        entity.onGesture(gesture);
      }
    }

    // Simulate BCI input (for development)
    simulateBCISignal(signal: BCISignal): void {
      const handler = this.bciHandlers.get(signal.type);
      if (handler) {
        handler(signal);
      }

      // Broadcast to all entities
      for (const entity of this.entities.values()) {
        entity.onNeuralSignal(signal);
      }
    }
  }

  export abstract class Entity implements SpatialEntity {
    public id: string;
    public position: [number, number, number];
    public rotation: [number, number, number] = [0, 0, 0];
    public scale: [number, number, number] = [1, 1, 1];
    public visible: boolean = true;
    public interactive: boolean = true;

    constructor(options: {
      id?: string;
      position: [number, number, number];
      rotation?: [number, number, number];
      scale?: [number, number, number];
    }) {
      this.id = options.id || Math.random().toString(36).substr(2, 9);
      this.position = options.position;
      if (options.rotation) this.rotation = options.rotation;
      if (options.scale) this.scale = options.scale;
    }

    // Override in subclasses
    onGesture(gesture: SpatialGesture): void {}
    onNeuralSignal(signal: BCISignal): void {}

    // Utility methods for creating 3D objects
    createCube(options: {
      size: [number, number, number];
      color: string;
      opacity?: number;
      material?: 'solid' | 'wireframe' | 'glass';
    }) {
      return {
        type: 'cube',
        id: this.id + '_cube_' + Date.now(),
        ...options
      };
    }

    createSphere(options: {
      radius: number;
      color: string;
      label?: string;
      material?: 'solid' | 'wireframe' | 'glass';
      onHover?: () => void;
      onClick?: () => void;
      onNeuralFocus?: () => void;
    }) {
      return {
        type: 'sphere',
        id: this.id + '_sphere_' + Date.now(),
        ...options
      };
    }

    createText(options: {
      text: string;
      fontSize: number;
      color: string;
      billboard?: boolean; // Always face camera
    }) {
      return {
        type: 'text',
        id: this.id + '_text_' + Date.now(),
        ...options
      };
    }

    // Movement and animation
    moveTo(position: [number, number, number], duration: number = 1000): Promise<void> {
      return new Promise(resolve => {
        const startPos = [...this.position] as [number, number, number];
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Linear interpolation
          this.position = [
            startPos[0] + (position[0] - startPos[0]) * progress,
            startPos[1] + (position[1] - startPos[1]) * progress,
            startPos[2] + (position[2] - startPos[2]) * progress
          ];

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        animate();
      });
    }

    // Spatial queries
    distanceTo(other: Entity): number {
      const dx = this.position[0] - other.position[0];
      const dy = this.position[1] - other.position[1];
      const dz = this.position[2] - other.position[2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    isNear(other: Entity, threshold: number = 1.0): boolean {
      return this.distanceTo(other) <= threshold;
    }
  }

  // Specialized entities for financial data
  export class PriceEntity extends Entity {
    constructor(
      position: [number, number, number],
      public symbol: string,
      public price: number,
      public change: number
    ) {
      super({ position });
    }

    onNeuralSignal(signal: BCISignal): void {
      if (signal.type === 'intent_buy' && signal.confidence > 0.8) {
        this.handleBuyIntent();
      } else if (signal.type === 'intent_sell' && signal.confidence > 0.8) {
        this.handleSellIntent();
      }
    }

    onGesture(gesture: SpatialGesture): void {
      if (gesture.type === 'air_tap') {
        this.showDetails();
      } else if (gesture.type === 'pinch') {
        this.adjustSize(gesture.scale || 1);
      }
    }

    private handleBuyIntent(): void {
      // Trigger buy action
      console.log(`Neural buy intent detected for ${this.symbol}`);
    }

    private handleSellIntent(): void {
      // Trigger sell action
      console.log(`Neural sell intent detected for ${this.symbol}`);
    }

    private showDetails(): void {
      // Show detailed price information
      console.log(`Showing details for ${this.symbol}: $${this.price} (${this.change > 0 ? '+' : ''}${this.change}%)`);
    }

    private adjustSize(scale: number): void {
      this.scale = [scale, scale, scale];
    }
  }

  // React hooks for spatial computing
  export function useSpatialGesture(
    onGesture: (gesture: SpatialGesture) => void,
    gestureTypes: SpatialGesture['type'][] = ['air_tap', 'pinch']
  ): void {
    React.useEffect(() => {
      // In real implementation, this would connect to gesture recognition API
      const handleGesture = (event: CustomEvent<SpatialGesture>) => {
        if (gestureTypes.includes(event.detail.type)) {
          onGesture(event.detail);
        }
      };

      globalThis.addEventListener('spatial:gesture', handleGesture as EventListener);
      return () => globalThis.removeEventListener('spatial:gesture', handleGesture as EventListener);
    }, [onGesture, gestureTypes]);
  }

  export function useBCISignal(
    onSignal: (signal: BCISignal) => void,
    signalTypes: BCISignal['type'][] = ['focus', 'intent_buy', 'intent_sell']
  ): void {
    React.useEffect(() => {
      // In real implementation, this would connect to BCI device API
      const handleSignal = (event: CustomEvent<BCISignal>) => {
        if (signalTypes.includes(event.detail.type)) {
          onSignal(event.detail);
        }
      };

      globalThis.addEventListener('bci:signal', handleSignal as EventListener);
      return () => globalThis.removeEventListener('bci:signal', handleSignal as EventListener);
    }, [onSignal, signalTypes]);
  }

  // Development utilities
  export const dev = {
    simulateGesture(type: SpatialGesture['type'], position: [number, number, number] = [0, 0, 0]): void {
      const gesture: SpatialGesture = {
        type,
        position,
        confidence: 0.9,
        timestamp: Date.now()
      };

      globalThis.dispatchEvent(new CustomEvent('spatial:gesture', { detail: gesture }));
    },

    simulateBCISignal(type: BCISignal['type'], intensity: number = 0.8): void {
      const signal: BCISignal = {
        type,
        intensity,
        confidence: 0.85,
        timestamp: Date.now(),
        metadata: {
          brainwave: 'beta',
          emotion: 'focused'
        }
      };

      globalThis.dispatchEvent(new CustomEvent('bci:signal', { detail: signal }));
    }
  };
}
