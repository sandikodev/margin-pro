import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, PieChart, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { BentoCard } from '@koda/ui'; // Removed unused import

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onDemo }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

            {/* Nav */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        MARGINS<span className="text-indigo-500">PRO</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onLogin} className="text-sm font-bold text-slate-400 hover:text-white transition-colors hidden md:block">
                            Log In
                        </button>
                        <button onClick={onGetStarted} className="px-5 py-2.5 bg-white text-slate-950 rounded-xl text-sm font-black uppercase tracking-wide hover:bg-slate-200 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-indigo-300 animate-in fade-in slide-in-from-bottom-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        The Operating System for Modern F&B
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 animate-in fade-in slide-in-from-bottom-8 delay-100">
                        Profitability <br className="hidden md:block" />
                        Is Not A Guessing Game.
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-200">
                        Stop running your business on intuition. Margins Pro gives you the
                        <span className="text-white font-bold"> financial clarity</span> and <span className="text-white font-bold">operational insights</span> you need to scale with confidence.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 delay-300">
                        <button onClick={onGetStarted} className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group">
                            Start Free Trial
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={onDemo} className="w-full md:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" /> Interactive Demo
                        </button>
                    </div>
                </div>
            </header>

            {/* Features / Bento Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Real-Time P&L Tracking</h3>
                            <p className="text-slate-400 leading-relaxed max-w-md">Connect your sales channels and expense feeds to get a live Profit & Loss statement that updates every second.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                                <PieChart className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Recipe Costing</h3>
                            <p className="text-slate-400 leading-relaxed">Calculate exact margins for every menu item down to the gram.</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 text-amber-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">AI Insights</h3>
                            <p className="text-slate-400 leading-relaxed">Get automated suggestions to cut food waste and optimize staff scheduling.</p>
                        </div>
                    </div>

                    <div className="col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden group hover:border-indigo-500/30 transition-colors flex items-center justify-between">
                        <div className="relative z-10 max-w-md">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Enterprise Grade Security</h3>
                            <p className="text-slate-400 leading-relaxed">Your financial data is encrypted with bank-level security standards. We never sell your data.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-slate-900 py-12 text-center text-slate-600 text-sm font-medium">
                <p>&copy; {new Date().getFullYear()} Margins Pro Inc. Built for winners.</p>
            </footer>

        </div>
    );
};
