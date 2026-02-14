/**
 * Koda Zenith Framework - Enhanced Production Framework
 * Edge Runtime Compatible | Zero Dependencies | Enterprise Ready
 */

import { Hono } from 'hono';
import type { MiddlewareHandler, Env, Schema } from 'hono';

// Re-export modules
export { env } from './env';
export { kodaContext } from './context';
export { createSecurityMiddleware, performanceMiddleware } from './security';
export { kodaDX, KodaError } from './dx';
export type { SecurityConfig } from './security';
export type { KodaContext } from './context';
export type { KodaEnv, KodaRuntime } from './env';

// --- MAIN FRAMEWORK ---
export interface KodaApp<T extends Env = any, S extends Schema = any, BasePath extends string = "/"> extends Hono<T, S, BasePath> {}

function createKoda<T extends Env = any, S extends Schema = any, BasePath extends string = "/">(): KodaApp<T, S, BasePath> {
  const app = new Hono<T, S, BasePath>();

  // Request context tracing
  app.use("*", async (c, next) => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    
    return await kodaContext.run({ requestId, startTime }, async () => {
      // Set request metadata
      kodaContext.set('method', c.req.method);
      kodaContext.set('path', new URL(c.req.url).pathname);
      kodaContext.set('userAgent', c.req.header('user-agent'));
      
      await next();
    });
  });

  return app as KodaApp<T, S, BasePath>;
}

// --- ENHANCED API ---
export const koda = Object.assign(createKoda, {
  // Security middleware factory
  security: createSecurityMiddleware,
  
  // Performance monitoring
  performance: performanceMiddleware,
  
  // Environment utilities
  env: () => import('./env').then(m => m.env),
  
  // Context utilities
  context: () => import('./context').then(m => m.kodaContext),
  
  // Development utilities
  dx: () => import('./dx').then(m => m.kodaDX),
  
  // Quick setup for common patterns
  setup: {
    /**
     * Production-ready setup with security and performance
     */
    production: (config?: { 
      rateLimit?: { windowMs: number; limit: number };
      csp?: Record<string, string[]>;
    }) => {
      const app = createKoda();
      
      // Add performance monitoring
      app.use('*', performanceMiddleware());
      
      // Add security middleware
      app.use('*', ...createSecurityMiddleware({
        rateLimit: config?.rateLimit || { windowMs: 60000, limit: 100 },
        csp: config?.csp,
        sanitize: true
      }));
      
      return app;
    },
    
    /**
     * Development setup with enhanced debugging
     */
    development: () => {
      const app = createKoda();
      
      // Add performance monitoring
      app.use('*', performanceMiddleware());
      
      // Add basic security (no rate limiting in dev)
      app.use('*', ...createSecurityMiddleware({
        sanitize: true,
        csp: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"]
        }
      }));
      
      return app;
    }
  }
});

export type { MiddlewareHandler };
