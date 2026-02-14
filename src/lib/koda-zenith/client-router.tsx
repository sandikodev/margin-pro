
import React, { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';

// Tipe module halaman
type PageModule = {
    default: React.ComponentType;
    Layout?: React.ComponentType<{ children: React.ReactNode }>;
    ErrorBoundary?: React.ComponentType;
    Loader?: () => Promise<any>; // Data loading (future)
};

/**
 * Koda Zenith Client Router
 * Mengubah struktur file src/routes menjadi React Router objects.
 * Mendukung Nested Layouts dan Lazy Loading.
 */
export function createClientRoutes(
    globPages: Record<string, () => Promise<unknown>>,
    globLayouts: Record<string, () => Promise<unknown>>
): RouteObject[] {
    const routes: RouteObject[] = [];
    const layoutMap = new Map<string, RouteObject>();

    // Helper untuk normalisasi path (Supports 'apex' or 'routes')
    const normalizePath = (path: string) => {
        return path
            .replace(/^\.\.\/apex/, '')     // Support Koda Zenith APEX Structure
            .replace(/^\/src\/apex/, '')
            .replace(/^\.\.\/routes/, '')   // Legacy
            .replace(/^\/src\/routes/, '')
            .replace(/\.(tsx|jsx)$/, '')
            .replace(/\/index$/, '')
            .replace(/\[\.{3}(.*?)\]/g, '*') // Catch-all
            .replace(/\[(.*?)\]/g, ':$1');   // Params
    };

    // 1. Proses Layouts Terlebih Dahulu
    // (Untuk membangun hierarki parent-child)
    // TODO: Implementasi Nested Layout yang kompleks butuh rekuesif.
    // Untuk MVP, kita akan buat flat routes dulu atau 1 level nesting.

    // 2. Proses Pages
    Object.keys(globPages).forEach((path) => {
        // Abaikan route API
        if (path.includes('/api/')) return;

        const urlPath = normalizePath(path);
        const LazyComponent = React.lazy(globPages[path] as () => Promise<{ default: React.ComponentType }>);

        const route: RouteObject = {
            path: urlPath === '' ? '/' : urlPath,
            element: (
                <Suspense fallback={<div className="p-4">Loading route...</div>}>
                    <LazyComponent />
                </Suspense>
            ),
            // Error Boundary bisa ditambahkan di sini jika module export ErrorBoundary
        };

        routes.push(route);
    });

    // Sorting: Root '/' terakhir agar tidak memakan route lain (tergantung algoritma RR)
    // React Router v6 cukup pintar menilai specificity.

    return routes;
}
