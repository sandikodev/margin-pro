import React from 'react';
import { Package, TrendingUp, Wallet } from 'lucide-react';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { BentoCard } from '@/components/ui/design-system/BentoCard';

interface PlatformTrackingGridProps {
  projectsCount: number;
  avgMargin: number;
  credits: number;
  setActiveTab: (tab: string) => void;
  formatValue: (val: number) => string;
  className?: string;
}

export const PlatformTrackingGrid: React.FC<PlatformTrackingGridProps> = ({ 
  projectsCount, 
  avgMargin, 
  credits, 
  setActiveTab, 
  formatValue,
  className 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
        <DashboardSectionHeader 
            title="Platform Tracking" 
            subtitle="Live Rates"
            indicatorColor="bg-emerald-500"
        />
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 lg:px-0 snap-x lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible">
           <BentoCard className="snap-start min-w-[150px] space-y-4 hover:shadow-md transition-all p-5">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                 <Package className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Katalog</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">{projectsCount} <span className="text-[10px] text-slate-300 font-bold uppercase">Menu</span></p>
              </div>
           </BentoCard>
           
           <BentoCard className="snap-start min-w-[150px] space-y-4 hover:shadow-md transition-all p-5">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Profit</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">{formatValue(avgMargin).split(',')[0]}<span className="text-[10px] text-slate-300 font-bold uppercase">/unit</span></p>
              </div>
           </BentoCard>

           <div onClick={() => setActiveTab('topup')} className="snap-start min-w-[150px] bg-indigo-600 p-5 rounded-[2.2rem] shadow-xl shadow-indigo-100 space-y-4 cursor-pointer active:scale-95 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/20">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                 <Wallet className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Vault</p>
                 <p className="text-xl font-black text-white tracking-tighter">{credits} <span className="text-[10px] text-indigo-300 font-bold uppercase">Pts</span></p>
              </div>
           </div>
        </div>
    </div>
  );
};
