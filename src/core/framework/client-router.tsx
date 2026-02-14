
import React from 'react';
import type { RouteObject } from 'react-router-dom';

/**
 * Koda Zenith Client Router
 * Transform file structure into React Router objects with Nested Layout support.
 */
export function createClientRoutes(
    globPages: Record<string, () => Promise<unknown>>,
    globLayouts: Record<string, () => Promise<unknown>>
): RouteObject[] {
    const pagePaths = Object.keys(globPages).filter(p => !p.includes('/_'));
    const layoutPaths = Object.keys(globLayouts).filter(p => !p.includes('/_'));

    const normalize = (path: string) => {
        let n = path
            .replace(/^\.\/apex/, '')
            .replace(/^\.\.\/apex/, '')
            .replace(/^\/src\/apex/, '')
            .replace(/^\.\/routes/, '')
            .replace(/^\.\.\/routes/, '')
            .replace(/^\/src\/routes/, '')
            .replace(/\.(tsx|jsx)$/, '')
            .replace(/\/index$/, '')
            .replace(/\/layout$/, '');
        return n || '/';
    };

    const getSegment = (path: string) => {
        if (path === '/') return '';
        const seg = path.split('/').pop() || '';
        return seg.replace(/\[(.*?)\]/g, ':$1');
    };

    const buildTree = (currentPath: string = '/'): RouteObject[] => {
        const children: RouteObject[] = [];

        // 1. Pages in this directory
        const levelPages = pagePaths.filter(p => {
            const n = normalize(p);
            if (currentPath === '/') {
                return n === '/' || (n.startsWith('/') && !n.slice(1).includes('/'));
            }
            return n.startsWith(currentPath + '/') && !n.slice(currentPath.length + 1).includes('/');
        });

        levelPages.forEach(p => {
            const n = normalize(p);
            const isIndex = n === currentPath;

            children.push({
                index: isIndex || undefined,
                path: isIndex ? undefined : getSegment(n),
                async lazy() {
                    const mod = await globPages[p]() as any;
                    return {
                        Component: mod.default,
                        loader: mod.loader,
                        action: mod.action,
                        ErrorBoundary: mod.ErrorBoundary,
                        handle: { meta: mod.meta }
                    };
                }
            });
        });

        // 2. Subdirectories
        const subDirs = new Set<string>();
        [...pagePaths, ...layoutPaths].forEach(p => {
            const n = normalize(p);
            if (n.startsWith(currentPath === '/' ? '/' : currentPath + '/') && n !== currentPath) {
                const relative = n.slice(currentPath === '/' ? 1 : currentPath.length + 1);
                const firstPart = relative.split('/')[0];
                if (firstPart && firstPart !== 'index' && firstPart !== 'layout') {
                    subDirs.add(firstPart);
                }
            }
        });

        subDirs.forEach(dirName => {
            const nextPath = currentPath === '/' ? `/${dirName}` : `${currentPath}/${dirName}`;
            const subRoutes = buildTree(nextPath);

            if (subRoutes.length > 0) {
                const layoutFile = layoutPaths.find(l => normalize(l) === nextPath);
                if (layoutFile) {
                    // Layout exists, subRoutes will contain the layout route with its path
                    children.push(...subRoutes);
                } else {
                    // No layout, but we need to maintain the path nesting
                    children.push({
                        path: dirName.replace(/\[(.*?)\]/g, ':$1'),
                        children: subRoutes
                    });
                }
            }
        });

        // 3. Wrap with layout if exists
        const layoutFile = layoutPaths.find(l => normalize(l) === currentPath);
        if (layoutFile) {
            return [{
                path: currentPath === '/' ? '/' : getSegment(currentPath),
                async lazy() {
                    const mod = await globLayouts[layoutFile]() as any;
                    return {
                        Component: mod.default,
                        loader: mod.loader,
                        ErrorBoundary: mod.ErrorBoundary
                    };
                },
                children
            }];
        }

        return children;
    };

    return buildTree();
}
