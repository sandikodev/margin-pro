import React, { Suspense } from 'react';
import { OnboardingWrapper } from '@/router-components';
import { FullPageLoader } from '@/components/ui/design-system/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function OnboardingRoute() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<FullPageLoader text="Loading Setup..." />}>
                <OnboardingWrapper />
            </Suspense>
        </ProtectedRoute>
    );
}
