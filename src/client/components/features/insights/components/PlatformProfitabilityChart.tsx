import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { BentoCard } from '@/components/ui/design-system/BentoCard';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { ChartDataItem } from '../ProfitSimulator';

interface PlatformProfitabilityChartProps {
    chartData: ChartDataItem[];
    promoPercent: number;
    setPromoPercent: (val: number) => void;
    formatValue: (val: number) => string;
}

export const PlatformProfitabilityChart: React.FC<PlatformProfitabilityChartProps> = ({
    chartData,
    promoPercent,
    setPromoPercent,
    formatValue
}) => {
    return (
        <BentoCard className="relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                <div className="lg:col-span-8 space-y-6">
                    <DashboardSectionHeader
                        title="Komparasi Profitabilitas"
                        subtitle="Urutan platform dari yang paling menguntungkan."
                        variant="default"
                        action={<TrendingUp className="w-4 h-4 text-slate-400" />}
                    />

                    <div className="h-[250px] lg:h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} width={80} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-white/10 ring-4 ring-black/5 animate-in zoom-in-95">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">{data.name}</p>
                                                <p className="text-xs font-black">Profit: {formatValue(data.profit)}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                                <Bar dataKey="profit" radius={[0, 8, 8, 0]} barSize={36}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex-grow space-y-8 flex flex-col justify-center">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /><span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Subsidi Promo</span></div>
                                <span className="text-[10px] font-black text-orange-600 bg-orange-100/50 px-3 py-1 rounded-full border border-orange-200">{promoPercent}%</span>
                            </div>
                            <div className="relative h-6 flex items-center">
                                <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>
                                <div className="absolute h-1.5 bg-orange-500 rounded-full" style={{ width: `${(promoPercent / 50) * 100}%` }}></div>
                                <input type="range" min="0" max="50" step="5" value={promoPercent} onChange={(e) => setPromoPercent(Number(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 italic text-center">Simulasikan beban diskon/promo platform.</p>
                        </div>
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};
