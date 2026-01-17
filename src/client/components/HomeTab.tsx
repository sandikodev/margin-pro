
import React from 'react';
import { Layers, TrendingUp, ShoppingBag, Star, RefreshCw, ArrowUpRight, Plus, Zap, Sparkles } from 'lucide-react';
import { Project } from '@shared/types';

interface DashboardViewProps {
  projects: Project[];
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  setActiveTab: (tab: 'home' | 'calc' | 'insights' | 'market' | 'edu' | 'profile' | 'cashflow' | 'about' | 'changelog' | 'topup') => void;
  createNewProject: () => void;
  setActiveProjectId: (id: string) => void;
  formatValue: (val: number) => string;
  marketItemsCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects, credits, setCredits, setActiveTab, createNewProject, setActiveProjectId, formatValue, marketItemsCount
}) => {
  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
      <section className="bg-indigo-600 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="relative z-10 space-y-6 max-w-lg">
          <h3 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tight leading-none">Bisnis Kuliner,<br/><span className="text-indigo-200">Terukur & Cuan.</span></h3>
          <p className="text-indigo-100 opacity-80 text-sm leading-relaxed">Jangan biarkan bisnis Anda "berdarah". Hitung HPP tepat, tentukan margin sehat di setiap aplikasi.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={createNewProject} className="bg-white text-indigo-600 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:translate-x-1 transition-transform"><Plus className="w-4 h-4" /> Mulai Hitung</button>
            <button onClick={() => setActiveTab('market')} className="bg-indigo-500/50 backdrop-blur-md text-white border border-white/20 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 transition-all flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Market</button>
          </div>
        </div>
        <div onClick={() => setActiveTab('profile')} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between w-full lg:w-64 relative z-10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Saldo Wallet</p>
            <p className="text-4xl font-black">{credits}<span className="text-sm opacity-50 ml-1">Cr</span></p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setCredits(c => c + 100); }} className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">Top Up <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" /></button>
        </div>
        <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Menu', val: projects.length, icon: Layers, color: 'indigo' },
          { label: 'Avg Profit', val: formatValue(projects.reduce((a,b)=>a+b.targetNet,0)/(projects.length || 1)), icon: TrendingUp, color: 'emerald' },
          { label: 'Market Deals', val: marketItemsCount, icon: ShoppingBag, color: 'orange' },
          { label: 'Level Akun', val: 'Elite', icon: Star, color: 'yellow' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-200 flex flex-col items-center text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className={`p-3 bg-${stat.color}-50 rounded-2xl shadow-sm`}><stat.icon className={`w-5 h-5 text-${stat.color}-600`} /></div>
            <div className="truncate w-full">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{stat.label}</p>
              <p className="text-base lg:text-lg font-black text-slate-900 truncate">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-indigo-500" /> Katalog Terbaru</h4>
          <button onClick={() => setActiveTab('calc')} className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Kelola Semua</button>
        </div>
        <div className="divide-y divide-slate-100">
          {projects.slice(0, 3).map(p => (
            <div key={p.id} className="p-6 lg:p-8 flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => { setActiveProjectId(p.id); setActiveTab('calc'); }}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">{p.name.charAt(0)}</div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-base lg:text-lg group-hover:translate-x-1 transition-transform">{p.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{formatValue(p.targetNet)} Net Profit</span>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
