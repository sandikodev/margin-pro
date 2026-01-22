import React, { useState } from 'react';
import { Settings, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConfig } from '@/hooks/useConfig';
import { useToast } from '@/context/toast-context';
import { api } from '@/lib/client';
import { BentoCard } from '@koda/ui';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

interface SettingsTabProps {
    addAuditLog: (action: string, details: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ addAuditLog }) => {
    const { settings, refreshConfigs } = useConfig();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSetting = async (key: string, value: string) => {
        setIsSaving(true);
        try {
            // @ts-expect-error - RPC inference
            await (api.admin.settings[':key'] as never).$put({
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <DashboardSectionHeader
                icon={Settings}
                title="System Variables"
                subtitle="Core constants governing calculation logic"
            />

            <div className="grid grid-cols-1 gap-6">
                <BentoCard className="p-8 border-indigo-100 flex items-center justify-between group hover:bg-indigo-50/10 transition-colors">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white rounded-3xl shadow-sm group-hover:shadow-indigo-100 transition-all border border-slate-100">
                            <Percent className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Global Policy</p>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">TAX_RATE (PPN)</h3>
                            <p className="text-xs text-slate-400 font-medium">Standard Value Added Tax percentage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            defaultValue={settings.TAX_RATE}
                            disabled={isSaving}
                            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 font-black text-slate-800 outline-none focus:border-indigo-500 w-28 text-center text-lg shadow-sm disabled:opacity-50"
                            onBlur={(e) => handleSaveSetting('TAX_RATE', e.target.value)}
                        />
                    </div>
                </BentoCard>
            </div>
        </motion.div>
    );
};
