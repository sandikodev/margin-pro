import React, { useState } from 'react';
import { 
  Zap, Check, CreditCard, Landmark, 
  Smartphone, Wallet, Coins, 
  TrendingUp, ArrowRight, ShieldAlert, 
  Award, Crown, Flame, Info, CheckCircle2,
  Sparkles, ShieldCheck
} from 'lucide-react';

interface TopUpViewProps {
  formatValue: (val: number) => string;
  topUpCredits: (amount: number) => void;
  onBack: () => void;
  onHistoryClick?: () => void; // New Prop
}

const PACKAGES = [
  { 
    id: 'starter', 
    name: 'Starter Kit', 
    credits: 100, 
    price: 50000, 
    description: 'Cukup untuk validasi ide menu baru.',
    features: ['Akses Simulator Dasar', 'Export PDF Standard'],
    popular: false,
    icon: Zap,
    color: 'slate',
    accent: 'bg-slate-100 text-slate-600'
  },
  { 
    id: 'pro', 
    name: 'Merchant Pro', 
    credits: 500, 
    price: 200000, 
    description: 'Paling hemat untuk operasional rutin.',
    features: ['Hemat 20%', 'Prioritas Support', 'Akses Fitur AI'],
    popular: true,
    icon: Flame,
    color: 'indigo',
    accent: 'bg-indigo-600 text-white'
  },
  { 
    id: 'enterprise', 
    name: 'Global Elite', 
    credits: 2000, 
    price: 750000, 
    description: 'Skala penuh franchise & ekspor.',
    features: ['Hemat 25%', 'Akses API', 'Konsultasi Menu'],
    popular: false,
    icon: Crown,
    color: 'violet',
    accent: 'bg-violet-100 text-violet-600'
  },
];

const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS', icon: Smartphone, desc: 'Scan & Go' },
  { id: 'va', label: 'Virtual Account', icon: Landmark, desc: 'Auto Check' },
  { id: 'ewallet', label: 'E-Wallet', icon: Wallet, desc: 'GoPay/OVO' }
];

export const TopUpView: React.FC<TopUpViewProps> = ({ formatValue, topUpCredits, onBack, onHistoryClick }) => {
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1]); // Default to Pro
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'ewallet'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      topUpCredits(selectedPackage.credits);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in duration-500 max-w-lg mx-auto px-6">
         <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
            <div className="relative w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-emerald-50">
                <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
               <Award className="w-3 h-3" /> Paid
            </div>
         </div>
         
         <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Pembayaran Berhasil!</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
               Saldo <span className="font-black text-indigo-600">+{selectedPackage.credits} Credits</span> telah ditambahkan ke dompet Anda. Selamat berkarya!
            </p>
         </div>

         <div className="w-full pt-8">
            <button 
              onClick={onBack}
              className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
               Kembali ke Profil <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-40 max-w-xl mx-auto">
      
      {/* 1. HEADER & CURRENT BALANCE */}
      <div className="px-2 pt-2">
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10 flex justify-between items-end">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                        <Wallet className="w-5 h-5 text-indigo-300" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200/80">Active Balance</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <p className="text-5xl font-black tracking-tighter">250</p>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Credits</p>
                  </div>
               </div>
               <button 
                 onClick={onHistoryClick}
                 className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/5"
               >
                  History
               </button>
            </div>
            
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/30 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-500/40 transition-colors duration-1000"></div>
            <Coins className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12 pointer-events-none" />
         </div>
      </div>

      {/* 2. PACKAGE SELECTION */}
      <div className="space-y-5 px-2">
         <div className="flex items-center justify-between px-2">
            <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-indigo-500" /> Pilih Paket Top-Up
            </h5>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {PACKAGES.map((pkg) => {
               const isSelected = selectedPackage.id === pkg.id;
               return (
                  <div 
                     key={pkg.id}
                     onClick={() => setSelectedPackage(pkg)}
                     className={`relative p-1 rounded-[2.2rem] transition-all duration-300 cursor-pointer active:scale-[0.98] group
                     ${isSelected ? 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-xl shadow-indigo-200' : 'bg-white hover:bg-slate-50'}`}
                  >
                     <div className={`h-full bg-white rounded-[2rem] p-6 border-2 relative overflow-hidden
                        ${isSelected ? 'border-transparent' : 'border-slate-100'}`}
                     >
                        {pkg.popular && (
                           <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-widest flex items-center gap-1 shadow-sm z-10">
                              <TrendingUp className="w-3 h-3" /> Best Value
                           </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? pkg.accent : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-md'}`}>
                                 <pkg.icon className="w-7 h-7" />
                              </div>
                              <div>
                                 <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{pkg.name}</h4>
                                 <p className="text-[10px] text-slate-400 font-medium mt-0.5">{pkg.description}</p>
                              </div>
                           </div>
                           <div className="text-right pt-1">
                              <p className={`text-lg font-black ${isSelected ? 'text-indigo-600' : 'text-slate-800'}`}>
                                 {formatValue(pkg.price).split(',')[0]}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                           <div className="flex items-center gap-3">
                              {pkg.features.slice(0, 2).map((feat, i) => (
                                 <span key={i} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-500" /> {feat}
                                 </span>
                              ))}
                           </div>
                           <div className="flex items-center gap-1">
                              <span className="text-2xl font-black text-slate-900">+{pkg.credits}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pts</span>
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* 3. PAYMENT & CHECKOUT */}
      <div className="px-2 pt-2">
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-lg space-y-6">
            
            {/* Method Selector */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Metode Pembayaran</label>
               <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(method => (
                     <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all
                        ${paymentMethod === method.id 
                           ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                           : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                     >
                        <method.icon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-tight">{method.label}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Summary & Action */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
               <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Harga Paket</span>
                  <span>{formatValue(selectedPackage.price)}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Biaya Layanan</span>
                  <span>Rp 0</span>
               </div>
               <div className="h-px bg-slate-200 my-2"></div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Total Bayar</span>
                  <span className="text-xl font-black text-indigo-600">{formatValue(selectedPackage.price)}</span>
               </div>
            </div>

            <div className="space-y-3">
               <button 
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95
                  ${isProcessing ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-600/30'}`}
               >
                  {isProcessing ? (
                     <>Memproses...</>
                  ) : (
                     <>
                        <ShieldCheck className="w-4 h-4" /> Bayar Sekarang
                     </>
                  )}
               </button>
               <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldAlert className="w-3 h-3" /> Transaksi Aman & Terenkripsi
               </div>
            </div>

         </div>
      </div>

      {/* 4. INFO FOOTER */}
      <div className="px-4 pb-4">
         <div className="flex items-start gap-3 opacity-60">
            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               Credits yang dibeli tidak memiliki masa berlaku (lifetime validity). Jika mengalami kendala pembayaran, silakan hubungi tim support melalui menu Profil.
            </p>
         </div>
      </div>

    </div>
  );
};