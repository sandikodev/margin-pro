
import React from 'react';
import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom';

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
        </div>
    );
}
