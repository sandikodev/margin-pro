
import React, { useState, useEffect } from 'react';
import { Platform, Project, MarketplaceItem, BusinessProfile } from './types';
import { INITIAL_MARKETPLACE } from './lib/constants';
import { DEMO_BUSINESS, DEMO_PROJECTS, DEMO_CASHFLOW, DEMO_LIABILITIES, DEMO_USER_CREDENTIALS } from './lib/demo-data';

// Auth & Onboarding Routes
import { LandingPage } from './routes/landing';
import { AuthPage } from './routes/auth';
import { OnboardingWizard } from './routes/onboarding';
import { DemoTour } from './routes/demo-tour';

// App Routes (Pages)
import { DashboardView } from './routes/index';
import { ProductCalculator } from './routes/calculator'; 
import { MarketplaceView } from './routes/market'; 
import { ProfitSimulator } from './routes/insights';
import { AcademyView } from './routes/academy';
import { MerchantProfile } from './routes/profile';
import { FinanceManager } from './routes/finance';
import { AboutView } from './routes/about';
import { ChangelogView } from './routes/changelog';
import { TopUpView } from './routes/topup';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Modals
import { ProjectSelectorModal } from './components/modals/ProjectSelectorModal';

// Hooks
import { useCurrency } from './hooks/useCurrency';
import { useProjects } from './hooks/useProjects';
import { useFinance } from './hooks/useFinance';
import { useMarketplace } from './hooks/useMarketplace';
import { useTTS } from './hooks/useTTS';
import { useSettings } from './hooks/useSettings'; 
import { useProfile } from './hooks/useProfile';
import { usePricingEngine } from './hooks/usePricingEngine';
import { useToast } from './components/ui/Toast';

type AppViewMode = 'landing' | 'auth' | 'onboarding' | 'app' | 'demo-tour';

