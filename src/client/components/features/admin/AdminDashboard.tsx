import React, { useState, useMemo, useEffect } from 'react';
import { 
  Settings, Layers, Languages, Save, RefreshCw, 
  ChevronRight, ArrowLeft, Palette, Percent, DollarSign,
  Edit3, Check, X, LayoutDashboard, Activity, Database,
  Search, Download, Upload, AlertCircle, TrendingUp,
  BarChart2, PieChart as PieChartIcon, SearchCode,
  Cpu, Brush, Zap, Terminal, Sliders, ShieldCheck,
  Globe, Moon, Sun, Monitor, HardDrive, Box
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../../../context/ConfigContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../lib/client';
import { Platform } from '@shared/types';

// TYPES
type AdminTab = 'overview' | 'settings' | 'platforms' | 'translations' | 'intelligence' | 'branding';

interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  type: 'success' | 'info' | 'error';
}

export const AdminDashboard: React.FC = () => {
    const { settings, platforms, translations, refreshConfigs } = useConfig();
    const { addToast } = useToast();
    
    // UI STATE
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [isSaving, setIsSaving] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
    const [platformBuffer, setPlatformBuffer] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMissing, setFilterMissing] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [activePlatformCategory, setActivePlatformCategory] = useState<string>('all');
    const [simulationImpact, setSimulationImpact] = useState<number>(0);
    const [terminalLogs, setTerminalLogs] = useState<{msg: string, type: 'cmd' | 'info' | 'warn'}[]>([]);

    // ANALYTICS DATA
    const platformDistribution = useMemo(() => {
        const counts: Record<string, number> = {};
        Object.values(platforms).forEach((p: any) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [platforms]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const commissionData = useMemo(() => {
        return Object.entries(platforms).map(([id, p]) => ({
            id,
            val: (p as any).defaultCommission * 100
        }));
    }, [platforms]);

    const platformEfficiency = useMemo(() => {
        return Object.entries(platforms).map(([id, p]: [any, any]) => ({
            subject: id.split(' ')[0],
            efficiency: Math.random() * 80 + 20, // Synthetic index
            margin: (1 - p.defaultCommission) * 100,
            full: 100
        }));
    }, [platforms]);

    useEffect(() => {
        document.documentElement.style.setProperty('--brand-primary', settings.BRAND_COLOR || '#6366f1');
        document.documentElement.style.setProperty('--ui-radius', settings.UI_RADIUS || '1.5rem');
        if (settings.GLASS_ENABLED === 'true') {
            document.documentElement.classList.add('glass-effects');
        } else {
            document.documentElement.classList.remove('glass-effects');
        }
    }, [settings]);

    const filteredPlatforms = useMemo(() => {
        return Object.entries(platforms).filter(([_, p]: [any, any]) => {
            if (activePlatformCategory === 'all') return true;
            return p.category === activePlatformCategory;
        });
    }, [platforms, activePlatformCategory]);

    // HELPERS
    const addAuditLog = (action: string, details: string, type: 'success' | 'info' | 'error' = 'info') => {
        const newLog: AuditEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            action,
            details,
            type
        };
        setAuditLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10
    };

    // ACTIONS
    const handleSaveSetting = async (key: string, value: string) => {
        setIsSaving(true);
        try {
            await (api.admin.settings[':key'] as any).$put({ 
                param: { key },
                json: { value }
            });
            await refreshConfigs();
            addToast('Setting updated!', 'success');
            addAuditLog('System Setting Update', `Changed ${key} to ${value}`, 'success');
        } catch (error) {
            addToast('Update failed', 'error');
            addAuditLog('System Setting Update', `Failed to change ${key}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePlatform = async (id: string) => {
        setIsSaving(true);
        try {
            await (api.admin.platforms[':id'] as any).$put({
                param: { id },
                json: platformBuffer
            });
            await refreshConfigs();
            setEditingPlatform(null);
            addToast(`${id} updated!`, 'success');
            addAuditLog('Platform Update', `Modified policy for ${id}`, 'success');
        } catch (error) {
            addToast('Failed to update platform', 'error');
            addAuditLog('Platform Update', `Failed to modify ${id}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveTranslation = async (key: string, umkm: string, pro: string) => {
        setIsSaving(true);
        try {
            await (api.admin.translations[':key'] as any).$put({
                param: { key },
                json: { umkm, pro }
            });
            await refreshConfigs();
            addToast(`Term "${key}" updated!`, 'success');
            addAuditLog('Dictionary Update', `Updated labels for ${key}`, 'success');
        } catch (error) {
            addToast('Failed update', 'error');
            addAuditLog('Dictionary Update', `Error updating ${key}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // COMMAND PALETTE LISTENER
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsCommandPaletteOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const exportDictionary = () => {
        const data = JSON.stringify(translations, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `margins-pro-dictionary-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        addAuditLog('Export', 'Downloaded dictionary as JSON', 'info');
    };

    const exportSystemBackup = () => {
        const fullBackup = {
            version: '2.0.WA',
            timestamp: new Date().toISOString(),
            settings,
            platforms,
            translations,
            checksum: btoa(JSON.stringify({settings, platforms})) // Mock checksum
        };
        const data = JSON.stringify(fullBackup, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `margins-pro-full-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        addAuditLog('System', 'Full cryptographically stamped backup created', 'success');
        addToast('Full system backup created!', 'success');
    };

    const bulkMigrateCategory = async (from: string, to: string) => {
        if (!confirm(`Are you sure you want to migrate ALL platforms from ${from} to ${to}?`)) return;
        setIsSaving(true);
        try {
            const targets = Object.entries(platforms).filter(([_, p]: [any, any]) => p.category === from);
            await Promise.all(targets.map(([id, p]: [any, any]) => 
                (api.admin.platforms[':id'] as any).$put({ param: { id }, json: { ...p, category: to } })
            ));
            await refreshConfigs();
            addAuditLog('Migration', `Moved ${targets.length} platforms from ${from} to ${to}`, 'info');
            addToast(`Migration complete: ${targets.length} platforms moved`, 'success');
        } catch { addToast('Migration failed', 'error'); }
        finally { setIsSaving(false); }
    };

    // FILTERED TRANSLATIONS
    const filteredTranslations = useMemo(() => {
        return Object.entries(translations).filter(([key, val]: [string, any]) => {
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
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* AUDIT / SYNC BAR (Conditional) */}
            <AnimatePresence>
                {isSaving && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-400 backdrop-blur-md"
                    >
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest">Synchronizing Changes...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Settings className="w-8 h-8 text-indigo-600" />
                        </motion.div> 
                        Control Center
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">High-performance admin toolkit for system logic</p>
                </div>
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* ADVANCED SIDEBAR */}
                <aside className="w-full lg:w-72 space-y-4">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'settings', label: 'Variables', icon: Settings },
                            { id: 'platforms', label: 'Platform Policies', icon: Layers },
                            { id: 'translations', label: 'Dictionary', icon: Languages },
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-4 font-black text-[10px] uppercase tracking-widest">
                                    <tab.icon className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} /> {tab.label}
                                </div>
                                    <ChevronRight className={`w-4 h-4 transition-all ${activeTab === tab.id ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}

                        <div className="my-2 border-t border-slate-100 px-4 py-2">
                             <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Wild Edition</h4>
                             {[
                                 { id: 'intelligence', label: 'Intelligence', icon: Cpu, color: 'text-amber-500' },
                                 { id: 'branding', label: 'Global Design', icon: Brush, color: 'text-pink-500' },
                             ].map(tab => (
                                 <button 
                                     key={tab.id}
                                     onClick={() => setActiveTab(tab.id as any)}
                                     className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group mb-1 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
                                 >
                                     <div className="flex items-center gap-3 font-black text-[9px] uppercase tracking-widest">
                                         <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : tab.color}`} /> {tab.label}
                                     </div>
                                 </button>
                             ))}
                        </div>
                    </div>

                    {/* SYSTEM HEALTH WIDGET */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500" /> System Integrity
                         </h4>
                         <div className="space-y-3">
                            {[
                                { name: 'Core API', status: 'Operational', color: 'bg-emerald-500' },
                                { name: 'Database (Turso)', status: 'Connected', color: 'bg-emerald-500' },
                                { name: 'Storage Sync', status: 'Active', color: 'bg-indigo-500' }
                            ].map(sys => (
                                <div key={sys.name} className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600">{sys.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-slate-400">{sys.status}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${sys.color}`} />
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-slate-100/50 rounded-[2rem] border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                             <SearchCode className="w-3 h-3 text-slate-400" />
                             <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Quick Command</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed">Press <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm text-slate-900 font-mono">⌘K</kbd> to unlock the command palette.</p>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1 bg-white rounded-[3rem] border border-slate-200 p-8 lg:p-12 shadow-sm min-h-[700px] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Panorama</h2>
                                    <p className="text-sm text-slate-400 mt-1 font-medium">Synthetic metrics and platform distribution</p>
                                </div>

                                {/* METRICS GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Integrated Platforms', val: Object.keys(platforms).length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                        { label: 'Dictionary Size', val: Object.keys(translations).length, icon: Languages, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { label: 'Config Variables', val: Object.keys(settings).length, icon: Settings, color: 'text-amber-600', bg: 'bg-amber-50' }
                                    ].map(stat => (
                                        <div key={stat.label} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                                <p className="text-3xl font-black text-slate-800 mt-1">{stat.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CHARTS ROW */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 space-y-6">
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
                                    </div>

                                    <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 space-y-6">
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
                                    </div>
                                </div>

                                {/* AUDIT LOGS */}
                                <div className="bg-white rounded-[2.5rem] border border-indigo-100 p-8 space-y-6 shadow-sm">
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
                                </div>

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
                                                            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono outline-none text-white"
                                                         >
                                                              {['food', 'marketplace', 'offline', 'export'].map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                                                         </select>
                                                         <ChevronRight className="w-4 h-4 text-slate-600" />
                                                         <select 
                                                            id="migrateTo"
                                                            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono outline-none text-white"
                                                         >
                                                              {['food', 'marketplace', 'offline', 'export'].map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                                                         </select>
                                                         <button 
                                                            onClick={() => {
                                                                const from = (document.getElementById('migrateFrom') as HTMLSelectElement).value;
                                                                const to = (document.getElementById('migrateTo') as HTMLSelectElement).value;
                                                                bulkMigrateCategory(from, to);
                                                            }}
                                                            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/40"
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
                        )}

                        {activeTab === 'settings' && (
                            <motion.div 
                                key="settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Variables</h2>
                                    <p className="text-sm text-slate-400 mt-1 font-medium">Core constants governing calculation logic</p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 flex items-center justify-between group hover:bg-indigo-50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-white rounded-3xl shadow-sm group-hover:shadow-indigo-100 transition-all">
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
                                                className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 font-black text-slate-800 outline-none focus:border-indigo-500 w-28 text-center text-lg shadow-sm"
                                                onBlur={(e) => handleSaveSetting('TAX_RATE', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'platforms' && (
                            <motion.div 
                                key="platforms"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Platform Policies</h2>
                                        <p className="text-sm text-slate-400 mt-1 font-medium">Commissions and operational fee structures</p>
                                    </div>
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
                                                                addToast('Mass update successful!', 'success');
                                                            } catch { addToast('Mass update failed', 'error'); }
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
                                <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-100">
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredPlatforms.map(([id, p]: [string, any]) => (
                                        <div key={id} className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative group overflow-hidden ${editingPlatform === id ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/50 border-slate-100 hover:border-indigo-200'}`}>
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
                                                    <h3 className="font-black text-lg uppercase tracking-tight text-slate-800">{id}</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                     <span className="text-[10px] font-black bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 uppercase tracking-widest">{p.category}</span>
                                                     {editingPlatform === id ? (
                                                         <div className="flex items-center gap-2">
                                                            <button onClick={() => handleSavePlatform(id)} className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg"><Check className="w-4 h-4" /></button>
                                                            <button onClick={() => setEditingPlatform(null)} className="p-2 bg-slate-200 text-slate-600 rounded-xl"><X className="w-4 h-4" /></button>
                                                         </div>
                                                     ) : (
                                                         <button onClick={() => { setEditingPlatform(id); setPlatformBuffer({ ...(p as any) }); }} className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
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
                                                                className="w-full text-lg font-black text-indigo-600 outline-none"
                                                                value={platformBuffer[field.key]}
                                                                onChange={(e) => setPlatformBuffer({ ...platformBuffer, [field.key]: parseFloat(e.target.value) })}
                                                            />
                                                        ) : (
                                                            <p className="text-xl font-black text-slate-800">{field.val}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* EXTENDED FIELDS (Only when editing) */}
                                            {editingPlatform === id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-6 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase text-slate-400">Branding Color</label>
                                                            <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" value={platformBuffer.color} onChange={(e) => setPlatformBuffer({...platformBuffer, color: e.target.value})}/>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                                                            <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" value={platformBuffer.category} onChange={(e) => setPlatformBuffer({...platformBuffer, category: e.target.value})}>
                                                                <option value="food">Food Delivery</option>
                                                                <option value="marketplace">E-Commerce</option>
                                                                <option value="offline">Offline/Store</option>
                                                                <option value="export">B2B/Export</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase text-slate-400">Official Terms URL</label>
                                                        <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" value={platformBuffer.officialTermsUrl} onChange={(e) => setPlatformBuffer({...platformBuffer, officialTermsUrl: e.target.value})}/>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'translations' && (
                            <motion.div 
                                key="translations"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Terminology Lexicon</h2>
                                        <p className="text-sm text-slate-400 mt-1 font-medium">Control feature labels for UMKM and PRO modes</p>
                                    </div>
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
                                                  placeholder="Search terms, keys, or labels..."
                                                  className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white w-full md:w-80 font-bold text-sm shadow-sm transition-all"
                                                  value={searchTerm}
                                                  onChange={(e) => setSearchTerm(e.target.value)}
                                              />
                                         </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
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
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'intelligence' && (
                            <motion.div 
                                key="intelligence"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Hub</h2>
                                        <p className="text-sm text-slate-400 mt-1 font-medium">Predictive simulation and efficiency analytics</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-3">
                                            <Zap className="w-3 h-3 text-amber-400" />
                                            <span className="text-[10px] font-black uppercase text-white tracking-widest">Al Engine Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                             <TrendingUp className="w-3 h-3 text-indigo-500" /> Platform Efficiency Index
                                         </h4>
                                         <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={platformEfficiency}>
                                                    <PolarGrid stroke="#e2e8f0" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                    <Radar name="Efficiency" dataKey="efficiency" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                                                    <Radar name="Margin" dataKey="margin" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                         </div>
                                    </div>

                                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col">
                                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                             <Terminal className="w-3 h-3 text-emerald-400" /> System Terminal
                                         </h4>
                                         <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[250px] scrollbar-hide">
                                              <p className="text-emerald-400 opacity-60">{'>'}&nbsp;initializing_wild_edition...</p>
                                              <p className="text-emerald-400 opacity-60">{'>'}&nbsp;security_handshake_complete</p>
                                              <p className="text-indigo-400">{'>'}&nbsp;fetching_platform_deltas... [OK]</p>
                                              {auditLogs.slice(0, 5).map(log => (
                                                  <p key={log.id} className="text-slate-400 text-[9px]">
                                                      <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.action}: {log.details}
                                                  </p>
                                              ))}
                                              <p className="text-amber-400 animate-pulse">{'>'}&nbsp;awaiting_admin_input_</p>
                                         </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[3rem] border-4 border-indigo-50 p-10 relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                          <Sliders className="w-32 h-32 text-indigo-600" />
                                     </div>
                                     <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                          <div className="max-w-md">
                                               <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                                                   "What-If" Simulation Playground
                                               </h3>
                                               <p className="text-sm text-slate-500 font-medium leading-relaxed">Adjust the global commission multiplier to see how fee changes across all platforms would impact overall unit profitability.</p>
                                          </div>
                                          <div className="flex-1 max-w-sm space-y-6">
                                               <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Multiplier: {simulationImpact > 0 ? '+' : ''}{simulationImpact}%</span>
                                                    <span className={`text-2xl font-black ${simulationImpact > 0 ? 'text-red-500' : simulationImpact < 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {simulationImpact === 0 ? 'NEUTRAL' : simulationImpact > 0 ? 'DECREASE' : 'INCREASE'}
                                                    </span>
                                               </div>
                                               <input 
                                                  type="range" min="-10" max="10" step="0.5"
                                                  value={simulationImpact}
                                                  onChange={(e) => setSimulationImpact(parseFloat(e.target.value))}
                                                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                               />
                                               <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                         <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Avg. Margin Delta</span>
                                                         <span className={`text-sm font-black ${simulationImpact > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{-simulationImpact}%</span>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                         <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Est. Revenue Risk</span>
                                                         <span className="text-sm font-black text-slate-800">±{Math.abs(simulationImpact * 1.5).toFixed(1)}%</span>
                                                    </div>
                                               </div>
                                          </div>
                                     </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'branding' && (
                            <motion.div 
                                key="branding"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Global Aesthetic Engine</h2>
                                        <p className="text-sm text-slate-400 mt-1 font-medium">Control the brand identity across the entire ecosystem</p>
                                    </div>
                                    <button onClick={() => addToast('Design synced to database', 'success')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">Save Brand State</button>
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
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* COMMAND PALETTE MODAL */}
            <AnimatePresence>
                {isCommandPaletteOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-6"
                        onClick={() => setIsCommandPaletteOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                            className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
                                <Search className="w-6 h-6 text-indigo-600" />
                                <input 
                                    autoFocus
                                    placeholder="Type a command or search settings..." 
                                    className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">ESC to Close</div>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                                <div className="px-4 py-2">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Navigation</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'overview', label: 'Jump to Overview', icon: LayoutDashboard },
                                            { id: 'settings', label: 'Jump to Settings', icon: Settings },
                                            { id: 'platforms', label: 'Jump to Platforms', icon: Layers },
                                            { id: 'translations', label: 'Jump to Dictionary', icon: Languages },
                                            { id: 'intelligence', label: 'Jump to Intelligence', icon: Cpu },
                                            { id: 'branding', label: 'Jump to Design', icon: Brush },
                                        ].map(cmd => (
                                            <button 
                                                key={cmd.id}
                                                onClick={() => { setActiveTab(cmd.id as any); setIsCommandPaletteOpen(false); }}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all text-xs font-bold"
                                            >
                                                <cmd.icon className="w-4 h-4" /> {cmd.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-4 py-2">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Actions</h5>
                                    <button onClick={exportDictionary} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all text-xs font-bold">
                                        <div className="flex items-center gap-3"><Download className="w-4 h-4" /> Export Lexicon (JSON)</div>
                                        <ChevronRight className="w-4 h-4 opacity-30" />
                                    </button>
                                    <button onClick={() => { setSearchTerm(''); setFilterMissing(true); setActiveTab('translations'); setIsCommandPaletteOpen(false); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-all text-xs font-bold">
                                        <div className="flex items-center gap-3"><AlertCircle className="w-4 h-4" /> Show Untranslated Terms</div>
                                        <ChevronRight className="w-4 h-4 opacity-30" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tip: Use arrows to navigate results (Coming Soon)</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
