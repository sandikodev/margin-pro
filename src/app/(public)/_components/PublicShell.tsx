/**
 * Public Layout
 * Layout wrapper for public routes with dedicated error boundary and suspense
 */

import React, { Suspense } from 'react';
import { Outlet } from 'react-router'; // ✅ SSR-safe import
import { PublicLoading } from '@/components/ui/system/PublicLoading';
import { PublicErrorPage } from '@/components/ui/system/PublicErrorPage';

export const PublicShell: React.FC = () => {
    return (
        <React.Fragment>
            <Suspense fallback={<PublicLoading text="Memuat halaman..." />}>
                <Outlet />
            </Suspense>
        </React.Fragment>
    );
};

export function ErrorBoundary() {
    return <PublicErrorPage />;
}

