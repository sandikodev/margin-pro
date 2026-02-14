import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from '@/core/ui/layout/DashboardShell';
import { useMarketplace } from '@/core/hooks/useMarketplace';
import { useCurrency } from '@/core/hooks/useCurrency';
import { useFinance } from '@/core/hooks/useFinance';
import { INITIAL_MARKETPLACE } from '@shared/constants';

// Feature Widgets
import { HeroWidget } from '@/core/ui/features/dashboard-widgets/HeroWidget';
import { PlatformTrackingGrid } from '@/core/ui/features/dashboard-widgets/PlatformTrackingGrid';
import { RecentActivityList } from '@/core/ui/features/dashboard-widgets/RecentActivityList';
import { OperationalHealthWidget } from '@/core/ui/features/dashboard-widgets/OperationalHealthWidget';
import { StrategicTiles } from '@/core/ui/features/dashboard-widgets/StrategicTiles';
import { QuickDiscoveryBanner } from '@/core/ui/features/dashboard-widgets/QuickDiscoveryBanner';
import { MerchantProfileCard } from '@/core/ui/features/dashboard-widgets/MerchantProfileCard';

export default function DashboardPage() {
    const { projects, activeBusiness, setActiveTab, createNewProject, setActiveProjectId } = useOutletContext<DashboardOutletContext>();
    const { credits, topUpCredits } = useMarketplace();
    const { formatValue } = useCurrency();
    const { monthlyFixedCost, currentSavings } = useFinance(activeBusiness?.id);

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
}
