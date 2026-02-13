# 🚀 Runtime Compatibility

Margins Pro is designed to run on **modern JavaScript runtimes**:

## Supported Runtimes

### ✅ Primary: Bun (Recommended)
```bash
bun --bun vite  # Development
bun dist/server/index.mjs  # Production
```

**Why Bun?**
- Ultra-fast startup (< 50ms cold start)
- Native TypeScript support
- Built-in bundler & test runner
- Drop-in Node.js replacement

### ✅ Secondary: Vercel Edge (Deno-based)
```typescript
// api/index.ts
export const config = {
    runtime: 'edge',  // Deno V8 isolates
};
```

**Why Edge?**
- Global distribution
- Zero cold starts
- Automatic scaling
- Cost-effective

### ⚠️ Node.js (Compatibility Mode)
While the app can run on Node.js, it's not optimized for it.

## Runtime-Agnostic Code

We use runtime detection for environment variables:

```typescript
// src/server/lib/runtime.ts
export const env = {
  get isDev() {
    if (typeof Bun !== 'undefined') return Bun.env.NODE_ENV !== 'production';
    if (typeof Deno !== 'undefined') return Deno.env.get('NODE_ENV') !== 'production';
    return process.env.NODE_ENV !== 'production';
  },
  
  get(key: string) {
    if (typeof Bun !== 'undefined') return Bun.env[key];
    if (typeof Deno !== 'undefined') return Deno.env.get(key);
    return process.env[key];
  }
};
```

## Build Configuration

**tsdown** is configured for runtime-neutral output:

```json
{
  "build:server": "tsdown src/server/index.ts --format esm --out-dir dist/server --clean --platform neutral"
}
```

`--platform neutral` ensures compatibility with Bun, Deno, and Node.js.

## Deployment Targets

| Platform | Runtime | Status |
|----------|---------|--------|
| Vercel | Edge (Deno) | ✅ Recommended |
| Railway | Bun | ✅ Supported |
| Fly.io | Bun | ✅ Supported |
| Cloudflare Workers | V8 isolates | 🚧 Experimental |
| AWS Lambda | Node.js | ⚠️ Not optimized |

## Performance Comparison

```
Cold Start Times:
- Bun: ~30ms
- Deno (Edge): ~0ms (isolates)
- Node.js: ~200ms

Bundle Size:
- Bun/Deno: 49.58 kB (gzipped: 11.36 kB)
- Node.js: Same, but slower execution
```

## Migration Notes

If migrating from Node.js:
1. Replace `process.env` with `env.get()`
2. Replace `process.env.NODE_ENV` checks with `env.isProd`
3. Use `import.meta.env` in client code
4. Ensure all dependencies are ESM-compatible

---

**TL;DR:** This app is built for **Bun** and **Vercel Edge**, not Node.js.
