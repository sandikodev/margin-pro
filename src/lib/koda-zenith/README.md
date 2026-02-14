# Koda Zenith Framework

## Hybrid Multi-Paradigm Framework - Production Ready

### Core Philosophy
**"The marriage of Next.js ergonomics, SvelteKit conventions, Qwik performance, NestJS enterprise patterns, Elixir/OTP reliability, and future-ready spatial computing"**

Built on **Bun/Deno + Hono + React Router v7** with **Rust/Zig/Elixir** engine aspirations.

### Core Features (Original)
- ✅ Edge Runtime Compatible (Vercel, Cloudflare, Deno Deploy)
- ✅ Zero Node.js dependencies
- ✅ Web Standards only
- ✅ Type-safe Hono wrapper
- ✅ Built-in security middleware
- ✅ Runtime detection (Bun/Deno/Edge/Node)
- ✅ Request context tracing

### Hybrid Architecture Features (New)

#### 🏗️ Next.js-style File-based Routing
```typescript
// src/app/dashboard/+page.koda.ts (loader)
export const loader = async ({ request, params }) => {
  return { user: await getUser(request) };
};

// src/app/dashboard/+page.tsx (component)
export default function Dashboard() {
  const { user } = useLoaderData();
  return <div>Welcome {user.name}</div>;
}
```

