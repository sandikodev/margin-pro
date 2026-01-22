import React from 'react';
import { DashboardView } from './index';

import { useMarketplace } from '@/hooks/useMarketplace';
import { useCurrency } from '@/hooks/useCurrency';
import { useFinance } from '@/hooks/useFinance';
import { INITIAL_MARKETPLACE } from '@/lib/constants';
import { Project, BusinessProfile } from '@shared/types';

interface DashboardPageProps {
    projects: Project[];
    activeBusiness: BusinessProfile | undefined;
    setActiveTab: (tab: string) => void;
    createNewProject: () => void;
    setActiveProjectId: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ projects, activeBusiness, setActiveTab, createNewProject, setActiveProjectId }) => {
    const { credits, topUpCredits } = useMarketplace();
    const { formatValue } = useCurrency();
    const { monthlyFixedCost, currentSavings } = useFinance(activeBusiness?.id);

    return (
        <DashboardView
            projects={projects}
            activeBusiness={activeBusiness}
            credits={credits}
            setCredits={topUpCredits} // In the original it was (amount) => topUpCredits(amount)
            setActiveTab={setActiveTab}
            createNewProject={createNewProject}
            setActiveProjectId={setActiveProjectId}
            formatValue={formatValue}
            marketItemsCount={INITIAL_MARKETPLACE.length}
            monthlyFixedCost={monthlyFixedCost}
            currentSavings={currentSavings}
        />
    );
}
