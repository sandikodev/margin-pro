import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from '@/core/ui/layout/DashboardShell';
import { useFinance } from '@/core/hooks/useFinance';
import { useCurrency } from '@/core/hooks/useCurrency';
import { FinanceManager } from '@/core/ui/features/finance/FinanceManager';

export default function FinancePage() {
    const { activeProject, activeBusiness, updateBusiness } = useOutletContext<DashboardOutletContext>();
    const {
        liabilities,
        setLiabilities,
        cashflow,
        setCashflow,
        monthlyFixedCost,
        setMonthlyFixedCost,
        currentSavings,
        toggleLiabilityPaid,
        deleteCashflow,
        addLiability,
        addCashflow
    } = useFinance(activeBusiness?.id);
    const { formatValue } = useCurrency();

    return (
        <FinanceManager
            liabilities={liabilities}
            setLiabilities={setLiabilities}
            addLiability={addLiability}
            cashflow={cashflow}
            addCashflow={addCashflow}
            setCashflow={setCashflow}
            activeProject={activeProject}
            formatValue={formatValue}
            monthlyFixedCost={monthlyFixedCost}
            setMonthlyFixedCost={setMonthlyFixedCost}
            currentSavings={currentSavings}
            toggleLiabilityPaid={toggleLiabilityPaid}
            deleteCashflow={deleteCashflow}
            activeBusiness={activeBusiness}
            updateBusiness={(updates) => {
                if (activeBusiness?.id) updateBusiness(activeBusiness.id, updates);
            }}
        />
    );
}
