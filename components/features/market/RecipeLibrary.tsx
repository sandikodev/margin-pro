
import React from 'react';
import { Search, Star, Zap, Download, ShoppingBag } from 'lucide-react';
import { MarketplaceItem } from '../../../types';

interface RecipeLibraryProps {
  items: MarketplaceItem[];
  handleBuyItem: (item: MarketplaceItem) => void;
  formatValue: (val: number) => string;
}

export const RecipeLibrary: React.FC<RecipeLibraryProps> = ({ items, handleBuyItem, formatValue }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900 leading-none">Global Library</h3>
          <p className="text-slate-500 text-sm max-w-sm">Dapatkan formula menu dari seller berprestasi untuk efisiensi bisnis Anda.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input placeholder="Cari racikan viral..." className="w-full pl-14 pr-8 py-4.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col gap-6 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden ring-1 ring-slate-100">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">@{item.author}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-100 shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-yellow-700">{item.rating}</span>
              </div>
            </div>
            
            <div className="space-y-2 relative z-10">
              <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{item.name}</h4>
              <span className="inline-block px-2 py-0.5 bg-indigo-50 text-[8px] font-black text-indigo-600 rounded uppercase tracking-widest">{item.label}</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 space-y-3 relative z-10 border border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Target Cuan</span>
                <span className="text-emerald-600">+{formatValue(item.targetNet)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Estimasi Modal</span>
                <span className="text-slate-700">{formatValue(item.costs.reduce((a,b)=>a+b.amount,0))}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-100 relative z-10">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-black text-slate-900">{item.price}<span className="text-[10px] text-slate-300 ml-1">Cr</span></span>
              </div>
              <button onClick={() => handleBuyItem(item)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                Beli Formula <Download className="w-3.5 h-3.5" />
              </button>
            </div>
            <ShoppingBag className="absolute -bottom-10 -right-10 w-40 h-40 text-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
