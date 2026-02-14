
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// --- FILE SYSTEM ROUTES (Koda Zenith Apex) ---
import { createClientRoutes } from '@/core/framework/client-router';

// Scan src/apex/**/*.tsx for pages/views
const autoRoutes = createClientRoutes(
    import.meta.glob('./apex/**/*.tsx'),
    import.meta.glob('./apex/**/layout.tsx') // Support layouts in apex
);

export const router = createBrowserRouter([
    // Auto Routes (Koda Zenith File-System Routing)
    ...autoRoutes,

    // Legacy Redirects
    { path: "/app/calc", element: <Navigate to="/app/project" replace /> },
    { path: "/app/edu", element: <Navigate to="/app/academia" replace /> },
    { path: "/academia", element: <Navigate to="/app/academia" replace /> },
    { path: "/onboarding/wizard", element: <Navigate to="/onboarding" replace /> },

    // Fallback
    { path: "*", element: <Navigate to="/" replace /> }
], {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
    }
});
