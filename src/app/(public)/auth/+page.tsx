import React from 'react';
import { useNavigate } from '@koda/runtime';
import { AuthPage } from './_components/AuthPage';
import { useAuth } from '@/hooks/useAuth';

export default function AuthRoute() {
    const navigate = useNavigate();
    const { login, user } = useAuth();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (user) {
            navigate('/app/dashboard', { replace: true });
        }
    }, [user, navigate]);

    if (user) return null; // Prevent flash of content

    return (
        <AuthPage
            onSuccess={(user) => {
                login(user); // Update auth context state
                navigate('/app/dashboard');
            }}
            onBack={() => navigate('/')}
        />
    );
}