#### 🎯 SvelteKit-inspired Conventions
- `+layout.koda.ts` - Layout loaders (like SvelteKit's `+layout.server.ts`)
- `+page.koda.ts` - Page loaders
- `+error.tsx` - Error boundaries
- File-based routing with automatic code splitting

#### ⚡ Qwik-style Performance Optimizations
```typescript
// entry-server.koda.ts - Server entry (middleware proxy)
export default {
  async middleware(request: Request) {
    // Next.js middleware.ts equivalent
    if (url.pathname.includes('admin') && !isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }
    return request;
  },
  
  extractCriticalCSS(html: string) {
    // Qwik approach - extract only used classes
    const usedClasses = extractUsedClasses(html);
    const criticalCSS = generateCriticalCSS(usedClasses);
    return { usedClasses, criticalCSS };
  }
};
```

```typescript
// entry-client.zen.tsx - Client entry (maximum freedom)
export default {
  hydrate(element: HTMLElement, data?: any) {
    // Progressive hydration with developer freedom
    const islands = element.querySelectorAll('[data-koda-island]');
    islands.forEach(island => {
      this.loadComponent(componentName, props)
        .then(Component => hydrateRoot(island, <Component />));
    });
  },
  
  enhance() {
    // Zen philosophy - enhance anything you want
    clientUtils.enhance('form[data-enhance]', handleFormEnhancement);
    clientUtils.enhance('[data-zen-interactive]', handleInteractivity);
  }
};
```

#### 🏢 Enterprise Patterns (NestJS/Spring-style)
```typescript
// Actor system with supervision (Elixir/OTP inspired)
class PriceActor extends Actor {
  async handleGetPrice(symbol: string) {
    return await this.fetchPrice(symbol);
  }
}

// Start supervised actor
supervisor.startActor('price-service', PriceActor, [], 'permanent');
```

#### 🚀 Spatial Computing Ready (Vision Pro, BCI)
```typescript
// Spatial entities for 3D interfaces
class PriceEntity extends Spatial.Entity {
  onNeuralSignal(signal: BCISignal) {
    if (signal.type === 'intent_buy' && signal.confidence > 0.8) {
      this.executeBuy();
    }
  }
  
  onGesture(gesture: SpatialGesture) {
    if (gesture.type === 'air_tap') {
      this.showDetails();
    }
  }
}
```

### Enhanced Enterprise Features

#### 🚀 Performance & Monitoring
- ✅ Request context tracing with performance metrics
- ✅ Database query tracking (`kodaContext.trackDB()`)
- ✅ Cache hit/miss tracking (`kodaContext.trackCache()`)
- ✅ Memory usage monitoring
- ✅ Slow request detection (>1s)
- ✅ Response time headers (`X-Response-Time`, `X-Request-ID`)

#### 🛡️ Security & Production Ready
- ✅ Advanced rate limiting (edge-compatible)
- ✅ XSS/injection protection
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ CORS handling
- ✅ Input sanitization
- ✅ Suspicious request blocking

#### 🔧 Developer Experience
- ✅ Enhanced error handling with context (`KodaError`)
- ✅ Performance timing utilities (`kodaDX.time()`, `kodaDX.timeAsync()`)
- ✅ Debug logging (dev only)
- ✅ Assert/invariant utilities
- ✅ Request diagnostics API (`/api/dx/diagnostics`)
- ✅ Performance history (`/api/dx/history`)

#### 🏗️ Architecture
- ✅ Modular design (env, context, security, dx, routing, actors, spatial)
- ✅ Code splitting (7 chunks, 65.86 kB total)
- ✅ Environment-aware setup patterns
- ✅ Type-safe throughout
- ✅ Zero external dependencies

### Entry Point Conventions

**Koda Zenith follows specific naming conventions for entry points:**

#### Server Entry: `entry-server.koda.ts`
- Server-side middleware proxy (like Next.js `middleware.ts`)
- Critical CSS extraction (Qwik-style performance)
- SSR rendering with optimization
- Global server-side data loading

#### Client Entry: `entry-client.zen.tsx`  
- Client-side hydration with maximum freedom
- Progressive enhancement (Zen philosophy)
- Flexible state management
- Developer has complete control

#### Future DSL Support:
- `entry-server.koda` - When Koda DSL is ready
- `entry-client.zen` - When Zen DSL is ready
- Full LSP support for both formats
**Original:** 49.61 kB (11.27 kB gzipped) - Inline implementation
**Enhanced:** 57.25 kB (14.2 kB gzipped) - Modular with code splitting
**Hybrid:** 65.86 kB (16.2 kB gzipped) - Full multi-paradigm architecture

### API Surface

**Simple Setup:**
```typescript
const app = koda();
```

**Production Setup:**
```typescript
const app = koda.setup.production({
  rateLimit: { windowMs: 60000, limit: 100 },
  csp: { /* CSP config */ }
});
```

**Next.js-style Setup:**
```typescript
const app = koda.setup.nextjs({
  '/dashboard/+page': { loader, default: DashboardPage },
  '/settings/+page': { loader, default: SettingsPage }
});
```

**Enterprise Setup:**
```typescript
const app = koda.setup.enterprise({
  actors: [
    { id: 'price-service', actor: PriceActor },
    { id: 'user-service', actor: UserActor }
  ],
  rateLimit: { windowMs: 60000, limit: 1000 }
});
```

**Spatial Computing Setup:**
```typescript
const app = koda.setup.development({
  enableSpatial: true // Enables /api/spatial/simulate endpoints
});

// Use spatial hooks in React components
function PriceVisualization() {
  useSpatialGesture((gesture) => {
    if (gesture.type === 'air_tap') {
      showPriceDetails();
    }
  });
  
  useBCISignal((signal) => {
    if (signal.type === 'intent_buy') {
      highlightBuyOptions();
    }
  });
}
```

### Future Vision (Rust/Zig/Elixir Engine)

**Current:** TypeScript + Bun/Deno + Hono
**Future:** Rust compiler + Zig runtime + Elixir supervision

```rust
// Future Koda Zenith compiler (Rust)
#[koda::route("/api/prices")]
async fn get_prices(ctx: KodaContext) -> KodaResponse {
    // Compiled to optimized machine code
}
```

```elixir
# Future supervision tree (Elixir)
defmodule KodaZenith.Supervisor do
  use Supervisor
  
  def start_link(_) do
    children = [
      {PriceActor, []},
      {UserActor, []},
      {SpatialEngine, []}
    ]
    
    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
```

### Stability Status
- ✅ Core framework: STABLE
- ✅ Security middleware: STABLE  
- ✅ Edge compatibility: STABLE
- ✅ Enhanced features: STABLE
- ✅ Hybrid architecture: STABLE
- 🚧 Spatial computing: EXPERIMENTAL
- 🚧 Actor system: BETA
- 🔬 Rust/Zig/Elixir engine: RESEARCH

### Next Steps
1. **Battle-test** hybrid architecture in Margins Pro production
2. Extract to npm package (`@koda/zenith@1.0.0`)
3. **Rust compiler** development for performance-critical paths
4. **Elixir supervision** for fault-tolerant distributed systems
5. **Spatial computing** integration for Vision Pro/AR interfaces
6. Community adoption and ecosystem growth

**"Koda Zenith: Where ergonomics meets performance, where present meets future"**
