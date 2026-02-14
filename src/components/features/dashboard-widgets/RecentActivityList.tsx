import React from 'react';
import { Package, ChevronRight, Layers } from 'lucide-react';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { Project } from '@shared/types';

interface RecentActivityListProps {
   projects: Project[];
   setActiveProjectId: (id: string) => void;
   setActiveTab: (tab: string) => void;
   formatValue: (val: number, options?: { compact?: boolean, noCurrency?: boolean }) => string;
   className?: string;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
   projects,
   setActiveProjectId,
   setActiveTab,
   formatValue,
   className
}) => {
   return (
      <div className={`space-y-4 px-2 lg:px-0 ${className}`}>
         <DashboardSectionHeader
            title="Recent Nodes"
            variant='accent'
            indicatorColor="bg-indigo-600"
            action={
               <button onClick={() => setActiveTab('calc')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest active:scale-90 transition-transform hover:text-indigo-700">See All</button>
            }
         />

         <div className="bg-white rounded-[2.5rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {projects.length === 0 ? (
               <div className="p-16 text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto"><Package className="w-8 h-8 text-slate-200" /></div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Node Library Empty</p>
               </div>
            ) : (
               projects.slice(0, 4).map(p => (
                  <div key={p.id}
                     onClick={(_) => {
                        setActiveProjectId(p.id);
                        setActiveTab('calc');
                     }}
                     style={{ viewTransitionName: `project-card-${p.id}` } as React.CSSProperties}
                     className="p-5 flex items-center justify-between active:bg-slate-50 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-xl uppercase border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                           {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-sm font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{p.name}</span>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tight bg-emerald-50 px-2 py-0.5 rounded-md">
                                 +{formatValue(p.targetNet, { compact: true })}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                 <Layers className="w-2.5 h-2.5" /> {p.costs.length} Elements
                              </span>
                           </div>
                        </div>
                     </div>
                     <div 
                        role="button"
                        aria-label={`View details for ${p.name}`}
                        className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                     >
                        <ChevronRight className="w-5 h-5" />
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
};
