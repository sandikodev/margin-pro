
import React from 'react';
import { Star, ChevronRight, Zap, TrendingUp } from 'lucide-react';

interface ProfileFinancialsProps {
  credits: number;
  onTopUp: () => void;
}

export const ProfileFinancials: React.FC<ProfileFinancialsProps> = ({ credits, onTopUp }) => {
  return (
    <div 
      onClick={onTopUp}
      className="w-full lg:w-80 space-y-3 sm:space-y-4 cursor-pointer group/card active:scale-95 transition-all"
    >
      {/* Tier Status Badge - Compact for Mobile */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex items-center gap-3 sm:gap-4 group-hover/card:bg-white/10 transition-all border-b-indigo-500/40 relative overflow-hidden">
        <div className="relative z-10 shrink-0">
          <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-40 animate-pulse"></div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
             <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
          </div>
        </div>
        <div className="flex flex-col relative z-10 text-white">
          <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 leading-none mb-1">Membership Tier</span>
          <span className="text-xs sm:text-base font-black italic tracking-tighter flex items-center gap-1.5">
             PRO ELITE <TrendingUp className="w-3 h-3 text-emerald-400" />
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-white/20 ml-auto group-hover/card:text-white/60 group-hover/card:translate-x-1 transition-all" />
      </div>

      {/* Main Credits Display - Visual Impact */}
      <div className="bg-slate-900/40 backdrop-blur-3xl p-5 sm:p-7 rounded-[1.8rem] sm:rounded-[2.5rem] border border-white/10 flex flex-row lg:flex-col items-center justify-between gap-4 sm:gap-6 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="flex flex-col relative z-10 text-white">
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1 sm:mb-2">Available Credits</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-6xl font-black group-hover/card:scale-105 sm:group-hover:scale-110 transition-transform origin-left duration-700 tracking-tighter">
               {credits}
            </span>
            <span className="text-[8px] sm:text-xs font-black uppercase opacity-30 tracking-widest">Points</span>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 bg-white text-slate-900 rounded-[1.2rem] sm:rounded-[1.8rem] shadow-2xl group-hover/card:bg-indigo-600 group-hover/card:text-white transition-all relative z-10">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};
