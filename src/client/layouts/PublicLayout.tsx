/**
 * Public Layout
 * Layout wrapper for public routes with dedicated error boundary and suspense
 */

import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PublicLoading } from '../components/ui/PublicLoading';

export const PublicLayout: React.FC = () => {
    return (
        <Suspense fallback={<PublicLoading text="Memuat halaman..." />}>
            <Outlet />
        </Suspense>
    );
};
