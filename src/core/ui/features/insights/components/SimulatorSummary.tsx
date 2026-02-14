import React from 'react';
import { Clock, Eye, EyeOff, Activity } from 'lucide-react';
import { Project } from '@shared/types';
import { BentoCard } from '@koda/ui';

interface SimulatorSummaryProps {
    activeProject?: Project;
    targetPortions: number;
    totalHPP: number;
    displayProfit: number;
    displayTotalPotential: number;
    displayLabel: string;
    effectiveStrategy: string;
    targetMargin: number;
    isPreviewing: boolean;
    setIsPreviewing: (val: boolean) => void;
    formatValue: (val: number) => string;
    t: (key: string) => string;
}

export const SimulatorSummary: React.FC<SimulatorSummaryProps> = ({
    activeProject,
    targetPortions,
    totalHPP,
    displayProfit,
    displayTotalPotential,
    displayLabel,
    effectiveStrategy,
    targetMargin,
    isPreviewing,
    setIsPreviewing,
    formatValue,
    t
}) => {
    return (
        <BentoCard noPadding className="relative overflow-hidden group/hero border-slate-200">
            <div className="p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                        {isPreviewing ? (
                            <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-[9px] font-black uppercase tracking-widest border border-orange-500/30 flex items-center gap-1.5 animate-pulse">
                                <Eye className="w-3 h-3" /> Intip Strategi Lain
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[9px] font-black uppercase tracking-widest border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                                <Activity className="w-3 h-3" /> Monitor Harga Aktif
                            </span>
                        )}
                    </div>

                    <div>
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-1">{activeProject?.name}</h2>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> Estimasi Jual {targetPortions} Porsi
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <div className={`inline-flex flex-col border rounded-2xl px-5 py-3 transition-all duration-300 ${isPreviewing ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isPreviewing ? 'text-orange-200' : 'text-slate-500'}`}>Gaya Perhitungan:</span>
                            <span className={`text-sm font-black uppercase tracking-wider ${effectiveStrategy === 'competitor' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                {displayLabel} {effectiveStrategy === 'markup' && <span className="text-[10px] opacity-60">({targetMargin}%)</span>}
                            </span>
                        </div>
                        <button
                            onMouseDown={() => setIsPreviewing(true)}
                            onMouseUp={() => setIsPreviewing(false)}
                            onMouseLeave={() => setIsPreviewing(false)}
                            onTouchStart={() => setIsPreviewing(true)}
                            onTouchEnd={() => setIsPreviewing(false)}
                            className={`h-full aspect-square flex items-center justify-center rounded-2xl border transition-all active:scale-90 select-none ${isPreviewing ? 'bg-white text-indigo-900 border-white shadow-xl' : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'}`}
                        >
                            {isPreviewing ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                    <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t('hppUnit')}</span>
                        <div>
                            <p className="text-lg font-black text-white leading-none mb-1">{formatValue(totalHPP)}</p>
                            <p className="text-[8px] text-slate-600">Modal Dasar Warung</p>
                        </div>
                    </div>

                    <div className={`rounded-2xl p-4 border flex flex-col justify-between transition-colors ${isPreviewing ? 'bg-orange-900/20 border-orange-500/30' : 'bg-indigo-900/30 border-indigo-500/20'}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isPreviewing ? 'text-orange-300' : 'text-indigo-300'}`}>
                            {isPreviewing ? 'Preview Cuan' : t('netProfit')}
                        </span>
                        <div>
                            <p className={`text-lg font-black ${displayProfit < 0 ? 'text-rose-400' : 'text-white'}`}>
                                {displayProfit < 0 ? '-' : ''}{formatValue(Math.abs(displayProfit))}
                            </p>
                            <p className={`text-[8px] ${isPreviewing ? 'text-orange-400/80' : 'text-indigo-400/80'}`}>Masuk Kantong Bersih</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Satu Siklus</span>
                        <div>
                            <p className="text-lg font-black text-white leading-none mb-1">{targetPortions}</p>
                            <p className="text-[8px] text-slate-600">Total Porsi Dijual</p>
                        </div>
                    </div>

                    <div className={`rounded-2xl p-4 border flex flex-col justify-between ${isPreviewing ? 'bg-orange-900/20 border-orange-500/30' : 'bg-emerald-900/20 border-emerald-500/20'}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isPreviewing ? 'text-orange-300' : 'text-emerald-300'}`}>Total Laba</span>
                        <div>
                            <p className={`text-lg font-black ${displayTotalPotential < 0 ? 'text-rose-400' : 'text-white'}`}>
                                {displayTotalPotential < 0 ? '-' : ''}{formatValue(Math.abs(displayTotalPotential))}
                            </p>
                            <p className={`text-[8px] ${isPreviewing ? 'text-orange-400/80' : 'text-emerald-400/80'}`}>Jika Semua Laku</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none"></div>
        </BentoCard>
    );
};
