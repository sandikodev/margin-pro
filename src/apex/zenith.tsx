
import React from 'react';

export default function ZenithPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl">
                <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ZENITH</h1>
                <p className="text-xl text-slate-400 font-medium tracking-wide">The File-System Router is Active.</p>
                <div className="mt-8 flex gap-4 justify-center">
                    <a href="/" className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm tracking-wider hover:scale-105 transition-transform">GO HOME</a>
                    <a href="/api/health" className="px-6 py-2 rounded-full border border-white/20 text-white font-bold text-sm tracking-wider hover:bg-white/10 transition-colors">CHECK API</a>
                </div>
            </div>
        </div>
    );
}
