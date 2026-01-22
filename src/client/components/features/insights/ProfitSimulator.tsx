import React, { useState, useMemo } from 'react';
import { LayoutGrid, Utensils, Store, Box, Globe, Sliders, PieChart } from 'lucide-react';
import { CalculationResult, Platform, Project, PlatformOverrides, Currency, BusinessProfile } from '@shared/types';
import { calculateTotalHPP } from '@/lib/utils';
import { FloatingActionMenu } from '@/components/ui/FloatingActionMenu';
import { TabNavigation, TabItem } from '@/components/ui/TabNavigation';
import { useConfig } from '@/hooks/useConfig';

// Modular Components
import { SimulatorSummary } from './components/SimulatorSummary';
import { PromoControls } from './components/PromoControls';
import { PlatformProfitabilityChart } from './components/PlatformProfitabilityChart';
import { PlatformFeeComparison } from './components/PlatformFeeComparison';
import { PlatformCard } from './components/PlatformCard';
import { PlatformDetailModal } from './components/PlatformDetailModal';

export interface ChartDataItem {
  name: string;
  profit: number;
  color: string;
}

export interface FeeComparisonItem {
  name: string;
  Fees: number;
  color: string;
}

interface ProfitSimulatorProps {
  results: CalculationResult[];
  chartData: ChartDataItem[];
  feeComparisonData: FeeComparisonItem[];
  promoPercent: number;
  setPromoPercent: (val: number) => void;
  expandedPlatform: Platform | null;
  setExpandedPlatform: (p: Platform | null) => void;
  formatValue: (val: number) => string;
  selectedCurrency: Currency;
  activeProject: Project | undefined;
  activeBusiness: BusinessProfile | undefined;
  updateProject: (updates: Partial<Project>) => void;
  overrides: Record<Platform, PlatformOverrides>;
  setOverrides: React.Dispatch<React.SetStateAction<Partial<Record<Platform, PlatformOverrides>>>>;
  onOpenSidebar: () => void;
  t: (key: string) => string;
}

type CategoryType = 'food' | 'marketplace' | 'export' | 'offline';

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({
  results, chartData, feeComparisonData, promoPercent, setPromoPercent,
  expandedPlatform, setExpandedPlatform, formatValue, selectedCurrency,
  activeProject, activeBusiness, updateProject, overrides, setOverrides, onOpenSidebar, t
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('food');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [modalTab, setModalTab] = useState<'settings' | 'breakdown'>('settings');

  const { platforms: platformData } = useConfig();

  const currentTaxRate = activeProject?.taxRate ?? activeBusiness?.taxRate ?? 11;
  const targetMargin = activeProject?.targetMargin || activeBusiness?.targetMargin || 20;

  const totalHPP = useMemo(() => calculateTotalHPP(activeProject?.costs || [], activeProject?.productionConfig), [activeProject]);
  const targetPortions = activeProject?.productionConfig?.targetUnits || 0;

  const realStrategy = activeProject?.pricingStrategy || 'markup';
  const effectiveStrategy = isPreviewing
    ? (realStrategy === 'competitor' ? 'markup' : 'competitor')
    : realStrategy;

  let displayProfit = 0;
  let displayLabel = '';

  if (effectiveStrategy === 'markup') {
    displayProfit = activeProject?.targetNet || 0;
    displayLabel = t('strategyMarkup');
  } else {
    displayProfit = (activeProject?.competitorPrice || 0) - totalHPP;
    displayLabel = t('strategyCompetitor');
  }

  const displayTotalPotential = displayProfit * targetPortions;

  const filteredResults = useMemo(() => {
    return results.filter(r => platformData[r.platform]?.category === activeCategory);
  }, [results, activeCategory, platformData]);

  const categories: TabItem[] = [
    { id: 'food', label: 'Aplikasi Food', icon: Utensils },
    { id: 'marketplace', label: 'Toko Online', icon: Store },
    { id: 'offline', label: 'Jual Langsung', icon: Box },
    { id: 'export', label: 'Luar Negeri', icon: Globe },
  ];

  const updateFee = (platform: Platform, field: keyof PlatformOverrides, value: number) => {
    setOverrides(prev => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value }
    }));
  };

  const activeResult = useMemo(() => {
    if (!expandedPlatform) return null;
    return results.find(r => r.platform === expandedPlatform);
  }, [expandedPlatform, results]);

  const primaryScenario = useMemo(() => {
    if (!activeResult) return undefined;
    const isCompetitorStrategy = effectiveStrategy === 'competitor';
    return isCompetitorStrategy ? (activeResult.competitorProtection || activeResult.recommended) : activeResult.recommended;
  }, [activeResult, effectiveStrategy]);

  const modalTabsData: TabItem[] = [
    { id: 'settings', label: 'Atur Biaya', icon: Sliders },
    { id: 'breakdown', label: 'Komposisi Harga', icon: PieChart }
  ];


  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      {/* 1. RINGKASAN STRATEGI */}
      <SimulatorSummary
        activeProject={activeProject}
        targetPortions={targetPortions}
        totalHPP={totalHPP}
        displayProfit={displayProfit}
        displayTotalPotential={displayTotalPotential}
        displayLabel={displayLabel}
        effectiveStrategy={effectiveStrategy}
        targetMargin={targetMargin}
        isPreviewing={isPreviewing}
        setIsPreviewing={setIsPreviewing}
        formatValue={formatValue}
        t={t}
      />

      {/* 2. PILIH CHANNEL JUALAN */}
      <TabNavigation
        variant="sticky"
        tabs={categories}
        activeTab={activeCategory}
        onChange={(id) => setActiveCategory(id as CategoryType)}
      />

      {/* 3. SIMULASI DISKON */}
      <PromoControls
        promoPercent={promoPercent}
        setPromoPercent={setPromoPercent}
      />

      {/* 4. CHARTS */}
      <PlatformProfitabilityChart
        chartData={chartData}
        promoPercent={promoPercent}
        setPromoPercent={setPromoPercent}
        formatValue={formatValue}
      />

      <PlatformFeeComparison
        results={results}
        feeComparisonData={feeComparisonData}
        platformData={platformData}
        selectedCurrency={selectedCurrency}
        formatValue={formatValue}
      />

      {/* 5. CHANNEL CARDS */}
      <div className="grid grid-cols-1 gap-6">
        {filteredResults.map(res => (
          <PlatformCard
            key={res.platform}
            res={res}
            platformData={platformData}
            effectiveStrategy={effectiveStrategy}
            expandedPlatform={expandedPlatform}
            setExpandedPlatform={setExpandedPlatform}
            setModalTab={setModalTab}
            formatValue={formatValue}
            totalHPP={totalHPP}
            activeProject={activeProject}
            updateProject={updateProject}
            t={t}
          />
        ))}
      </div>

      {/* DETAIL MODAL */}
      <PlatformDetailModal
        expandedPlatform={expandedPlatform}
        activeResult={activeResult || undefined}
        onClose={() => setExpandedPlatform(null)}
        modalTab={modalTab}
        setModalTab={setModalTab}
        modalTabsData={modalTabsData}
        primaryScenario={primaryScenario}
        overrides={overrides}
        updateFee={updateFee}
        currentTaxRate={currentTaxRate}
        formatValue={formatValue}
        t={t}
      />

      <div className="lg:hidden">
        <FloatingActionMenu
          icon={LayoutGrid}
          onMainClick={onOpenSidebar}
        />
      </div>
    </div>
  );
};
