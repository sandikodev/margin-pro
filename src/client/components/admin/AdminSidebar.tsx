import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Settings, Layers, Languages, Cpu, FileText, Brush,
    LogOut, ChevronRight, LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTab } from './AdminCommandPalette';

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface AdminSidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (open: boolean) => void;
    user: {
        email?: string;
        name?: string;
    };
    signOut: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeTab,
    setActiveTab,
    isMobileNavOpen,
    setIsMobileNavOpen,
    user,
    signOut
}) => {
    const navItems: NavItem[] = [
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
    );
};
