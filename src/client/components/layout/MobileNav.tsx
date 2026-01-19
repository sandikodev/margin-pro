
import React from 'react';
import { Home, PieChart, GraduationCap, Banknote } from 'lucide-react';

export type TabId = 'home' | 'cashflow' | 'insights' | 'edu' | 'market' | 'profile' | 'topup' | 'calc' | 'about' | 'changelog';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: TabId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 left-1/2 lg:left-auto lg:right-4 -translate-x-1/2 lg:translate-x-0 w-[94%] max-w-sm lg:max-w-none lg:w-24 h-20 lg:h-auto bg-white/95 backdrop-blur-3xl border border-slate-200/50 flex flex-row lg:flex-col items-center justify-around lg:justify-center lg:gap-8 px-4 lg:px-0 lg:py-8 z-40 rounded-[2rem] lg:rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-white/30 transition-all duration-500">
       {[
         { id: 'home', icon: Home, label: 'Beranda' },
         { id: 'cashflow', icon: Banknote, label: 'Finance' },
         { id: 'insights', icon: PieChart, label: 'Simulasi' },
         { id: 'edu', icon: GraduationCap, label: 'Academy' }
       ].map(item => (
         <button key={item.id} onClick={() => setActiveTab(item.id as TabId)} className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${activeTab === item.id ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`p-3 rounded-2xl transition-all duration-300 relative ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-4 ring-indigo-500/10' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
              <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest leading-none ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
         </button>
       ))}
    </nav>
  );
};
    