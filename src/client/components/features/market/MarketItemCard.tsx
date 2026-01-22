import React from 'react';
import { Coffee, Utensils, Star, Heart, BadgeCheck, Download, TrendingUp, Zap, Coins } from 'lucide-react';
import { MarketplaceItem } from '@shared/types';
import { BentoCard } from '@koda/core/ui';

interface MarketItemCardProps {
  item: MarketplaceItem;
  handleBuyItem: (item: MarketplaceItem) => void;
  formatValue: (val: number) => string;
  isWishlisted: boolean;
  toggleWishlist: (id: string) => void;
}

export const MarketItemCard: React.FC<MarketItemCardProps> = ({ 
  item, handleBuyItem, formatValue, isWishlisted, toggleWishlist 
}) => {
  return (
    <BentoCard noPadding className="p-5 hover:shadow-xl transition-all duration-300 group relative active:scale-[0.98] hover:-translate-y-1">
      <div className="flex gap-4">
        {/* Visual Thumbnail */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center relative shrink-0 overflow-hidden group-hover:border-indigo-200 transition-colors">
          {item.name.includes('Kopi') ? <Coffee className="w-10 h-10 text-indigo-300 group-hover:text-indigo-500 transition-colors" /> : <Utensils className="w-10 h-10 text-indigo-300 group-hover:text-indigo-500 transition-colors" />}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/5 to-transparent"></div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-slate-100">
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
            <span className="text-[9px] font-black text-slate-800">{item.rating}</span>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-500">{item.label}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
                  className={`transition-colors ${isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-200 hover:text-rose-400'}`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
            </div>
            <h4 className="text-base font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h4>
            <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <BadgeCheck className="w-2.5 h-2.5 text-indigo-500" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">by @{item.author}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Target Cuan</span>
                <span className="text-sm font-black text-emerald-600 leading-none">+{formatValue(item.targetNet).split(',')[0]}</span>
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Kredit</span>
                <div className="flex items-center gap-1 text-slate-900">
                  <Coins className="w-3 h-3 text-yellow-500" />
                  <span className="text-base font-black tracking-tight">{item.price}</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION FOOTER */}
      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
              <Download className="w-3 h-3" /> {item.downloads}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> High ROI
            </div>
        </div>
        <button 
          onClick={() => handleBuyItem(item)}
          className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-slate-100 hover:bg-indigo-600"
        >
          Unlock <Zap className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
        </button>
      </div>
    </BentoCard>
  );
};
