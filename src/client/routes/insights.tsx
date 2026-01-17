
import React from 'react';
import { ProfitSimulator as SimulatorComponent } from '../components/features/insights/ProfitSimulator';
import { CalculationResult, Platform, Project, PlatformOverrides } from '@shared/types';
import { TERMINOLOGY } from '../lib/constants';

interface ProfitSimulatorProps {
  results: CalculationResult[];
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
