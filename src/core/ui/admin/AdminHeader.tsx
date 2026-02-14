import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface AdminHeaderProps {
    isMobileNavOpen: boolean;
    setIsMobileNavOpen: (open: boolean) => void;
    setIsCommandPaletteOpen: (open: boolean) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    isMobileNavOpen,
    setIsMobileNavOpen,
    setIsCommandPaletteOpen
}) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
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
    );
};
