
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, TrendingUp, ShoppingBag, Star, RefreshCw, 
  ArrowUpRight, Plus, Zap, Sparkles, Target, 
  BarChart3, ChevronRight, Activity, Wallet, 
  ShieldCheck, Hourglass, ArrowRight, Gauge, 
  LayoutGrid, Package, Smartphone, Bell, Search, 
  PieChart, ArrowDownRight, Sparkle, History,
  UtensilsCrossed, Store
} from 'lucide-react';
import { Project } from '../types';

interface DashboardViewProps {
  projects: Project[];
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  setActiveTab: (tab: any) => void;
  createNewProject: () => void;
  setActiveProjectId: (id: string) => void;
  formatValue: (val: number) => string;
  marketItemsCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects, credits, setCredits, setActiveTab, createNewProject, setActiveProjectId, formatValue, marketItemsCount
}) => {
  const [businessTypeIdx, setBusinessTypeIdx] = useState(0);
  const businessTypes = ['Kuliner', 'Minuman', 'Retail', 'UMKM', 'Outlet'];
  const [fade, setFade] = useState(true);

  // Stats Calculations
  const totalNetProfit = useMemo(() => projects.reduce((a, b) => a + (b.targetNet || 0), 0), [projects]);
  const avgMargin = useMemo(() => {
    if (projects.length === 0) return 0;
    return totalNetProfit / projects.length;
  }, [totalNetProfit, projects]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBusinessTypeIdx((prev) => (prev + 1) % businessTypes.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-32 pt-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 max-w-lg mx-auto">
      
      {/* 1. NATIVE SYSTEM GREETING */}
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Selamat Datang,</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Merchant Central ✨</h2>
        </div>
        <div className="flex gap-2">
           <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
              <Search className="w-5 h-5" />
           </button>
           <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 relative active:scale-90 transition-transform">
              <History className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* 2. IMMERSIVE HERO WIDGET (AI POWERED NARRATIVE) */}
      <section className="mx-2 bg-slate-950 rounded-[2.5rem] p-7 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative group border border-white/5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/30 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-7">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5 mb-1 backdrop-blur-md">
                <Sparkle className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                <span className="text-[8px] font-black uppercase text-indigo-300 tracking-[0.2em]">Operating Pulse: Stable</span>
             </div>
             <h1 className="text-3xl font-black tracking-tighter text-white leading-[0.95]">
                Optimasi Bisnis <br/>
                <span className={`inline-block transition-all duration-700 text-indigo-400 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  {businessTypes[businessTypeIdx]},
                </span>
                <br/>
                <span className="text-slate-500 italic">Anti-Boncos.</span>
             </h1>
          </div>

          <div className="flex gap-3">
             <button 
               onClick={createNewProject} 
               className="active:scale-[0.97] flex-1 bg-white py-4 rounded-2xl flex items-center justify-center gap-2 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-white/10"
             >
                <Plus className="w-4 h-4 stroke-[4px]" /> New Node
             </button>
             <button 
               onClick={() => setActiveTab('market')}
               className="active:scale-[0.97] w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
             >
                <ShoppingBag className="w-5 h-5" />
             </button>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM SNAPSHOTS (HORIZONTAL SCROLL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-5">
           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Platform Tracking</h4>
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Live Rates</span>
           </div>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 snap-x">
           <div className="snap-start min-w-[150px] bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                 <Package className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Katalog</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">{projects.length} <span className="text-[10px] text-slate-300 font-bold uppercase">Menu</span></p>
              </div>
           </div>
           
           <div className="snap-start min-w-[150px] bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Profit</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">{formatValue(avgMargin).split(',')[0]}<span className="text-[10px] text-slate-300 font-bold uppercase">/unit</span></p>
              </div>
           </div>

           <div onClick={() => setActiveTab('topup')} className="snap-start min-w-[150px] bg-indigo-600 p-5 rounded-[2.2rem] shadow-xl shadow-indigo-100 space-y-4 cursor-pointer active:scale-95 transition-all">
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

      {/* 4. STRATEGIC TILES GRID */}
      <div className="grid grid-cols-2 gap-4 px-4">
         <button onClick={() => setActiveTab('cashflow')} className="active:scale-[0.97] bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-start gap-4 shadow-sm group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><Activity className="w-6 h-6" /></div>
            <div className="text-left">
               <span className="text-sm font-black text-slate-800 uppercase tracking-tight block leading-none">Journal</span>
               <span className="text-[8px] text-slate-400 font-black uppercase block mt-1.5 tracking-widest leading-none">Cashflow History</span>
            </div>
         </button>
         
         <button onClick={() => setActiveTab('insights')} className="active:scale-[0.97] bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-start gap-4 shadow-sm group">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all"><Gauge className="w-6 h-6" /></div>
            <div className="text-left">
               <span className="text-sm font-black text-slate-800 uppercase tracking-tight block leading-none">Simulation</span>
               <span className="text-[8px] text-slate-400 font-black uppercase block mt-1.5 tracking-widest leading-none">Profit Projection</span>
            </div>
         </button>
      </div>

      {/* 5. OPERATIONAL HEALTH (iOS WIDGET STYLE) */}
      <div className="px-2">
         <div className="bg-white rounded-[2.5rem] p-7 text-slate-900 border border-slate-100 shadow-sm relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer" onClick={() => setActiveTab('cashflow')}>
            <div className="relative z-10 flex justify-between items-start mb-6">
               <div className="space-y-1">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2 leading-none">
                    <ShieldCheck className="w-3 h-3" /> Capital Runway
                  </h5>
                  <p className="text-3xl font-black italic tracking-tighter">18 Days Left</p>
               </div>
               <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Hourglass className="w-5 h-5 text-indigo-500" />
               </div>
            </div>
            
            <div className="relative z-10 space-y-2">
               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                  <span>Stock Threshold</span>
                  <span className="text-emerald-600">Normal Range</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[70%] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
               </div>
               <p className="text-[9px] text-slate-400 font-medium italic mt-2">Segera belanja bulk pada hari ke-15 untuk menjaga stabilitas HPP.</p>
            </div>
            
            <BarChart3 className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 -rotate-12 pointer-events-none" />
         </div>
      </div>

      {/* 6. RECENT ACTIVITY LIST (NATIVE LIST STYLE) */}
      <div className="space-y-4 px-2">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
               <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
               <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Recent Nodes</h4>
            </div>
            <button onClick={() => setActiveTab('calc')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest active:scale-90 transition-transform">See All</button>
         </div>
         
         <div className="bg-white rounded-[2.5rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            {projects.length === 0 ? (
               <div className="p-16 text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto"><Package className="w-8 h-8 text-slate-200" /></div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Node Library Empty</p>
               </div>
            ) : (
               projects.slice(0, 4).map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => { setActiveProjectId(p.id); setActiveTab('calc'); }}
                    className="p-5 flex items-center justify-between active:bg-slate-50 transition-colors group cursor-pointer"
                  >
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-xl uppercase border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                           {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-sm font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{p.name}</span>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tight bg-emerald-50 px-2 py-0.5 rounded-md">
                                 +{formatValue(p.targetNet).split(',')[0]}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                 <Layers className="w-2.5 h-2.5" /> {p.costs.length} Elements
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>

      {/* 7. QUICK DISCOVERY BANNER */}
      <div className="px-2">
         <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer" onClick={() => setActiveTab('edu')}>
            <div className="relative z-10 flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Star className="w-6 h-6 text-white fill-white animate-pulse" />
               </div>
               <div className="space-y-0.5">
                  <h5 className="text-xs font-black uppercase tracking-widest leading-none">Margins Academy</h5>
                  <p className="text-[10px] text-indigo-100 opacity-80 leading-tight">Pelajari trik jualan untung di platform food.</p>
               </div>
            </div>
            <div className="relative z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
               <ArrowRight className="w-4 h-4" />
            </div>
            
            <Sparkles className="absolute top-0 right-0 w-24 h-24 text-white/5 pointer-events-none" />
         </div>
      </div>

      {/* 8. MERCHANT PROFILE SUMMARY (NATIVE BOTTOM CARD) */}
      <div className="px-4 pt-4 border-t border-slate-100">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-inner">
                  <span className="text-[10px] font-black text-slate-400">SB</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-800 leading-none">Sandikodev Store</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tight">Verified Outlet</span>
               </div>
            </div>
            <button onClick={() => setActiveTab('profile')} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
               <LayoutGrid className="w-4 h-4" />
            </button>
         </div>
      </div>

    </div>
  );
};
