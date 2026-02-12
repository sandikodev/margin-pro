# Double Render Investigation - Deep Dive

## Current Status: PARTIALLY FIXED

### ✅ Fixed Issues:
1. **StrictMode Double Mount** - Removed from ClientRouter and SSR
   - Effect mounts: Now exactly 1 (correct)
   - No "DOUBLE MOUNT DETECTED" errors
   
2. **Hydration Idempotency** - Added check in start()
   - start() called: 1 time
   - hydrateRoot() called: 1 time

### ❌ Remaining Issue:
**Content Still Renders Twice in Browser**
- Page title "Hydration & Duplication Check" appears 2 times
- Hydration only happens once (correct)
- This means the DOM itself contains duplicate content

## Root Cause Analysis

### Test Results:
```bash
# Browser test (with JS):
Found "2" occurrences ❌

# SSR test (JS disabled):
Found "0" occurrences ❌

# Console logs:
- entry-client.tsx executed: 1 times ✅
- start() called: 1 times ✅
- hydrateRoot() called: 1 times ✅
```

### Key Finding:
SSR is NOT rendering content at all (returns 404 or empty HTML for curl).
Browser shows 2 occurrences, but hydration only happens once.

This means:
1. SSR middleware is broken or not properly configured
2. Browser is running in CSR-only mode
3. Something in CSR is causing double render

### HTML Output Analysis (from previous test):
```html
<div id="root">
  [CONTENT 1 - Full page with header "Zenith Labs"]
  <script>window.__staticRouterHydrationData = JSON.parse(...);</script>
  <script>window.__staticRouterHydrationData = {...};</script>
  [CONTENT 2 - DUPLICATE with same header]
</div>
```

**Observation:** 
- Two hydration scripts (one JSON.parse, one object literal)
- Content appears twice INSIDE root div
- Both have the experiments layout header

### Hypothesis:
1. React Router's `StaticRouterProvider` injects its own hydration script
2. We manually inject another one in `ssr.tsx`
3. This causes React to detect mismatch and re-render
4. OR: Layout component (`experiments/+layout.tsx`) is being rendered twice in the route tree

## Next Steps:

### Option 1: Fix SSR Middleware
- Investigate why SSR returns 404 for curl
- Check Vite middleware configuration
- Ensure SSR middleware is properly registered

### Option 2: Investigate Route Tree
- Check if experiments layout is duplicated in generated routes
- Verify `<Outlet />` is only called once per layout
- Check `.koda/generated/client-manifest.tsx`

### Option 3: React Router 7 SSR Deep Dive
- Study how `StaticRouterProvider` handles hydration
- Check if we should NOT manually inject hydration data
- Review React Router 7 SSR examples

## Files Modified:
- `src/server/core/ssr.tsx` - Hydration script injection
- `packages/koda/packages/runtime/src/ClientRouter.tsx` - Removed StrictMode
- `packages/koda/packages/runtime/src/index.tsx` - Added idempotency check
- `src/app/experiments/hydration-check/+page.koda.ts` - Static test data

## Test Scripts Created:
- `screenshot.js` - Browser test with console log capture
- `check-ssr.js` - SSR-only test (JS disabled)
- `dump-ssr.js` - Full HTML output dump

## Recommendation:
Focus on fixing SSR middleware first. Once SSR properly renders content, we can verify if hydration works correctly and if double render persists.

The fact that SSR returns 0 occurrences suggests the real issue is in SSR configuration, not in the hydration logic itself.
