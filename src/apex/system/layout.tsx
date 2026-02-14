import React from 'react';
import { ProtectedRoute } from '@/core/ui/auth/ProtectedRoute';
import { SystemLayout } from '@/core/layouts/SystemLayout';

export default function SystemRootLayout() {
    return (
        <ProtectedRoute requiredRole="admin" redirectTo="/app">
            <SystemLayout />
        </ProtectedRoute>
    );
}
