import React from 'react';
import { useLoaderData } from 'react-router-dom';

// Data Loader (Server/Client Fetching)
export async function loader() {
    // Simulasi fetch data dari "backend"
    await new Promise(resolve => setTimeout(resolve, 800)); // Artificial delay
    return {
        message: "Data loaded via Koda Zenith loader!",
        timestamp: new Date().toISOString()
    };
}

// Meta Tags (SEO / Client-Side Title)
export const meta = () => {
    return [
        { title: "Zenith | Koda Framework" },
        { name: "description", content: "Demonstrasi fitur Koda Zenith: File-System Routing, Loaders, dan Meta Tags." }
    ];
};

export default function ZenithPage() {
    const data = useLoaderData() as { message: string, timestamp: string };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white animate-in fade-in duration-700">
            <div className="text-center p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">

                {/* Decorative Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 block animate-pulse">Koda Zenith Active</span>
                    <h1 className="text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                        ZENITH
                    </h1>

                    <div className="bg-black/40 rounded-xl p-4 mb-8 border border-white/5 text-left max-w-sm mx-auto">
                        <p className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wider">Loader Data:</p>
                        <p className="text-sm text-emerald-300 font-mono">{data.message}</p>
                        <p className="text-[10px] text-slate-600 font-mono mt-1">{data.timestamp}</p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <a href="/" className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs tracking-[0.15em] hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                            GO HOME
                        </a>
                        <a href="/api/health" className="px-8 py-3 rounded-full border border-white/20 text-white font-bold text-xs tracking-[0.15em] hover:bg-white/10 hover:border-white/40 transition-all">
                            CHECK API
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Custom Error ErrorBoundary for this route
export function ErrorBoundary() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-950 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Zenith Loader Failed</h1>
                <p className="opacity-70">Something went wrong while loading data for this view.</p>
                <a href="/" className="mt-4 inline-block underline">Return Home</a>
            </div>
        </div>
    );
}
