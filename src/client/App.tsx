import React, { Suspense, useState, useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { User, BusinessProfile } from '@shared/types';

// Auth & Context
import { AuthProvider } from './context/AuthProvider';
import { AuthContext, useAuth } from './context/auth-context';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './context/toast-context';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useProfile } from './hooks/useProfile';

// Lazy Imports (App & System)
const OnboardingWizard = React.lazy(() => import('./routes/app/onboarding').then(module => ({ default: module.OnboardingWizard })));
const DashboardShell = React.lazy(() => import('./components/layout/DashboardShell').then(module => ({ default: module.DashboardShell })));
const AdminDashboard = React.lazy(() => import('./routes/system/admin').then(module => ({ default: module.AdminDashboard })));
const SystemLayout = React.lazy(() => import('./layouts/SystemLayout').then(module => ({ default: module.SystemLayout })));

// Lazy Page Imports
const DashboardPage = React.lazy(() => import('./routes/app/dashboard-page').then(module => ({ default: module.DashboardPage })));
const MarketPage = React.lazy(() => import('./routes/app/market-page').then(module => ({ default: module.MarketPage })));
const ProfilePage = React.lazy(() => import('./routes/app/profile-page').then(module => ({ default: module.ProfilePage })));
const FinancePage = React.lazy(() => import('./routes/app/finance-page').then(module => ({ default: module.FinancePage })));
const CalculatorPage = React.lazy(() => import('./routes/app/calculator-page').then(module => ({ default: module.CalculatorPage })));
const InsightsPage = React.lazy(() => import('./routes/app/insights-page').then(module => ({ default: module.InsightsPage })));
const AcademyView = React.lazy(() => import('./routes/app/academy').then(module => ({ default: module.AcademyView })));
const AboutView = React.lazy(() => import('./routes/app/about').then(module => ({ default: module.AboutView })));
const ChangelogView = React.lazy(() => import('./routes/app/changelog').then(module => ({ default: module.ChangelogView })));
const TopUpView = React.lazy(() => import('./routes/app/topup').then(module => ({ default: module.TopUpView })));

// Public / Auth
import { LandingPage } from './routes/public/landing';
import { AuthPage } from './routes/public/auth';
import { DemoTour } from './routes/public/demo-tour';
import { PricingPage } from './routes/public/pricing';
import { InvitePage } from './routes/public/invite';
import { BlogIndex } from './routes/public/blog';
import { BlogPostPage } from './routes/public/blog/post';
import { LegalLayout } from './layouts/LegalLayout';
import { LegalIndexPage } from './routes/public/legal/index';
import { LegalDocumentPage } from './routes/public/legal/document';
import { ErrorPage } from './components/ui/ErrorPage';

// Loading Component
import { FullPageLoader } from './components/ui/design-system/Loading';


// --- WRAPPERS (Preserved from previous implementation) ---

const AuthWrapper = () => {
    const navigate = useNavigate(); // Hook works inside RouterProvider
    const { showToast } = useToast();
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const referralCode = searchParams.get('ref') || location.state?.referralCode || '';
    
    // Capture mode from URL query params
    const modeParam = searchParams.get('mode');
    const [initialMode, setInitialMode] = useState<'login' | 'register'>(
        location.state?.mode || (modeParam === 'login' ? 'login' : 'register')
    );
    const [isDemo, setIsDemo] = useState(location.state?.isDemo || false);
  
    const [prevLocationState, setPrevLocationState] = useState(location.state);
    if (location.state !== prevLocationState) {
      setPrevLocationState(location.state);
      if (location.state?.mode) setInitialMode(location.state.mode);
      if (location.state?.isDemo) setIsDemo(location.state.isDemo);
    }
  
    // Effect: Auto-redirect if authenticated
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

const LandingWrapper = () => {
    // We cannot use useNavigate here if it's the element of a Route?
    // Actually yes we can, components rendered by RouterProvider can use hooks.
    // BUT LandingWrapper logic: if auth -> redirect.
    // We can use a Loader for this in v7, but keeping legacy logic for now.
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const location = useLocation(); // Hook works

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

const DemoWrapper = () => {
    const navigate = useNavigate();
    return <DemoTour onStartDemo={() => navigate('/auth', { state: { mode: 'login', isDemo: true } })} onBack={() => navigate('/')} />;
};

const OnboardingWrapper = () => {
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
          avatarUrl: ''
        };
        
        try {
            await profile.createBusiness(newBusiness);
            // activeBusinessId is set automatically by useProfile hook
            localStorage.setItem('margins_pro_onboarded', 'true');
            showToast("Setup Selesai!", "success");
            navigate('/app');
        } catch (e) {
            console.error("Onboarding failed", e);
        }
    };
    return <OnboardingWizard onComplete={handleComplete} />;
};
  
// --- PAGE CONNECTORS (Context Bridge) ---
import type { DashboardOutletContext } from './components/layout/DashboardShell';

const DashboardPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <DashboardPage projects={ctx.projects} setActiveTab={ctx.setActiveTab} createNewProject={ctx.createNewProject} setActiveProjectId={ctx.setActiveProjectId} />; }
const MarketPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <MarketPage addProject={ctx.addProject} activeBusinessId={ctx.activeBusinessId} setActiveTab={ctx.setActiveTab} setActiveProjectId={ctx.setActiveProjectId} />; }
const ProfilePageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <ProfilePage businesses={ctx.businesses} activeBusiness={ctx.activeBusiness} activeBusinessId={ctx.activeBusinessId} addBusiness={ctx.addBusiness} switchBusiness={ctx.switchBusiness} updateBusiness={ctx.updateBusiness} deleteBusiness={ctx.deleteBusiness} initialTab={'outlets'} onTopUpClick={() => ctx.setActiveTab('topup')} isEditingProfile={ctx.isProfileEditing} setIsEditingProfile={ctx.setIsProfileEditing} />; }
const FinancePageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <FinancePage activeProject={ctx.activeProject} activeBusiness={ctx.activeBusiness} updateBusiness={ctx.updateBusiness} />; }
const CalculatorPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <CalculatorPage activeProject={ctx.activeProject || null} updateProject={ctx.updateProject} createNewProject={ctx.createNewProject} deleteProject={ctx.deleteProject} goToSimulation={() => ctx.setActiveTab('insights')} />; }
const InsightsPageConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <InsightsPage activeProject={ctx.activeProject || null} updateProject={ctx.updateProject} onBack={() => ctx.setActiveTab('calc')} onOpenSidebar={() => {}} exchangeRates={ctx.exchangeRates} selectedCurrency={ctx.selectedCurrency} />; }
// Helper for TopUp which needs Hooks that were in Shell
import { useCurrency } from './hooks/useCurrency';
import { useMarketplace } from './hooks/useMarketplace';
const TopUpViewWrapper = ({ setActiveTab }: { setActiveTab: (t:string)=>void }) => {
    const { formatValue } = useCurrency();
    const { topUpCredits, credits } = useMarketplace();
    return <TopUpView formatValue={formatValue} topUpCredits={topUpCredits} currentCredits={credits} onBack={() => setActiveTab('profile')} onHistoryClick={() => setActiveTab('profile')} />;
}
const TopUpViewConnect = () => { const ctx = useOutletContext<DashboardOutletContext>(); return <TopUpViewWrapper setActiveTab={ctx.setActiveTab} /> }


// --- PROTECTED LAYOUT (AUTH REQUIRED) ---
const ProtectedLayout = () => {
    const { user, isLoading: authLoading } = useContext(AuthContext) || {};
    const profile = useProfile();
    const location = useLocation();

    if (authLoading || profile.isLoading) {
        return <FullPageLoader text="Verifying Session..." />;
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // New Onboarding Logic: Check if user has any business
    if (!profile.businesses || profile.businesses.length === 0) {
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <DashboardShell />
    );
};

// --- ROUTER CONFIGURATION ---

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingWrapper />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/auth",
        element: <AuthWrapper />,
    },
    {
        path: "/demo",
        element: <DemoWrapper />,
    },
    {
        path: "/r/:code",
        element: <InvitePage />,
    },
    {
        path: "/onboarding",
        element: (
            <ProtectedRoute>
                <OnboardingWrapper />
            </ProtectedRoute>
        ),
    },
    {
        path: "/app",
        element: <ProtectedLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <DashboardPageConnect /> },
            { path: "market", element: <MarketPageConnect /> },
            { path: "profile", element: <ProfilePageConnect /> },
            { path: "finance", element: <FinancePageConnect /> },
            { path: "calc", element: <CalculatorPageConnect /> },
            { path: "insights", element: <InsightsPageConnect /> },
            { path: "academia", element: <AcademyView onOpenAbout={() => {}} /> },
            { path: "edu", element: <Navigate to="academia" replace /> },
            { path: "about", element: <AboutView onBack={() => {}} onOpenChangelog={() => {}} /> },
            { path: "changelog", element: <ChangelogView onBack={() => {}} /> },
            { path: "topup", element: <TopUpViewConnect /> },
            { path: "*", element: <Navigate to="/app" replace /> }
        ]
    },
    {
        path: "/system",
        element: (
            <ProtectedRoute requiredRole="admin" redirectTo="/app">
                <SystemLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "admin", element: <AdminDashboard /> },
            { index: true, element: <Navigate to="admin" replace /> }
        ]
    },
    { path: "/pricing", element: <PricingPage /> },
    { path: "/blog", element: <BlogIndex /> },
    { path: "/blog/:slug", element: <BlogPostPage /> },
    {
        path: "/legal",
        element: <LegalLayout />,
        children: [
            { index: true, element: <LegalIndexPage /> },
            { path: ":slug", element: <LegalDocumentPage /> }
        ]
    },
    { path: "*", element: <Navigate to="/" replace /> }
], {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
    }
});

export const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <Suspense fallback={<FullPageLoader />}>
                    <RouterProvider router={router} />
                </Suspense>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;
