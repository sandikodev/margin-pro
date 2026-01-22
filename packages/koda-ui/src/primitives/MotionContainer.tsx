import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils';

/**
 * Koda UI: MotionContainer Primitive 🎬
 * Part of Phase 6: Koda UI Native (The Chassis)
 * Orchestrates consistent entry/exit transitions across the application.
 * Ensures the 'Institutional-Grade' smoothness of the Zenith Synthesis.
 * ทุก detail Zenith tetap aman.
 */

export interface MotionContainerProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    animation?: 'fade' | 'slide-up' | 'scale' | 'none';
    delay?: number;
}

export const MotionContainer = React.forwardRef<HTMLDivElement, MotionContainerProps>(
    ({ className, children, animation = 'slide-up', delay = 0, ...props }, ref) => {
        const animations = {
            fade: {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            },
            'slide-up': {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
            },
            scale: {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.05 },
            },
            none: {}
        };

        const variant = animations[animation] as { initial?: any; animate?: any; exit?: any };

        return (
            <motion.div
                ref={ref}
                initial={variant.initial}
                animate={variant.animate}
                exit={variant.exit}
                transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for "Institutional" feel
                    delay
                }}
                className={cn(className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

MotionContainer.displayName = 'MotionContainer';
