import React from 'react';
import { Package, TrendingUp, Wallet } from 'lucide-react';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { BentoCard, ResponsiveGrid } from '@koda/ui';

interface PlatformTrackingGridProps {
   projectsCount: number;
   avgMargin: number;
   targetMargin?: number;
   credits: number;
   setActiveTab: (tab: string) => void;
   formatValue: (val: number, options?: { compact?: boolean, noCurrency?: boolean }) => string;
   className?: string;
}

export const PlatformTrackingGrid: React.FC<PlatformTrackingGridProps> = ({
   projectsCount,
   avgMargin,
   targetMargin,
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

         <ResponsiveGrid 
            columns={3} 
            className="flex overflow-x-auto scrollbar-hide px-4 lg:px-0 snap-x lg:grid lg:overflow-visible"
         >
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
               <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                     <TrendingUp className="w-5 h-5" />
                  </div>
                  {targetMargin && (
                     <div className="px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/10">
                        <span className="text-[8px] font-black text-emerald-600 uppercase">Target: {targetMargin}%</span>
                     </div>
                  )}
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Profit</p>
                  <p className="text-xl font-black text-slate-900 tracking-tighter">
                     {formatValue(avgMargin, { compact: true })}
                     <span className="text-[10px] text-slate-300 font-bold uppercase">/unit</span>
                  </p>
               </div>
            </BentoCard>

            <div
               onClick={() => setActiveTab('topup')}
               role="button"
               tabIndex={0}
               aria-label={`Vault: ${credits} Points. Click to top up.`}
               onKeyDown={(e) => e.key === 'Enter' && setActiveTab('topup')}
               className="snap-start min-w-[150px] bg-indigo-600 p-5 rounded-[2.2rem] shadow-xl shadow-indigo-100 space-y-4 cursor-pointer active:scale-95 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/20"
            >
               <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                  <Wallet className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Vault</p>
                  <p className="text-xl font-black text-white tracking-tighter">{credits} <span className="text-[10px] text-indigo-300 font-bold uppercase">Pts</span></p>
               </div>
            </div>
         </ResponsiveGrid>
      </div>
   );
};
