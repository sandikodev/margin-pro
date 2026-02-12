import React from 'react';
import { useLoaderData } from '@koda/runtime';

/**
 * 🏔️ Zenith View Layer (.zen)
 * This file handles ONLY presentation. No heavy logic allowed.
 * It receives data from the .koda cortex.
 */
export default function ZenithTestPage() {
    const data = useLoaderData() as any;

    return (
        <div className="p-10 bg-black min-h-screen text-white font-sans">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Zenith Architecture Test
            </h1>
            
            <div className="grid grid-cols-2 gap-8">
                {/* Visuals Column */}
                 <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur">
                    <h2 className="text-xl font-semibold mb-2">💎 .zen (The Face)</h2>
                    <p className="text-gray-400">Rendering high-fidelity UI smoothly on the Main Thread.</p>
                </div>

                {/* Logic Column (Data from .koda) */}
                <div className="p-6 border border-blue-900/50 rounded-xl bg-blue-900/10">
                    <h2 className="text-xl font-semibold mb-2 text-blue-400">🧠 .koda (The Cortex)</h2>
                    <p className="text-gray-400 text-sm mb-4">Data retrieved from Headless Logic Layer:</p>
                    
                    <pre className="font-mono text-sm text-green-400 p-4 bg-black rounded-lg overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
                Route: /experiments/zenith-test
            </div>
        </div>
    );
}
