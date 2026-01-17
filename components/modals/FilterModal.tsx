import React from 'react';
import { Sliders, ArrowUpNarrowWide, ArrowDownNarrowWide, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';

export type SortOption = 'popular' | 'cheapest' | 'expensive' | 'rating';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSort: SortOption;
  setSort: (val: SortOption) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, activeSort, setSort }) => {
  const options: { id: SortOption; label: string; icon: React.ElementType }[] = [
    { id: 'popular', label: 'Paling Populer', icon: Sliders },
    { id: 'cheapest', label: 'Harga Terendah', icon: ArrowDownNarrowWide },
    { id: 'expensive', label: 'Harga Tertinggi', icon: ArrowUpNarrowWide },
    { id: 'rating', label: 'Rating Terbaik', icon: Check },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter & Urutkan"
      description="Tampilkan menu sesuai kebutuhan Anda"
      icon={Sliders}
      footer={
        <button 
           onClick={onClose}
           className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98]"
        >
           Terapkan Filter
        </button>
      }
    >
       <div className="p-6 space-y-6">
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urutkan Berdasarkan</label>
             <div className="grid grid-cols-1 gap-3">
                {options.map((opt) => (
                   <button
                      key={opt.id}
                      onClick={() => setSort(opt.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${activeSort === opt.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                   >
                      <div className="flex items-center gap-3">
                         <opt.icon className="w-4 h-4" />
                         <span className="text-sm font-bold">{opt.label}</span>
                      </div>
                      {activeSort === opt.id && <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>}
                   </button>
                ))}
             </div>
          </div>
       </div>
    </Modal>
  );
};