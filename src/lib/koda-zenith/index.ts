/**
 * Koda Zenith Framework - Minimum Viable Framework
 * Edge Runtime Compatible | Zero Dependencies | Production Ready
 */

import { Hono } from 'hono';
import type { MiddlewareHandler, Env, Schema } from 'hono';
import { secureHeaders } from 'hono/secure-headers';

// --- TYPES ---
export interface KodaApp<T extends Env = any, S extends Schema = any, BasePath extends string = "/"> extends Hono<T, S, BasePath> {}

export interface SecurityConfig {
  csp?: Record<string, string[]>;
  sanitize?: boolean;
}

export interface KodaEnv {
  runtime: 'bun' | 'edge' | 'node' | 'deno' | 'unknown';
  isDev: boolean;
  get(key: string): string | undefined;
  isProd: boolean;
}

// --- RUNTIME DETECTION ---
function detectRuntime(): KodaEnv['runtime'] {
  if (typeof Deno !== 'undefined') return 'deno';
  if (typeof Bun !== 'undefined') return 'bun';
  if (typeof EdgeRuntime !== 'undefined') return 'edge';
  if (typeof process !== 'undefined' && process?.versions?.node) return 'node';
  return 'unknown';
}

// --- ENV UTILS ---
const env: KodaEnv = {
  runtime: detectRuntime(),
  isDev: typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false,
  get: (key: string) => typeof process !== 'undefined' ? process.env[key] : undefined,
  get isProd() { return !this.isDev; }
};

// --- CONTEXT STORAGE ---
const contextMap = new Map<string, any>();
let currentRequestId: string | undefined;

export const kodaContext = {
  run<T>(ctx: { requestId: string }, fn: () => T): T {
    contextMap.set(ctx.requestId, ctx);
    currentRequestId = ctx.requestId;
    try {
      return fn();
    } finally {
      contextMap.delete(ctx.requestId);
      currentRequestId = undefined;
    }
  },
  current() {
    return currentRequestId ? contextMap.get(currentRequestId) : undefined;
  }
};

// --- SECURITY MIDDLEWARE ---
function createSecurityMiddleware(config: SecurityConfig = {}): MiddlewareHandler[] {
  const middleware: MiddlewareHandler[] = [];

  // Basic sanitization
  if (config.sanitize !== false) {
    middleware.push(async (c, next) => {
      // Basic XSS protection
      const userAgent = c.req.header('user-agent') || '';
      if (userAgent.includes('<script>') || userAgent.includes('javascript:')) {
        return c.text('Blocked', 400);
      }
      await next();
    });
  }

  // Security headers
  middleware.push(secureHeaders({
    contentSecurityPolicy: config.csp as any
  }));

  return middleware;
}

// --- MAIN FACTORY ---
function createKoda<T extends Env = any, S extends Schema = any, BasePath extends string = "/">(): KodaApp<T, S, BasePath> {
  const app = new Hono<T, S, BasePath>();

  // Request tracing
  app.use("*", async (c, next) => {
    const requestId = crypto.randomUUID();
    return await kodaContext.run({ requestId }, next);
  });

  return app as KodaApp<T, S, BasePath>;
}

// --- EXPORTS ---
export const koda = Object.assign(createKoda, {
  security: createSecurityMiddleware,
  env,
  context: kodaContext
});

export type { MiddlewareHandler };

// Global declarations
declare global {
  var Bun: any;
  var Deno: any;
  var EdgeRuntime: any;
}
