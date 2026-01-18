
import React from 'react';
import { ProfitSimulator as SimulatorComponent, ChartDataItem, FeeComparisonItem } from '../../components/features/insights/ProfitSimulator';
import { CalculationResult, Platform, Project, PlatformOverrides, Currency } from '@shared/types';
import { TERMINOLOGY } from '../../lib/constants';

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
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  overrides: Record<Platform, PlatformOverrides>;
  setOverrides: React.Dispatch<React.SetStateAction<Record<Platform, PlatformOverrides>>>;
  onBack: () => void;
  onOpenSidebar: () => void;
  t: (key: keyof typeof TERMINOLOGY) => string; // Pass the translator function
}

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = (props) => {
  return <SimulatorComponent {...props} />;
};
