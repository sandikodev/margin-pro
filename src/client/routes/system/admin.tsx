import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Layers, Languages, Cpu, FileText, Brush, 
  Search, Bell, LogOut, ChevronRight, Menu, LayoutDashboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useConfig } from '../../hooks/useConfig';
import { useToast } from '../../context/toast-context';

import { OverviewTab } from '../../components/admin/OverviewTab';
import { UsersTab } from '../../components/admin/UsersTab';
import { InvoicesTab } from '../../components/admin/InvoicesTab';
import { SettingsTab } from '../../components/admin/SettingsTab';
import { PlatformsTab } from '../../components/admin/PlatformsTab';
import { TranslationsTab } from '../../components/admin/TranslationsTab';
import { IntelligenceTab } from '../../components/admin/IntelligenceTab';
import { BrandingTab } from '../../components/admin/BrandingTab';
import { AdminCommandPalette, AdminTab } from '../../components/admin/AdminCommandPalette';
import { cn } from '@/lib/utils';
import { FullPageLoader } from '../../components/ui/design-system/Loading';

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

/* -------------------------------------------------------------------------------------------------
 * COMPONENT
 * -----------------------------------------------------------------------------------------------*/
export const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const { translations } = useConfig();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [filterMissing, setFilterMissing] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // Redirect if not admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/app');
            showToast('Unauthorized Access', 'error');
        }
    }, [user, navigate, showToast]);

    // Keyboard shortcuts
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

    const addAuditLog = (action: string, details: string, type: 'success' | 'info' | 'error' = 'info') => {
        const newLog: AuditEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            action,
            details,
            type
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const exportDictionary = () => {
        const data = JSON.stringify(translations, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lexicon.json';
        a.click();
        showToast('Lexicon exported', 'success');
        addAuditLog('Export', 'Dictionary lexicon exported to JSON', 'info');
    };

    if (!user || user.role !== 'admin') return <FullPageLoader text="Verifying Access..." />;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'platforms', label: 'Platforms', icon: Layers },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'translations', label: 'Lexicon', icon: Languages },
        { id: 'branding', label: 'Branding', icon: Brush },
        { id: 'intelligence', label: 'Intelligence', icon: Cpu },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex">
            {/* SIDEBAR NAVIGATION */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col",
                isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="p-8 pb-4">
                    <Link to="/app" className="flex items-center gap-3 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                            <Cpu className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter text-white">Margins<span className="text-indigo-400">Pro</span></h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Console</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="px-4 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 mt-4">Main Menu</p>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id as AdminTab); setIsMobileNavOpen(false); }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group",
                                activeTab === item.id 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", activeTab === item.id ? "text-indigo-200" : "text-slate-500 group-hover:text-white")} />
                            {item.label}
                            {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto text-indigo-300" />}
                        </button>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 mt-auto">
                    <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-3 border border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-xs">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.name || 'Admin'}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <button onClick={() => signOut()} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50">
                
                {/* TOP HEADER */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div 
                            className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all group w-64"
                            onClick={() => setIsCommandPaletteOpen(true)}
                        >
                            <Search className="w-4 h-4" />
                            <span className="text-xs font-bold">Search (Cmd+K)</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-xs font-black uppercase text-slate-400 tracking-widest hidden md:block">System Operational</span>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                     </div>
                </header>

                {/* DYNAMIC CONTENT SCROLL AREA */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <OverviewTab key="overview" auditLogs={auditLogs} addAuditLog={addAuditLog} />
                        )}
                        {activeTab === 'users' && (
                            <UsersTab key="users" addAuditLog={addAuditLog} />
                        )}
                        {activeTab === 'invoices' && (
                            <InvoicesTab key="invoices" />
                        )}
                        {activeTab === 'settings' && (
                            <SettingsTab key="settings" addAuditLog={addAuditLog} />
                        )}
                        {activeTab === 'platforms' && (
                            <PlatformsTab key="platforms" addAuditLog={addAuditLog} />
                        )}
                        {activeTab === 'translations' && (
                            <TranslationsTab 
                                key="translations" 
                                addAuditLog={addAuditLog} 
                                filterMissing={filterMissing} 
                                setFilterMissing={setFilterMissing} 
                            />
                        )}
                        {activeTab === 'intelligence' && (
                            <IntelligenceTab key="intelligence" auditLogs={auditLogs} />
                        )}
                        {activeTab === 'branding' && (
                            <BrandingTab key="branding" addAuditLog={addAuditLog} />
                        )}
                    </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* COMMAND PALETTE */}
            <AdminCommandPalette 
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                setActiveTab={setActiveTab}
                exportDictionary={exportDictionary}
                setFilterMissing={setFilterMissing}
            />

            {/* MOBILE NAV OVERLAY */}
            {isMobileNavOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
                    onClick={() => setIsMobileNavOpen(false)}
                />
            )}
        </div>
    );
}
