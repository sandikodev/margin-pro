import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { CalculationResult, Platform, Currency, PlatformConfig } from '@shared/types';
import { BentoCard } from '@/components/ui/design-system/BentoCard';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { FeeComparisonItem } from '../ProfitSimulator';

interface PlatformFeeComparisonProps {
    results: CalculationResult[];
    feeComparisonData: FeeComparisonItem[];
    platformData: Record<Platform, PlatformConfig>;
    selectedCurrency: Currency;
    formatValue: (val: number) => string;
}

export const PlatformFeeComparison: React.FC<PlatformFeeComparisonProps> = ({
    results,
    feeComparisonData,
    platformData,
    selectedCurrency,
    formatValue
}) => {
    const safePercent = (numerator: number | undefined, denominator: number | undefined) => {
        if (!numerator || !denominator) return '0';
        return ((numerator / denominator) * 100).toFixed(1);
    };

    return (
        <BentoCard className="relative overflow-hidden">
            <div className="space-y-6">
                <DashboardSectionHeader
                    title="Komparasi Beban Biaya (Fees)"
                    subtitle="Perbandingan total potongan di setiap platform."
                    variant="default"
                    action={
                        <div className="hidden lg:flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            <span className="text-[10px] font-black uppercase text-rose-700 tracking-tight">Cek Potongan Terbesar</span>
                        </div>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 h-[250px] lg:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={feeComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#fff1f2' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-2xl animate-in zoom-in-95">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.name}</p>
                                                    <p className="text-sm font-black text-rose-600">Total Fee: {selectedCurrency.symbol}{payload[0].value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="Fees" radius={[12, 12, 0, 0]} barSize={50}>
                                    {feeComparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                        {[...results].sort((a, b) => b.recommended.totalDeductions - a.recommended.totalDeductions).map((r, idx) => (
                            <div key={r.platform} className={`p-5 rounded-2xl border transition-all ${idx === 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: platformData[r.platform]?.color }}></div>
                                        <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">{r.platform}</span>
                                    </div>
                                    {idx === 0 && <span className="text-[8px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">Tertinggi</span>}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beban Potongan</span>
                                        <span className="text-lg font-black text-slate-900">{formatValue(r.recommended.totalDeductions)}</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">% Dari Harga</span>
                                        <span className="text-sm font-black text-rose-500">{safePercent(r.recommended.totalDeductions, r.recommended.price)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};
