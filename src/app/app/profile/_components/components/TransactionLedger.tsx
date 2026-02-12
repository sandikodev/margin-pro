import React from 'react';
import { History, ShoppingBag, Activity } from 'lucide-react';
import { BentoCard } from '@koda/ui';

interface TransactionLedgerProps {
    transactionHistory: { name: string; date: string | number; price: number }[];
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
    transactionHistory
}) => {
    return (
        <BentoCard noPadding className="border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                    <History className="w-4 h-4 text-indigo-500" /> Transaction Ledger
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                    {transactionHistory.length} Records
                </span>
            </div>

            <div className="divide-y divide-slate-50">
                {transactionHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest">No Transactions Found</p>
                    </div>
                ) : (
                    transactionHistory.map((tx, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{tx.name}</h4>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                                        {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-rose-500 block">-{tx.price}</span>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Credits</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </BentoCard>
    );
};
