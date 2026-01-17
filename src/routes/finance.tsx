import React, { useState, useMemo } from 'react';
import { Banknote, AlertTriangle, Plus, CalendarClock, TrendingUp, ArrowDownRight, ArrowUpRight, Calculator, CheckCircle2, Trash2, Target, Sliders, ShieldAlert, Wallet, Hourglass, ShieldCheck, XCircle } from 'lucide-react';
import { Liability, CashflowRecord, Project, BusinessProfile } from '../types';
import { FinanceManager as FinanceComponent } from '../components/features/finance/FinanceManager';

interface FinanceManagerProps {
  liabilities: Liability[];
  setLiabilities: React.Dispatch<React.SetStateAction<Liability[]>>;
  cashflow: CashflowRecord[];
  setCashflow: React.Dispatch<React.SetStateAction<CashflowRecord[]>>;
  activeProject: Project;
  formatValue: (val: number) => string;
  // Extended functions passed from parent/hook
  toggleLiabilityPaid?: (id: string) => void;
  deleteCashflow?: (id: string) => void;
  // New props for Business Profile Sync
  activeBusiness?: BusinessProfile;
  updateBusiness?: (updates: Partial<BusinessProfile>) => void;
}

interface ExtendedFinanceManagerProps extends FinanceManagerProps {
  monthlyFixedCost?: number;
  setMonthlyFixedCost?: (val: number) => void;
  currentSavings?: number;
  setCurrentSavings?: (val: number) => void;
}

export const FinanceManager: React.FC<ExtendedFinanceManagerProps> = (props) => {
  return <FinanceComponent {...props} />;
};