/**
 * entry-server.koda.ts
 * Server-side entry point - Middleware proxy (Next.js style)
 * Qwik-style performance optimizations
 */

import type { KodaServerEntry } from '../../core/framework/entries';
import { serverUtils } from '../../core/framework/entries';


import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';


// Server entry implementation
const serverEntry: KodaServerEntry = {
  /**
   * Middleware proxy (Next.js middleware.ts equivalent)
   */
  async middleware(request: Request): Promise<Request | Response> {
    const url = new URL(request.url);

    // Security middleware
    if (url.pathname.includes('admin') && !isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Rewrite rules
    if (url.pathname.startsWith('/old-path')) {
      const newUrl = new URL(request.url);
      newUrl.pathname = url.pathname.replace('/old-path', '/new-path');
      return Response.redirect(newUrl.toString(), 301);
    }

    // Continue to next middleware
    return request;
  },

  /**
   * Critical CSS extraction (Qwik approach)
   */
  extractCriticalCSS(html: string) {
    const usedClasses = serverUtils.extractUsedClasses(html);
    const criticalCSS = serverUtils.generateCriticalCSS(usedClasses);

    return { usedClasses, criticalCSS };
  },

  /**
   * SSR rendering with critical CSS
   */
  async render(request: Request) {
    try {
      // Create router (would be auto-generated from file-based routes)
      const routes: any[] = []; // Auto-discovered routes
      const { query, dataRoutes } = createStaticHandler(routes);
      const context = await query(request);

      if (context instanceof Response) {
        return { html: '', context, criticalCSS: '' };
      }

      const router = createStaticRouter(dataRoutes, context);

      // Render to string first (Qwik approach)
      const html = renderToString(
        <StaticRouterProvider router={router} context={context} />
      );


      // Extract critical CSS from rendered HTML
      const { usedClasses, criticalCSS } = this.extractCriticalCSS!(html);

      // Inject critical CSS
      const finalHtml = serverUtils.injectCriticalCSS(html, criticalCSS);

      console.log(`[Koda SSR] Generated critical CSS for ${usedClasses.length} classes`);

      return {
        html: finalHtml,
        context,
        criticalCSS
      };
    } catch (error) {
      console.error('[Koda SSR] Render error:', error);
      return {
        html: '<div>Server Error</div>',
        context: null,
        criticalCSS: ''
      };
    }
  },

  /**
   * Server-side data loading
   */
  async loader(request: Request) {
    const url = new URL(request.url);

    // Global data loading (like Next.js getServerSideProps)
    const globalData = {
      timestamp: Date.now(),
      path: url.pathname,
      userAgent: request.headers.get('user-agent'),
    };

    // Route-specific data loading would be handled by file-based loaders
    return globalData;
  }
};

// Helper functions
function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie');
  return cookie?.includes('auth-token') || false;
}

export default serverEntry;
