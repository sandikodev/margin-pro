import React from 'react';
import { Outlet } from '@koda/runtime';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SystemShell } from './_components/SystemShell';

export default function SystemLayoutRoute() {
    return (
        <ProtectedRoute requiredRole="admin" redirectTo="/app">
            <SystemShell>
                <Outlet />
            </SystemShell>
        </ProtectedRoute>
    );
}
