import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SystemLayout } from '@/layouts/SystemLayout';

export default function SystemLayoutRoute() {
    return (
        <ProtectedRoute requiredRole="admin" redirectTo="/app">
            <SystemLayout>
                <Outlet />
            </SystemLayout>
        </ProtectedRoute>
    );
}
