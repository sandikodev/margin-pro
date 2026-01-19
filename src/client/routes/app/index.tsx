import React, { useMemo } from 'react';
import { Search, History } from 'lucide-react';
import { Project } from '@shared/types';

// Design System
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

// Feature Widgets
import { HeroWidget } from '@/components/features/dashboard-widgets/HeroWidget';
import { PlatformTrackingGrid } from '@/components/features/dashboard-widgets/PlatformTrackingGrid';
import { RecentActivityList } from '@/components/features/dashboard-widgets/RecentActivityList';
import { OperationalHealthWidget } from '@/components/features/dashboard-widgets/OperationalHealthWidget';
import { StrategicTiles } from '@/components/features/dashboard-widgets/StrategicTiles';
import { QuickDiscoveryBanner } from '@/components/features/dashboard-widgets/QuickDiscoveryBanner';
import { MerchantProfileCard } from '@/components/features/dashboard-widgets/MerchantProfileCard';


interface DashboardViewProps {
  projects: Project[];
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  setActiveTab: (tab: string) => void;
  createNewProject: () => void;
  setActiveProjectId: (id: string) => void;
  formatValue: (val: number) => string;
  marketItemsCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects, credits, setActiveTab, createNewProject, setActiveProjectId, formatValue
}) => {
  // Stats Calculations
  const totalNetProfit = useMemo(() => projects.reduce((a, b) => a + (b.targetNet || 0), 0), [projects]);
  const avgMargin = useMemo(() => {
    if (projects.length === 0) return 0;
    return totalNetProfit / projects.length;
  }, [totalNetProfit, projects]);

  return (
    <div className="space-y-6 lg:space-y-0 animate-in fade-in slide-in-from-bottom-10 duration-1000 lg:grid lg:grid-cols-12 lg:gap-6">
      
      {/* --- LEFT COLUMN (MAIN CONTENT) --- */}
      <div className="space-y-6 lg:col-span-8">
        
        {/* 1. NATIVE SYSTEM GREETING */}
        <DashboardSectionHeader 
            title="Merchant Central ✨" 
            variant='accent'
            // We reuse the header component but with custom styling for greeting? 
            // Actually the design system header is specifically for section titles (small gray text).
            // The greeting is unique. Let's keep greeting inline or make a Greeting component?
            // Inline is fine as it's just text + buttons, but let's try to reuse SectionHeader if flexible enough.
            // The greeting has "Selamat Datang" above it.
            // Let's keep it inline for now to avoid over-abstraction of unique elements.
        />
        <div className="flex items-center justify-between px-4 lg:px-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Selamat Datang,</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Merchant Central ✨</h2>
          </div>
          <div className="flex gap-2">
             <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
                <Search className="w-5 h-5" />
             </button>
             <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 relative active:scale-90 transition-transform">
                <History className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* 2. IMMERSIVE HERO WIDGET */}
        <HeroWidget 
            createNewProject={createNewProject}
            setActiveTab={setActiveTab}
        />

        {/* 3. PLATFORM SNAPSHOTS */}
        <PlatformTrackingGrid 
            projectsCount={projects.length}
            avgMargin={avgMargin}
            credits={credits}
            setActiveTab={setActiveTab}
            formatValue={formatValue}
        />

        {/* 6. RECENT ACTIVITY LIST */}
        <RecentActivityList 
            projects={projects}
            setActiveProjectId={setActiveProjectId}
            setActiveTab={setActiveTab}
            formatValue={formatValue}
        />

      </div>

      {/* --- RIGHT COLUMN (WIDGETS & SIDEBAR) --- */}
      <div className="space-y-6 lg:col-span-4 flex flex-col h-full">
        
        {/* 5. OPERATIONAL HEALTH */}
        <OperationalHealthWidget setActiveTab={setActiveTab} />

        {/* 4. STRATEGIC TILES */}
        <StrategicTiles setActiveTab={setActiveTab} />

        {/* 7. QUICK DISCOVERY BANNER */}
        <QuickDiscoveryBanner setActiveTab={setActiveTab} />

        {/* 8. MERCHANT PROFILE SUMMARY */}
        <MerchantProfileCard setActiveTab={setActiveTab} />

      </div>

    </div>
  );
};
