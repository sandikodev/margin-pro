import React, { useState, useMemo } from 'react';
import { Search, Filter, Flame, Trophy, Clock, ChevronRight, Sparkles, BadgeCheck } from 'lucide-react';
import { MarketplaceItem } from '@shared/types';
import { FilterModal, SortOption } from '../../components/modals/FilterModal';
import { MarketItemCard } from '../../components/features/market/MarketItemCard';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  handleBuyItem: (item: MarketplaceItem) => void;
  formatValue: (val: number) => string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ items, handleBuyItem, formatValue }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>('popular');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const categories = ['Semua', 'Viral', 'Minuman', 'Cemilan', 'Premium', 'Harian'];

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    let result = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeCategory !== 'Semua') {
       // Simple Mock Filter
       if (activeCategory === 'Viral') result = result.filter(i => i.downloads > 1000);
       if (activeCategory === 'Premium') result = result.filter(i => (i.price || 0) > 100);
    }

    // Sort Logic
    switch(activeSort) {
       case 'cheapest': return result.sort((a,b) => (a.price || 0) - (b.price || 0));
       case 'expensive': return result.sort((a,b) => (b.price || 0) - (a.price || 0));
       case 'rating': return result.sort((a,b) => b.rating - a.rating);
       case 'popular': 
       default: return result.sort((a,b) => b.downloads - a.downloads);
    }
  }, [items, searchTerm, activeSort, activeCategory]);

  return (
    <div className="space-y-6 pb-32 pt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-lg mx-auto">
      
      {/* 1. COMPACT NATIVE SEARCH & FILTER */}
      <div className="px-2 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari template bisnis..." 
              className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 active:scale-90 transition-transform shadow-sm hover:border-indigo-200 hover:text-indigo-600"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* 2. HORIZONTAL CATEGORIES (NATIVE PILLS) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 snap-x">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
              ${activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TRENDING BANNER (iOS Style) */}
      <div className="px-2">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl active:scale-[0.98] transition-all cursor-pointer group">
          <div className="relative z-10 space-y-2 max-w-[65%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest backdrop-blur-md">Flash Sale</span>
              <div className="flex items-center gap-1 text-[8px] font-black uppercase text-yellow-300">
                <Clock className="w-2.5 h-2.5" /> 04:12:45
              </div>
            </div>
            <h4 className="text-xl font-black italic tracking-tighter leading-tight">Bundle Retail Pro 50% Off!</h4>
            <p className="text-[10px] text-indigo-100/80 font-medium">Dapatkan strategi HPP terendah untuk toko retail minggu ini.</p>
          </div>
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
          <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12"></div>
        </div>
      </div>

      {/* 4. PRODUCT GRID (NATIVE CARDS) */}
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between px-2">
          <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Hot Items
          </h5>
          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Urutkan: {activeSort}</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map(item => (
            <MarketItemCard 
               key={item.id}
               item={item}
               handleBuyItem={handleBuyItem}
               formatValue={formatValue}
               isWishlisted={wishlist.has(item.id)}
               toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>

      {/* 5. SELLER HIGHLIGHT (COMMUNITY) */}
      <div className="px-2">
        <div className="bg-slate-50 rounded-[2.2rem] p-6 border border-slate-100 space-y-5">
          <div className="flex items-center justify-between">
            <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-3 h-3 text-yellow-500" /> Top Contributors
            </h5>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-0.5 relative group">
                  <div className="w-full h-full rounded-[inherit] bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <span className="text-xs font-black text-indigo-400 group-hover:text-white uppercase">S{i}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-50 flex items-center justify-center">
                    <BadgeCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Seller_{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        activeSort={activeSort}
        setSort={setActiveSort}
      />

    </div>
  );
};