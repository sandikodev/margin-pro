
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Shield, ArrowLeft, Home, Lock, Brain, Server, Cookie } from 'lucide-react';
import { getLegalDocBySlug } from '@/lib/legal';

export const LegalLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();
    
    // State for dynamic theme
    const [theme, setTheme] = useState({
        icon: 'Default',
        color: 'indigo',
        gradientStart: 'from-slate-800',
        gradientEnd: 'to-slate-900',
        bgGradient1: 'bg-indigo-600/10',
        bgGradient2: 'bg-emerald-600/5',
        title: 'Legal Center',
        accent: 'text-indigo-400'
    });

    useEffect(() => {
        const updateTheme = async () => {
            if (slug && location.pathname !== '/legal') {
                const doc = await getLegalDocBySlug(slug);
                if (doc) {
                    const isLock = doc.icon === 'Lock';
                    const isBrain = doc.icon === 'Brain';
                    const isServer = doc.icon === 'Server';
                    const isCookie = doc.icon === 'Cookie';

                    let colorTheme = {
                        color: 'indigo',
                        gradientStart: 'from-indigo-600',
                        gradientEnd: 'to-purple-700',
                        bgGradient1: 'bg-indigo-600/20',
                        bgGradient2: 'bg-purple-600/10',
                        accent: 'text-indigo-400'
                    };

                    if (isLock) {
                        colorTheme = {
                            color: 'emerald',
                            gradientStart: 'from-emerald-600',
                            gradientEnd: 'to-teal-600',
                            bgGradient1: 'bg-emerald-600/20',
                            bgGradient2: 'bg-teal-600/10',
                            accent: 'text-emerald-400'
                        };
                    } else if (isBrain) { // AI Policy
                         colorTheme = {
                            color: 'rose',
                            gradientStart: 'from-rose-600',
                            gradientEnd: 'to-pink-600',
                            bgGradient1: 'bg-rose-600/20',
                            bgGradient2: 'bg-pink-600/10',
                            accent: 'text-rose-400'
                        };
                    } else if (isServer) { // Security
                         colorTheme = {
                            color: 'cyan',
                            gradientStart: 'from-cyan-600',
                            gradientEnd: 'to-blue-600',
                            bgGradient1: 'bg-cyan-600/20',
                            bgGradient2: 'bg-blue-600/10',
                            accent: 'text-cyan-400'
                        };
                    } else if (isCookie) { // Cookies
                         colorTheme = {
                            color: 'amber',
                            gradientStart: 'from-amber-600',
                            gradientEnd: 'to-orange-600',
                            bgGradient1: 'bg-amber-600/20',
                            bgGradient2: 'bg-orange-600/10',
                            accent: 'text-amber-400'
                        };
                    }

                    setTheme({
                        icon: doc.icon,
                        color: colorTheme.color,
                        gradientStart: colorTheme.gradientStart,
                        gradientEnd: colorTheme.gradientEnd,
                        bgGradient1: colorTheme.bgGradient1,
                        bgGradient2: colorTheme.bgGradient2,
                        title: doc.title,
                        accent: colorTheme.accent
                    });
                    return;
                }
            }
            // Default (Index)
            setTheme({
                icon: 'Shield',
                color: 'indigo',
                gradientStart: 'from-slate-800',
                gradientEnd: 'to-slate-900',
                bgGradient1: 'bg-indigo-600/10',
                bgGradient2: 'bg-emerald-600/5',
                title: 'Legal Center',
                accent: 'text-indigo-400'
            });
        };
        updateTheme();
    }, [slug, location.pathname]);

    const isIndex = location.pathname === '/legal';
    const backPath = isIndex ? '/' : '/legal';
    const backLabel = isIndex ? 'Back to App' : 'Back to Legal Hub';
    const BackIcon = isIndex ? Home : ArrowLeft;

    const Icon = theme.icon === 'Lock' ? Lock : 
                 theme.icon === 'Brain' ? Brain :
                 theme.icon === 'Server' ? Server :
                 theme.icon === 'Cookie' ? Cookie :
                 Shield;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-hidden print:bg-white print:text-black print:overflow-visible">
             {/* Dynamic Background Gradients */}
             <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 transition-all duration-1000 print:hidden">
                <div className={`absolute top-[-20%] left-[20%] w-[800px] h-[800px] ${theme.bgGradient1} rounded-full blur-[150px] transition-colors duration-1000`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] ${theme.bgGradient2} rounded-full blur-[120px] transition-colors duration-1000`} />
            </div>

            {/* Shared Header */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 print:hidden">
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/legal')}>
                        <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${theme.gradientStart} ${theme.gradientEnd} border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-500`}>
                             <Icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold tracking-tight text-base md:text-lg text-white leading-none">Margin<span className={`${theme.accent} transition-colors duration-500`}>Pro</span></span>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all duration-500">{theme.title}</span>
                        </div>
                    </div>

                    {/* Dynamic Back Button */}
                     <button 
                        onClick={() => navigate(backPath)} 
                        className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 transition-all px-4 py-2 rounded-full hover:bg-white/5 group"
                    >
                        <BackIcon size={14} className="group-hover:-translate-x-1 transition-transform" />
                        {backLabel}
                    </button>
                </div>
            </nav>

            {/* Content Outlet */}
            <main className="relative z-10 pt-20 print:pt-0">
                 <Outlet />
            </main>
        </div>
    );
};
