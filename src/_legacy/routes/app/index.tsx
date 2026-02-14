import React, { useMemo } from 'react';
import { Project, BusinessProfile } from '@shared/types';

// Design System

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
  activeBusiness: BusinessProfile | undefined;
  credits: number;
  setCredits: (amount: number) => void;
  setActiveTab: (tab: string) => void;
  createNewProject: () => void;
  setActiveProjectId: (id: string) => void;
  formatValue: (val: number, options?: { compact?: boolean, noCurrency?: boolean }) => string;
  marketItemsCount: number;
  monthlyFixedCost?: number;
  currentSavings?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects, activeBusiness, credits, setActiveTab, createNewProject, setActiveProjectId, formatValue,
  monthlyFixedCost = 0, currentSavings = 0
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
        {/* HEADING REMOVED - MOVED TO HEADER */}

        {/* 2. IMMERSIVE HERO WIDGET */}
        <HeroWidget
          createNewProject={createNewProject}
          setActiveTab={setActiveTab}
        />

        {/* 3. PLATFORM SNAPSHOTS */}
        <PlatformTrackingGrid
          projectsCount={projects.length}
          avgMargin={avgMargin}
          targetMargin={activeBusiness?.targetMargin}
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
        <OperationalHealthWidget
          setActiveTab={setActiveTab}
          monthlyFixedCost={monthlyFixedCost}
          currentSavings={currentSavings}
        />

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
