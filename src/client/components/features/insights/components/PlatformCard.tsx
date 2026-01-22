import React from 'react';
import { Settings2, ShieldCheck } from 'lucide-react';
import { BentoCard } from '@koda/ui';
import { Carousel, CarouselItem } from '@/components/ui/Carousel';
import { CalculationResult, Platform, Project, PlatformConfig } from '@shared/types';

interface PlatformCardProps {
    res: CalculationResult;
    platformData: Record<Platform, PlatformConfig>;
    effectiveStrategy: string;
    expandedPlatform: Platform | null;
    setExpandedPlatform: (p: Platform | null) => void;
    setModalTab: (tab: 'settings' | 'breakdown') => void;
    formatValue: (val: number) => string;
    totalHPP: number;
    activeProject?: Project;
    updateProject: (updates: Partial<Project>) => void;
    t: (key: string) => string;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
    res,
    platformData,
    effectiveStrategy,
    expandedPlatform,
    setExpandedPlatform,
    setModalTab,
    formatValue,
    totalHPP,
    activeProject,
    updateProject,
    t
}) => {
    const isCompetitorStrategy = effectiveStrategy === 'competitor';
    const cardScenario = isCompetitorStrategy ? (res.competitorProtection || res.recommended) : res.recommended;

    const displayPrice = cardScenario.price;
    const displayProfit = cardScenario.netProfit;

    const safePercent = (numerator: number | undefined, denominator: number | undefined) => {
        if (!numerator || !denominator) return '0';
        return ((numerator / denominator) * 100).toFixed(1);
    };

    return (
        <BentoCard noPadding className={`bg-white border-2 transition-all shadow-sm flex flex-col relative overflow-hidden ${expandedPlatform === res.platform ? 'border-indigo-600 ring-4 ring-indigo-500/5' : 'border-slate-100'}`}>
            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: platformData[res.platform]?.color }}></div>

            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ backgroundColor: platformData[res.platform]?.color }}>
                            {res.platform.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-none">{res.platform}</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${cardScenario.isBleeding ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {cardScenario.isBleeding ? 'Status: Kurang Untung / Rugi' : 'Status: Keuntungan Aman'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Jual Yang Disarankan</p>
                        <p className="text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: platformData[res.platform]?.color }}>
                            {formatValue(displayPrice)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className={`rounded-[2rem] p-7 text-white shadow-xl flex flex-col justify-center min-w-[180px] bg-emerald-500 shadow-emerald-500/20`}>
                        <span className="text-[10px] font-black uppercase opacity-80 tracking-widest mb-1">{t('netProfit')}</span>
                        <span className="text-2xl font-black leading-none">{formatValue(displayProfit)}</span>
                        <span className="text-[10px] font-black mt-2 opacity-80 italic">Profit {safePercent(displayProfit, totalHPP)}% dari Modal</span>
                    </div>
                    <button
                        onClick={() => {
                            setExpandedPlatform(res.platform);
                            setModalTab('settings'); // Default tab
                        }}
                        className="p-7 rounded-[1.8rem] transition-all flex flex-col items-center justify-center gap-2 border bg-slate-50 text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200"
                    >
                        <Settings2 className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
                    </button>
                </div>
            </div>

            {/* DUAL MODE BOXES - CAROUSEL MODE */}
            <Carousel className="px-4 pb-10 lg:px-8">
                <CarouselItem className="rounded-3xl p-6 bg-slate-50 border-2 border-slate-100 space-y-5">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">{t('simulate')}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Ubah angka ini untuk tes cuan anda</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-4 rounded-2xl border border-slate-200">
                        <span className="text-sm font-black text-slate-400">Rp</span>
                        <input
                            type="number"
                            value={activeProject?.competitorPrice || ''}
                            onChange={(e) => updateProject({ competitorPrice: Number(e.target.value) })}
                            className="w-full text-2xl font-black text-slate-900 outline-none"
                            placeholder="Tes harga jual..."
                        />
                    </div>
                    {res.market && (
                        <div className={`p-5 rounded-2xl flex justify-between items-center ${res.market.isBleeding ? 'bg-rose-100 text-rose-700' : 'bg-white border border-slate-200'}`}>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest">Cuan Di Harga Ini</span>
                                {res.market.isBleeding && <span className="text-[8px] font-bold">Resiko Rugi Terdeteksi</span>}
                            </div>
                            <span className="text-xl font-black">{formatValue(res.market.netProfit)}</span>
                        </div>
                    )}
                </CarouselItem>

                <CarouselItem className="rounded-3xl p-6 bg-indigo-50 border-2 border-indigo-100 space-y-5">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">{t('recommendation')}</span>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase">Harga paling pas agar {t('profitTarget')} Aman</p>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-3xl font-black text-indigo-700">{formatValue(cardScenario.price)}</span>
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-200"><ShieldCheck className="w-6 h-6 text-indigo-600" /></div>
                    </div>
                    <div className="p-5 bg-indigo-600 rounded-2xl flex justify-between items-center text-white shadow-lg shadow-indigo-600/20">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest">Cuan Yang Dijaga</span>
                            <span className="text-[8px] font-bold opacity-70">Sesuai Target Laba Anda</span>
                        </div>
                        <span className="text-xl font-black">{formatValue(cardScenario.netProfit)}</span>
                    </div>
                </CarouselItem>
            </Carousel>
        </BentoCard>
    );
};
