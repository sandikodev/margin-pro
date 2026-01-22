import React from 'react';
import { Wallet, ShoppingCart, Package, Zap, Building2, HelpCircle, Plus } from 'lucide-react';
import { CashflowRecord, TransactionCategory } from '@shared/types';
import { BentoCard } from '@koda/core/ui';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { FloatingActionMenu, FloatingActionItem } from '@/components/ui/FloatingActionMenu';

interface JournalTabProps {
    groupedCashflow: Record<string, CashflowRecord[]>;
    formatValue: (val: number) => string;
    deleteCashflow: (id: string) => void;
    openInput: (type: 'IN' | 'OUT') => void;
    isFabOpen: boolean;
    setIsFabOpen: (val: boolean) => void;
    fabItems: FloatingActionItem[];
}

export const JournalTab: React.FC<JournalTabProps> = ({
    groupedCashflow, formatValue, deleteCashflow, openInput, isFabOpen, setIsFabOpen, fabItems
}) => {
    const getCategoryIcon = (cat: TransactionCategory | undefined) => {
        switch (cat) {
            case 'SALES': return <ShoppingCart className="w-4 h-4" />;
            case 'COGS': return <Package className="w-4 h-4" />;
            case 'OPEX': return <Zap className="w-4 h-4" />;
            case 'ASSET': return <Building2 className="w-4 h-4" />;
            default: return <HelpCircle className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (cat: TransactionCategory | undefined) => {
        switch (cat) {
            case 'SALES': return 'text-emerald-600 bg-emerald-100';
            case 'COGS': return 'text-orange-600 bg-orange-100';
            case 'OPEX': return 'text-rose-600 bg-rose-100';
            case 'ASSET': return 'text-indigo-600 bg-indigo-100';
            default: return 'text-slate-600 bg-slate-100';
        }
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            {Object.keys(groupedCashflow).length === 0 ? (
                <BentoCard className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                    <Wallet className="w-16 h-16 text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-500">Belum ada transaksi bulan ini.</p>
                    <button onClick={() => openInput('IN')} className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest underline">Catat Transaksi Pertama</button>
                </BentoCard>
            ) : (
                Object.entries(groupedCashflow)
                    .sort(([, recordsA], [, recordsB]) => {
                        const timeA = recordsA[0]?.date || 0;
                        const timeB = recordsB[0]?.date || 0;
                        return timeB - timeA;
                    })
                    .map(([date, records]: [string, CashflowRecord[]]) => (
                        <div key={date} className="space-y-2">
                            <DashboardSectionHeader title={date} variant="default" className="sticky top-16 bg-slate-50/95 backdrop-blur-md py-2 z-10 px-0 -mx-1" />

                            <div className="space-y-2">
                                {records.map(record => {
                                    const isIncome = record.revenue > 0;
                                    const amount = isIncome ? record.revenue : record.expense;
                                    const catColor = getCategoryColor(record.category);

                                    return (
                                        <BentoCard noPadding key={record.id} className="p-4 flex items-center justify-between active:scale-[0.99] hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catColor}`}>
                                                    {getCategoryIcon(record.category)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{record.note || record.category}</p>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{record.category}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-sm font-black block ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {isIncome ? '+' : '-'}{formatValue(amount)}
                                                </span>
                                                <button onClick={() => deleteCashflow(record.id)} className="text-[9px] text-slate-300 hover:text-rose-500 transition-colors">Hapus</button>
                                            </div>
                                        </BentoCard>
                                    )
                                })}
                            </div>
                        </div>
                    ))
            )}

            <FloatingActionMenu
                icon={Plus}
                items={fabItems}
                isOpen={isFabOpen}
                setIsOpen={setIsFabOpen}
            />
        </div>
    );
};
