import React, { useMemo } from 'react';
import { Layers, Search, ChevronRight, TrendingUp, CheckCircle2, Clock, Calculator, AlertCircle, Sparkles } from 'lucide-react';
import { Project } from '@shared/types';
import { Modal } from '@/components/ui/Modal';

interface ProjectSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  formatValue: (val: number) => string;
}

export const ProjectSelectorModal: React.FC<ProjectSelectorModalProps> = ({
  isOpen, onClose, projects, activeProjectId, onSelect, onCreateNew, formatValue
}) => {
  
  // Calculate quick stats
  const stats = useMemo(() => {
    const total = projects.length;
    const avgProfit = total > 0 ? projects.reduce((a,b) => a + (b.targetNet || 0), 0) / total : 0;
    const highestProfit = total > 0 ? Math.max(...projects.map(p => p.targetNet || 0)) : 0;
    return { total, avgProfit, highestProfit };
  }, [projects]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Library Project"
      description="Pilih item untuk analisis margin mendalam"
      icon={Layers}
      footer={
        <button 
           onClick={onCreateNew}
           className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
           <span className="w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px]">+</span>
           Buat Item Baru
        </button>
      }
    >
       {/* Mini Dashboard */}
       {projects.length > 0 && (
         <div className="grid grid-cols-2 gap-px bg-slate-100 border-b border-slate-200">
            <div className="bg-white p-4 flex flex-col items-center text-center">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</span>
               <span className="text-xl font-black text-slate-900">{stats.total}</span>
            </div>
            <div className="bg-white p-4 flex flex-col items-center text-center">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Profit</span>
               <span className="text-xl font-black text-emerald-600">{formatValue(stats.avgProfit).split(',')[0]}</span>
            </div>
         </div>
       )}

       <div className="p-4 lg:p-6 space-y-3 min-h-[300px]">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-6">
               <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                  <Search className="w-8 h-8 text-indigo-300" />
               </div>
               <div className="space-y-2 max-w-xs">
                  <p className="text-base font-black text-slate-700">Library Masih Kosong</p>
                  <p className="text-xs text-slate-400 leading-relaxed">Anda belum memiliki data produk. Buat baru untuk mulai menghitung HPP & Profit.</p>
               </div>
            </div>
          ) : (
            <div className="space-y-4">
               {projects.map(p => {
                 const isActive = activeProjectId === p.id;
                 const isTopPerformer = p.targetNet >= stats.highestProfit && p.targetNet > 0;
                 
                 return (
                   <button
                     key={p.id}
                     onClick={() => onSelect(p.id)}
                     className={`w-full text-left transition-all group relative overflow-hidden rounded-[1.5rem] border-2
                     ${isActive 
                       ? 'bg-white border-indigo-600 ring-4 ring-indigo-500/10 shadow-xl z-10' 
                       : 'bg-white border-transparent hover:border-indigo-200 hover:shadow-lg shadow-sm'}`}
                   >
                      {isActive && <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>}
                      
                      <div className="p-5 flex items-start gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-sm transition-transform group-hover:scale-110
                           ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {p.name.charAt(0)}
                         </div>
                         
                         <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                               <h4 className={`font-black text-sm truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{p.name}</h4>
                               {isTopPerformer && (
                                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                                     <Sparkles className="w-2 h-2" /> Top
                                  </span>
                               )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px]">
                               <span className="font-bold text-slate-500 flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-slate-300" />
                                  {new Date(p.lastModified).toLocaleDateString()}
                               </span>
                               <span className="font-bold text-slate-500 flex items-center gap-1.5">
                                  <Calculator className="w-3 h-3 text-slate-300" />
                                  {p.costs.length} Komponen
                               </span>
                            </div>
                         </div>

                         <div className="shrink-0 flex flex-col items-end gap-1">
                            {isActive ? (
                               <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4" />
                               </div>
                            ) : (
                               <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            )}
                         </div>
                      </div>

                      {/* Footer Info inside Card */}
                      <div className={`px-5 py-3 border-t flex items-center justify-between ${isActive ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                         <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${p.pricingStrategy === 'competitor' ? 'text-indigo-500' : 'text-slate-400'}`}>
                               {p.pricingStrategy === 'competitor' ? 'Mode Pasar' : 'Mode Markup'}
                            </span>
                         </div>
                         <div className="flex items-center gap-1.5 font-black text-xs text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            {formatValue(p.targetNet)}
                         </div>
                      </div>
                   </button>
                 );
               })}
            </div>
          )}
       </div>
       
       <div className="px-6 pb-2 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide">
             <AlertCircle className="w-3 h-3" />
             Tips: Pilih item untuk simulasi biaya marketplace
          </div>
       </div>
    </Modal>
  );
};