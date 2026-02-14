
import React, { useState } from 'react';
import {
   ArrowRight, TrendingUp, ShieldCheck,
   Store, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_VALUES } from '@/constants/pricing';
import { formatIDR } from '@/utils/currency';

interface DemoTourProps {
   onStartDemo: () => void;
   onBack: () => void;
}

export const DemoTour: React.FC<DemoTourProps> = ({ onStartDemo, onBack }) => {
   const [step, setStep] = useState(0);

   const steps = [
      {
         title: "Selamat Datang, Owner!",
         desc: "Dalam mode demo ini, Anda akan berperan sebagai pemilik 'Lumina Bistro', sebuah bisnis kuliner yang sedang berkembang.",
         icon: Store,
         color: "text-indigo-400",
         bg: "bg-indigo-500/10",
         border: "border-indigo-500/20",
         shadow: "shadow-indigo-500/20",
         content: (
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg text-center space-y-4">
               <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                  <Store className="w-10 h-10" />
               </div>
               <div>
                  <h4 className="font-black text-white text-lg">Lumina Bistro</h4>
                  <p className="text-xs text-indigo-300 font-medium tracking-wide">STATUS: PRO MERCHANT</p>
               </div>
               <div className="flex justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full">F&B Offline</span>
                  <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full">2 Cabang</span>
               </div>
            </div>
         )
      },
      {
         title: "Misi Anda: Cek Profit",
         desc: "Produk 'Rice Bowl Blackpepper' Anda laris, tapi apakah untung jika dijual di GoFood dengan potongan 20%?",
         icon: TrendingUp,
         color: "text-emerald-400",
         bg: "bg-emerald-500/10",
         border: "border-emerald-500/20",
         shadow: "shadow-emerald-500/20",
         content: (
            <div className="space-y-3">
               <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">HPP (Modal)</span>
                  <span className="text-sm font-black text-white">{formatIDR(DEMO_VALUES.SAMPLE_COST)}</span>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Jual</span>
                  <span className="text-sm font-black text-white">{formatIDR(DEMO_VALUES.SAMPLE_SELLING_PRICE)}</span>
               </div>
               <div className="flex justify-center py-2">
                  <ArrowRight className="w-5 h-5 text-slate-500 rotate-90" />
               </div>
               <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 shadow-sm text-center">
                  <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Potensi Masalah</p>
                  <p className="text-sm font-bold text-rose-200">Komisi Aplikasi memakan {formatIDR(DEMO_VALUES.PLATFORM_COMMISSION)}!</p>
               </div>
            </div>
         )
      },
      {
         title: "Solusi: Pricing Engine",
         desc: "Gunakan fitur Calculator & Insights untuk menemukan harga jual yang aman agar profit Anda tidak tergerus.",
         icon: ShieldCheck,
         color: "text-indigo-400",
         bg: "bg-indigo-500/10",
         border: "border-indigo-500/20",
         shadow: "shadow-indigo-500/20",
         content: (
            <div className="bg-slate-900 border border-white/10 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-6 h-6 text-emerald-400" />
                     <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Protection Active</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                     Sistem akan merekomendasikan markup harga otomatis untuk menjaga target profit bersih Anda tetap <b className="text-white">{formatIDR(DEMO_VALUES.TARGET_PROFIT)}/porsi</b> di semua aplikasi.
                  </p>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
            </div>
         )
      }
   ];

   const currentStep = steps[step];

   return (
      // Fixed height container (100dvh) ensures it fits mobile screen exactly
      <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden font-sans text-slate-200 selection:bg-indigo-500/30 selection:text-white">
         {/* Background Decor */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
         </div>

         {/* Header - Fixed at top */}
         <div className="relative z-10 px-6 pt-safe mt-4 pb-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">D</div>
               <span className="font-black text-white tracking-tight">DEMO TOUR</span>
            </div>
            <button onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5">Keluar</button>
         </div>

         {/* Main Content - Scrollable if content is tall */}
         <div className="flex-1 overflow-y-auto px-6 relative z-10 w-full">
            <div className="max-w-md mx-auto py-4 min-h-full flex flex-col justify-center">
               <AnimatePresence mode='wait'>
                  <motion.div
                     key={step}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.4 }}
                     className="mb-8"
                  >
                     <div className={`w-16 h-16 ${currentStep.bg} ${currentStep.border} border rounded-2xl flex items-center justify-center mb-6 shadow-lg ${currentStep.shadow}`}>
                        <currentStep.icon className={`w-8 h-8 ${currentStep.color}`} />
                     </div>
                     <h2 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight">
                        {currentStep.title}
                     </h2>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {currentStep.desc}
                     </p>
                  </motion.div>
               </AnimatePresence>

               <AnimatePresence mode='wait'>
                  <motion.div
                     key={`content-${step}`}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4, delay: 0.1 }}
                     className="mb-4"
                  >
                     {currentStep.content}
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>

         {/* Footer Actions - Sticky at bottom */}
         <div className="px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-slate-950/80 backdrop-blur-xl border-t border-white/5 relative z-20 shrink-0">
            <div className="max-w-md mx-auto w-full space-y-4">

               {/* Steps Indicator */}
               <div className="flex justify-center gap-2 mb-2">
                  {steps.map((_, i) => (
                     <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-2 bg-slate-800'}`}></div>
                  ))}
               </div>

               {step < steps.length - 1 ? (
                  <button
                     onClick={() => setStep(step + 1)}
                     className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                  >
                     Lanjut <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               ) : (
                  <button
                     onClick={onStartDemo}
                     className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 active:scale-95 animate-pulse"
                  >
                     <LogIn className="w-4 h-4" /> Lanjut ke Login Demo
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};