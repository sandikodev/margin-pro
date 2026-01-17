import React, { useState } from 'react';
import { 
  ArrowRight, TrendingUp, ShieldCheck, 
  Store, LogIn 
} from 'lucide-react';

interface DemoTourProps {
  onStartDemo: () => void;
  onBack: () => void;
}

export const DemoTour: React.FC<DemoTourProps> = ({ onStartDemo, onBack }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Selamat Datang, Owner!",
      desc: "Dalam mode demo ini, Anda akan berperan sebagai pemilik 'Fiera Food', sebuah bisnis kuliner yang sedang berkembang.",
      icon: Store,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      content: (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg text-center space-y-4">
           <div className="w-20 h-20 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <Store className="w-10 h-10" />
           </div>
           <div>
              <h4 className="font-black text-slate-900 text-lg">Fiera Food Mangiran</h4>
              <p className="text-xs text-slate-500 font-medium">Status: Pro Merchant</p>
           </div>
           <div className="flex justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="bg-slate-100 px-3 py-1 rounded-full">F&B Offline</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full">2 Cabang</span>
           </div>
        </div>
      )
    },
    {
      title: "Misi Anda: Cek Profit",
      desc: "Produk 'Rice Bowl Blackpepper' Anda laris, tapi apakah untung jika dijual di GoFood dengan potongan 20%?",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      content: (
        <div className="space-y-3">
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">HPP (Modal)</span>
              <span className="text-xs font-black text-slate-900">Rp 12.500</span>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Harga Jual</span>
              <span className="text-xs font-black text-slate-900">Rp 25.000</span>
           </div>
           <div className="flex justify-center py-2">
              <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
           </div>
           <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 shadow-sm text-center">
              <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Potensi Masalah</p>
              <p className="text-sm font-bold text-rose-700">Komisi Aplikasi memakan Rp 6.000!</p>
           </div>
        </div>
      )
    },
    {
      title: "Solusi: Pricing Engine",
      desc: "Gunakan fitur Calculator & Insights untuk menemukan harga jual yang aman agar profit Anda tidak tergerus.",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      content: (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-emerald-400" />
                 <span className="text-sm font-black uppercase tracking-widest">Protection Active</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                 Sistem akan merekomendasikan markup harga otomatis untuk menjaga target profit bersih Anda tetap <b>Rp 6.000/porsi</b> di semua aplikasi.
              </p>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    // Fixed height container (100dvh) ensures it fits mobile screen exactly
    <div className="h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-slate-50 -skew-y-6 transform origin-top-left -translate-y-10 z-0 pointer-events-none"></div>
      
      {/* Header - Fixed at top */}
      <div className="relative z-10 px-6 pt-safe mt-4 pb-4 flex justify-between items-center shrink-0">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">D</div>
            <span className="font-black text-slate-900 tracking-tight">DEMO TOUR</span>
         </div>
         <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1">Keluar</button>
      </div>

      {/* Main Content - Scrollable if content is tall */}
      <div className="flex-1 overflow-y-auto px-6 relative z-10 w-full">
         <div className="max-w-md mx-auto py-4 min-h-full flex flex-col justify-center">
             <div className="mb-8">
                <div className={`w-16 h-16 ${currentStep.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-all duration-500`}>
                   <currentStep.icon className={`w-8 h-8 ${currentStep.color}`} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 leading-tight tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-500 key={step}">
                   {currentStep.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 key={step}-desc">
                   {currentStep.desc}
                </p>
             </div>

             <div className="mb-4 animate-in zoom-in-95 fade-in duration-500 delay-200 key={step}-content">
                {currentStep.content}
             </div>
         </div>
      </div>

      {/* Footer Actions - Sticky at bottom */}
      <div className="p-6 bg-white border-t border-slate-100 relative z-20 pb-safe shrink-0">
         <div className="max-w-md mx-auto w-full space-y-4">
            
            {/* Steps Indicator */}
            <div className="flex justify-center gap-2 mb-2">
                {steps.map((_, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}></div>
                ))}
            </div>

            {step < steps.length - 1 ? (
               <button 
                  onClick={() => setStep(step + 1)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                  Lanjut <ArrowRight className="w-4 h-4" />
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