import React from 'react';
import { useFinance } from '@/hooks/useFinance';
import { FinanceManager } from './finance';
import { useOutletContext } from '@koda/runtime';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';

export const FinancePage: React.FC = () => {
  const ctx = useOutletContext<DashboardOutletContext>();
  const { activeProject, activeBusiness, updateBusiness, formatValue } = ctx;
  const { liabilities, setLiabilities, cashflow, setCashflow, monthlyFixedCost, setMonthlyFixedCost, currentSavings, toggleLiabilityPaid, deleteCashflow, addLiability, addCashflow } = useFinance(activeBusiness?.id);

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

export default FinancePage;
