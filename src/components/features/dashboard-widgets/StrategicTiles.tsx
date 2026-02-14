import React from 'react';
import { Activity, Gauge, ChevronRight } from 'lucide-react';


interface StrategicTileProps {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const StrategicTile: React.FC<StrategicTileProps> = ({ onClick, icon, title, subtitle }) => (
    <button onClick={onClick} className="w-full active:scale-[0.97] bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col lg:flex-row items-center lg:items-center gap-4 shadow-sm group hover:shadow-md transition-all text-left">
       <div className="rounded-2xl flex items-center justify-center shrink-0 transition-all">
          {icon}
       </div>
       <div className="text-left lg:flex-1 w-full">
          <span className="text-sm font-black text-slate-800 uppercase tracking-tight block leading-none">{title}</span>
          <span className="text-[8px] text-slate-400 font-black uppercase block mt-1.5 tracking-widest leading-none">{subtitle}</span>
       </div>
       <div className="hidden lg:block">
          <ChevronRight className="w-4 h-4 text-slate-300" />
       </div>
    </button>
)

interface StrategicTilesProps {
    setActiveTab: (tab: string) => void;
    className?: string;
}

export const StrategicTiles: React.FC<StrategicTilesProps> = ({ setActiveTab, className }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-1 gap-4 px-4 lg:px-0 ${className}`}>
        <StrategicTile 
            onClick={() => setActiveTab('cashflow')}
            title="Journal"
            subtitle="Cashflow History"
            icon={
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Activity className="w-6 h-6" />
                </div>
            }
        />
        <StrategicTile 
            onClick={() => setActiveTab('insights')}
            title="Simulation"
            subtitle="Profit Projection"
            icon={
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <Gauge className="w-6 h-6" />
                </div>
            }
        />
    </div>
  );
};
