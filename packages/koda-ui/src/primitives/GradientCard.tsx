import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils';

/**
 * Koda UI: GradientCard Primitive 💎
 * Part of Phase 6: Koda UI Native (The Chassis)
 * Provides high-fidelity, premium visual containers for key highlights.
 * ทุก detail Zenith tetap aman.
 */

export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent';
}

export const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
    ({ className, children, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: "from-violet-600 to-indigo-600",
            secondary: "from-pink-500 to-rose-500",
            accent: "from-cyan-500 to-blue-500"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "bg-gradient-to-r rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all",
                    variants[variant],
                    className
                )}
                {...props}
            >
                <Sparkles className="absolute top-0 right-0 w-24 h-24 text-white/5 pointer-events-none" />
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </div>
        );
    }
);

GradientCard.displayName = 'GradientCard';
