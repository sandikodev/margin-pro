import React from 'react';
import { cn } from '../utils';

/**
 * Koda UI: BentoCard Primitive 🍱
 * Part of Phase 6: Koda UI Native (The Chassis)
 * Provides institutional-grade layout stability for dashboard widgets.
 * ทุก detail Zenith tetap aman.
 */

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
    ({ className, children, noPadding = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden",
                    !noPadding && "p-7",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

BentoCard.displayName = 'BentoCard';
