import React from 'react';
import { cn } from '../utils';

/**
 * Koda UI: ZenithStage Primitive 🛰️
 * The ultimate container for Koda applications.
 * Provides the "Zenith" aesthetic (Glassmorphism, deep shadows, institutional spacing).
 */
export interface ZenithStageProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const ZenithStage: React.FC<ZenithStageProps> = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                "min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30",
                "bg-[radial-gradient(circle_at_top_right,#1e1b4b_0%,transparent_40%),radial-gradient(circle_at_bottom_left,#064e3b_0%,transparent_30%)]",
                "font-sans antialiased p-6 lg:p-12",
                className
            )}
            {...props}
        >
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                {children}
            </div>
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
};
