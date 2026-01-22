import React, { useState, useMemo } from 'react';
import { Languages, AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '@/hooks/useConfig';
import { useToast } from '@/context/toast-context';
import { api } from '@/lib/client';
import { BentoCard } from '@koda/core/ui';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

interface TranslationsTabProps {
    addAuditLog: (action: string, details: string, type?: 'success' | 'info' | 'error') => void;
    filterMissing: boolean;
    setFilterMissing: (val: boolean) => void;
}

export const TranslationsTab: React.FC<TranslationsTabProps> = ({ addAuditLog, filterMissing, setFilterMissing }) => {
    const { translations, refreshConfigs } = useConfig();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSaveTranslation = async (key: string, umkm: string, pro: string) => {
        try {
            // @ts-expect-error - RPC deep path inference
            await (api.admin.translations[':key'] as never).$put({
                param: { key },
                json: { umkm, pro }
            });
            await refreshConfigs();
            showToast(`Term "${key}" updated!`, 'success');
            addAuditLog('Dictionary Update', `Updated labels for ${key}`, 'success');
        } catch {
            showToast('Failed update', 'error');
            addAuditLog('Dictionary Update', `Error updating ${key}`, 'error');
        }
    };

    const filteredTranslations = useMemo(() => {
        return Object.entries(translations).filter(([key, val]: [string, { umkm: string; pro: string }]) => {
            const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                val.umkm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                val.pro.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterMissing) {
                // Heuristic: if it matches the key, it's likely untranslated or placeholder
                return matchesSearch && (!val.umkm || !val.pro || val.umkm === key || val.pro === key);
            }
            return matchesSearch;
        });
    }, [translations, searchTerm, filterMissing]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <DashboardSectionHeader
                    icon={Languages}
                    title="Terminology Lexicon"
                    subtitle="Control feature labels for UMKM and PRO modes"
                />

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFilterMissing(!filterMissing)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${filterMissing ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'}`}
                    >
                        <AlertCircle className="w-3 h-3" /> {filterMissing ? 'Showing Missing only' : 'Filter Missing'}
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search terms..."
                            className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white w-full md:w-80 font-bold text-sm shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <BentoCard className="shadow-xl overflow-hidden !p-0 border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Lexicon Key</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">UMKM (Simple Translation)</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">PRO (Advanced Terminology)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTranslations.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <AlertCircle className="w-12 h-12" />
                                            <p className="text-sm font-black uppercase tracking-widest">No matching terms found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTranslations.map(([key, t]) => (
                                    <tr key={key} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md self-start border border-slate-100">{key}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <input
                                                type="text"
                                                defaultValue={t.umkm}
                                                className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none focus:text-indigo-600 transition-colors"
                                                onBlur={(e) => handleSaveTranslation(key, e.target.value, t.pro)}
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <input
                                                type="text"
                                                defaultValue={t.pro}
                                                className="w-full bg-transparent text-sm font-bold text-indigo-700 outline-none focus:ring-1 ring-indigo-200 rounded px-2 py-1"
                                                onBlur={(e) => handleSaveTranslation(key, t.umkm, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Displaying {filteredTranslations.length} of {Object.keys(translations).length} total concepts
                    </div>
                    <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                </div>
            </BentoCard>
        </motion.div>
    );
};
