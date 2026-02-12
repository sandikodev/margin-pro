import React from 'react';
import { Calculator, Banknote, ShieldCheck } from 'lucide-react';
import { Liability } from '@shared/types';
import { BentoCard } from '@koda/ui';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

interface DebtTabProps {
    simPlafon: string;
    setSimPlafon: (val: string) => void;
    simRate: string;
    setSimRate: (val: string) => void;
    simTenor: string;
    setSimTenor: (val: string) => void;
    simResult: number | null;
    calculateLoan: () => void;
    saveLoanToLiability: () => void;
    liabilities: Liability[];
    toggleLiabilityPaid: (id: string) => void;
    formatValue: (val: number) => string;
}

export const DebtTab: React.FC<DebtTabProps> = ({
    simPlafon, setSimPlafon, simRate, setSimRate, simTenor, setSimTenor, simResult,
    calculateLoan, saveLoanToLiability, liabilities, toggleLiabilityPaid, formatValue
}) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* LOAN CALCULATOR CARD */}
            <BentoCard className="space-y-4">
                <DashboardSectionHeader title="Quick Loan Sim" variant="accent" action={<Calculator className="w-4 h-4 text-indigo-500" />} className="px-0 mb-0" />
                <div className="space-y-3">
                    <input type="number" value={simPlafon} onChange={(e) => setSimPlafon(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Jumlah Pinjaman (Rp)" />
                    <div className="flex gap-3">
                        <input type="number" value={simRate} onChange={(e) => setSimRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Bunga %" />
                        <input type="number" value={simTenor} onChange={(e) => setSimTenor(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Bulan" />
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                        <span className="text-[10px] font-black uppercase text-indigo-400">Cicilan/Bulan</span>
                        <span className="text-lg font-black text-indigo-700">{simResult ? formatValue(simResult) : '-'}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={calculateLoan} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600">Hitung</button>
                        {simResult && <button onClick={saveLoanToLiability} className="flex-1 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg">Simpan</button>}
                    </div>
                </div>
            </BentoCard>

            {/* LIABILITY LIST */}
            <div className="space-y-3">
                <DashboardSectionHeader title="Active Liabilities" variant="default" className="px-0" />
                {liabilities.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <ShieldCheck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-400">Tidak ada kewajiban aktif.</p>
                    </div>
                ) : (
                    liabilities.map(l => (
                        <BentoCard noPadding key={l.id} className={`p-5 flex items-center justify-between ${l.isPaidThisMonth ? 'border-emerald-200 opacity-60' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${l.isPaidThisMonth ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                    <Banknote className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-black text-slate-800 text-sm">{l.name}</h5>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Due: Tgl {l.dueDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-black ${l.isPaidThisMonth ? 'text-emerald-600' : 'text-slate-900'}`}>{formatValue(l.amount)}</p>
                                <button onClick={() => toggleLiabilityPaid(l.id)} className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-1">{l.isPaidThisMonth ? 'Lunas' : 'Bayar'}</button>
                            </div>
                        </BentoCard>
                    ))
                )}
            </div>
        </div>
    );
};
