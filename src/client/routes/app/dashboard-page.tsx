import React from 'react';
import { DashboardView } from './index';

import { useMarketplace } from '../../hooks/useMarketplace';
import { useCurrency } from '../../hooks/useCurrency';
import { INITIAL_MARKETPLACE } from '../../lib/constants';
import { Project } from '@shared/types';

interface DashboardPageProps {
    projects: Project[];
    setActiveTab: (tab: string) => void;
    createNewProject: () => void;
    setActiveProjectId: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ projects, setActiveTab, createNewProject, setActiveProjectId }) => {
    const { credits, topUpCredits } = useMarketplace();
    const { formatValue } = useCurrency();

    return (
        <DashboardView 
            projects={projects} 
            credits={credits} 
            setCredits={topUpCredits} // In the original it was (amount) => topUpCredits(amount)
            setActiveTab={setActiveTab} 
            createNewProject={createNewProject} 
            setActiveProjectId={setActiveProjectId} 
            formatValue={formatValue}
            marketItemsCount={INITIAL_MARKETPLACE.length}
        />
    );
}
