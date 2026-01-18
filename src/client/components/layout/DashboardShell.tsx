import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Platform, Project, MarketplaceItem } from '@shared/types';
import { INITIAL_MARKETPLACE } from '../../lib/constants';

// Routes (Tabs)
import { DashboardView } from '../../routes/app/index';
import { ProductCalculator } from '../../routes/app/calculator'; 
import { MarketplaceView } from '../../routes/app/market'; 
import { ProfitSimulator } from '../../routes/app/insights';
import { AcademyView } from '../../routes/app/academy';
import { MerchantProfile } from '../../routes/app/profile';
import { FinanceManager } from '../../routes/app/finance';
import { AboutView } from '../../routes/app/about';
import { ChangelogView } from '../../routes/app/changelog';
import { TopUpView } from '../../routes/app/topup';

// Layout
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { MobileNav } from '../../components/layout/MobileNav';

// Modals
import { ProjectSelectorModal } from '../../components/modals/ProjectSelectorModal';

// Hooks
import { useCurrency } from '../../hooks/useCurrency';
import { useProjects } from '../../hooks/useProjects';
import { useFinance } from '../../hooks/useFinance';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useTTS } from '../../hooks/useTTS';
import { useSettings } from '../../hooks/useSettings'; 
import { useProfile } from '../../hooks/useProfile';
import { usePricingEngine } from '../../hooks/usePricingEngine';
import { useToast } from '../../context/ToastContext';

export const DashboardShell: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // --- APP STATE MANAGEMENT ---
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

  // Sync active project if needed
  useEffect(() => {
    if (projects.length > 0) {
      const currentExists = projects.find(p => p.id === activeProjectId);
      if (!currentExists) {
        setActiveProjectId(projects[0].id);
      }
    } else {
      setActiveProjectId('');
    }
  }, [profile.activeBusinessId, projects, activeProjectId, setActiveProjectId]);

  const { selectedCurrency, setSelectedCurrency, exchangeRates, isRefreshingRates, fetchLiveRates, formatValue } = useCurrency();
  const { results, chartData, feeComparisonData, overrides, setOverrides, promoPercent, setPromoPercent } = usePricingEngine(activeProject, selectedCurrency, exchangeRates);
  const { liabilities, setLiabilities, cashflow, setCashflow, monthlyFixedCost, setMonthlyFixedCost, currentSavings, toggleLiabilityPaid, deleteCashflow } = useFinance();
  const { credits, transactionHistory, deductCredits, topUpCredits } = useMarketplace();
  const { isSpeaking, handleAudioSummary: playSummary } = useTTS();
  const { settings, toggleLanguage, t } = useSettings();

  // --- HANDLERS ---

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem('margins_pro_auth');
    localStorage.removeItem('margins_pro_is_demo');
    
    // Clear Demo Data securely if it was demo
    // (Optional: keep data for better UX if they re-login, but strictly "logout" implies clearing access)
    
    showToast("Anda telah keluar sesi.", "info");
    navigate('/');
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

  const handleAudioSummary = () => {
    if (!activeProject || !activeProject.costs) return;
    const totalCost = activeProject.costs.reduce((a,b)=>a+b.amount,0);
    playSummary(activeProject, formatValue(totalCost), formatValue(activeProject.targetNet));
  };

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
                setCredits={(amount: number) => { topUpCredits(amount); }}
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
                // setCredits removed 
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
                // setCurrentSavings removed
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
                onOpenSidebar={() => setIsSidebarOpen(true)}
                onBack={() => {
                  if (activeProject) setActiveTab('calc'); 
                  else setActiveTab('home');
                }}
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
