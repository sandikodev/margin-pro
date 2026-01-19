import React, { useState } from 'react';
import { Palette, Activity, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '../../hooks/useConfig';
import { useToast } from '../../context/toast-context';
import { api } from '@/lib/client';
import { DashboardSectionHeader } from '../ui/design-system/SectionHeader';

interface BrandingTabProps {
    addAuditLog: (action: string, details: string, type?: 'success' | 'info' | 'error') => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({ addAuditLog }) => {
    const { settings, refreshConfigs } = useConfig();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSetting = async (key: string, value: string) => {
        setIsSaving(true);
        try {
            await (api.admin.settings[':key'] as any).$put({ 
                param: { key },
                json: { value }
            });
            await refreshConfigs();
            showToast('Setting updated!', 'success');
            addAuditLog('System Setting Update', `Changed ${key} to ${value}`, 'success');
        } catch {
            showToast('Update failed', 'error');
            addAuditLog('System Setting Update', `Failed to change ${key}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
        >
            <div className="flex items-center justify-between">
                <DashboardSectionHeader 
                    icon={Palette}
                    title="Global Aesthetic Engine"
                    subtitle="Control the brand identity across the entire ecosystem"
                />
                <button onClick={() => showToast('Design synced to database', 'success')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">Save Brand State</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Palette className="w-3 h-3 text-pink-500" /> Primary Palette
                                </h4>
                                <div className="grid grid-cols-5 gap-3">
                                    {['#6366f1', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'].map(c => (
                                        <button 
                                            key={c} 
                                            className={`h-12 rounded-xl transition-all ${settings.BRAND_COLOR === c ? 'ring-4 ring-indigo-200 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => handleSaveSetting('BRAND_COLOR', c)}
                                            disabled={isSaving}
                                        />
                                    ))}
                                </div>
                        </div>

                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-indigo-500" /> UI Shape & Density
                                    </h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                                            <span className="text-xs font-bold text-slate-600">Corner Radius</span>
                                            <div className="flex gap-2">
                                                {['0.5rem', '1.5rem', '3rem'].map(r => (
                                                    <button 
                                                    key={r}
                                                    onClick={() => handleSaveSetting('UI_RADIUS', r)}
                                                    className={`w-8 h-8 flex items-center justify-center text-[10px] font-black rounded-lg border transition-all ${settings.UI_RADIUS === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                                    >
                                                        {r === '0.5rem' ? 'S' : r === '1.5rem' ? 'M' : 'L'}
                                                    </button>
                                                ))}
                                            </div>
                                    </div>
                                </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Sun className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 space-y-8">
                                <h3 className="text-2xl font-black tracking-tight text-white mb-4">Real-time Preview</h3>
                                <p className="text-slate-400 text-sm font-medium">Visualizing brand parameters in a sandbox environment.</p>
                                
                                <div 
                                    className="aspect-video rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4 shadow-2xl transition-all"
                                    style={{ 
                                        backgroundColor: settings.BRAND_COLOR ? `${settings.BRAND_COLOR}10` : 'rgba(99, 102, 241, 0.1)',
                                        borderRadius: settings.UI_RADIUS || '1.5rem'
                                    }}
                                >
                                    <div className="w-1/3 h-4 bg-white/20 rounded-full" />
                                    <div className="grid grid-cols-3 gap-4 h-full">
                                        <div className="bg-white/5 rounded-xl border border-white/10" style={{ borderRadius: settings.UI_RADIUS || '1.5rem' }} />
                                        <div className="bg-white/5 rounded-xl border border-white/10" style={{ borderRadius: settings.UI_RADIUS || '1.5rem' }} />
                                        <div className="bg-white/20 rounded-xl border border-white/20" style={{ borderRadius: settings.UI_RADIUS || '1.5rem', backgroundColor: settings.BRAND_COLOR }} />
                                    </div>
                                </div>
                        </div>
                    </div>
            </div>
        </motion.div>
    );
};
