import React, { useEffect, useState, useRef } from 'react';
import { useLoaderData } from 'react-router';

export default function HydrationCheckPage() {
    const data = useLoaderData() as any;
    const [mountCount, setMountCount] = useState(0);
    const renderCount = useRef(0);

    // Increment render count immediately
    renderCount.current += 1;

    useEffect(() => {
        // This should only run ONCE if hydration is correct
        setMountCount(c => c + 1);
        console.log('🧪 [Test] Hydration Check Page Mounted via useEffect');

        if ((window as any).__KODA_HYDRATED_TEST_MOUNT) {
            console.error('❌ DOUBLE MOUNT DETECTED! UseEffect ran twice!');
        }
        (window as any).__KODA_HYDRATED_TEST_MOUNT = true;

        return () => {
            console.log('🧪 [Test] Unmounting');
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-12 font-mono">
            <h1 className="text-3xl font-bold mb-8 text-indigo-400">🕵️ Hydration & Duplication Check</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* SSR Data Status */}
                <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">📦 Server Data (SSR)</h2>
                    <pre className="text-sm bg-black p-4 rounded text-green-400 overflow-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${data?.message ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>{data?.message ? 'Data Received' : 'Data Missing'}</span>
                    </div>
                </div>

                {/* Client Side checks */}
                <div className="border border-slate-800 bg-slate-900/50 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">⚡ Client Behavior</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                            <span>Component Renders:</span>
                            <span className="font-bold text-yellow-400">{renderCount.current}</span>
                            <span className="text-xs text-slate-500">(Can be &gt;1 in StrictMode, normal)</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                            <span>Effect Mounts:</span>
                            <span className={`font-bold ${mountCount === 1 ? 'text-green-400' : 'text-red-500'}`}>
                                {mountCount}
                            </span>
                            <span className="text-xs text-slate-500">(MUST be exactly 1)</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800">
                            <span>Hydration Global:</span>
                            <code className="text-xs bg-slate-800 px-2 py-1 rounded">window.__staticRouterHydrationData</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
                <h3 className="text-lg font-bold text-indigo-300 mb-2">Instructions</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Reload this page. The "Effect Mounts" count should stay at <strong>1</strong> (ignoring initial 0 state).</li>
                    <li>Check console for "DOUBLE MOUNT DETECTED" errors.</li>
                    <li>Verify "Server Data" matches what `+page.koda.ts` returned.</li>
                </ul>
            </div>

            <a href="/" className="mt-8 inline-block text-slate-500 hover:text-white transition-colors">← Back Home</a>
        </div>
    );
}
