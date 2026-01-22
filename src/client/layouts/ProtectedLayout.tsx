import React, { useEffect, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import { useProfile } from '@/hooks/useProfile';
import { FullPageLoader } from '@/components/ui/design-system/Loading';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const ProtectedLayout = () => {
    const { user, isLoading: authLoading } = useContext(AuthContext) || {};
    const profile = useProfile();
    const location = useLocation();

    // Onboarding Logic Tokens
    const hasBusinesses = profile.businesses && profile.businesses.length > 0;
    const isRecentlyOnboarded = localStorage.getItem('margins_pro_onboarded') === 'true';

    useEffect(() => {
        if (hasBusinesses && isRecentlyOnboarded) {
            localStorage.removeItem('margins_pro_onboarded');
        }
    }, [hasBusinesses, isRecentlyOnboarded]);

    if (authLoading || profile.isLoading) {
        return <FullPageLoader text="Verifying Session..." />;
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (!hasBusinesses) {
        // If we're loading, fetching, or just finished onboarding, show loader instead of redirecting
        if (profile.isLoading || profile.isFetching || isRecentlyOnboarded) {
            return <FullPageLoader text="Menyiapkan Bisnis Anda..." />;
        }
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <DashboardShell />
    );
};
