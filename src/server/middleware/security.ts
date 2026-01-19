import { Context, Next } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { rateLimiter } from "hono-rate-limiter";
import { logger } from "../lib/logger";
import { env } from "../env";

// 1. Secure Headers
export const securityHeaders = secureHeaders({
    // HSTS enabled for production
    strictTransportSecurity: env.NODE_ENV === 'production'
        ? 'max-age=63072000; includeSubDomains; preload'
        : false,
    xFrameOptions: 'DENY',
    xXssProtection: '1; mode=block',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    // CSP: Allow scripts from self and inline (React often needs inline styles/scripts in dev)
    // We can tighten this later
    contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.google.com", "https://*.gstatic.com", "https://app.midtrans.com"], // unsafe-eval needed for some dev tools / maps
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: ["'self'", "https://*.googleapis.com", "https://*.turso.io", "https://app.midtrans.com", "https://api.midtrans.com", "https://api.sandbox.midtrans.com"], // Allow API calls
    }
});

// 2. Rate Limiter (General API)
// Limit: 100 requests per minute per IP
export const apiLimiter = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 100,
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown",
});

// 3. Rate Limiter (Auth - Strict)
// Limit: 5 attempts per minute per IP
export const authLimiter = rateLimiter({
    windowMs: 60 * 1000,
    limit: 10,  // Slightly relaxed for dev but strict enough for brute force
    message: "Too many login attempts, please try again later.",
    keyGenerator: (c) => c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown",
});

// 4. Request Logger
export const requestLogger = async (c: Context, next: Next) => {
    const start = Date.now();
    const { method, url } = c.req;

    await next();

    const ms = Date.now() - start;
    const { status } = c.res;

    // Log level based on status
    if (status >= 500) {
        logger.error(`Request Failed`, { method, url, status, ms });
    } else if (status >= 400) {
        logger.warn(`Client Error`, { method, url, status, ms });
    } else {
        logger.info(`Request Completed`, { method, url, status, ms });
    }
};
