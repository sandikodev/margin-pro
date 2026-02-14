import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from '@/core/ui/layout/DashboardShell';
import { ProfitSimulator } from '@/core/ui/features/insights/ProfitSimulator';
import { usePricingEngine } from '@/core/hooks/usePricingEngine';
import { useCurrency } from '@/core/hooks/useCurrency';
import { useSettings } from '@/core/hooks/useSettings';
import { Platform } from '@shared/types';

export default function InsightsPage() {
    const { activeProject, activeBusiness, updateProject, setActiveTab } = useOutletContext<DashboardOutletContext>();
    const { formatValue, selectedCurrency, exchangeRates } = useCurrency();
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
            updateProject={(updates) => updateProject(activeProject.id, updates)}
            overrides={overrides}
            setOverrides={setOverrides}
            onOpenSidebar={() => { /* Handled by layout usually, or we can trigger it */ }}
            onBack={() => setActiveTab('calc')}
            t={t}
        />
    );
}
