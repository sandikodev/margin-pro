/**
 * 📈 Margins Pro: Professional SaaS Application
 * Project Ownership: PT Koneksi Jaringan Indonesia
 * Engineering Team: Kopikonfig
 * Architecture: Powered by Koda Zenith
 */
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { apexRoutes } from './static-routes';

// Router configuration with Apex Auto-Discovery
export const router = createBrowserRouter([
    ...apexRoutes,

    // Legacy Redirects & Splats
    { path: "/app/calc", element: <Navigate to="/app/project" replace /> },
    { path: "/app/edu", element: <Navigate to="/app/academia" replace /> },
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
