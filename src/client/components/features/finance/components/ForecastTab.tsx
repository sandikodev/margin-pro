import React from 'react';
import { TrendingUp, ShieldCheck, Calculator } from 'lucide-react';
import { BentoCard } from '@koda/core/ui';

interface ForecastTabProps {
    simDailySalesQty: number;
    setSimDailySalesQty: (val: number) => void;
    monthlyFixedCost: number;
    setMonthlyFixedCost: (val: number) => void;
    projectedNetFreeCashflow: number;
    monthsToReachBuffer: string;
    savingsPercentage: number | string;
    minPortionsPerDay: number;
    formatValue: (val: number) => string;
}

export const ForecastTab: React.FC<ForecastTabProps> = ({
    simDailySalesQty, setSimDailySalesQty, monthlyFixedCost, setMonthlyFixedCost,
    projectedNetFreeCashflow, monthsToReachBuffer, savingsPercentage, minPortionsPerDay, formatValue
}) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* SLIDERS */}
            <BentoCard className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Jual Harian</span>
                        <span className="text-lg font-black text-indigo-600">{simDailySalesQty} Porsi</span>
                    </div>
                    <input type="range" min="0" max="200" step="5" value={simDailySalesQty} onChange={(e) => setSimDailySalesQty(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600" />
                </div>
                <div className="h-px bg-slate-100"></div>
                <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Biaya Tetap (Gaji+Listrik)</span>
                    <input type="number" value={monthlyFixedCost} onChange={(e) => setMonthlyFixedCost(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                </div>
            </BentoCard>

            {/* RESULT CARDS */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500 text-white p-5 rounded-[2rem] shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Potensi Cashflow</span>
                    <p className="text-xl font-black mt-1 leading-tight">{formatValue(projectedNetFreeCashflow)}</p>
                    <TrendingUp className="absolute bottom-[-10px] right-[-10px] w-16 h-16 text-white/20" />
                </div>
                <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Target Dana Darurat</span>
                        <p className="text-xl font-black mt-1 leading-tight">{monthsToReachBuffer} Bulan</p>
                        <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(Number(savingsPercentage), 100)}%` }}></div>
                        </div>
                        <span className="text-[7px] mt-1 block opacity-70">{savingsPercentage}% Terkumpul</span>
                    </div>
                    <ShieldCheck className="absolute bottom-[-10px] right-[-10px] w-16 h-16 text-white/10" />
                </div>
            </div>

            <BentoCard className="bg-gradient-to-br from-indigo-600 to-indigo-900 text-white p-6 border-none shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5 text-indigo-300" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Analisa Titik Impas (BEP)</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-black tracking-tighter">{minPortionsPerDay}</p>
                            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Porsi Terjual / Hari</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-white/80 italic">Aman diatas {minPortionsPerDay} porsi</p>
                            <p className="text-[9px] text-indigo-300 mt-1">Minimal penjualan untuk menutup biaya tetap & hutang.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
            </BentoCard>
        </div>
    );
};
