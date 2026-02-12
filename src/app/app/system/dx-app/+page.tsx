import React, { useEffect } from 'react';

/**
 * 🎨 Zenith DX Demo: App Kernel Panic
 * Triggers a "Kernel Panic" crash within the DashboardShell.
 */
export default function AppErrorDemo() {
    useEffect(() => {
        // Intentionally throw a type error or similar to trigger AppErrorPage in /app/+error.tsx
        const crashHost = (undefined as any);
        console.log(crashHost.triggerPanic());
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-red-500 rounded-full animate-ping mx-auto" />
                <h1 className="text-xl font-black text-slate-800 uppercase tracking-widest">Inisiasi Kernel Panic...</h1>
            </div>
        </div>
    );
}
