import React from 'react';
import { ZenithStage } from './primitives/ZenithStage';
import { BentoCard } from './primitives/BentoCard';
import { GradientCard } from './primitives/GradientCard';
import { ResponsiveGrid } from './primitives/ResponsiveGrid';
import { Sparkles, Palette, Boxes, LayoutGrid, Zap, Shield } from 'lucide-react';

/**
 * Koda UI: Design System Demo 🎨💎
 * A standalone showcase of all Zenith primitives.
 * Can be rendered at /koda-ui-demo route.
 */
export const ZenithDesignDemo: React.FC = () => {
    return (
        <ZenithStage>
            {/* Header */}
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">@koda/ui v0.1.0</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter">
                    Zenith <span className="text-indigo-500">Design System</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Institutional-grade UI primitives. Chassis for world-class applications.
                </p>
            </header>

            {/* Component Showcase */}
            <section className="space-y-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                    <Boxes className="w-6 h-6 text-indigo-500" /> Primitives
                </h2>

                <ResponsiveGrid columns={3} gap="lg">
                    {/* BentoCard Demo */}
                    <BentoCard className="bg-slate-900 border-slate-800 p-8 space-y-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                            <LayoutGrid className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black text-white">BentoCard</h3>
                        <p className="text-sm text-slate-400">
                            The foundational container primitive. Provides consistent rounded corners, borders, and shadows.
                        </p>
                        <code className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">{'<BentoCard />'}</code>
                    </BentoCard>

                    {/* GradientCard Demo */}
                    <GradientCard variant="primary" className="p-8 space-y-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Palette className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-white">GradientCard</h3>
                        <p className="text-sm text-indigo-100/80">
                            High-impact visual container with built-in gradients and sparkle effects.
                        </p>
                        <code className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">{'<GradientCard variant="primary" />'}</code>
                    </GradientCard>

                    {/* ResponsiveGrid Demo */}
                    <BentoCard className="bg-slate-900 border-slate-800 p-8 space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                            <LayoutGrid className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-black text-white">ResponsiveGrid</h3>
                        <p className="text-sm text-slate-400">
                            Standardized responsive layout system with configurable columns and gaps.
                        </p>
                        <code className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded">{'<ResponsiveGrid columns={3} />'}</code>
                    </BentoCard>
                </ResponsiveGrid>
            </section>

            {/* Variant Showcase */}
            <section className="space-y-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                    <Palette className="w-6 h-6 text-pink-500" /> GradientCard Variants
                </h2>
                <ResponsiveGrid columns={3} gap="md">
                    <GradientCard variant="primary" className="p-6 text-center">
                        <span className="text-sm font-bold uppercase tracking-widest">Primary</span>
                    </GradientCard>
                    <GradientCard variant="secondary" className="p-6 text-center">
                        <span className="text-sm font-bold uppercase tracking-widest">Secondary</span>
                    </GradientCard>
                    <GradientCard variant="accent" className="p-6 text-center">
                        <span className="text-sm font-bold uppercase tracking-widest">Accent</span>
                    </GradientCard>
                </ResponsiveGrid>
            </section>

            {/* Philosophy */}
            <section className="text-center space-y-6 py-12 border-t border-slate-800">
                <div className="flex justify-center gap-8">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">High Performance</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Institutional Grade</span>
                    </div>
                </div>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                    "We provide the Infrastructure (Chassis), you provide the Design (Paint)."
                </p>
            </section>
        </ZenithStage>
    );
};
