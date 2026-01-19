import React from 'react';
import { ShieldCheck, Hourglass, BarChart3 } from 'lucide-react';
import { BentoCard } from '@/components/ui/design-system/BentoCard';

interface OperationalHealthWidgetProps {
    setActiveTab: (tab: string) => void;
    className?: string;
}

export const OperationalHealthWidget: React.FC<OperationalHealthWidgetProps> = ({ setActiveTab, className }) => {
  return (
    <div className={`px-2 lg:px-0 ${className}`}>
       <BentoCard 
          onClick={() => setActiveTab('cashflow')}
          className="hover:shadow-md transition-all cursor-pointer group p-7"
       >
          <div className="relative z-10 flex justify-between items-start mb-6">
             <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2 leading-none">
                  <ShieldCheck className="w-3 h-3" /> Capital Runway
                </h5>
                <p className="text-3xl font-black italic tracking-tighter">18 Days Left</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
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
          
          <BarChart3 className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
       </BentoCard>
    </div>
  );
};
