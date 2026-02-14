
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

    // 1. Identifikasi Root Layout (src/apex/layout.tsx atau src/routes/layout.tsx)
    // Sederhana: Kita cari layout di root direktori scan
    let rootLayoutPath = Object.keys(globLayouts).find(path =>
        path.match(/\/apex\/layout\.tsx$/) || path.match(/\/routes\/layout\.tsx$/)
    );

    const childRoutes: RouteObject[] = [];

    // 2. Helper Normalisasi
    const normalizePath = (path: string) => {
        return path
            .replace(/^\.\.\/apex/, '')
            .replace(/^\/src\/apex/, '')
            .replace(/^\.\.\/routes/, '')
            .replace(/^\/src\/routes/, '')
            .replace(/\/\([^)]+\)/g, '') // Support Route Groups: (auth) -> ""
            .replace(/\.(tsx|jsx)$/, '')
            .replace(/\/index$/, '')
            .replace(/\/layout$/, '') // Layout path cleaning
            .replace(/\[\.{3}(.*?)\]/g, '*')
            .replace(/\[(.*?)\]/g, ':$1');
    };

    // 3. Proses Pages
    Object.keys(globPages).forEach((path) => {
        if (path.includes('/api/')) return;

        const urlPath = normalizePath(path);
        const routeModule = globPages[path] as () => Promise<any>;

        const route: RouteObject = {
            path: urlPath === '' ? '/' : urlPath,
            async lazy() {
                const mod = await routeModule();
                return {
                    Component: mod.default,
                    loader: mod.loader,
                    action: mod.action,
                    ErrorBoundary: mod.ErrorBoundary || mod.CatchBoundary,
                };
            }
        };

        childRoutes.push(route);
    });

    // 4. Bungkus dengan Root Layout jika ada
    if (rootLayoutPath) {
        const layoutModule = globLayouts[rootLayoutPath] as () => Promise<any>;

        console.log(`[Koda Zenith] Root Layout found: ${rootLayoutPath}`);

        routes.push({
            path: "/", // Root Path
            async lazy() {
                const mod = await layoutModule();
                return {
                    Component: mod.default, // Layout Component (must render <Outlet />)
                    loader: mod.loader,
                    ErrorBoundary: mod.ErrorBoundary
                };
            },
            children: childRoutes
        });
    } else {
        // Jika tidak ada layout, langsung push semua page
        routes.push(...childRoutes);
    }

    return routes;
}
