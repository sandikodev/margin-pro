import React, { useState } from 'react';
import { ProfitSimulator } from './insights';
import { usePricingEngine } from '../../hooks/usePricingEngine';
import { useCurrency } from '../../hooks/useCurrency';
import { Project, ExchangeRates, Platform, Currency } from '@shared/types';
import { useSettings } from '../../hooks/useSettings';

interface InsightsPageProps {
    activeProject: Project | null;
    updateProject: (id: string, updates: Partial<Project>) => void;
    onBack: () => void;
    onOpenSidebar: () => void;
    exchangeRates: ExchangeRates;
    selectedCurrency: Currency;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ 
    activeProject, updateProject, onBack, onOpenSidebar, exchangeRates, selectedCurrency 
}) => {
    const { formatValue } = useCurrency();
    const { t } = useSettings();
    const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);

    // This hook is heavy, so it's good it's only here now
    const { results, chartData, feeComparisonData, overrides, setOverrides, promoPercent, setPromoPercent } = usePricingEngine(activeProject, selectedCurrency, exchangeRates);

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
            updateProject={(updates) => updateProject(activeProject.id, updates)}
            overrides={overrides}
            setOverrides={setOverrides}
            onOpenSidebar={onOpenSidebar}
            onBack={onBack}
            t={t}
        />
    );
}
