import React, { useState, useMemo } from 'react';
import { Layers, AlertCircle, Download, Upload, Check, X, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '../../hooks/useConfig';
import { useToast } from '../../context/toast-context';
import { api } from '@/lib/client';
import { Platform, PlatformConfig, PlatformCategory } from '@shared/types';
import { BentoCard } from '../ui/design-system/BentoCard';
import { DashboardSectionHeader } from '../ui/design-system/SectionHeader';
import { ResponsiveGrid } from '../ui/design-system/ResponsiveGrid';

interface PlatformsTabProps {
    addAuditLog: (action: string, details: string, type?: 'success' | 'info' | 'error') => void;
}

export const PlatformsTab: React.FC<PlatformsTabProps> = ({ addAuditLog }) => {
    const { platforms, refreshConfigs } = useConfig();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
    const [platformBuffer, setPlatformBuffer] = useState<Partial<PlatformConfig>>({});
    const [activePlatformCategory, setActivePlatformCategory] = useState<string>('all');

    const handleSavePlatform = async (id: string) => {
        setIsSaving(true);
        try {
            await (api.admin.platforms[':id'] as any).$put({
                param: { id },
                json: platformBuffer
            });
            await refreshConfigs();
            setEditingPlatform(null);
            showToast(`${id} updated!`, 'success');
            addAuditLog('Platform Update', `Modified policy for ${id}`, 'success');
        } catch {
            showToast('Failed to update platform', 'error');
            addAuditLog('Platform Update', `Failed to modify ${id}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredPlatforms = useMemo(() => {
        return Object.entries(platforms).filter(([_, p]: [string, PlatformConfig]) => {
            if (activePlatformCategory === 'all') return true;
            return p.category === activePlatformCategory;
        });
    }, [platforms, activePlatformCategory]);

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <DashboardSectionHeader 
                    icon={Layers}
                    title="Platform Policies"
                    subtitle="Commissions and operational fee structures"
                />
                
                <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span className="text-[9px] font-black uppercase text-amber-600">Bulk Tool: Set all commissions to</span>
                        <input 
                            type="number" step="0.01" 
                            className="w-10 bg-transparent border-b border-amber-200 text-xs font-black text-amber-700 outline-none text-center"
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    const val = parseFloat((e.target as HTMLInputElement).value) / 100;
                                    if (confirm(`Apply ${val*100}% commission to ALL platforms?`)) {
                                        setIsSaving(true);
                                        try {
                                            await Promise.all(Object.keys(platforms).map(id => 
                                                (api.admin.platforms[':id'] as any).$put({ param: { id }, json: { ...platforms[id as Platform], defaultCommission: val } })
                                            ));
                                            await refreshConfigs();
                                            showToast('Mass update successful!', 'success');
                                        } catch { showToast('Mass update failed', 'error'); }
                                        finally { setIsSaving(false); }
                                    }
                                }
                            }}
                        />
                        </div>
                        <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Download className="w-4 h-4" /></button>
                        <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Upload className="w-4 h-4" /></button>
                </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-100">
                {['all', 'food', 'marketplace', 'offline', 'export'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActivePlatformCategory(cat)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlatformCategory === cat ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {cat === 'all' ? 'All Channels' : cat}
                    </button>
                ))}
            </div>

            <ResponsiveGrid columns={2}>
                {filteredPlatforms.map(([id, p]: [string, PlatformConfig]) => (
                    <BentoCard 
                        key={id} 
                        className={`p-8 transition-all duration-300 relative group overflow-hidden ${editingPlatform === id ? 'bg-indigo-50/50 border-indigo-200' : 'hover:border-indigo-200'}`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: p.color }} />
                                <h3 className="font-black text-lg uppercase tracking-tight text-slate-800">{id}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 uppercase tracking-widest">{p.category}</span>
                                    {editingPlatform === id ? (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleSavePlatform(id)} className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform"><Check className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingPlatform(null)} className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => { setEditingPlatform(id); setPlatformBuffer({ ...p }); }} className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                                    )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 relative z-10">
                            {[
                                { label: 'Commission', key: 'defaultCommission', val: `${(p.defaultCommission * 100).toFixed(1)}%`, isPercent: true },
                                { label: 'Fixed Fee', key: 'defaultFixedFee', val: p.defaultFixedFee },
                                { label: 'WD Fee', key: 'withdrawalFee', val: p.withdrawalFee }
                            ].map(field => (
                                <div key={field.key} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group-hover:border-indigo-50 transition-colors">
                                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest mb-2">{field.label}</p>
                                    {editingPlatform === id ? (
                                        <input 
                                            type="number" step={field.isPercent ? "0.01" : "1"} 
                                            className="w-full text-lg font-black text-indigo-600 outline-none bg-transparent"
                                            value={(platformBuffer as any)[field.key]}
                                            onChange={(e) => setPlatformBuffer({ ...platformBuffer, [field.key]: parseFloat(e.target.value) })}
                                        />
                                    ) : (
                                        <p className="text-xl font-black text-slate-800 break-all">{field.val}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* EXTENDED FIELDS (Only when editing) */}
                        {editingPlatform === id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-6 space-y-4 border-t border-indigo-100 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400">Branding Color</label>
                                        <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:border-indigo-300 outline-none" value={platformBuffer.color} onChange={(e) => setPlatformBuffer({...platformBuffer, color: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                                        <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" value={platformBuffer.category} onChange={(e) => setPlatformBuffer({...platformBuffer, category: e.target.value as PlatformCategory})}>
                                            <option value="food">Food Delivery</option>
                                            <option value="marketplace">E-Commerce</option>
                                            <option value="offline">Offline/Store</option>
                                            <option value="export">B2B/Export</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Official Terms URL</label>
                                    <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" value={platformBuffer.officialTermsUrl} onChange={(e) => setPlatformBuffer({...platformBuffer, officialTermsUrl: e.target.value})}/>
                                </div>
                            </motion.div>
                        )}
                    </BentoCard>
                ))}
            </ResponsiveGrid>
        </motion.div>
    );
};
