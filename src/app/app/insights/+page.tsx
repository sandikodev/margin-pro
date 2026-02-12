import React, { useState } from 'react';
import { ProfitSimulator } from './_components/ProfitSimulator';
import { usePricingEngine } from '@/hooks/usePricingEngine';
import { Platform } from '@shared/types';
import { useSettings } from '@/hooks/useSettings';
import { useOutletContext } from '@koda/runtime';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';

/**
 * 🏔️ Zenith Insights (+page)
 * Maps to /app/insights
 */
export const InsightsPage: React.FC = () => {
    const ctx = useOutletContext<DashboardOutletContext>();
    const { activeProject, activeBusiness, editProject, exchangeRates, selectedCurrency, formatValue } = ctx;
    const { t } = useSettings();
    const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);

    // This hook is heavy, so it's good it's only here now
    const { results, chartData, feeComparisonData, overrides, setOverrides, promoPercent, setPromoPercent } = usePricingEngine(activeProject, selectedCurrency, exchangeRates, activeBusiness);

    if (!activeProject) return null;

    return (
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
            activeBusiness={activeBusiness}
            updateProject={(updates) => editProject(activeProject.id, updates)}
            overrides={overrides}
            setOverrides={setOverrides}
            onOpenSidebar={() => { }}
            t={t}
        />
    );
}

export default InsightsPage;
