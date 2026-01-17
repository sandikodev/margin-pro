import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { ToastProvider, useToast } from './components/ui/Toast';

// Routes
import { LandingPage } from './routes/landing';
import { AuthPage } from './routes/auth';
import { OnboardingWizard } from './routes/onboarding';
import { DemoTour } from './routes/demo-tour';
import { DashboardShell } from './components/layout/DashboardShell';

// Data
import { DEMO_BUSINESS, DEMO_PROJECTS, DEMO_CASHFLOW, DEMO_LIABILITIES, DEMO_USER_CREDENTIALS } from './lib/demo-data';
import { BusinessProfile } from './types';
import { useProfile } from './hooks/useProfile';

// --- AUTH GUARDS ---

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem('margins_pro_auth');
  const location = useLocation();

  if (isAuth !== 'true') {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

const RedirectIfAuth = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem('margins_pro_auth');
  const hasOnboarded = localStorage.getItem('margins_pro_onboarded');
  
  if (isAuth === 'true') {
      if (hasOnboarded === 'true') {
          return <Navigate to="/app" replace />;
      }
      return <Navigate to="/onboarding" replace />;
  }
  return children;
};

// --- AUTH DATA HELPER ---
const populateDemoData = () => {
    localStorage.clear();
    localStorage.setItem('margins_pro_businesses_v3', JSON.stringify(DEMO_BUSINESS));
    localStorage.setItem('margins_pro_active_business_id_v3', DEMO_BUSINESS[0].id);
    localStorage.setItem('margins_pro_v12_final', JSON.stringify(DEMO_PROJECTS));
    localStorage.setItem('margins_pro_cashflow', JSON.stringify(DEMO_CASHFLOW));
    localStorage.setItem('margins_pro_liabilities', JSON.stringify(DEMO_LIABILITIES));
    localStorage.setItem('margins_pro_auth', 'true');
    localStorage.setItem('margins_pro_onboarded', 'true');
    localStorage.setItem('margins_pro_is_demo', 'true');
    localStorage.setItem('margins_pro_demo_welcome', 'true');
};

// --- WRAPPER COMPONENTS ---
// We wrap pages to handle internal navigation logic that was previously in App.tsx

const AuthWrapper = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const location = useLocation();
  const [initialMode, setInitialMode] = useState<'login' | 'register'>('register');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
     if (location.state?.mode) setInitialMode(location.state.mode);
     if (location.state?.isDemo) setIsDemo(true);
  }, [location]);

  const handleSuccess = (mode: 'login' | 'register', email?: string, password?: string) => {
     // Demo Logic
     if (email === DEMO_USER_CREDENTIALS.email && password === DEMO_USER_CREDENTIALS.password) {
         populateDemoData();
         window.location.href = '/app'; // Hard reload to ensure hooks pick up new storage
         return;
     }

     localStorage.setItem('margins_pro_auth', 'true');
     showToast("Login Berhasil", "success");
     
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
        isDemo={isDemo}
        onSuccess={handleSuccess}
        onBack={() => navigate('/')}
      />
  );
};

const OnboardingWrapper = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    // We need useProfile to add business! 
    // BUT useProfile relies on storage. 
    // Ideally we should move addBusiness logic inside OnboardingWizard or pass a handler.
    // For now, simpler to reuse the useProfile hook, even if redundant in other routes.
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
    return (
        <LandingPage 
            onGetStarted={() => navigate('/auth', { state: { mode: 'register' } })}
            onLogin={() => navigate('/auth', { state: { mode: 'login' } })}
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
  // Demo Welcome Toast Logic
  useEffect(() => {
     // We can't use useToast here because it's outside ToastProvider in this specific render tree position usually 
     // BUT here App IS inside ToastProvider in index.tsx?
     // Wait, index.tsx wraps App with ToastProvider. So useToast works!
  }, []);
  
  // Note: ToastProvider is in index.tsx, so we are good.

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Redirect to /app if logged in) */}
        <Route path="/" element={
            <RedirectIfAuth>
                <LandingWrapper />
            </RedirectIfAuth>
        } />
        
        <Route path="/auth" element={
            <RedirectIfAuth>
                <AuthWrapper />
            </RedirectIfAuth>
        } />

        <Route path="/demo" element={
             <RedirectIfAuth>
                <DemoWrapper />
             </RedirectIfAuth>
        } />

        {/* Protected Routes */}
        <Route path="/onboarding" element={
            <RequireAuth>
                <OnboardingWrapper />
            </RequireAuth>
        } />

        <Route path="/app/*" element={
            <RequireAuth>
                <DashboardShell />
            </RequireAuth>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
