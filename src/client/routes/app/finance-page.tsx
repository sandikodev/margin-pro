import React from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useCurrency } from '@/hooks/useCurrency';
import { FinanceManager } from './finance';
import { BusinessProfile, Project } from '@shared/types';

interface FinancePageProps {
  activeProject: Project | undefined;
  activeBusiness: BusinessProfile | undefined;
  updateBusiness: (id: string, updates: Partial<BusinessProfile>) => void;
}

export const FinancePage: React.FC<FinancePageProps> = ({ activeProject, activeBusiness, updateBusiness }) => {
  const { liabilities, setLiabilities, cashflow, setCashflow, monthlyFixedCost, setMonthlyFixedCost, currentSavings, toggleLiabilityPaid, deleteCashflow, addLiability, addCashflow } = useFinance(activeBusiness?.id);
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
