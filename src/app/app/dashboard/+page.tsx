import React from 'react';
import { DashboardView } from './_components/DashboardView';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useFinance } from '@/hooks/useFinance';
import { INITIAL_MARKETPLACE } from '@/lib/constants';
import { useOutletContext, useLoaderData } from '@koda/runtime';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';
import { MarketplaceBalance, Liability, CashflowRecord } from '@shared/types';

interface DashboardLoaderData {
    finance: { liabilities: Liability[], cashflow: CashflowRecord[] };
    financeSettings: { monthlyFixedCost: number, currentSavings: number };
    marketplace: MarketplaceBalance;
}

export const DashboardPage: React.FC = () => {
    const loaderData = useLoaderData() as DashboardLoaderData;
    const ctx = useOutletContext<DashboardOutletContext>();
    const { projects, activeBusiness, setActiveTab, createNewProject, setActiveProjectId, formatValue, credits } = ctx;

    const { topUpCredits } = useMarketplace(loaderData?.marketplace);
    const { monthlyFixedCost, currentSavings } = useFinance(activeBusiness?.id, loaderData?.finance, loaderData?.financeSettings);

    return (
        <DashboardView
            projects={projects}
            activeBusiness={activeBusiness}
            credits={credits}
            setCredits={topUpCredits}
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

export default DashboardPage;
