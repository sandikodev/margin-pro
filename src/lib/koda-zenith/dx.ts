/**
 * Koda Zenith - Development Experience Utilities
 * Enhanced debugging and development tools
 */

import { kodaContext } from './context';
import { env } from './env';

export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  context?: any;
  timestamp: string;
}

export class KodaError extends Error {
  public readonly context: any;
  public readonly timestamp: string;
  
  constructor(message: string, context?: any) {
    super(message);
    this.name = 'KodaError';
    this.context = context;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KodaError);
    }
  }
  
  toJSON(): ErrorInfo {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

export const kodaDX = {
  /**
   * Enhanced error handling with context
   */
  error(message: string, context?: any): KodaError {
    const error = new KodaError(message, context);
    kodaContext.log('error', message, { context, stack: error.stack });
    return error;
  },

  /**
   * Performance timing utility
   */
  time<T>(label: string, fn: () => T): T {
    const start = Date.now();
    try {
      const result = fn();
      const duration = Date.now() - start;
      kodaContext.log('info', `Performance: ${label}`, { duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      kodaContext.log('error', `Performance: ${label} (failed)`, { 
        duration: `${duration}ms`, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  },

  /**
   * Async performance timing
   */
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      kodaContext.log('info', `Performance: ${label}`, { duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      kodaContext.log('error', `Performance: ${label} (failed)`, { 
        duration: `${duration}ms`, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  },

  /**
   * Debug logging (dev only)
   */
  debug(message: string, data?: any): void {
    if (env.isDev) {
      kodaContext.log('info', `[DEBUG] ${message}`, data);
    }
  },

  /**
   * Assert utility with context
   */
  assert(condition: any, message: string, context?: any): asserts condition {
    if (!condition) {
      throw this.error(`Assertion failed: ${message}`, context);
    }
  },

  /**
   * Invariant utility (always throws in production)
   */
  invariant(condition: any, message: string, context?: any): asserts condition {
    if (!condition) {
      throw this.error(`Invariant violation: ${message}`, context);
    }
  },

  /**
   * Get current request diagnostics
   */
  getDiagnostics() {
    const ctx = kodaContext.current();
    if (!ctx) return null;
    
    return {
      requestId: ctx.requestId,
      duration: Date.now() - ctx.startTime,
      performance: ctx.performance,
      metadata: ctx.metadata,
      runtime: env.runtime,
      memory: this.getMemoryUsage()
    };
  },

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return {
        rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`
      };
    }
    
    // Browser/Edge runtime
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
      };
    }
    
    return null;
  }
};
