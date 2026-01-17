import React from 'react';
import { BarChart3, Target, CalendarDays, Scale, ShieldCheck, Clock } from 'lucide-react';
import { Project, ProductionConfig } from '../../types';

interface OperationalContextProps {
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  prodConfig: ProductionConfig;
}

export const OperationalContext: React.FC<OperationalContextProps> = ({ activeProject, updateProject, prodConfig }) => {
  return (
    <div className="bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] p-5 lg:p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col gap-5 lg:gap-6">
          
          {/* Header Section (Simplified) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    <BarChart3 className="w-3 h-3" /> Operational Scope
                 </div>
            </div>

            {activeProject.confidence === 'high' ? (
               <div className="flex flex-col items-end shrink-0">
                 <span className="flex items-center gap-1.5 text-[8px] lg:text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                   <ShieldCheck className="w-3 h-3" /> Validated
                 </span>
               </div>
            ) : (
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded-lg shrink-0">Draft Mode</span>
            )}
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
             {/* Period Selector - Spans 2 cols on mobile */}
             <div className="col-span-2 lg:col-span-1 space-y-1.5">
               <label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Periode Hitung</label>
               <div className="flex bg-slate-800 p-1 rounded-xl">
                 {['daily', 'weekly', 'monthly'].map((p) => (
                   <button 
                    key={p}
                    onClick={() => updateProject({ productionConfig: { ...prodConfig, period: p as any } })}
                    className={`flex-1 py-2.5 text-[9px] lg:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all active:scale-95 ${prodConfig.period === p ? 'bg-indigo-600 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                   >
                     {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                   </button>
                 ))}
               </div>
             </div>
             
             {/* Target Units */}
             <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"><Target className="w-3 h-3" /> Output / Penjualan</label>
                <div className="flex items-center bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-700/50 focus-within:border-indigo-500 focus-within:bg-slate-800/80 transition-all">
                  <input 
                    type="number" 
                    value={prodConfig.targetUnits || ''} 
                    onChange={(e) => updateProject({ productionConfig: { ...prodConfig, targetUnits: Number(e.target.value) } })}
                    className="bg-transparent w-full text-sm lg:text-base font-black text-white outline-none placeholder-slate-600"
                    placeholder="0"
                  />
                  <span className="text-[9px] font-bold text-slate-500 uppercase ml-1">Unit/Pcs</span>
                </div>
             </div>

             {/* Active Days */}
             <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Hari Operasional</label>
                <div className="flex items-center bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-700/50 focus-within:border-indigo-500 focus-within:bg-slate-800/80 transition-all">
                  <input 
                    type="number" 
                    value={prodConfig.daysActive || ''} 
                    onChange={(e) => updateProject({ productionConfig: { ...prodConfig, daysActive: Number(e.target.value) } })}
                    className="bg-transparent w-full text-sm lg:text-base font-black text-white outline-none placeholder-slate-600"
                    placeholder="0"
                  />
                  <span className="text-[9px] font-bold text-slate-500 uppercase ml-1">Hari</span>
                </div>
             </div>
          </div>
          
          {/* Insight Bar */}
          <div className="px-4 py-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-between">
            <span className="text-[9px] text-indigo-200/80 font-medium">Alokasi biaya untuk stok/bulk akan dibagi rata.</span>
            <div className="text-[9px] lg:text-[10px] font-black uppercase text-indigo-300 tracking-widest flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Avg: {(prodConfig.targetUnits / (prodConfig.period === 'weekly' ? prodConfig.daysActive : 1)).toFixed(0)} Unit/Hari
            </div>
          </div>
        </div>
        
        {/* Background Decor */}
        <Scale className="absolute -bottom-12 -right-12 w-48 h-48 lg:w-64 lg:h-64 text-white/5 rotate-12 pointer-events-none group-hover:rotate-6 transition-transform duration-700" />
      </div>
  );
};