import React, { useState } from 'react';
import { BentoCard, ResponsiveGrid, GradientCard } from '@koda/core/ui';
import { Network, ShieldCheck, Database, Wallet } from 'lucide-react';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Sovereign<span className="text-indigo-500">Node</span></h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Connected to IPFS Swarm</span>
                    </div>
                </div>
                <button className="px-6 py-3 bg-white/10 rounded-full font-bold border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Connect Wallet
                </button>
            </header>

            {/* Hero Section using Koda Primitives */}
            <ResponsiveGrid columns={2}>
                <GradientCard variant="primary" className="col-span-1">
                    <h2 className="text-2xl font-black mb-4">Unstoppable Infrastructure</h2>
                    <p className="opacity-80 leading-relaxed mb-6">
                        This dashboard is hosted on the localized hash-addressed network.
                        Zero central servers. Zero downtime.
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest border-t border-white/20 pt-4">
                        <Network className="w-4 h-4" /> Koda Core Agnostic Engine
                    </div>
                </GradientCard>

                <ResponsiveGrid columns={2} gap="sm">
                    <BentoCard className="flex flex-col justify-center items-center text-center bg-slate-900 border-slate-800">
                        <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3" />
                        <div className="text-2xl font-black text-white">100%</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Uptime Guarantee</div>
                    </BentoCard>
                    <BentoCard className="flex flex-col justify-center items-center text-center bg-slate-900 border-slate-800">
                        <Database className="w-8 h-8 text-indigo-500 mb-3" />
                        <div className="text-2xl font-black text-white">IPFS</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Storage Layer</div>
                    </BentoCard>
                </ResponsiveGrid>
            </ResponsiveGrid>

            {/* Data Grid Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-indigo-500/30 pb-4">
                    <h3 className="text-xl font-bold">Node Telemetry</h3>
                    <span className="text-xs font-mono text-slate-500">REALTIME</span>
                </div>

                <ResponsiveGrid columns={4}>
                    {[1, 2, 3, 4].map((i) => (
                        <BentoCard key={i} className="bg-slate-900/50 border-slate-800 p-6">
                            <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-2">Peer ID</div>
                            <div className="font-mono text-indigo-400 text-sm truncate">QmHas8...29sA{i}</div>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[70%]" />
                            </div>
                        </BentoCard>
                    ))}
                </ResponsiveGrid>
            </div>

            <footer className="text-center text-slate-600 text-xs py-12">
                Powered by <strong>Koda Core v0.1.0</strong> • Deploy to 4EVERLAND
            </footer>
        </div>
    );
}
