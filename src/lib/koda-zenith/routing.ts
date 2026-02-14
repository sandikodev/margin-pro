/**
 * Koda Zenith - File-based Routing System
 * Next.js + SvelteKit + Qwik hybrid approach
 */

import { Hono } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { kodaContext } from './context';

export interface RouteModule {
  loader?: (args: { request: Request; params: Record<string, string> }) => Promise<any>;
  action?: (args: { request: Request; params: Record<string, string> }) => Promise<any>;
  default?: React.ComponentType<any>;
  ErrorBoundary?: React.ComponentType<any>;
}

export interface KodaRoute {
  path: string;
  module: RouteModule;
  children?: KodaRoute[];
}

// File-based routing discovery (build-time)
export function createRoutes(routeModules: Record<string, RouteModule>): KodaRoute[] {
  const routes: KodaRoute[] = [];
  
  for (const [filePath, module] of Object.entries(routeModules)) {
    // Convert file path to route path
    // src/app/dashboard/+page.tsx -> /dashboard
    // src/app/dashboard/settings/+page.tsx -> /dashboard/settings
    const routePath = filePath
      .replace(/^src\/app/, '')
      .replace(/\/\+page\.(tsx?|jsx?)$/, '')
      .replace(/\/\+layout\.(tsx?|jsx?)$/, '')
      .replace(/\/index$/, '')
      || '/';
    
    routes.push({
      path: routePath,
      module
    });
  }
  
  return routes;
}

// SSR with critical CSS extraction (Qwik-style)
export async function renderWithCriticalCSS(
  html: string,
  extractUsedClasses: (html: string) => string[],
  generateCriticalCSS: (classes: string[]) => string
) {
  const usedClasses = extractUsedClasses(html);
  const criticalCSS = generateCriticalCSS(usedClasses);
  
  kodaContext.log('info', 'Critical CSS generated', { 
    classCount: usedClasses.length,
    cssSize: criticalCSS.length 
  });
  
  return {
    html: html.replace(
      '<head>',
      `<head><style data-koda-critical>${criticalCSS}</style>`
    ),
    criticalCSS,
    usedClasses
  };
}

// Route loader middleware (SvelteKit-style)
export function createLoaderMiddleware(routes: KodaRoute[]): MiddlewareHandler {
  return async (c, next) => {
    const url = new URL(c.req.url);
    const pathname = url.pathname;
    
    // Find matching route
    const route = routes.find(r => r.path === pathname || pathname.startsWith(r.path + '/'));
    
    if (route?.module.loader) {
      const params = {}; // Extract from path params
      const loaderData = await route.module.loader({
        request: c.req.raw,
        params
      });
      
      // Store loader data in context
      kodaContext.set('loaderData', loaderData);
    }
    
    await next();
  };
}

// Action handler middleware (form submissions)
export function createActionMiddleware(routes: KodaRoute[]): MiddlewareHandler {
  return async (c, next) => {
    if (c.req.method !== 'POST') {
      await next();
      return;
    }
    
    const url = new URL(c.req.url);
    const pathname = url.pathname;
    
    const route = routes.find(r => r.path === pathname);
    
    if (route?.module.action) {
      const params = {};
      const result = await route.module.action({
        request: c.req.raw,
        params
      });
      
      return c.json(result);
    }
    
    await next();
  };
}
