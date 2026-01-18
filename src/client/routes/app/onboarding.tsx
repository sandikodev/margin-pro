import React, { useState } from 'react';
import { Store, Check, Briefcase, ShoppingBag, Utensils, Coffee, ArrowRight, Loader2 } from 'lucide-react';
import { BusinessProfile } from '@shared/types';

interface OnboardingProps {
  onComplete: (profileData: Partial<BusinessProfile>) => void;
}

export const OnboardingWizard: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<Partial<BusinessProfile>>({
    name: '',
    type: 'fnb_offline',
    initialCapital: 0
  });

  const businessTypes = [
    { id: 'fnb_offline', label: 'Resto / Warung', icon: Utensils, desc: 'Makan di tempat & online' },
    { id: 'fnb_online', label: 'Cloud Kitchen', icon: ShoppingBag, desc: 'Hanya jualan online' },
    { id: 'retail', label: 'Toko Retail', icon: Store, desc: 'Jualan barang / produk' },
    { id: 'coffee', label: 'Coffee Shop', icon: Coffee, desc: 'Minuman & nongkrong' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        onComplete(data);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pt-10 pb-8 px-6 animate-in slide-in-from-right duration-500">
      
      {/* Progress */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex justify-between mb-2">
           <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Langkah {step} dari 3</span>
           <span className="text-[10px] font-bold text-slate-400">{step === 1 ? 'Identitas' : step === 2 ? 'Kategori' : 'Modal'}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
           <div 
             className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
             style={{ width: `${(step / 3) * 100}%` }}
           ></div>
        </div>
      </div>

      <div className="flex-grow flex flex-col max-w-md mx-auto w-full">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                <Store className="w-7 h-7" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Apa nama bisnis Anda?</h2>
                <p className="text-sm text-slate-500">Nama ini akan muncul di laporan dan simulasi profit.</p>
             </div>
             <input 
                autoFocus
                type="text" 
                value={data.name}
                onChange={(e) => setData({...data, name: e.target.value})}
                className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-200 py-2 focus:border-indigo-600 outline-none bg-transparent placeholder-slate-300 transition-all"
                placeholder="Contoh: Kopi Kenangan Mantan"
             />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Jenis usaha apa?</h2>
                <p className="text-sm text-slate-500">Kami akan menyesuaikan parameter perhitungan untuk Anda.</p>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {businessTypes.map((type) => (
                   <button 
                      key={type.id}
                      onClick={() => setData({...data, type: type.id as BusinessProfile['type']})}
                      className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all active:scale-95 ${data.type === type.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                   >
                      <div className={`p-3 rounded-xl ${data.type === type.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                         <type.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className={`font-black text-sm ${data.type === type.id ? 'text-indigo-900' : 'text-slate-800'}`}>{type.label}</h4>
                         <p className="text-[10px] text-slate-500 font-medium">{type.desc}</p>
                      </div>
                      {data.type === type.id && <Check className="w-5 h-5 text-indigo-600 ml-auto" />}
                   </button>
                ))}
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
                <Briefcase className="w-7 h-7" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Estimasi Modal Awal</h2>
                <p className="text-sm text-slate-500">Berapa modal yang disiapkan? (Bisa diubah nanti/kosongkan).</p>
             </div>
             <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">Rp</span>
                <input 
                   type="number" 
                   value={data.initialCapital || ''}
                   onChange={(e) => setData({...data, initialCapital: Number(e.target.value)})}
                   className="w-full pl-10 text-2xl font-black text-slate-900 border-b-2 border-slate-200 py-2 focus:border-emerald-500 outline-none bg-transparent placeholder-slate-300 transition-all"
                   placeholder="0"
                />
             </div>
             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-800 leading-relaxed">
                   💡 Info: Modal awal digunakan untuk menghitung ROI (Return on Investment) dan proyeksi balik modal di dashboard.
                </p>
             </div>
          </div>
        )}
      </div>

      <div className="mt-8 max-w-md mx-auto w-full">
         <button 
            onClick={handleNext}
            disabled={step === 1 && !data.name}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${loading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
         >
            {loading ? (
               <>Menyiapkan Dashboard <Loader2 className="w-4 h-4 animate-spin" /></>
            ) : (
               <>
                  {step === 3 ? 'Selesai & Masuk' : 'Lanjut'} 
                  <ArrowRight className="w-4 h-4" />
               </>
            )}
         </button>
      </div>

    </div>
  );
};