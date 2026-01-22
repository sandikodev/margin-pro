
import React from 'react';
import { ProfitSimulator as SimulatorComponent, ChartDataItem, FeeComparisonItem } from '@/components/features/insights/ProfitSimulator';
import { CalculationResult, Platform, Project, PlatformOverrides, Currency, BusinessProfile } from '@shared/types';

interface ProfitSimulatorProps {
  results: CalculationResult[];
  chartData: ChartDataItem[];
  feeComparisonData: FeeComparisonItem[];
  selectedCurrency: Currency;
  promoPercent: number;
  setPromoPercent: (val: number) => void;
  expandedPlatform: Platform | null;
  setExpandedPlatform: (p: Platform | null) => void;
  formatValue: (val: number) => string;
  activeProject: Project | undefined;
  activeBusiness: BusinessProfile | undefined;
  updateProject: (updates: Partial<Project>) => void;
  overrides: Record<Platform, PlatformOverrides>;
  setOverrides: React.Dispatch<React.SetStateAction<Partial<Record<Platform, PlatformOverrides>>>>;
  onBack: () => void;
  onOpenSidebar: () => void;
  t: (key: string) => string;
}

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = (props) => {
  return <SimulatorComponent {...props} />;
};
