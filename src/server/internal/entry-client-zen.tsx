/**
 * entry-client.zen.tsx
 * Client-side entry point - Freedom & flexibility for developers
 * Zen philosophy: Minimal constraints, maximum freedom
 */

import type { ZenClientEntry } from '../../core/framework/entries';
import { clientUtils } from '../../core/framework/entries';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Client entry implementation with Zen philosophy
const clientEntry: ZenClientEntry = {
  /**
   * Zen hydration - Developer has full freedom
   */
  hydrate(element: HTMLElement, data?: any) {
    // Progressive hydration approach
    const islandElements = element.querySelectorAll('[data-koda-island]');

    islandElements.forEach(island => {
      const componentName = island.getAttribute('data-koda-island');
      const props = island.getAttribute('data-koda-props');

      // Developer can implement their own component loading strategy
      this.loadComponent?.(componentName!, JSON.parse(props || '{}'))
        ?.then(Component => {
          hydrateRoot(island, <Component {...JSON.parse(props || '{}')} />);
        });
    });
  },

  /**
   * Progressive enhancement - Zen approach
   */
  enhance() {
    // Enhance forms with better UX
    clientUtils.enhance('form[data-enhance]', (form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form as HTMLFormElement);

        // Developer freedom: implement their own form handling
        await this.handleFormSubmission?.(formData, form);
      });
    });

    // Enhance navigation
    clientUtils.enhance('a[data-prefetch]', (link) => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href) this.router?.prefetch(href);
      });
    });

    // Enhance interactive elements
    clientUtils.enhance('[data-zen-interactive]', (element) => {
      const interaction = element.getAttribute('data-zen-interactive');

      switch (interaction) {
        case 'lazy-load':
          this.setupLazyLoading?.(element);
          break;
        case 'infinite-scroll':
          this.setupInfiniteScroll?.(element);
          break;
        case 'real-time':
          this.setupRealTimeUpdates?.(element);
          break;
      }
    });
  },

  /**
   * Zen router - Minimal but powerful
   */
  router: clientUtils.createZenRouter({
    '/': () => console.log('Home page'),
    '/dashboard': () => console.log('Dashboard page'),
    '/settings': () => console.log('Settings page')
  }),

  /**
   * Zen store - Developer freedom for state management
   */
  store: {
    // Minimal reactive store
    state: new Proxy({}, {
      set(target: any, key: string, value: any) {
        target[key] = value;
        // Notify subscribers
        clientEntry.store.notify?.(key, value);
        return true;
      }
    }),

    subscribe(key: string, callback: (value: any) => void) {
      // Developer can implement their own subscription system
    },

    notify(key: string, value: any) {
      // Broadcast state changes
      document.dispatchEvent(new CustomEvent(`zen:state:${key}`, { detail: value }));
    }
  },

  /**
   * Zen initialization - Complete freedom
   */
  init() {
    console.log('🧘 Zen Client initialized - You have complete freedom');

    // Auto-enhance the page
    this.enhance?.();

    // Setup global error handling
    window.addEventListener('error', (e) => {
      console.error('Zen Error:', e.error);
      // Developer can implement their own error handling
    });

    // Setup performance monitoring
    if ('performance' in window) {
      this.setupPerformanceMonitoring?.();
    }

    // Setup service worker (if available)
    if ('serviceWorker' in navigator) {
      this.setupServiceWorker?.();
    }

    // Developer freedom: Add any custom initialization
    this.customInit?.();
  },

  // Extension points for developer freedom
  async loadComponent(name: string, props: any) {
    // Dynamic component loading - developer implements their strategy
    try {
      const module = await import(`../../client/components/${name}`);
      return module.default;
    } catch (error) {
      console.warn(`Component ${name} not found, using fallback`);
      return () => <div>Component not found: {name}</div>;
    }
  },

  async handleFormSubmission(formData: FormData, form: Element) {
    // Developer implements their form handling logic
    const action = form.getAttribute('action') || '/api/form';

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Success feedback
        form.classList.add('zen-success');
      } else {
        // Error feedback
        form.classList.add('zen-error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  },

  setupLazyLoading(element: Element) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const src = entry.target.getAttribute('data-src');
          if (src) {
            (entry.target as HTMLImageElement).src = src;
            observer.unobserve(entry.target);
          }
        }
      });
    });

    observer.observe(element);
  },

  setupInfiniteScroll(element: Element) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger load more
          const loadMore = element.getAttribute('data-load-more');
          if (loadMore) {
            fetch(loadMore).then(/* handle response */);
          }
        }
      });
    });

    observer.observe(element);
  },

  setupRealTimeUpdates(element: Element) {
    const wsUrl = element.getAttribute('data-ws-url');
    if (wsUrl) {
      const ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Update element with real-time data
        element.textContent = data.content;
      };
    }
  },

  setupPerformanceMonitoring() {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('Performance:', entry.name, entry.duration);
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }
  },

  setupServiceWorker() {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  },

  // Extension point for custom initialization
  customInit() {
    // Developer can override this for custom logic
  }
};

export default clientEntry;
