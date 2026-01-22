import React from 'react';
import { ShieldCheck, Hourglass, BarChart3 } from 'lucide-react';
import { BentoCard } from '@koda/core/ui';

interface OperationalHealthWidgetProps {
   setActiveTab: (tab: string) => void;
   monthlyFixedCost?: number;
   currentSavings?: number;
   className?: string;
}

export const OperationalHealthWidget: React.FC<OperationalHealthWidgetProps> = ({
   setActiveTab,
   monthlyFixedCost = 0,
   currentSavings = 0,
   className
}) => {
   const dailyBurn = monthlyFixedCost / 30;
   const runwayDays = dailyBurn > 0 ? Math.floor(currentSavings / dailyBurn) : 0;

   // Progress bar logic: scale of 30 days
   const runwayPercentage = Math.min(100, (runwayDays / 30) * 100);
   const isHealthy = runwayDays >= 30;
   const isWarning = runwayDays < 15;

   return (
      <div className={`px-2 lg:px-0 ${className}`}>
         <BentoCard
            onClick={() => setActiveTab('finance')}
            className="hover:shadow-md transition-all cursor-pointer group p-7"
         >
            <div className="relative z-10 flex justify-between items-start mb-6">
               <div className="space-y-1">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2 leading-none">
                     <ShieldCheck className="w-3 h-3" /> Capital Runway
                  </h5>
                  <p className="text-3xl font-black italic tracking-tighter">
                     {runwayDays} Days Left
                  </p>
               </div>
               <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Hourglass className={`w-5 h-5 ${isWarning ? 'text-orange-500 animate-pulse' : 'text-indigo-500'}`} />
               </div>
            </div>

            <div className="relative z-10 space-y-2">
               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                  <span>Runway Status</span>
                  <span className={isHealthy ? 'text-emerald-600' : isWarning ? 'text-orange-500' : 'text-indigo-600'}>
                     {isHealthy ? 'Optimal' : isWarning ? 'Critical Range' : 'Stable'}
                  </span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                     className={`h-full rounded-full shadow-lg transition-all duration-1000`}
                     style={{
                        width: `${runwayPercentage}%`,
                        backgroundColor: isHealthy ? '#059669' : isWarning ? '#f97316' : '#4f46e5'
                     }}
                  ></div>
               </div>
               <p className="text-[9px] text-slate-400 font-medium italic mt-2">
                  {runwayDays < 15
                     ? "Segera optimalkan cashflow untuk memperpanjang runway."
                     : "Runway saat ini cukup untuk menjaga stabilitas operasional."}
               </p>
            </div>

            <BarChart3 className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
         </BentoCard>
      </div>
   );
};
