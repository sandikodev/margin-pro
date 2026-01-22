import React from 'react';
import { Flame } from 'lucide-react';
import { BentoCard } from '@koda/core/ui';

interface PromoControlsProps {
    promoPercent: number;
    setPromoPercent: (val: number) => void;
}

export const PromoControls: React.FC<PromoControlsProps> = ({
    promoPercent,
    setPromoPercent
}) => {
    return (
        <BentoCard noPadding className="p-8 flex flex-col md:flex-row items-center gap-10 bg-slate-50 border-slate-200">
            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
                <Flame className="w-7 h-7 text-orange-500" />
                <div className="flex-grow">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rencana Diskon Warung</p>
                    <p className="text-lg font-black text-slate-800">{promoPercent}% <span className="text-[10px] text-slate-400 font-bold">Diskon Promo</span></p>
                </div>
            </div>
            <div className="flex-grow w-full space-y-4">
                <input
                    type="range" min="0" max="50" step="5" value={promoPercent}
                    onChange={(e) => setPromoPercent(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Tanpa Diskon (0%)</span>
                    <span>Promo Tengah (25%)</span>
                    <span>Promo Besar (50%)</span>
                </div>
            </div>
        </BentoCard>
    );
};
