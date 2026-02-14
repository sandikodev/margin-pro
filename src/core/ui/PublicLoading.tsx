/**
 * Public Loading Fallback
 * Elegant loading state for public routes
 * Contrasts with the functional FullPageLoader used for app routes
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PublicLoadingProps {
    text?: string;
}

export const PublicLoading: React.FC<PublicLoadingProps> = ({ text = "Memuat..." }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 flex items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"
                />
            </div>

            <motion.div

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 text-center"
            >
                {/* Animated Logo */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-8"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30">
                        <span className="text-white text-2xl font-black">M</span>
                    </div>
                </motion.div>

                {/* Loading Dots */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-indigo-500 rounded-full"
                        />
                    ))}
                </div>

                {/* Loading Text */}
                <p className="text-slate-400 font-medium">{text}</p>
            </motion.div>
        </div>
    );
};
