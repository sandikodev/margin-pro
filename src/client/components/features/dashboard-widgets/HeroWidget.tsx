import React, { useState, useEffect, useMemo } from 'react';
import { Sparkle, Plus, ShoppingBag, Search, History } from 'lucide-react';
import { BentoCard } from '@koda/core/ui';

interface HeroWidgetProps {
  createNewProject: () => void;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export const HeroWidget: React.FC<HeroWidgetProps> = ({ createNewProject, setActiveTab, className }) => {
  const [businessTypeIdx, setBusinessTypeIdx] = useState(0);
  const businessTypes = useMemo(() => ['Kuliner', 'Minuman', 'Retail', 'UMKM', 'Outlet'], []);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBusinessTypeIdx((prev) => (prev + 1) % businessTypes.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [businessTypes]);

  return (
    <BentoCard noPadding className={`bg-slate-950 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-white/5 p-7 group relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/30 rounded-full blur-[50px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none"></div>

      {/* 1. Operating Pulse (Absolute) */}
      <div className="absolute top-6 left-7 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5 backdrop-blur-md">
          <Sparkle className="w-3 h-3 text-indigo-400 fill-indigo-400" />
          <span className="text-[8px] font-black uppercase text-indigo-300 tracking-[0.2em]">Operating Pulse: Stable</span>
        </div>
      </div>

      {/* 2. Quick Actions for Mobile (Absolute) */}
      <div className="absolute top-6 right-7 z-20 flex gap-2 lg:hidden">
        <button
          aria-label="Search"
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/60 active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          aria-label="Recent History"
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/60 active:scale-95 transition-all"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 space-y-7 pt-10">
        <h1 className="text-3xl font-black tracking-tighter text-white leading-[0.95]">
          Optimasi Bisnis <br />
          <span className={`inline-block transition-all duration-700 text-indigo-400 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {businessTypes[businessTypeIdx]},
          </span>
          <br />
          <span className="text-slate-500 italic">Anti-Boncos.</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={createNewProject}
            className="active:scale-[0.97] flex-1 bg-white py-4 rounded-2xl flex items-center justify-center gap-2 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-white/10 hover:bg-slate-50 transition-colors"
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
    </BentoCard>
  );
};
