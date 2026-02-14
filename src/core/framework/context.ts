/**
 * Koda Zenith - Request Context & Tracing
 * Edge Compatible | Performance Optimized
 */

export interface KodaContext {
  requestId: string;
  startTime: number;
  metadata: Record<string, any>;
  performance: {
    dbQueries: number;
    dbTime: number;
    cacheHits: number;
    cacheMisses: number;
  };
}

// Edge-compatible context storage
const contextMap = new Map<string, KodaContext>();
let currentRequestId: string | undefined;
const history: KodaContext[] = [];
const MAX_HISTORY = 50;

export const kodaContext = {
  /**
   * Run function within request context
   */
  run<T>(ctx: Partial<KodaContext>, fn: () => T): T {
    const fullContext: KodaContext = {
      requestId: ctx.requestId || crypto.randomUUID(),
      startTime: ctx.startTime || Date.now(),
      metadata: ctx.metadata || {},
      performance: {
        dbQueries: 0,
        dbTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        ...ctx.performance
      }
    };
    
    contextMap.set(fullContext.requestId, fullContext);
    currentRequestId = fullContext.requestId;
    
    // Dev history tracking
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      history.unshift(fullContext);
      if (history.length > MAX_HISTORY) history.pop();
    }
    
    try {
      return fn();
    } finally {
      contextMap.delete(fullContext.requestId);
      currentRequestId = undefined;
    }
  },

  /**
   * Get current request context
   */
  current(): KodaContext | undefined {
    return currentRequestId ? contextMap.get(currentRequestId) : undefined;
  },

  /**
   * Update current context metadata
   */
  set(key: string, value: any): void {
    const ctx = this.current();
    if (ctx) {
      ctx.metadata[key] = value;
    }
  },

  /**
   * Track database query performance
   */
  trackDB(queryTime: number): void {
    const ctx = this.current();
    if (ctx) {
      ctx.performance.dbQueries++;
      ctx.performance.dbTime += queryTime;
    }
  },

  /**
   * Track cache performance
   */
  trackCache(hit: boolean): void {
    const ctx = this.current();
    if (ctx) {
      if (hit) {
        ctx.performance.cacheHits++;
      } else {
        ctx.performance.cacheMisses++;
      }
    }
  },

  /**
   * Get request performance metrics
   */
  getMetrics(): KodaContext['performance'] | null {
    const ctx = this.current();
    return ctx ? ctx.performance : null;
  },

  /**
   * Get development history (dev only)
   */
  getHistory(): KodaContext[] {
    return history;
  },

  /**
   * Structured logging with context
   */
  log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const ctx = this.current();
    const timestamp = new Date().toISOString();
    const requestId = ctx?.requestId || 'no-context';
    const duration = ctx ? Date.now() - ctx.startTime : 0;
    
    const logEntry = {
      timestamp,
      level,
      requestId,
      duration: `${duration}ms`,
      message,
      ...(data && { data })
    };
    
    console.log(JSON.stringify(logEntry));
  }
};
