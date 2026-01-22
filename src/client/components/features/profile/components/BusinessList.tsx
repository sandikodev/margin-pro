import React from 'react';
import { PlusCircle, CheckCircle2, Settings, Store } from 'lucide-react';
import { BusinessProfile } from '@shared/types';
import { BentoCard } from '@/components/ui/design-system/BentoCard';

interface BusinessListProps {
    businesses: BusinessProfile[];
    activeBusinessId: string;
    switchBusiness: (id: string) => void;
    startNew: () => void;
    startEdit: (b: BusinessProfile) => void;
    formatIDR: (val: number) => string;
}

export const BusinessList: React.FC<BusinessListProps> = ({
    businesses,
    activeBusinessId,
    switchBusiness,
    startNew,
    startEdit,
    formatIDR
}) => {
    return (
        <section className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={startNew}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                    <PlusCircle className="w-4 h-4" /> Tambah Unit
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businesses.map(b => (
                    <BentoCard
                        key={b.id}
                        onClick={() => switchBusiness(b.id)}
                        noPadding
                        className={`p-7 border-2 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]
              ${activeBusinessId === b.id
                                ? 'border-indigo-600 ring-4 ring-indigo-500/10 shadow-2xl'
                                : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg'}`}
                    >
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                                style={{ backgroundColor: b.themeColor === 'emerald' ? '#10b981' : b.themeColor === 'rose' ? '#f43f5e' : b.themeColor === 'orange' ? '#f97316' : '#6366f1' }}
                            >
                                {b.name.charAt(0)}
                            </div>
                            {activeBusinessId === b.id ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); startEdit(b); }}
                                    className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{b.name}</h3>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                <Store className="w-3.5 h-3.5" /> {b.type.replace('_', ' ').toUpperCase()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2 border-t border-slate-50 mt-4">
                                Asset: {formatIDR(b.currentAssetValue || 0)}
                            </p>
                        </div>

                        {activeBusinessId === b.id && (
                            <button
                                onClick={(e) => { e.stopPropagation(); startEdit(b); }}
                                className="absolute bottom-0 right-0 bg-slate-50 text-slate-400 p-4 rounded-tl-[2rem] hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        )}
                    </BentoCard>
                ))}
            </div>
        </section>
    );
};
