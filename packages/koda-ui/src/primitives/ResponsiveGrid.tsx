import React from 'react';
import { cn } from '../utils';

/**
 * Koda UI: ResponsiveGrid Primitive 📐
 * Part of Phase 6: Koda UI Native (The Chassis)
 * Provides a standardized responsive layout system for Koda applications.
 * ทุก detail Zenith tetap aman.
 */

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    columns?: '2' | '3' | '4' | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
    ({ className, children, columns = '3', gap = 'md', ...props }, ref) => {
        const colStr = columns.toString();

        const gaps = {
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "grid grid-cols-1",
                    gaps[gap],
                    colStr === '2' && "md:grid-cols-2",
                    colStr === '3' && "md:grid-cols-2 lg:grid-cols-3",
                    colStr === '4' && "md:grid-cols-2 lg:grid-cols-4",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

ResponsiveGrid.displayName = 'ResponsiveGrid';
