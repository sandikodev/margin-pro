import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Project, BusinessProfile, Currency } from '@shared/types';

// Layout
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { MobileNav, TabId } from '../../components/layout/MobileNav';

// Modals
import { ProjectSelectorModal } from '../../components/modals/ProjectSelectorModal';

// Hooks
import { useCurrency } from '../../hooks/useCurrency';
import { useProjects } from '../../hooks/useProjects';
import { useTTS } from '../../hooks/useTTS';
import { useProfile } from '../../hooks/useProfile';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useToast } from '../../context/toast-context';
import confetti from 'canvas-confetti';
import { useKonamiCode } from '../../hooks/useKonamiCode';

// Define the Context Type
export interface DashboardOutletContext {
    projects: Project[];
    activeProject: Project | undefined;
    activeProjectId: string;
    setActiveProjectId: (id: string) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    createNewProject: () => void; // Wrapped for UI
    addProject: (p: Project) => void;
    editProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    activeBusiness: BusinessProfile | undefined;
    activeBusinessId: string;
    // Shared Utils
    setActiveTab: (tab: string) => void;
    // Profile
    businesses: BusinessProfile[];
    addBusiness: (b: BusinessProfile) => void;
    switchBusiness: (id: string) => void;
    updateBusiness: (id: string, u: Partial<BusinessProfile>) => void;
    deleteBusiness: (id: string) => void;
    // UI
    isProfileEditing: boolean;
    setIsProfileEditing: (val: boolean) => void;
    // Currency
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exchangeRates: any;
    selectedCurrency: Currency;
}

export const DashboardShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // --- DERIVE ACTIVE TAB FROM URL ---
  const getTabFromPath = (path: string): TabId => {
      if (path.includes('/app/market')) return 'market';
      if (path.includes('/app/profile')) return 'profile';
      if (path.includes('/app/finance')) return 'cashflow';
      if (path.includes('/app/calc')) return 'calc';
      if (path.includes('/app/insights')) return 'insights';
      if (path.includes('/app/academia') || path.includes('/app/edu')) return 'edu';
      if (path.includes('/app/about')) return 'about';
      if (path.includes('/app/changelog')) return 'changelog';
      if (path.includes('/app/topup')) return 'topup';
      return 'home';
  };
  const activeTab = getTabFromPath(location.pathname);

  // --- APP STATE MANAGEMENT ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  
  // Hooks
  const profile = useProfile();
  const { credits } = useMarketplace(); // Fetch real credits for Header
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
  const { isSpeaking, handleAudioSummary: playSummary } = useTTS();

  // EASTER EGG
  useKonamiCode(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
    });
    showToast("GOD MODE: UNLOCKED 🚀", "success");
  });

  // --- HANDLERS ---

  const handleCreateNewProject = () => {
    const newId = createProjectHook();
    setActiveProjectId(newId);
    navigate('/app/calc'); // Navigate instead of setState
    setIsSidebarOpen(false);
    showToast("Project baru dibuat", "info");
  };

  const handleTabChange = (tab: string) => {
    // Legacy support for string args, map to routes
    switch(tab) {
        case 'home': navigate('/app'); break;
        case 'calc': navigate('/app/calc'); break;
        case 'insights': 
            navigate('/app/insights'); 
            setShowProjectSelector(true); // Keep selector logic
            break;
        case 'market': navigate('/app/market'); break;
        case 'edu': navigate('/app/academia'); break;
        case 'profile': navigate('/app/profile'); break;
        case 'cashflow': navigate('/app/finance'); break;
        case 'about': navigate('/app/about'); break;
        case 'changelog': navigate('/app/changelog'); break;
        case 'topup': navigate('/app/topup'); break;
        default: navigate('/app');
    }
  };

  const handleAudioSummary = () => {
    if (!activeProject || !activeProject.costs) return;
    const totalCost = activeProject.costs.reduce((a,b)=>a+b.amount,0);
    playSummary(activeProject, formatValue(totalCost), formatValue(activeProject.targetNet));
  };

  // --- CONTEXT VALUE ---
  const outletContext: DashboardOutletContext = {
      projects,
      activeProject,
      activeProjectId,
      setActiveProjectId,
      updateProject: editProject,
      createNewProject: handleCreateNewProject,
      addProject,
      editProject,
      deleteProject,
      activeBusiness: profile.activeBusiness,
      activeBusinessId: profile.activeBusinessId,
      setActiveTab: handleTabChange,
      businesses: profile.businesses,
      addBusiness: profile.addBusiness,
      switchBusiness: profile.switchBusiness,
      updateBusiness: profile.updateBusiness,
      deleteBusiness: profile.deleteBusiness,
      isProfileEditing,
      setIsProfileEditing,
      exchangeRates,
      selectedCurrency
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
          credits={credits || 0} 
                      // Header needs credits. We should pull useMarketplace just for credits in Header if needed, 
                      // OR remove it from Header props if it fetches itself. 
                      // Let's check Header.tsx... It takes credits as prop.
                      // For now, let's keep it 0 or fetch it here cleanly if critical.
                      // Optimization: Let's fetch lightweight credit balance here.
                      // Actually, let useMarketplace() run here just for credits.
          activeBusiness={profile.activeBusiness}
          isProfileEditing={isProfileEditing}
          onProfileBack={() => setIsProfileEditing(false)}
        />

        <div className="flex-grow overflow-y-auto bg-slate-50/50 p-4 lg:p-6 lg:pr-32 scrollbar-hide pb-36 lg:pb-20 overscroll-y-contain w-full">
          <div className="max-w-7xl mx-auto w-full">
             <Outlet context={outletContext} />
          </div>
        </div>

        <div className="pb-safe bg-slate-50/50">
           <MobileNav activeTab={activeTab} setActiveTab={(t) => handleTabChange(t)} />
        </div>

        <ProjectSelectorModal 
          isOpen={showProjectSelector}
          onClose={() => setShowProjectSelector(false)}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelect={(id) => {
            setActiveProjectId(id);
            navigate('/app/insights'); // Direct nav
            setShowProjectSelector(false);
          }}
          onCreateNew={handleCreateNewProject}
          formatValue={formatValue}
        />
      </main>
    </div>
  );
};
