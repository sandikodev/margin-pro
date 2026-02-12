import React from 'react';
import { useNavigate } from '@koda/runtime';
import { LandingPage } from './_components/LandingPage';

export default function LandingRoute() {
    const navigate = useNavigate();
    return (
        <LandingPage
            onGetStarted={() => navigate('/auth?mode=register')}
            onLogin={() => navigate('/auth?mode=login')}
            onDemo={() => navigate('/auth?mode=login&isDemo=true')}
        />
    );
}
