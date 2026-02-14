/**
 * Koda Zenith - Entry Point System
 * Proper naming conventions for server/client entries
 */

export interface KodaServerEntry {
  // Server-side middleware proxy (Next.js style)
  middleware?: (request: Request) => Promise<Request | Response>;

  // Critical CSS extraction (Qwik style)
  extractCriticalCSS?: (html: string) => {
    usedClasses: string[];
    criticalCSS: string;
  };

  // SSR rendering
  render?: (request: Request) => Promise<{
    html: string;
    context: any;
    criticalCSS?: string;
  }>;

  // Server-side data loading
  loader?: (request: Request) => Promise<any>;
}

export interface ZenClientEntry {
  // Client-side hydration with freedom
  hydrate?: (element: HTMLElement, data?: any) => void;

  // Progressive enhancement
  enhance?: () => void;

  // Client-side routing
  router?: {
    navigate: (path: string) => void;
    prefetch: (path: string) => Promise<void>;
  };

  // State management freedom
  store?: any;

  // Custom client logic
  init?: () => void;

  // Zenith Extension Points
  loadComponent?: (name: string, props: any) => Promise<any>;
  handleFormSubmission?: (formData: FormData, form: Element) => Promise<void>;
  setupLazyLoading?: (element: Element) => void;
  setupInfiniteScroll?: (element: Element) => void;
  setupRealTimeUpdates?: (element: Element) => void;
  setupPerformanceMonitoring?: () => void;
  setupServiceWorker?: () => void;
  customInit?: () => void;
}


// Entry point discovery (Optimized for ESM & Edge)
export function discoverEntries(): {
  serverEntry?: KodaServerEntry;
  clientEntry?: ZenClientEntry;
} {
  // In Zenith framework, we link to the known entry locations.
  // These are typically resolved by the build system.
  // We use placeholders here that are populated during the build or via static imports.

  return {
    // We will attempt to use global variables or static links if available
    serverEntry: (globalThis as any).__KODA_SERVER_ENTRY__,
    clientEntry: (globalThis as any).__ZEN_CLIENT_ENTRY__
  };
}

/**
 * Intelligent Entry Linker
 * Used to manually register entries when dynamic discovery is limited
 */
export function registerEntries(entries: { server?: KodaServerEntry; client?: ZenClientEntry }) {
  if (entries.server) (globalThis as any).__KODA_SERVER_ENTRY__ = entries.server;
  if (entries.client) (globalThis as any).__ZEN_CLIENT_ENTRY__ = entries.client;
}



// Server entry utilities
export const serverUtils = {
  /**
   * Qwik-style critical CSS extraction
   */
  extractUsedClasses(html: string): string[] {
    const classRegex = /class="([^"]+)"/g;
    const classes = new Set<string>();
    let match;

    while ((match = classRegex.exec(html)) !== null) {
      const classList = match[1].split(/\s+/);
      classList.forEach(cls => {
        if (cls.trim()) classes.add(cls.trim());
      });
    }

    return Array.from(classes);
  },

  /**
   * Generate critical CSS from used classes
   */
  generateCriticalCSS(usedClasses: string[], fullCSS?: string): string {
    if (!fullCSS) {
      // In real implementation, this would read from built CSS files
      return `/* Critical CSS for ${usedClasses.length} classes */`;
    }

    // Extract only CSS rules for used classes
    const criticalRules: string[] = [];

    usedClasses.forEach(className => {
      const regex = new RegExp(`\\.${className}\\b[^{]*\\{[^}]*\\}`, 'g');
      const matches = fullCSS.match(regex);
      if (matches) {
        criticalRules.push(...matches);
      }
    });

    return criticalRules.join('\n');
  },

  /**
   * Inject critical CSS into HTML
   */
  injectCriticalCSS(html: string, criticalCSS: string): string {
    return html.replace(
      '<head>',
      `<head><style data-koda-critical>${criticalCSS}</style>`
    );
  }
};

// Client entry utilities  
export const clientUtils = {
  /**
   * Progressive hydration with freedom
   */
  progressiveHydrate(selector: string, component: any, data?: any): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      // User has freedom to implement their own hydration strategy
      if (typeof component === 'function') {
        component(element, data);
      }
    });
  },

  /**
   * Zen-style router (minimal, flexible)
   */
  createZenRouter(routes: Record<string, () => void>) {
    return {
      navigate(path: string) {
        history.pushState({}, '', path);
        const handler = routes[path];
        if (handler) handler();
      },

      async prefetch(path: string) {
        // User can implement their own prefetch strategy
        console.log(`Prefetching: ${path}`);
      }
    };
  },

  /**
   * Freedom to enhance any element
   */
  enhance(selector: string, enhancer: (element: Element) => void): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach(enhancer);
  }
};
