import React, { useEffect } from 'react';

/**
 * 🎨 Zenith DX Demo: Public Error Page
 * Triggers a 404/500 style error for public view.
 */
export default function PublicErrorDemo() {
    useEffect(() => {
        // Intentionally throw a generic error to trigger PublicErrorPage in root +error.tsx
        throw new Error("DEMO_SYSTEM_FAULT: Simulasi kerusakan terpantau pada Kernel Zenith. Ini adalah tampilan PublicErrorPage.");
    }, []);

    return (
        <div className="p-20 text-center">
            <h1 className="text-2xl font-bold">Initiating Public Error...</h1>
        </div>
    );
}
