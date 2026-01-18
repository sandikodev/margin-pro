import { useState, useMemo, useEffect } from 'react';
import { Platform, Project, PlatformOverrides, Currency } from '@shared/types';
import { calculatePricingStrategies } from '../lib/utils';
import { useConfig } from '../context/ConfigContext';

export const usePricingEngine = (
  activeProject: Project | undefined,
  selectedCurrency: Currency,
  exchangeRates: Record<string, number>
) => {
  const { platforms: platformData, settings, isLoading } = useConfig();
  const [promoPercent, setPromoPercent] = useState<number>(0);
  const taxRate = parseFloat(settings.TAX_RATE || '0.11');

  // Initialize overrides based on dynamic data
  const [overrides, setOverrides] = useState<Record<Platform, PlatformOverrides>>({} as any);

  useEffect(() => {
    if (!isLoading && Object.keys(platformData).length > 0) {
      const initial: Partial<Record<Platform, PlatformOverrides>> = {};
      Object.keys(platformData).forEach(key => {
        const p = key as Platform;
        initial[p] = {
          commission: platformData[p].defaultCommission * 100,
          fixedFee: platformData[p].defaultFixedFee,
          withdrawal: platformData[p].withdrawalFee
        };
      });
      setOverrides(initial as Record<Platform, PlatformOverrides>);
    }
  }, [platformData, isLoading]);

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
    color: platformData[r.platform]?.color || '#cbd5e1'
  })).sort((a, b) => b.profit - a.profit), [results, platformData]);

  // Derived Data for Fee Comparison
  const feeComparisonData = useMemo(() => results.map(r => {
    const rate = exchangeRates[selectedCurrency.code] || 1;
    const value = selectedCurrency.code === 'IDR' ? r.recommended.totalDeductions : r.recommended.totalDeductions / rate;
    return {
      name: r.platform,
      'Fees': value,
      color: platformData[r.platform]?.color || '#cbd5e1'
    };
  }), [results, selectedCurrency, exchangeRates, platformData]);

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