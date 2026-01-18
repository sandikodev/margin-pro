import React from 'react';
import { TrendingUp, ShieldCheck, Zap, ArrowRight, Star, Activity, HelpCircle, Instagram, Twitter, Linkedin, Mail, Eye } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemo: () => void; // New Prop
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onDemo }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">MARGINS</span>
          </div>
          <button 
            onClick={onLogin}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Masuk Akun
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-md mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
            <Zap className="w-3 h-3 fill-indigo-300" />
            #1 Pricing Engine for F&B
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Stop Jualan <br/>
            <span className="text-indigo-500">Tanpa Profit.</span>
          </h1>
          
          <p className="text-sm text-slate-400 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Platform intelijen harga untuk merchant GoFood, GrabFood & ShopeeFood. Hitung HPP akurat, simulasi komisi, dan kunci profit bersih Anda.
          </p>

          <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 flex flex-col gap-3">
            <button 
              onClick={onGetStarted}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Mulai Gratis <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onDemo}
              className="w-full py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Eye className="w-4 h-4" /> Lihat Demo
            </button>
            <p className="text-[10px] text-slate-500 mt-2 font-bold">Tanpa Kartu Kredit • Setup dalam 30 Detik</p>
          </div>
        </div>

        {/* Hero Visual Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-0 pointer-events-none"></div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-center">
           <div>
              <p className="text-2xl font-black text-white">10k+</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Merchant</p>
           </div>
           <div className="w-px h-8 bg-white/10"></div>
           <div>
              <p className="text-2xl font-black text-white">Rp 5M+</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Profit Saved</p>
           </div>
           <div className="w-px h-8 bg-white/10"></div>
           <div>
              <p className="text-2xl font-black text-white">4.9</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-center">
                 <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Rating
              </p>
           </div>
        </div>
      </section>

      {/* PAIN POINTS SECTION (New Enrichment) */}
      <section className="py-20 px-6">
         <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
               <h3 className="text-3xl font-black text-white">Kenapa Mitra Sering Boncos?</h3>
               <p className="text-sm text-slate-400 max-w-xl mx-auto">Potongan aplikasi delivery (20-30%) ditambah biaya layanan seringkali memakan profit margin jika salah menetapkan harga.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 rounded-[2rem] bg-rose-950/20 border border-rose-500/20 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-black text-xl">1</div>
                  <h4 className="text-lg font-bold text-rose-200">Salah Hitung HPP</h4>
                  <p className="text-xs text-rose-200/60 leading-relaxed">Lupa memasukkan biaya kemasan, gas, dan penyusutan alat ke modal dasar.</p>
               </div>
               <div className="p-6 rounded-[2rem] bg-rose-950/20 border border-rose-500/20 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-black text-xl">2</div>
                  <h4 className="text-lg font-bold text-rose-200">Terjebak Diskon</h4>
                  <p className="text-xs text-rose-200/60 leading-relaxed">Ikut campaign promo besar-besaran tapi lupa markup harga jual terlebih dahulu.</p>
               </div>
               <div className="p-6 rounded-[2rem] bg-rose-950/20 border border-rose-500/20 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-black text-xl">3</div>
                  <h4 className="text-lg font-bold text-rose-200">Fee Terselubung</h4>
                  <p className="text-xs text-rose-200/60 leading-relaxed">Tidak sadar adanya biaya layanan, pajak 11%, dan biaya withdraw saldo.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-6 bg-slate-900/50">
         <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-2 max-w-sm">
               <h3 className="text-2xl font-black text-white">Solusi Cerdas & Praktis</h3>
               <p className="text-xs text-slate-400">Teknologi enterprise yang disederhanakan untuk warung makan & resto.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
               <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                     <TrendingUp className="w-24 h-24 text-indigo-500 rotate-12" />
                  </div>
                  <div className="relative z-10 space-y-3">
                     <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <TrendingUp className="w-6 h-6 text-indigo-400" />
                     </div>
                     <h4 className="text-lg font-black">Profit Simulator</h4>
                     <p className="text-xs text-slate-400 leading-relaxed">Lihat potensi cuan bersih di GoFood, Grab, & ShopeeFood sebelum Anda posting menu.</p>
                  </div>
               </div>

               <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                     <ShieldCheck className="w-24 h-24 text-emerald-500 rotate-12" />
                  </div>
                  <div className="relative z-10 space-y-3">
                     <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                     </div>
                     <h4 className="text-lg font-black">Anti-Boncos Shield</h4>
                     <p className="text-xs text-slate-400 leading-relaxed">Sistem otomatis mendeteksi jika harga jual Anda terlalu rendah untuk menutup biaya komisi.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ SECTION (New Enrichment) */}
      <section className="py-20 px-6">
         <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-2xl font-black text-center mb-8">Pertanyaan Umum (FAQ)</h3>
            
            <div className="space-y-4">
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Apakah aplikasi ini gratis?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Ya! Fitur dasar kalkulator HPP dan simulasi harga tersedia gratis untuk UMKM. Kami memiliki fitur premium untuk manajemen multi-cabang.</p>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Apakah data saya aman?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Sangat aman. Data perhitungan tersimpan lokal di perangkat Anda (untuk versi gratis) dan terenkripsi untuk versi akun cloud.</p>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Bisa untuk retail non-makanan?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Bisa! Margins Pro juga mendukung perhitungan untuk toko baju, craft, dan jasa. Cukup pilih kategori saat onboarding.</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-slate-950 to-indigo-950 relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6">Siap Cuan Lebih Banyak?</h2>
            <button 
                onClick={onGetStarted}
                className="w-full max-w-sm mx-auto py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all"
            >
                Gabung Sekarang
            </button>
         </div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </section>

      {/* Footer (New Enrichment) */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950 text-slate-500">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
               <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <span className="font-black text-white tracking-tight">MARGINS PRO</span>
               </div>
               <p className="text-[10px] font-medium">© 2025 PT Koneksi Jaringan Indonesia.</p>
               <div className="flex gap-4 mt-2">
                  <a href="/legal/terms" className="text-[10px] hover:text-white transition-colors">Terms</a>
                  <a href="/legal/privacy" className="text-[10px] hover:text-white transition-colors">Privacy</a>
               </div>
            </div>
            
            <div className="flex gap-6">
               <a href="#" className="hover:text-indigo-400 transition-colors"><Instagram className="w-5 h-5" /></a>
               <a href="#" className="hover:text-indigo-400 transition-colors"><Twitter className="w-5 h-5" /></a>
               <a href="#" className="hover:text-indigo-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
               <a href="mailto:support@konxc.space" className="hover:text-indigo-400 transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
         </div>
      </footer>
    </div>
  );
};