import React, { useMemo, useState } from 'react';
import { 
  Settings, Layers, Languages, HardDrive, ShieldCheck, Zap, Check, AlertCircle, TrendingUp, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { useConfig } from '@/hooks/useConfig';
import { PlatformConfig, PlatformCategory } from '@shared/types';
import { BentoCard } from '@/components/ui/design-system/BentoCard';
import { ResponsiveGrid } from '@/components/ui/design-system/ResponsiveGrid';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { api } from '@/lib/client';
import { useToast } from '@/context/toast-context';

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/
interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  type: 'success' | 'info' | 'error';
}

interface OverviewTabProps {
  auditLogs: AuditEntry[];
  addAuditLog: (action: string, details: string, type?: 'success' | 'info' | 'error') => void;
}

/* -------------------------------------------------------------------------------------------------
 * COMPONENT
 * -----------------------------------------------------------------------------------------------*/
export const OverviewTab: React.FC<OverviewTabProps> = ({ auditLogs, addAuditLog }) => {
    const { settings, platforms, translations, refreshConfigs } = useConfig();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // --- COMPUTED DATA ---
    const platformDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        Object.values(platforms).forEach((p: PlatformConfig) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [platforms]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const commissionData = useMemo(() => {
        return Object.entries(platforms).map(([id, p]) => ({
            id,
            val: p.defaultCommission * 100
        }));
    }, [platforms]);

    // --- ACTIONS ---

    const exportSystemBackup = () => {
        const fullBackup = {
            version: '2.0.WA',
            timestamp: new Date().toISOString(),
            settings,
            platforms,
            translations,
            checksum: btoa(JSON.stringify({settings, platforms})) 
        };
        const data = JSON.stringify(fullBackup, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `margins-pro-full-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        addAuditLog('System', 'Full cryptographically stamped backup created', 'success');
        showToast('Full system backup created!', 'success');
    };

    const bulkMigrateCategory = async (from: string, to: string) => {
        if (!confirm(`Are you sure you want to migrate ALL platforms from ${from} to ${to}?`)) return;
        setIsSaving(true);
        try {
            const targets = Object.entries(platforms).filter(([_, p]: [string, PlatformConfig]) => p.category === from);
            await Promise.all(targets.map(([id, p]: [string, PlatformConfig]) => 
                (api.admin.platforms[':id'] as unknown as { $put: (arg: { param: { id: string }, json: Partial<PlatformConfig> }) => Promise<Response> }).$put({ param: { id }, json: { ...p, category: to as PlatformCategory } })
            ));
            await refreshConfigs();
            addAuditLog('Migration', `Moved ${targets.length} platforms from ${from} to ${to}`, 'info');
            showToast(`Migration complete: ${targets.length} platforms moved`, 'success');
        } catch { showToast('Migration failed', 'error'); }
        finally { setIsSaving(false); }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
        >
            <DashboardSectionHeader 
                icon={Settings} 
                title="System Panorama" 
                subtitle="Synthetic metrics and platform distribution" 
            />

            {/* METRICS GRID */}
            <ResponsiveGrid columns={3}>
                {[
                    { label: 'Integrated Platforms', val: Object.keys(platforms).length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Dictionary Size', val: Object.keys(translations).length, icon: Languages, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Config Variables', val: Object.keys(settings).length, icon: Settings, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map(stat => (
                    <BentoCard key={stat.label} className="p-6 flex flex-col gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-800 mt-1">{stat.val}</p>
                        </div>
                    </BentoCard>
                ))}
            </ResponsiveGrid>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BentoCard className="p-8 space-y-6">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4 text-indigo-600" /> Platform Categories
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={platformDistribution}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {platformDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </BentoCard>

                <BentoCard className="p-8 space-y-6">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Commission Benchmark (%)
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={commissionData}>
                                <XAxis dataKey="id" hide />
                                <YAxis hide />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="val" fill="#6366f1" radius={[10, 10, 10, 10]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </BentoCard>
            </div>

            {/* AUDIT LOGS */}
            <BentoCard className="p-8 space-y-6 !border-indigo-100">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600">Recent Session Audit Log</h4>
                <div className="space-y-4">
                    {auditLogs.length === 0 ? (
                        <p className="text-center py-6 text-slate-300 text-xs font-medium italic">No configuration changes made in this session yet.</p>
                    ) : (
                        auditLogs.map(log => (
                            <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className={`mt-1 w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase text-slate-800">{log.action}</span>
                                        <span className="text-[8px] font-black text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </BentoCard>

            {/* ADVANCED DATA SUITE */}
            <div className="p-8 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all rotate-12">
                        <HardDrive className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-2 text-white">Advanced Data Suite</h3>
                                <p className="text-slate-400 text-sm font-medium">Mission-critical system operations and data integrity</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={exportSystemBackup}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-white/10"
                                >
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Full System Backup
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-amber-500" /> Bulk Category Migration
                                </h4>
                                <div className="flex items-center gap-3">
                                        <select 
                                        id="migrateFrom"
                                        className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono outline-none text-white focus:bg-white/20"
                                        >
                                            {['food', 'marketplace', 'offline', 'export'].map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                                        </select>
                                        <div className="text-slate-600">→</div>
                                        <select 
                                        id="migrateTo"
                                        className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono outline-none text-white focus:bg-white/20"
                                        >
                                            {['food', 'marketplace', 'offline', 'export'].map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                                        </select>
                                        <button 
                                        onClick={() => {
                                            const from = (document.getElementById('migrateFrom') as HTMLSelectElement).value;
                                            const to = (document.getElementById('migrateTo') as HTMLSelectElement).value;
                                            bulkMigrateCategory(from, to);
                                        }}
                                        disabled={isSaving}
                                        className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/40"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                                <div className="p-3 bg-amber-500 text-white rounded-xl">
                                        <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Atomic Warning</p>
                                        <p className="text-[8px] text-amber-200/60 font-medium leading-tight">Migration actions are atomic and immediately affect all production instances.</p>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </motion.div>
    );
};
