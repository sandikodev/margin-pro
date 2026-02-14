/**
 * Koda Zenith - Security Middleware
 * Production-grade security with zero dependencies
 */

import type { MiddlewareHandler } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { kodaContext } from './context';

export interface SecurityConfig {
  csp?: Record<string, string[]>;
  rateLimit?: {
    windowMs: number;
    limit: number;
    skipSuccessfulRequests?: boolean;
  };
  sanitize?: boolean;
  cors?: {
    origin?: string | string[];
    credentials?: boolean;
  };
}

// Simple in-memory rate limiter (edge-compatible)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export function createSecurityMiddleware(config: SecurityConfig = {}): MiddlewareHandler[] {
  const middleware: MiddlewareHandler[] = [];

  // Rate limiting
  if (config.rateLimit) {
    const { windowMs, limit, skipSuccessfulRequests } = config.rateLimit;
    
    middleware.push(async (c, next) => {
      const ip = c.req.header('cf-connecting-ip') || 
                 c.req.header('x-forwarded-for') || 
                 c.req.header('x-real-ip') || 
                 'unknown';
      
      const path = new URL(c.req.url).pathname;
      const key = getRateLimitKey(ip, path);
      const now = Date.now();
      
      // Cleanup old entries periodically
      if (Math.random() < 0.01) cleanupRateLimit();
      
      let record = rateLimitStore.get(key);
      if (!record || now > record.resetTime) {
        record = { count: 0, resetTime: now + windowMs };
        rateLimitStore.set(key, record);
      }
      
      record.count++;
      
      if (record.count > limit) {
        kodaContext.log('warn', 'Rate limit exceeded', { ip, path, count: record.count });
        return c.json({ error: 'Too Many Requests' }, 429);
      }
      
      await next();
      
      // Reset counter for successful requests if configured
      if (skipSuccessfulRequests && c.res.status < 400) {
        record.count = Math.max(0, record.count - 1);
      }
    });
  }

  // Input sanitization
  if (config.sanitize !== false) {
    middleware.push(async (c, next) => {
      const userAgent = c.req.header('user-agent') || '';
      const referer = c.req.header('referer') || '';
      
      // Basic XSS protection
      const dangerousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /onload\s*=/gi,
        /onerror\s*=/gi
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(userAgent) || pattern.test(referer)) {
          kodaContext.log('warn', 'Suspicious request blocked', { userAgent, referer });
          return c.text('Request blocked for security reasons', 400);
        }
      }
      
      await next();
    });
  }

  // Security headers
  middleware.push(secureHeaders({
    contentSecurityPolicy: config.csp as any,
    crossOriginEmbedderPolicy: false, // Disable for compatibility
  }));

  // CORS handling
  if (config.cors) {
    middleware.push(async (c, next) => {
      const origin = c.req.header('origin');
      const { origin: allowedOrigins, credentials } = config.cors!;
      
      if (allowedOrigins) {
        const allowed = Array.isArray(allowedOrigins) 
          ? allowedOrigins.includes(origin || '') 
          : allowedOrigins === origin;
        
        if (allowed) {
          c.header('Access-Control-Allow-Origin', origin || '');
          if (credentials) {
            c.header('Access-Control-Allow-Credentials', 'true');
          }
        }
      }
      
      await next();
    });
  }

  return middleware;
}

// Performance monitoring middleware
export function performanceMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();
    
    await next();
    
    const duration = Date.now() - start;
    const ctx = kodaContext.current();
    
    if (ctx) {
      ctx.metadata.responseTime = duration;
      ctx.metadata.statusCode = c.res.status;
      ctx.metadata.method = c.req.method;
      ctx.metadata.path = new URL(c.req.url).pathname;
    }
    
    // Log slow requests
    if (duration > 1000) {
      kodaContext.log('warn', 'Slow request detected', {
        duration: `${duration}ms`,
        method: c.req.method,
        path: new URL(c.req.url).pathname,
        status: c.res.status
      });
    }
    
    // Add performance headers
    c.header('X-Response-Time', `${duration}ms`);
    if (ctx) {
      c.header('X-Request-ID', ctx.requestId);
    }
  };
}
