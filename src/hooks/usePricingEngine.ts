import { useState, useMemo } from 'react';
import { Platform, Project, PlatformOverrides, Currency, BusinessProfile } from '@shared/types';
import { calculatePricingStrategies } from '@/lib/utils';
import { useConfig } from '@/hooks/useConfig';

export const usePricingEngine = (
  activeProject: Project | undefined,
  selectedCurrency: Currency,
  exchangeRates: Record<string, number>,
  activeBusiness?: BusinessProfile
) => {
  const { platforms: platformData, isLoading } = useConfig();
  const [promoPercent, setPromoPercent] = useState<number>(0);

  // Use business tax rate as fallback
  const businessTaxRate = activeBusiness?.taxRate ?? 11; // 11% default
  const businessTargetMargin = activeBusiness?.targetMargin ?? 20; // 20% default

  // 1. Store only explicit user overrides (initially empty or partial)
  const [userOverrides, setUserOverrides] = useState<Partial<Record<Platform, PlatformOverrides>>>({});

  // 2. Derive defaults from dynamic platformData
  const defaults = useMemo(() => {
    if (isLoading || Object.keys(platformData).length === 0) return {} as Record<Platform, PlatformOverrides>;

    const defs: Partial<Record<Platform, PlatformOverrides>> = {};
    Object.keys(platformData).forEach(key => {
      const p = key as Platform;
      defs[p] = {
        commission: platformData[p].defaultCommission * 100,
        fixedFee: platformData[p].defaultFixedFee,
        withdrawal: platformData[p].withdrawalFee
      };
    });
    return defs as Record<Platform, PlatformOverrides>;
  }, [platformData, isLoading]);

  // 3. Merge defaults with user overrides to get the effective configuration
  const overrides = useMemo(() => {
    return { ...defaults, ...userOverrides } as Record<Platform, PlatformOverrides>;
  }, [defaults, userOverrides]);

  // No useEffect needed for synchronization!

  // Core Calculation
  const results = useMemo(() => {
    if (!activeProject || !activeProject.costs) return [];
    if (Object.keys(overrides).length === 0) return [];
    return calculatePricingStrategies(activeProject, overrides, promoPercent, businessTaxRate, businessTargetMargin);
  }, [activeProject, promoPercent, overrides, businessTaxRate, businessTargetMargin]);

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
    setOverrides: setUserOverrides,

    promoPercent,
    setPromoPercent
  };
};