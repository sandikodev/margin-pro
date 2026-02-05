import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Play, BarChart2 } from 'lucide-react';

interface DemoTourProps {
    onStartDemo: () => void;
    onBack: () => void;
}

const STEPS = [
    {
        title: "Welcome to Margins Pro",
        description: "Your all-in-one command center for F&B profitability.",
        icon: <Play className="w-12 h-12 text-indigo-400" />,
        color: "bg-indigo-500/20"
    },
    {
        title: "Track Live Metrics",
        description: "Monitor sales, COGS, and labor costs in real-time.",
        icon: <BarChart2 className="w-12 h-12 text-emerald-400" />,
        color: "bg-emerald-500/20"
    },
    {
        title: "Ready to Explore?",
        description: "Jump into the simulator with a pre-populated dataset.",
        icon: <Check className="w-12 h-12 text-amber-400" />,
        color: "bg-amber-500/20"
    }
];

export const DemoTour: React.FC<DemoTourProps> = ({ onStartDemo, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            onStartDemo();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
            {/* Ambient BG */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-lg relative z-10">
                <button onClick={onBack} className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Cancel Demo
                </button>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-4 ${STEPS[currentStep].color}`}>
                                {STEPS[currentStep].icon}
                            </div>

                            <h2 className="text-3xl font-black tracking-tight">{STEPS[currentStep].title}</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">{STEPS[currentStep].description}</p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-12">
                        <div className="flex gap-2">
                            {STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-white' : 'w-2 bg-slate-800'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors"
                        >
                            {currentStep === STEPS.length - 1 ? 'Launch' : 'Next'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