// Internal App Component containing main logic
const InternalApp: React.FC<{ onSessionReset: () => void }> = ({ onSessionReset }) => {
  // --- AUTH STATE MANAGEMENT ---
  const [viewMode, setViewMode] = useState<AppViewMode>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');
  const [isDemoFlow, setIsDemoFlow] = useState(false); 
  const { showToast } = useToast();
  
  useEffect(() => {
    // 1. Check for Demo Welcome Flag (Persistence across session reset)
    const showDemoWelcome = localStorage.getItem('margins_pro_demo_welcome');
    if (showDemoWelcome === 'true') {
      // Custom toast for demo users
      setTimeout(() => {
        showToast("Mode Demo Siap! Login sebagai Owner Fiera Food 🚀", "success");
      }, 500); 
      localStorage.removeItem('margins_pro_demo_welcome');
    }

    // 2. Simple auth persistence check
    const isAuth = localStorage.getItem('margins_pro_auth');
    const hasOnboarded = localStorage.getItem('margins_pro_onboarded');
    
    if (isAuth === 'true') {
      if (hasOnboarded === 'true') {
        setViewMode('app');
      } else {
        setViewMode('onboarding');
      }
    } else {
      setViewMode('landing');
    }
  }, []);

  // --- APP STATE MANAGEMENT (Existing Logic) ---
  const [activeTab, setActiveTab] = useState<'home' | 'calc' | 'insights' | 'market' | 'edu' | 'profile' | 'cashflow' | 'about' | 'changelog' | 'topup'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);
  const [profileInitialTab, setProfileInitialTab] = useState<'outlets' | 'account' | 'ledger'>('outlets');

  // Hooks
  const profile = useProfile();
  const { 
    projects, activeProject, activeProjectId, setActiveProjectId, 
    updateProject, editProject, createNewProject: createProjectHook, addProject,
    deleteProject, toggleFavorite, allProjects, importProjectWithAI, isImporting
  } = useProjects(profile.activeBusinessId);

  useEffect(() => {
    if (projects.length > 0 && viewMode === 'app') {
      const currentExists = projects.find(p => p.id === activeProjectId);
      if (!currentExists) {
        setActiveProjectId(projects[0].id);
      }
    } else if (viewMode === 'app') {
      setActiveProjectId('');
    }
  }, [profile.activeBusinessId, projects, activeProjectId, setActiveProjectId, viewMode]);

  const { selectedCurrency, setSelectedCurrency, exchangeRates, isRefreshingRates, fetchLiveRates, formatValue } = useCurrency();
  const { results, chartData, feeComparisonData, overrides, setOverrides, promoPercent, setPromoPercent } = usePricingEngine(activeProject, selectedCurrency, exchangeRates);
  const { liabilities, setLiabilities, cashflow, setCashflow, monthlyFixedCost, setMonthlyFixedCost, currentSavings, setCurrentSavings, toggleLiabilityPaid, deleteCashflow } = useFinance();
  const { credits, transactionHistory, deductCredits, topUpCredits } = useMarketplace();
  const { isSpeaking, handleAudioSummary: playSummary } = useTTS();
  const { settings, toggleLanguage, t } = useSettings();

  // --- HANDLERS ---

  // Demo Population Logic - Executed AFTER successful demo login
  const populateDemoData = () => {
    localStorage.clear(); // Reset first
    
    // Inject Demo Data
    localStorage.setItem('margins_pro_businesses_v3', JSON.stringify(DEMO_BUSINESS));
    localStorage.setItem('margins_pro_active_business_id_v3', DEMO_BUSINESS[0].id);
    localStorage.setItem('margins_pro_v12_final', JSON.stringify(DEMO_PROJECTS));
    localStorage.setItem('margins_pro_cashflow', JSON.stringify(DEMO_CASHFLOW));
    localStorage.setItem('margins_pro_liabilities', JSON.stringify(DEMO_LIABILITIES));
    
    // Set Auth Flags
    localStorage.setItem('margins_pro_auth', 'true');
    localStorage.setItem('margins_pro_onboarded', 'true');
    localStorage.setItem('margins_pro_is_demo', 'true');
    
    // Set Welcome Flag for the reload
    localStorage.setItem('margins_pro_demo_welcome', 'true');

    // Force Soft Reset (Re-mount App to read new localStorage)
    onSessionReset();
  };

  // Auth Handlers
  const handleAuthSuccess = (mode: 'login' | 'register', email?: string, password?: string) => {
    // Check for Demo Credentials
    if (email === DEMO_USER_CREDENTIALS.email && password === DEMO_USER_CREDENTIALS.password) {
        populateDemoData();
        return;
    }

    localStorage.setItem('margins_pro_auth', 'true');
    if (mode === 'login') {
      const onboarded = localStorage.getItem('margins_pro_onboarded');
      if (onboarded === 'true') {
        setViewMode('app');
        showToast("Selamat datang kembali!", "success");
      } else {
        setViewMode('onboarding');
      }
    } else {
      setViewMode('onboarding');
    }
  };

  const handleOnboardingComplete = (data: Partial<BusinessProfile>) => {
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
      gmapsLink: ''
    };
    
    profile.addBusiness(newBusiness);
    profile.switchBusiness(newBusiness.id);

    localStorage.setItem('margins_pro_onboarded', 'true');
    setViewMode('app');
    showToast("Profil bisnis berhasil dibuat!", "success");
  };

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem('margins_pro_auth');
    localStorage.removeItem('margins_pro_is_demo');
    // We keep data for now to avoid data loss on accidental logout, unless it was demo mode
    if (localStorage.getItem('margins_pro_is_demo') === 'true') {
        localStorage.clear();
    }
    
    setViewMode('landing');
    setActiveTab('home'); 
    setIsDemoFlow(false);
    showToast("Anda telah keluar sesi.", "info");
    
    // Force soft reload to clear in-memory hook state
    onSessionReset();
  };

  // --- TRANSITION HANDLERS ---
  
  const handleStartDemoFlow = () => {
    // Transition from Demo Tour -> Auth Page with Pre-filled data
    setIsDemoFlow(true);
    setAuthInitialMode('login');
    setViewMode('auth');
  };

  const handleCreateNewProject = () => {
    const newId = createProjectHook();
    setActiveProjectId(newId);
    setActiveTab('calc');
    setIsSidebarOpen(false);
    showToast("Project baru dibuat", "info");
  };

  const handleBuyItem = (item: MarketplaceItem) => {
    const success = deductCredits(item.price || 0, item.name);
    if (!success) {
      showToast("Credit tidak mencukupi!", "error");
      return;
    }
    const newProject: Project = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      businessId: profile.activeBusinessId,
      name: `[NEW] ${item.name}`,
      lastModified: Date.now()
    };
    addProject(newProject);
    setActiveTab('calc');
    showToast("Template berhasil dibeli", "success");
  };

  const handleTabChange = (tab: typeof activeTab) => {
    if (tab === 'insights') {
      setShowProjectSelector(true);
    } else {
      if (tab === 'profile') setProfileInitialTab('outlets');
      setActiveTab(tab);
    }
  };

  const handleHistoryNavigation = () => {
    setProfileInitialTab('ledger');
    setActiveTab('profile');
  };

  // App Handlers
  const handleAudioSummary = () => {
    if (!activeProject || !activeProject.costs) return;
    const totalCost = activeProject.costs.reduce((a,b)=>a+b.amount,0);
    playSummary(activeProject, formatValue(totalCost), formatValue(activeProject.targetNet));
  };

  // --- RENDER LOGIC ---

  if (viewMode === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => {
          setAuthInitialMode('register');
          setViewMode('auth');
          setIsDemoFlow(false);
        }} 
        onLogin={() => {
          setAuthInitialMode('login');
          setViewMode('auth');
          setIsDemoFlow(false);
        }}
        onDemo={() => {
          setViewMode('demo-tour');
        }}
      />
    );
  }

  if (viewMode === 'demo-tour') {
    return (
      <DemoTour 
        onStartDemo={handleStartDemoFlow}
        onBack={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'auth') {
    return (
      <AuthPage 
        initialMode={authInitialMode}
        initialEmail={isDemoFlow ? DEMO_USER_CREDENTIALS.email : ''}
        initialPassword={isDemoFlow ? DEMO_USER_CREDENTIALS.password : ''}
        isDemo={isDemoFlow} // Pass this prop to customize UI
        onSuccess={handleAuthSuccess} 
        onBack={() => {
          setViewMode(isDemoFlow ? 'demo-tour' : 'landing');
          if (!isDemoFlow) setAuthInitialMode('register');
        }} 
      />
    );
  }

  if (viewMode === 'onboarding') {
    return (
      <OnboardingWizard onComplete={handleOnboardingComplete} />
    );
  }

  // viewMode === 'app' (The Main Application)
  return (
    <div className="h-[100dvh] w-full bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans text-slate-900 fixed inset-0">
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        projects={projects}
        allProjects={allProjects}
        activeTab={activeTab}
        activeProjectId={activeProjectId}
        setActiveProjectId={setActiveProjectId}
        setActiveTab={handleTabChange}
        createNewProject={handleCreateNewProject}
        addProject={addProject}
        editProject={editProject}
        importProjectWithAI={importProjectWithAI}
        isImporting={isImporting}
        credits={credits}
        deleteProject={deleteProject}
        toggleFavorite={toggleFavorite}
        activeBusiness={profile.activeBusiness}
        businesses={profile.businesses}
        onSwitchBusiness={profile.switchBusiness}
      />

      <main className="flex-grow flex flex-col h-full overflow-hidden relative w-full">
        <Header 
          setSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
          activeProject={activeProject}
          updateProject={updateProject} 
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          fetchLiveRates={fetchLiveRates}
          isRefreshingRates={isRefreshingRates}
          isSpeaking={isSpeaking}
          handleAudioSummary={handleAudioSummary}
          setActiveTab={handleTabChange}
          credits={credits}
          activeBusiness={profile.activeBusiness}
          isProfileEditing={isProfileEditing}
          onProfileBack={() => setIsProfileEditing(false)}
        />

        <div className="flex-grow overflow-y-auto bg-slate-50/50 p-4 lg:p-10 scrollbar-hide pb-36 lg:pb-20 overscroll-y-contain w-full">
          <div className="max-w-5xl mx-auto w-full">
            {activeTab === 'home' && (
              <DashboardView 
                projects={projects} 
                credits={credits} 
                setCredits={topUpCredits as any}
                setActiveTab={handleTabChange} 
                createNewProject={handleCreateNewProject} 
                setActiveProjectId={setActiveProjectId} 
                formatValue={formatValue}
                marketItemsCount={INITIAL_MARKETPLACE.length}
              />
            )}

            {activeTab === 'market' && (
              <MarketplaceView 
                items={INITIAL_MARKETPLACE} 
                handleBuyItem={handleBuyItem} 
                formatValue={formatValue} 
              />
            )}

            {(activeTab === 'profile') && (
              <MerchantProfile 
                credits={credits} 
                setCredits={topUpCredits as any} 
                transactionHistory={transactionHistory}
                settings={settings}
                toggleLanguage={toggleLanguage}
                isEditingProfile={isProfileEditing}
                setIsEditingProfile={setIsProfileEditing}
                onTopUpClick={() => handleTabChange('topup')}
                businesses={profile.businesses}
                activeBusinessId={profile.activeBusinessId}
                activeBusiness={profile.activeBusiness}
                addBusiness={profile.addBusiness}
                switchBusiness={profile.switchBusiness}
                updateBusiness={profile.updateBusiness}
                deleteBusiness={profile.deleteBusiness}
                initialTab={profileInitialTab}
                onLogout={handleLogout} 
              />
            )}

            {activeTab === 'topup' && (
              <TopUpView 
                formatValue={formatValue}
                topUpCredits={topUpCredits}
                onBack={() => handleTabChange('profile')}
                onHistoryClick={handleHistoryNavigation}
              />
            )}

            {activeTab === 'cashflow' && (
              <FinanceManager 
                liabilities={liabilities}
                setLiabilities={setLiabilities}
                cashflow={cashflow}
                setCashflow={setCashflow}
                activeProject={activeProject}
                formatValue={formatValue}
                monthlyFixedCost={monthlyFixedCost}
                setMonthlyFixedCost={setMonthlyFixedCost}
                currentSavings={currentSavings}
                setCurrentSavings={setCurrentSavings}
                toggleLiabilityPaid={toggleLiabilityPaid}
                deleteCashflow={deleteCashflow}
                activeBusiness={profile.activeBusiness}
                updateBusiness={(updates) => profile.updateBusiness(profile.activeBusinessId, updates)}
              />
            )}

            {activeTab === 'calc' && activeProject && (
              <ProductCalculator 
                activeProject={activeProject} 
                updateProject={updateProject} 
                createNewProject={handleCreateNewProject} 
                deleteProject={deleteProject}
                formatValue={formatValue} 
                goToSimulation={() => handleTabChange('insights')} 
              />
            )}

            {activeTab === 'insights' && activeProject && (
              <ProfitSimulator 
                results={results}
                chartData={chartData}
                feeComparisonData={feeComparisonData}
                promoPercent={promoPercent}
                setPromoPercent={setPromoPercent}
                expandedPlatform={expandedPlatform}
                setExpandedPlatform={setExpandedPlatform}
                formatValue={formatValue}
                selectedCurrency={selectedCurrency}
                activeProject={activeProject}
                updateProject={updateProject}
                overrides={overrides}
                setOverrides={setOverrides}
                onBack={() => handleTabChange('calc')}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                t={t}
              />
            )}

            {activeTab === 'edu' && <AcademyView onOpenAbout={() => handleTabChange('about')} />}
            {activeTab === 'about' && (
              <AboutView 
                onBack={() => handleTabChange('edu')} 
                onOpenChangelog={() => handleTabChange('changelog')} 
              />
            )}
            {activeTab === 'changelog' && <ChangelogView onBack={() => handleTabChange('about')} />}
          </div>
        </div>

        <div className="pb-safe bg-slate-50/50 lg:hidden">
           <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>

        <ProjectSelectorModal 
          isOpen={showProjectSelector}
          onClose={() => setShowProjectSelector(false)}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelect={(id) => {
            setActiveProjectId(id);
            setActiveTab('insights');
            setShowProjectSelector(false);
          }}
          onCreateNew={handleCreateNewProject}
          formatValue={formatValue}
        />
      </main>
    </div>
  );
};

// Main App Wrapper to handle Key-Based Soft Resets
export const App: React.FC = () => {
  const [sessionKey, setSessionKey] = useState(0);

  // This function forces a re-mount of the InternalApp, essentially acting as a "page reload"
  // but keeping it within the React SPA context, avoiding 404s on environments that don't support hard reloads.
  const triggerSessionReset = () => {
    setSessionKey(prev => prev + 1);
  };

  return <InternalApp key={sessionKey} onSessionReset={triggerSessionReset} />;
};

export default App;
