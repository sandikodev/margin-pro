/**
 * Koda Zenith Framework - Enhanced Production Framework
 * Edge Runtime Compatible | Zero Dependencies | Enterprise Ready
 * 
 * Hybrid Architecture:
 * - Next.js-style file-based routing
 * - SvelteKit-inspired conventions  
 * - Qwik-style performance optimizations
 * - NestJS/Spring enterprise patterns
 * - Elixir/OTP actor system
 * - Spatial computing ready (Vision Pro, BCI)
 */

import { Hono } from 'hono';
import type { MiddlewareHandler, Env, Schema } from 'hono';

// Re-export core modules
export { env } from './env';
export { kodaContext } from './context';
export { createSecurityMiddleware, performanceMiddleware } from './security';
export { kodaDX, KodaError } from './dx';

// Re-export advanced modules
export { createRoutes, createLoaderMiddleware, createActionMiddleware, renderWithCriticalCSS } from './routing';
export { Actor, Supervisor, supervisor, useActor, actorToHono } from './actors';
export { Spatial } from './spatial';

// Re-export entry system
export { discoverEntries, serverUtils, clientUtils } from './entries';
export type { KodaServerEntry, ZenClientEntry } from './entries';

// Re-export types
export type { SecurityConfig } from './security';
export type { KodaContext } from './context';
export type { KodaEnv, KodaRuntime } from './env';
export type { RouteModule, KodaRoute } from './routing';

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
  
  // File-based routing (Next.js/SvelteKit style)
  routing: {
    createRoutes,
    createLoaderMiddleware,
    createActionMiddleware,
    renderWithCriticalCSS
  },
  
  // Actor system (Elixir/OTP style)
  actors: {
    Actor,
    Supervisor,
    supervisor,
    useActor,
    actorToHono
  },
  
  // Spatial computing (Vision Pro/BCI ready)
  spatial: Spatial,
  
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
      routes?: RouteModule[];
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
      
      // Add file-based routing if provided
      if (config?.routes) {
        const routes = createRoutes(config.routes as any);
        app.use('*', createLoaderMiddleware(routes));
        app.use('*', createActionMiddleware(routes));
      }
      
      return app;
    },
    
    /**
     * Development setup with enhanced debugging
     */
    development: (config?: {
      routes?: RouteModule[];
      enableSpatial?: boolean;
    }) => {
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
      
      // Add file-based routing if provided
      if (config?.routes) {
        const routes = createRoutes(config.routes as any);
        app.use('*', createLoaderMiddleware(routes));
        app.use('*', createActionMiddleware(routes));
      }
      
      // Enable spatial computing dev tools
      if (config?.enableSpatial) {
        app.get('/api/spatial/simulate/:type', async (c) => {
          const type = c.req.param('type') as any;
          if (type === 'gesture') {
            Spatial.dev.simulateGesture('air_tap');
          } else if (type === 'bci') {
            Spatial.dev.simulateBCISignal('focus');
          }
          return c.json({ simulated: type });
        });
      }
      
      return app;
    },
    
    /**
     * Next.js-style app with file-based routing
     */
    nextjs: (routeModules: Record<string, RouteModule>) => {
      const app = createKoda();
      const routes = createRoutes(routeModules);
      
      app.use('*', performanceMiddleware());
      app.use('*', createLoaderMiddleware(routes));
      app.use('*', createActionMiddleware(routes));
      
      return app;
    },
    
    /**
     * Enterprise setup with actor system
     */
    enterprise: (config?: {
      actors?: Array<{ id: string; actor: new (...args: any[]) => Actor; args?: any[] }>;
      rateLimit?: { windowMs: number; limit: number };
    }) => {
      const app = createKoda();
      
      // Start supervised actors
      if (config?.actors) {
        for (const { id, actor: ActorClass, args = [] } of config.actors) {
          supervisor.startActor(id, ActorClass, args, 'permanent');
        }
      }
      
      // Add enterprise middleware
      app.use('*', performanceMiddleware());
      app.use('*', ...createSecurityMiddleware({
        rateLimit: config?.rateLimit || { windowMs: 60000, limit: 1000 },
        sanitize: true
      }));
      
      // Actor API endpoints
      app.post('/api/actors/:id', async (c) => {
        const actorId = c.req.param('id');
        const actor = supervisor.getActor(actorId);
        
        if (!actor) {
          return c.json({ error: 'Actor not found' }, 404);
        }
        
        return actorToHono(actor).post(c);
      });
      
      return app;
    }
  }
});

export type { MiddlewareHandler };
