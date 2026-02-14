import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useConfig } from '@/hooks/useConfig';
import { useToast } from '@/context/toast-context';

import { OverviewTab } from '@/components/admin/OverviewTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { InvoicesTab } from '@/components/admin/InvoicesTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import { PlatformsTab } from '@/components/admin/PlatformsTab';
import { TranslationsTab } from '@/components/admin/TranslationsTab';
import { IntelligenceTab } from '@/components/admin/IntelligenceTab';
import { BrandingTab } from '@/components/admin/BrandingTab';
import { AdminCommandPalette, AdminTab } from '@/components/admin/AdminCommandPalette';
import { FullPageLoader } from '@/components/ui/design-system/Loading';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

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

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex">
            {/* SIDEBAR NAVIGATION */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobileNavOpen={isMobileNavOpen}
                setIsMobileNavOpen={setIsMobileNavOpen}
                user={user}
                signOut={signOut}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50">

                {/* TOP HEADER */}
                <AdminHeader
                    isMobileNavOpen={isMobileNavOpen}
                    setIsMobileNavOpen={setIsMobileNavOpen}
                    setIsCommandPaletteOpen={setIsCommandPaletteOpen}
                />

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

