import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/toast-context';
import { api } from '@/lib/client';
import { BentoCard } from '@/components/ui/design-system/BentoCard';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { cn } from '@/lib/utils';

export interface AdminInvoice {
    id: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    createdAt: string;
    userEmail: string;
    userName: string | null;
}

export const InvoicesTab: React.FC = () => {
    const { showToast } = useToast();
    const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInvoices = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // @ts-expect-error - RPC inference
            const res = await (api.admin.invoices as never).$get();
            if (res.ok) {
                const data = await res.json();
                setInvoices(data as AdminInvoice[]);
            }
        } catch (e) {
            console.error("Failed to fetch invoices", e);
            showToast("Failed to fetch invoices", "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const totalRevenue = invoices.reduce((acc, curr) => curr.status === 'PAID' ? acc + curr.amount : acc, 0);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <DashboardSectionHeader
                    icon={FileText}
                    title="Financial Overview"
                    subtitle="Track incoming payments and invoice status"
                />
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-indigo-50/50 rounded-xl flex items-center gap-2 border border-indigo-100">
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Total Revenue</span>
                        <span className="text-sm font-black text-indigo-600">
                            IDR {totalRevenue.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            <BentoCard className="shadow-xl overflow-hidden !p-0 border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300 animate-pulse">
                                            <div className="w-12 h-12 bg-slate-200 rounded-full" />
                                            <div className="h-4 w-32 bg-slate-200 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <FileText className="w-12 h-12 opacity-50" />
                                            <p className="text-sm font-black uppercase tracking-widest">No invoices found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-slate-700">{inv.id.slice(0, 8)}...</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{inv.userName || 'Unknown'}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{inv.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-800">
                                                IDR {inv.amount.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                                inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                                                    inv.status === 'PENDING' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                                        'bg-rose-100 text-rose-600 border-rose-200'
                                            )}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-400">
                                                {new Date(inv.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </BentoCard>
        </motion.div>
    );
};
