import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface MerchantProfileCardProps {
    setActiveTab: (tab: string) => void;
    className?: string;
}

export const MerchantProfileCard: React.FC<MerchantProfileCardProps> = ({ setActiveTab, className }) => {
  return (
    <div className={`px-4 pt-4 lg:px-0 border-t border-slate-100 lg:border-t-0 lg:pt-0 lg:mt-auto ${className}`}>
       <div className="flex items-center justify-between bg-white lg:p-4 lg:rounded-[2rem] lg:border lg:border-slate-100 lg:shadow-sm">
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
  );
};
