
import React, { useEffect } from 'react';
import { Outlet, ScrollRestoration, useNavigation, useMatches, useRouteError, isRouteErrorResponse } from 'react-router-dom';


// Minimal Meta Handler (Update Document Title)
function MetaHandler() {
    const matches = useMatches();
    useEffect(() => {
        // Find deepest match with meta handle
        const metaMatch = [...matches].reverse().find((m) => m.handle && (m.handle as any).meta);
        if (metaMatch && metaMatch.handle) {
            const metaFn = (metaMatch.handle as any).meta;
            const tags = typeof metaFn === 'function' ? metaFn() : [];

            tags.forEach((tag: any) => {
                if (tag.title) document.title = tag.title;
                // Note: For full meta tag support (description, og:image), 
                // we would need a more robust head manager or react-helmet-async here.
            });
        }
    }, [matches]);
    return null;
}


export default function ApexRootLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    return (
        <div className="koda-zenith-app font-sans antialiased text-slate-900 dark:text-slate-100 bg-black min-h-screen selection:bg-indigo-500/30">
            {/* Global Loading Bar */}
            <div
                className={`fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all duration-300 ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
            />

            {/* Persistent Layout Elements (Header/Sidebar could be here) */}

            <main className="relative z-0">
                <Outlet />
            </main>

            {/* Koda Zenith Debug Indicator (Dev Only) */}
            {import.meta.env.DEV && (
                <div className="fixed bottom-2 right-2 px-2 py-1 bg-black/80 text-[9px] text-slate-500 rounded border border-white/5 font-mono pointer-events-none z-50">
                    Apex Layout Active
                </div>
            )}

            <ScrollRestoration />
            <MetaHandler />
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    console.error("Apex Route Error:", error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 font-mono">
            <div className="max-w-md text-center border border-red-500/30 bg-red-950/20 p-8 rounded-xl backdrop-blur-sm">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-2 text-red-500">System Malfunction</h1>
                <p className="text-slate-400 mb-6 text-sm">
                    {isRouteErrorResponse(error)
                        ? `${error.status} ${error.statusText}`
                        : (error instanceof Error ? error.message : "Unknown Anomaly Detected")
                    }
                </p>
                <div className="flex gap-4 justify-center">
                    <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-xs uppercase tracking-wider transition-colors">
                        Reboot System
                    </a>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 text-red-400 text-xs uppercase tracking-wider transition-colors">
                        Try Reload
                    </button>
                </div>
            </div>
        </div>
    );
}
