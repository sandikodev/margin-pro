import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Beaker, Home, Terminal, Github, ChevronLeft, LayoutGrid } from 'lucide-react';

export const Layout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-mono selection:bg-purple-500/30">
            {/* Cyber Header */}
            <header className="h-14 border-b border-purple-900/30 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => navigate('/app')}
                        className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold tracking-tighter uppercase">Esc_</span>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <Beaker size={18} className="text-purple-500 animate-pulse" />
                        <span className="text-sm font-black tracking-widest text-white">LABORATORY</span>
                        <span className="text-[10px] bg-purple-900/40 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20">BETA v0.2.1-ZENITH</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6">
                        <LabsNavItem to="/labs" icon={<Terminal size={14} />} label="Experiments" />
                        <LabsNavItem to="/labs/benchmarks" icon={<LayoutGrid size={14} />} label="Performance" />
                    </nav>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <a href="https://github.com/sandikodev/koda" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                        <Github size={18} />
                    </a>
                </div>
            </header>

            <main className="flex-1 relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <Outlet />
            </main>

            {/* Matrix Footer */}
            <footer className="p-4 border-t border-purple-900/20 bg-black/60 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black tracking-widest text-slate-600 uppercase">
                    <div className="flex items-center gap-4">
                        <span>Status: Online</span>
                        <span>Load: 0.12ms</span>
                        <span>Zenith_Link: Stable</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>© 2026 Sandikodev Koda Zenith Laboratories</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const LabsNavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) => `
            flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-all
            ${isActive ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}
        `}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default Layout;
