import React from 'react';
import { Outlet, useLoaderData } from '@koda/runtime';

/**
 * 🏔️ Zenith Layout Component
 * Showcase how layout-level data is consumed.
 */
export default function ExperimentsLayout() {
    const data = useLoaderData() as any;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <header className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black">X</div>
                    <div>
                        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Zenith Labs</h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{data?.layoutMsg || "Loading..."}</p>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-gray-600 px-3 py-1 border border-white/5 rounded-full uppercase">
                    Scope: {data?.scope || "N/A"}
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
