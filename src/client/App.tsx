import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';

// Eager Imports (Critical Path)
import { LandingPage } from './routes/landing';
import { AuthPage } from './routes/auth';

// Lazy Imports (Chunked)
const OnboardingWizard = React.lazy(() => import('./routes/onboarding').then(module => ({ default: module.OnboardingWizard })));
const DemoTour = React.lazy(() => import('./routes/demo-tour').then(module => ({ default: module.DemoTour })));
const DashboardShell = React.lazy(() => import('./components/layout/DashboardShell').then(module => ({ default: module.DashboardShell })));
const AdminDashboard = React.lazy(() => import('./components/features/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const PricingPage = React.lazy(() => import('./routes/pricing').then(module => ({ default: module.PricingPage })));
const SystemLayout = React.lazy(() => import('./layouts/SystemLayout').then(module => ({ default: module.SystemLayout })));
const BlogIndex = React.lazy(() => import('./routes/blog').then(module => ({ default: module.BlogIndex })));
const BlogPostPage = React.lazy(() => import('./routes/blog/post').then(module => ({ default: module.BlogPostPage })));
const TermsPage = React.lazy(() => import('./routes/legal/terms').then(module => ({ default: module.TermsPage })));
const PrivacyPage = React.lazy(() => import('./routes/legal/privacy').then(module => ({ default: module.PrivacyPage })));

// Loading Component
const PageLoader = () => (
 <div className="min-h-screen flex items-center justify-center bg-slate-50">
   <div className="flex flex-col items-center gap-4">
     <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Content...</p>
   </div>
 </div>
);

// Data
import { DEMO_BUSINESS, DEMO_PROJECTS, DEMO_CASHFLOW, DEMO_LIABILITIES, DEMO_USER_CREDENTIALS } from './lib/demo-data';
import { BusinessProfile } from '@shared/types';
import { useProfile } from './hooks/useProfile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// --- AUTH DATA HELPER ---
const populateDemoData = () => {
    // Only populate if missing, to prevent overwriting user work in demo
    if (!localStorage.getItem('margins_pro_businesses_v3')) {
        localStorage.setItem('margins_pro_businesses_v3', JSON.stringify(DEMO_BUSINESS));
        localStorage.setItem('margins_pro_active_business_id_v3', DEMO_BUSINESS[0].id);
        localStorage.setItem('margins_pro_v12_final', JSON.stringify(DEMO_PROJECTS));
        localStorage.setItem('margins_pro_cashflow', JSON.stringify(DEMO_CASHFLOW));
        localStorage.setItem('margins_pro_liabilities', JSON.stringify(DEMO_LIABILITIES));
        localStorage.setItem('margins_pro_onboarded', 'true');
        localStorage.setItem('margins_pro_is_demo', 'true');
        localStorage.setItem('margins_pro_demo_welcome', 'true');
    }
};

// --- WRAPPERS ---

const AuthWrapper = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const location = useLocation();
  const [initialMode, setInitialMode] = useState<'login' | 'register'>(location.state?.mode || 'register');
  const [isDemo, setIsDemo] = useState(location.state?.isDemo || false);

  // Capture referral code from URL query params (e.g. ?ref=ANDI123)
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('ref') || location.state?.referralCode || '';

  const [prevLocationState, setPrevLocationState] = useState(location.state);
  if (location.state !== prevLocationState) {
    setPrevLocationState(location.state);
    if (location.state?.mode) setInitialMode(location.state.mode);
    if (location.state?.isDemo) setIsDemo(location.state.isDemo);
  }

  const handleSuccess = (mode: 'login' | 'register', email?: string, password?: string) => {
     // Demo Logic
     if (email === DEMO_USER_CREDENTIALS.email && password === DEMO_USER_CREDENTIALS.password) {
         populateDemoData();
         login('demo-token-123', {
             id: 'demo-user-1',
             email: email,
             name: 'Demo Merchant',
             role: 'user',
             createdAt: Date.now()
         });
         return;
     }
     
     // MOCKED REAL LOGIN
     login('mock-token-xyz', {
         id: 'user-' + Date.now(),
         email: email || 'user@example.com',
         name: 'New User',
         role: 'user',
         createdAt: Date.now()
     });

     showToast("Login Berhasil", "success");
     
     // Check onboarding status
     const onboarded = localStorage.getItem('margins_pro_onboarded');
     if (onboarded === 'true') {
         navigate('/app');
     } else {
         navigate('/onboarding');
     }
  };

  return (
      <AuthPage 
        initialMode={initialMode}
        initialEmail={isDemo ? DEMO_USER_CREDENTIALS.email : ''}
        initialPassword={isDemo ? DEMO_USER_CREDENTIALS.password : ''}
        initialReferralCode={referralCode}
        isDemo={isDemo}
        onSuccess={handleSuccess}
        onBack={() => navigate('/')}
      />
  );
};

const OnboardingWrapper = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const profile = useProfile();

    const handleComplete = (data: Partial<BusinessProfile>) => {
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
        
        profile.addBusiness(newBusiness);
        profile.switchBusiness(newBusiness.id);
    
        localStorage.setItem('margins_pro_onboarded', 'true');
        showToast("Setup Selesai!", "success");
        navigate('/app');
    };

    return <OnboardingWizard onComplete={handleComplete} />;
  };

const LandingWrapper = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    // Preserve query params (like ?ref=...)
    const handleAuthNav = (mode: 'login' | 'register') => {
        navigate({
            pathname: '/auth',
            search: location.search
        }, { 
            state: { mode } 
        });
    };

    return (
        <LandingPage 
            onGetStarted={() => handleAuthNav('register')}
            onLogin={() => handleAuthNav('login')}
            onDemo={() => navigate('/demo')}
        />
    );
};

const DemoWrapper = () => {
    const navigate = useNavigate();
    return (
        <DemoTour 
            onStartDemo={() => navigate('/auth', { state: { mode: 'login', isDemo: true } })}
            onBack={() => navigate('/')}
        />
    );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingWrapper />} />
        
        <Route path="/auth" element={
             <AuthWrapper />
        } />

        <Route path="/demo" element={
            <DemoWrapper />
        } />

        {/* PROTECTED */}
        <Route path="/onboarding" element={
            <ProtectedRoute>
                <OnboardingWrapper />
            </ProtectedRoute>
        } />

        <Route path="/app/*" element={
            <ProtectedRoute>
                <DashboardShell />
            </ProtectedRoute>
        } />

        {/* SYSTEM (ADMIN ONLY) */}
        {/* Note: We use 'admin' role check here. Demo user is 'user', so this tests security. */}
        <Route path="/system" element={
            <ProtectedRoute requiredRole="admin" redirectTo="/app"> 
               <SystemLayout /> 
            </ProtectedRoute>
        }>
            <Route path="admin" element={<AdminDashboard />} /> 
            <Route index element={<Navigate to="admin" replace />} />
        </Route>

        <Route path="/pricing" element={<PricingPage />} />

        {/* PUBLIC CONTENT */}
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
