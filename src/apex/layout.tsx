
import React, { useEffect } from 'react';
import { Outlet, ScrollRestoration, useNavigation, useMatches, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Terminal, Bug, RefreshCw, Home, AlertCircle } from 'lucide-react';

// Enhanced Meta Handler for SEO
function MetaHandler() {
    const matches = useMatches();
    useEffect(() => {
        // Find the deepest meta tag from the route tree
        const metaMatch = [...matches].reverse().find((m) => m.handle && (m.handle as any).meta);

        if (metaMatch && metaMatch.handle) {
            const metaFn = (metaMatch.handle as any).meta;
            const meta = typeof metaFn === 'function' ? metaFn() : (metaFn || {});

            // 1. Title
            if (meta.title) {
                document.title = meta.title.includes('Margin Pro')
                    ? meta.title
                    : `${meta.title} | Margin Pro`;
            }

            // 2. Description
            if (meta.description) {
                let descTag = document.querySelector('meta[name="description"]');
                if (!descTag) {
                    descTag = document.createElement('meta');
                    descTag.setAttribute('name', 'description');
                    document.head.appendChild(descTag);
                }
                descTag.setAttribute('content', meta.description);
            }

            // 3. Theme Color (Optional dynamic theme)
            if (meta.themeColor) {
                let themeTag = document.querySelector('meta[name="theme-color"]');
                if (!themeTag) {
                    themeTag = document.createElement('meta');
                    themeTag.setAttribute('name', 'theme-color');
                    document.head.appendChild(themeTag);
                }
                themeTag.setAttribute('content', meta.themeColor);
            }
        }
    }, [matches]);
    return null;
}

export default function ApexRootLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    return (
        <div className="koda-zenith-app font-sans antialiased text-slate-900 dark:text-slate-100 bg-black min-h-screen selection:bg-indigo-500/30">
            {/* Global Smooth Progress Bar */}
            <div
                className={`fixed top-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[100] transition-all duration-700 ease-in-out ${isLoading ? 'w-[70%] opacity-100' : 'w-full opacity-0'}`}
            />

            <main className="relative z-0">
                <Outlet />
            </main>

            {/* Koda Zenith Status (Dev Only) */}
            {import.meta.env.DEV && (
                <div className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md text-[10px] text-slate-400 rounded-full border border-white/10 font-mono pointer-events-none z-50 tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ZENITH_APEX_ACTIVE
                </div>
            )}

            <ScrollRestoration />
            <MetaHandler />
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    const isDev = import.meta.env.DEV;

    console.error("[Apex Runtime Error]:", error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#02040a] text-white p-6 font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-red-500/10">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-3">
                        Kernel <span className="text-red-500">Panic</span>
                    </h1>
                    <p className="text-slate-400 font-medium">
                        The application encountered an unexpected runtime exception.
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl mb-8">
                    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Terminal className="w-3 h-3 text-red-400" /> Error_Dump_v1.0
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                        </div>
                    </div>
                    <div className="p-8 font-mono text-sm">
                        <p className="text-red-400 mb-4 font-bold">
                            {isRouteErrorResponse(error)
                                ? `HTTP_${error.status}: ${error.statusText}`
                                : (error instanceof Error ? error.name : "UNKNOWN_EXCEPTION")
                            }
                        </p>
                        <code className="block text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5 break-words">
                            {isRouteErrorResponse(error)
                                ? "Route not found or unauthorized access."
                                : (error instanceof Error ? error.message : String(error))}
                        </code>

                        {isDev && error instanceof Error && error.stack && (
                            <div className="mt-6">
                                <p className="text-[10px] text-slate-500 mb-2 uppercase font-black uppercase tracking-widest">Stack Trace</p>
                                <pre className="text-[10px] text-slate-500 leading-relaxed overflow-x-auto p-4 bg-black/20 rounded-lg max-h-40">
                                    {error.stack}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl transition-all active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Home className="w-4 h-4" /> Return_Home
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <RefreshCw className="w-4 h-4 border-red-500" /> Retry_Session
                    </button>
                </div>

                {isDev && (
                    <p className="mt-10 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                        Zenith Debug Mode Active
                    </p>
                )}
            </div>
        </div>
    );
}
