import { useState, useMemo } from 'react';
import { Platform, Project, PlatformOverrides } from '../types';
import { PLATFORM_DATA } from '../lib/constants';
import { calculatePricingStrategies } from '../lib/utils';

export const usePricingEngine = (
  activeProject: Project | undefined,
  selectedCurrency: any,
  exchangeRates: Record<string, number>
) => {
  const [promoPercent, setPromoPercent] = useState<number>(0);
  const taxRate = 0.11;

  // Initialize overrides based on constants
  const [overrides, setOverrides] = useState<Record<Platform, PlatformOverrides>>(() => {
    const initial: any = {};
    Object.values(Platform).forEach(p => {
      initial[p] = {
        commission: PLATFORM_DATA[p].defaultCommission * 100,
        fixedFee: PLATFORM_DATA[p].defaultFixedFee,
        withdrawal: PLATFORM_DATA[p].withdrawalFee
      };
    });
    return initial;
  });

  // Core Calculation
  const results = useMemo(() => {
    if (!activeProject || !activeProject.costs) return [];
    return calculatePricingStrategies(activeProject, overrides, promoPercent, taxRate);
  }, [activeProject, promoPercent, overrides]);

  // Derived Data for Charts
  const chartData = useMemo(() => results.map(r => ({
    name: r.platform,
    profit: r.recommended.netProfit, 
    price: r.recommended.price,
    color: PLATFORM_DATA[r.platform].color
  })).sort((a, b) => b.profit - a.profit), [results]);

  // Derived Data for Fee Comparison
  const feeComparisonData = useMemo(() => results.map(r => {
    const rate = exchangeRates[selectedCurrency.code] || 1;
    const value = selectedCurrency.code === 'IDR' ? r.recommended.totalDeductions : r.recommended.totalDeductions / rate;
    return {
      name: r.platform,
      'Fees': value,
      color: PLATFORM_DATA[r.platform].color
    };
  }), [results, selectedCurrency, exchangeRates]);

  return {
    results,
    chartData,
    feeComparisonData,
    overrides,
    setOverrides,
    promoPercent,
    setPromoPercent
  };
};