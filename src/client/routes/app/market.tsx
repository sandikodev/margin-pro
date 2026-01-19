import React, { useState, useMemo } from 'react';
import { Search, Filter, Flame, Clock, ChevronRight, BadgeCheck } from 'lucide-react';
import { MarketplaceItem } from '@shared/types';
import { FilterModal, SortOption } from '../../components/modals/FilterModal';
import { MarketItemCard } from '../../components/features/market/MarketItemCard';
import { DashboardSectionHeader } from '../../components/ui/design-system/SectionHeader';
import { BentoCard } from '../../components/ui/design-system/BentoCard';
import { GradientCard } from '../../components/ui/design-system/GradientCard';
import { ResponsiveGrid } from '../../components/ui/design-system/ResponsiveGrid';

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
       if (activeCategory === 'Viral') result = result.filter(i => i.downloads > 1000);
       if (activeCategory === 'Premium') result = result.filter(i => (i.price || 0) > 100);
    }

    switch(activeSort) {
       case 'cheapest': return result.sort((a,b) => (a.price || 0) - (b.price || 0));
       case 'expensive': return result.sort((a,b) => (b.price || 0) - (a.price || 0));
       case 'rating': return result.sort((a,b) => b.rating - a.rating);
       case 'popular': 
       default: return result.sort((a,b) => b.downloads - a.downloads);
    }
  }, [items, searchTerm, activeSort, activeCategory]);

  return (
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* 1. SEARCH & CATEGORIES */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari template bisnis..." 
              className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-[2rem] text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="w-14 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-500 active:scale-90 transition-transform shadow-sm hover:border-indigo-200 hover:text-indigo-600"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 snap-x">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border
              ${activeCategory === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TRENDING BANNER */}
      <GradientCard noPadding className="p-8 cursor-pointer group">
        <div className="relative z-10 space-y-3 max-w-[80%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest backdrop-blur-md text-white">Flash Sale</span>
              <div className="flex items-center gap-1 text-[8px] font-black uppercase text-yellow-300">
                <Clock className="w-2.5 h-2.5" /> 04:12:45
              </div>
            </div>
            <h4 className="text-2xl font-black italic tracking-tighter leading-tight text-white">Bundle Retail Pro 50% Off!</h4>
            <p className="text-[10px] text-indigo-100/80 font-medium">Strategi HPP terendah untuk toko retail minggu ini.</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12"></div>
      </GradientCard>

      {/* 3. PRODUCT GRID */}
      <div className="space-y-4">
        <DashboardSectionHeader 
            title="Hot Items" 
            subtitle={`Sort: ${activeSort}`} 
            variant="default"
            action={<Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
        />

        <ResponsiveGrid columns="3">
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
        </ResponsiveGrid>
      </div>

      {/* 4. SELLER HIGHLIGHT */}
      <div className="space-y-4">
        <DashboardSectionHeader 
            title="Top Contributors" 
            variant="default"
            action={<ChevronRight className="w-4 h-4 text-slate-300" />}
        />
        <BentoCard className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-2">
           {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center p-0.5 relative transition-transform group-active:scale-95">
                  <div className="w-full h-full rounded-[inherit] bg-white flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <span className="text-sm font-black text-slate-300 group-hover:text-indigo-500 uppercase">S{i}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <BadgeCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">Seller_{i}</span>
              </div>
            ))}
        </BentoCard>
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