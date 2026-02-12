import React from 'react';
import { useLoaderData } from '@koda/runtime';

/**
 * 🏎️ Zenith Turbo View
 * Rendering the results of the Native Bridge execution.
 */
export default function TurboPage() {
    const data = useLoaderData() as any;

    return (
        <div className="p-10 bg-black min-h-screen text-white font-sans overflow-hidden relative">
            {/* Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                 <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600 rounded-full blur-[128px]" />
                 <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-5xl font-black mb-2 italic tracking-tighter bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                    ZENITH TURBO
                </h1>
                <p className="text-xl text-gray-400 mb-8 font-mono">
                    Native Bridge Activation // Protocol 17
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Card */}
                    <div className="p-6 border border-red-900/50 bg-black/60 backdrop-blur rounded-xl">
                        <h2 className="text-lg font-bold text-red-400 mb-4">STATUS</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-mono text-green-400">BRIDGE_ACTIVE</span>
                        </div>
                        <div className="mt-4 font-mono text-sm text-gray-500">
                            Mode: {data.mode}
                        </div>
                    </div>

                    {/* Polyglot Results */}
                    <div className="p-6 border border-orange-900/50 bg-black/60 backdrop-blur rounded-xl">
                        <h2 className="text-lg font-bold text-orange-400 mb-4">EXECUTION RESULTS</h2>
                        <ul className="space-y-4 font-mono text-sm">
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Rust::Hash</span>
                                <span className="text-white truncate max-w-[150px]">{data.nativeResults.rustHash}</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Zig::Alloc</span>
                                <span className="text-white">{data.nativeResults.zigAllocSize} bytes</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Elixir::Spawn</span>
                                <span className="text-white">{data.nativeResults.elixirPid}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-900/50 rounded-lg text-center text-gray-500 font-mono text-xs">
                    Performance Metric: {data.performance}
                </div>
            </div>
        </div>
    );
}
