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
}

// Entry point discovery
export function discoverEntries(): {
  serverEntry?: KodaServerEntry;
  clientEntry?: ZenClientEntry;
} {
  let serverEntry: KodaServerEntry | undefined;
  let clientEntry: ZenClientEntry | undefined;
  
  // Try to import server entry
  try {
    // In real implementation, this would be resolved at build time
    serverEntry = require('./entry-server.koda').default;
  } catch (e) {
    // Fallback to .ts extension
    try {
      serverEntry = require('./entry-server.koda.ts').default;
    } catch (e) {
      console.warn('No server entry found (entry-server.koda.ts)');
    }
  }
  
  // Try to import client entry
  try {
    clientEntry = require('./entry-client.zen').default;
  } catch (e) {
    try {
      clientEntry = require('./entry-client.zen.tsx').default;
    } catch (e) {
      console.warn('No client entry found (entry-client.zen.tsx)');
    }
  }
  
  return { serverEntry, clientEntry };
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
