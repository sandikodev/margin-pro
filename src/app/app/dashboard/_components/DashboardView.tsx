import React, { useMemo } from 'react';
import { Project, BusinessProfile } from '@shared/types';

// Feature Widgets
import { HeroWidget } from './HeroWidget';
import { PlatformTrackingGrid } from './PlatformTrackingGrid';
import { RecentActivityList } from './RecentActivityList';
import { OperationalHealthWidget } from './OperationalHealthWidget';
import { StrategicTiles } from './StrategicTiles';
import { QuickDiscoveryBanner } from './QuickDiscoveryBanner';
import { MerchantProfileCard } from './MerchantProfileCard';

export interface DashboardViewProps {
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
    projects = [], activeBusiness, credits = 0, setActiveTab, createNewProject, setActiveProjectId, formatValue,
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
                <HeroWidget
                    createNewProject={createNewProject}
                    setActiveTab={setActiveTab}
                />

                <PlatformTrackingGrid
                    projectsCount={projects.length}
                    avgMargin={avgMargin}
                    targetMargin={activeBusiness?.targetMargin}
                    credits={credits}
                    setActiveTab={setActiveTab}
                    formatValue={formatValue}
                />

                <RecentActivityList
                    projects={projects}
                    setActiveProjectId={setActiveProjectId}
                    setActiveTab={setActiveTab}
                    formatValue={formatValue}
                />
            </div>

            {/* --- RIGHT COLUMN (WIDGETS & SIDEBAR) --- */}
            <div className="space-y-6 lg:col-span-4 flex flex-col h-full">
                <OperationalHealthWidget
                    setActiveTab={setActiveTab}
                    monthlyFixedCost={monthlyFixedCost}
                    currentSavings={currentSavings}
                />

                <StrategicTiles setActiveTab={setActiveTab} />
                <QuickDiscoveryBanner setActiveTab={setActiveTab} />
                <MerchantProfileCard setActiveTab={setActiveTab} />
            </div>
        </div>
    );
};
