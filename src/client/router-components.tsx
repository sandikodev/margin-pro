import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { User, BusinessProfile } from '@shared/types';
import { useAuth } from './context/auth-context';
import { useToast } from './context/toast-context';
import { useProfile } from './hooks/useProfile';
import { useCurrency } from './hooks/useCurrency';
import { useMarketplace } from './hooks/useMarketplace';
import type { DashboardOutletContext } from './components/layout/DashboardShell';

// Public Routes
import { LandingPage } from './routes/public/landing';
import { AuthPage } from './routes/public/auth';
import { DemoTour } from './routes/public/demo-tour';

// Lazy Apps
const OnboardingWizard = React.lazy(() => import('./routes/app/onboarding').then(module => ({ default: module.OnboardingWizard })));
const DashboardPage = React.lazy(() => import('./routes/app/dashboard-page').then(module => ({ default: module.DashboardPage })));
const MarketPage = React.lazy(() => import('./routes/app/market-page').then(module => ({ default: module.MarketPage })));
const ProfilePage = React.lazy(() => import('./routes/app/profile-page').then(module => ({ default: module.ProfilePage })));
const FinancePage = React.lazy(() => import('./routes/app/finance-page').then(module => ({ default: module.FinancePage })));
const CalculatorPage = React.lazy(() => import('./routes/app/calculator-page').then(module => ({ default: module.CalculatorPage })));
const InsightsPage = React.lazy(() => import('./routes/app/insights-page').then(module => ({ default: module.InsightsPage })));
const TopUpView = React.lazy(() => import('./routes/app/topup').then(module => ({ default: module.TopUpView })));
const LaboratoryPage = React.lazy(() => import('./routes/labs').then(module => ({ default: module.LaboratoryPage })));

export const AuthWrapper = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const referralCode = searchParams.get('ref') || location.state?.referralCode || '';

    const modeParam = searchParams.get('mode');
    const [initialMode, setInitialMode] = useState<'login' | 'register'>(
        location.state?.mode || (modeParam === 'register' ? 'register' : 'login')
    );
    const [isDemo, setIsDemo] = useState(location.state?.isDemo || false);

    const [prevLocationState, setPrevLocationState] = useState(location.state);
    if (location.state !== prevLocationState) {
        setPrevLocationState(location.state);
        if (location.state?.mode) setInitialMode(location.state.mode);
        if (location.state?.isDemo) setIsDemo(location.state.isDemo);
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSuccess = (user: User) => {
        login('cookie-managed', user);
        const permissions = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : (user.permissions || []);
        if (permissions.includes('demo_mode')) {
            showToast("Mode Demo Aktif", "success");
        } else {
            showToast("Login Berhasil", "success");
        }
    };

    return (
        <AuthPage
            initialMode={initialMode}
            initialEmail={''}
            initialPassword={''}
            initialReferralCode={referralCode}
            isDemo={isDemo}
            onSuccess={handleSuccess}
            onBack={() => navigate('/')}
        />
    );
};

export const LandingWrapper = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleAuthNav = (mode: 'login' | 'register') => {
        navigate({ pathname: '/auth', search: location.search }, { state: { mode } });
    };

    return <LandingPage onGetStarted={() => handleAuthNav('register')} onLogin={() => handleAuthNav('login')} onDemo={() => navigate('/demo')} />;
};

export const DemoWrapper = () => {
    const navigate = useNavigate();
    return <DemoTour onStartDemo={() => navigate('/auth', { state: { mode: 'login', isDemo: true } })} onBack={() => navigate('/')} />;
};

export const OnboardingWrapper = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const profile = useProfile();

    const handleComplete = async (data: Partial<BusinessProfile>) => {
        const newBusiness: BusinessProfile = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || 'Bisnis Saya',
            type: data.type || 'fnb_offline',
            initialCapital: data.initialCapital || 0,
            currentAssetValue: 0,
            cashOnHand: 0,
            themeColor: 'indigo',
            establishedDate: Date.now(),
            address: '',
            gmapsLink: '',
            avatarUrl: '',
            ...data
        };

        try {
            await profile.createBusiness(newBusiness);
            localStorage.setItem('margins_pro_onboarded', 'true');
            showToast("Setup Selesai!", "success");
            navigate('/app');
        } catch (e) {
            console.error("Onboarding failed", e);
        }
    };
    return <Suspense fallback={<div>Loading Setup...</div>}><OnboardingWizard onComplete={handleComplete} /></Suspense>;
};

export const DashboardPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <Suspense fallback={null}><DashboardPage projects={ctx.projects} activeBusiness={ctx.activeBusiness} setActiveTab={ctx.setActiveTab} createNewProject={ctx.createNewProject} setActiveProjectId={ctx.setActiveProjectId} /></Suspense>; }
export const MarketPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <Suspense fallback={null}><MarketPage addProject={ctx.addProject} activeBusinessId={ctx.activeBusinessId} setActiveTab={ctx.setActiveTab} setActiveProjectId={ctx.setActiveProjectId} /></Suspense>; }
export const ProfilePageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <Suspense fallback={null}><ProfilePage businesses={ctx.businesses} activeBusiness={ctx.activeBusiness} activeBusinessId={ctx.activeBusinessId} addBusiness={ctx.addBusiness} switchBusiness={ctx.switchBusiness} updateBusiness={ctx.updateBusiness} deleteBusiness={ctx.deleteBusiness} initialTab={'outlets'} onTopUpClick={() => ctx.setActiveTab('topup')} isEditingProfile={ctx.isProfileEditing} setIsEditingProfile={ctx.setIsProfileEditing} user={ctx.user} /></Suspense>; }
export const FinancePageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <Suspense fallback={null}><FinancePage activeProject={ctx.activeProject} activeBusiness={ctx.activeBusiness} updateBusiness={ctx.updateBusiness} /></Suspense>; }
export const CalculatorPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <Suspense fallback={null}><CalculatorPage activeProject={ctx.activeProject} activeBusiness={ctx.activeBusiness} updateProject={ctx.updateProject} createNewProject={ctx.createNewProject} deleteProject={ctx.deleteProject} goToSimulation={() => ctx.setActiveTab('insights')} /></Suspense>; }
export const InsightsPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <Suspense fallback={null}><InsightsPage activeProject={ctx.activeProject} activeBusiness={ctx.activeBusiness} updateProject={ctx.updateProject} onBack={() => ctx.setActiveTab('calc')} onOpenSidebar={() => { }} exchangeRates={ctx.exchangeRates} selectedCurrency={ctx.selectedCurrency} /></Suspense>; }

const TopUpViewWrapper = ({ setActiveTab }: { setActiveTab: (t: string) => void }) => {
    const { formatValue } = useCurrency();
    const { topUpCredits, credits } = useMarketplace();
    return <Suspense fallback={null}><TopUpView formatValue={formatValue} topUpCredits={topUpCredits} currentCredits={credits} onBack={() => setActiveTab('profile')} onHistoryClick={() => setActiveTab('profile')} /></Suspense>;
}
export const TopUpViewConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <TopUpViewWrapper setActiveTab={ctx.setActiveTab} /> }
export const LaboratoryPageConnect = () => { return <Suspense fallback={null}><LaboratoryPage /></Suspense>; }
