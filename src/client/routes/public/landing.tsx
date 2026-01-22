import React from 'react';
import { TrendingUp, ShieldCheck, ArrowRight, Star, Activity, HelpCircle, Instagram, Linkedin, Mail, Eye, Menu, X, BookOpen, CreditCard, Globe } from 'lucide-react';
import { EXTERNAL_LINKS, COMPANY } from '@shared/constants';
import { BentoCard } from '@/components/ui/design-system/BentoCard';
import { GradientCard } from '@/components/ui/design-system/GradientCard';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
   onGetStarted: () => void;
   onLogin: () => void;
   onDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onDemo }) => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
   const [isScrolled, setIsScrolled] = React.useState(false);
   const [roiRevenue, setRoiRevenue] = React.useState(15000000); // 15jt default

   const [floatingIcons, setFloatingIcons] = React.useState<{ id: number, x: string, duration: number, size: number, delay: number }[]>([]);

   React.useEffect(() => {
      setFloatingIcons([...Array(5)].map((_, i) => ({
         id: i,
         x: Math.random() * 100 + 'vw',
         duration: 10 + Math.random() * 10,
         size: 24 + Math.random() * 20,
         delay: i * 2
      })));
   }, []);

   React.useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const savedProfit = Math.round(roiRevenue * 0.08); // Estimate 8% leakage saved

   const platforms = [
      { name: 'GoFood', color: 'bg-emerald-500' },
      { name: 'GrabFood', color: 'bg-green-600' },
      { name: 'ShopeeFood', color: 'bg-orange-600' },
      { name: 'Tokopedia', color: 'bg-green-500' },
      { name: 'TikTok Shop', color: 'bg-slate-900' },
      { name: 'Lazada', color: 'bg-blue-600' },
   ];

   return (
      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans selection:bg-indigo-500/30">
         {/* Aurora Background Effects */}
         <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
         </div>

         {/* Navbar */}
         <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-0 shadow-2xl shadow-indigo-500/5' : 'bg-transparent border-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
               <div className="flex-1 flex items-center justify-start gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
                  <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                     <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-black text-xl tracking-tight hidden md:block uppercase">Margin<span className="text-indigo-400">Pro</span></span>
               </div>

               {/* Desktop Nav */}
               {/* Desktop Nav */}
               <div className="hidden md:flex items-center justify-center gap-10">
                  <a href="#features" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Features</a>
                  <a href="/pricing" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Pricing</a>
                  <a href="/blog" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Resources</a>
                  <a href="/demo" className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group">
                     Live Demo <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-black uppercase group-hover:bg-indigo-500 group-hover:text-white transition-colors">New</span>
                  </a>
               </div>

               <div className="hidden md:flex flex-1 items-center justify-end min-w-[240px] gap-4">
                  <button
                     onClick={onLogin}
                     className={`text-sm font-bold transition-all duration-500 w-24 h-10 flex items-center justify-center rounded-xl ${isScrolled ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'}`}
                  >
                     Log In
                  </button>
                  <button
                     onClick={onGetStarted}
                     className={`w-[140px] whitespace-nowrap bg-white text-slate-950 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg shadow-white/5 hover:-translate-y-0.5 ${isScrolled ? 'block' : 'hidden'}`}
                  >
                     Start for Free
                  </button>
               </div>

               {/* Mobile Menu Toggle */}
               <button
                  className="md:hidden text-slate-300 p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               >
                  {isMobileMenuOpen ? <X /> : <Menu />}
               </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
               {isMobileMenuOpen && (
                  <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="md:hidden absolute top-16 left-0 w-full bg-slate-950 border-b border-white/5 p-6 flex flex-col gap-6"
                  >
                     <div className="flex flex-col gap-4">
                        <a href="#features" className="text-lg font-bold text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Fitur</a>
                        <a href="/pricing" className="text-lg font-bold text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Harga</a>
                        <a href="/blog" className="text-lg font-bold text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
                        <a href="/demo" className="text-lg font-bold text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Lihat Demo</a>
                     </div>
                     <div className="h-px bg-white/10"></div>
                     <div className="flex flex-col gap-3">
                        <button onClick={onLogin} className="w-full py-4 rounded-xl border border-white/10 text-white font-bold">Masuk Akun</button>
                        <button onClick={onGetStarted} className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold">Daftar Gratis</button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </nav>

         {/* Hero Section */}
         <section className="pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest"
               >
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  #1 Pricing Intelligence for Merchants
               </motion.div>

               <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-6xl lg:text-[100px] font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent"
               >
                  Stop Selling <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_100%] animate-gradient-x">Without Profit.</span>
               </motion.h1>

               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto"
               >
                  Platform intelijen harga otomatis untuk mitra GoFood, GrabFood & ShopeeFood. Hentikan kebocoran margin dan kunci profit bersih di setiap transaksi.
               </motion.p>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
               >
                  <button
                     onClick={onGetStarted}
                     className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] hover:scale-[1.05] hover:shadow-[0_0_70px_-10px_rgba(255,255,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                     Get Started Free <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                     onClick={onDemo}
                     className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-3 hover:border-white/20"
                  >
                     <Eye className="w-4 h-4 text-indigo-400" /> Watch Demo
                  </button>
               </motion.div>
            </div>

            {/* Floating Icons Animation (Playful element) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {floatingIcons.map((icon) => (
                  <motion.div
                     key={icon.id}
                     className="absolute text-indigo-500/20"
                     initial={{ y: '100vh', x: icon.x }}
                     animate={{
                        y: '-20vh',
                        rotate: 360
                     }}
                     transition={{
                        duration: icon.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: icon.delay
                     }}
                  >
                     <Star size={icon.size} fill="currentColor" />
                  </motion.div>
               ))}
            </div>
         </section>

         {/* Platform Marquee - Infintie Scroll */}
         <section className="py-12 bg-white/[0.02] border-y border-white/5 relative overflow-hidden group">
            <div className="flex w-fit animate-infinite-scroll group-hover:pause gap-12 px-6">
               {[...platforms, ...platforms].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 opacity-30 group-hover:opacity-70 transition-opacity">
                     <div className={`w-3 h-3 rounded-full ${p.color}`} />
                     <span className="font-black text-sm uppercase tracking-[0.2em] whitespace-nowrap">{p.name}</span>
                  </div>
               ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
         </section>

         {/* Interactive ROI Slider (Playful & Informative) */}
         <section className="py-32 px-6 relative">
            <div className="max-w-5xl mx-auto">
               <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 lg:p-20 relative overflow-hidden group">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-colors"></div>

                  <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                     <div className="space-y-8">
                        <div className="space-y-4">
                           <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">
                              Berapa Cuan yang Bisa <br />
                              <span className="text-indigo-400">Kami Selamatkan?</span>
                           </h3>
                           <p className="text-slate-400 text-lg font-medium">Banyak mitra tidak sadar kehilangan 5-10% profit karena salah hitung komisi & promo aplikasi.</p>
                        </div>

                        <div className="space-y-6">
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Omset Bulanan Anda</span>
                              <span className="text-3xl font-black text-white">Rp {roiRevenue.toLocaleString('id-ID')}</span>
                           </div>
                           <input
                              type="range"
                              min="5000000"
                              max="250000000"
                              step="1000000"
                              value={roiRevenue}
                              onChange={(e) => setRoiRevenue(parseInt(e.target.value))}
                              className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                           />
                           <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              <span>5 Juta</span>
                              <span>250 Juta</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-indigo-600 rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl shadow-indigo-500/20 flex flex-col items-center text-center space-y-6 transform lg:rotate-2 group-hover:rotate-0 transition-transform">
                        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                           <TrendingUp className="w-10 h-10 text-white" />
                        </div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Estimasi Kebocoran Tercegah</p>
                           <p className="text-4xl lg:text-6xl font-black tracking-tighter">Rp {savedProfit.toLocaleString('id-ID')}</p>
                           <p className="text-sm font-bold opacity-70 mt-4">Setara dengan biaya berlangganan Pro selama 12 bulan!</p>
                        </div>
                        <button onClick={onGetStarted} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform mt-4">Klaim Profit Anda</button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Feature Highlights - Enhanced Bento */}
         <section id="features" className="py-32 px-6 relative">
            <div className="max-w-6xl mx-auto space-y-20">
               <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <h3 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">Fitur Enterprise, <br /> <span className="text-slate-500">Harga Warung.</span></h3>
                  <p className="text-xl text-slate-400 font-medium leading-relaxed">Kami merancang setiap tools untuk kecepatan dan akurasi, sehingga Anda bisa fokus masak, bukan hitung-hitungan.</p>
               </div>

               <div className="grid gap-8 md:grid-cols-3">
                  {/* Large Card */}
                  <BentoCard className="md:col-span-2 p-10 !bg-slate-900 border-slate-800 group relative overflow-hidden min-h-[400px]">
                     <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-30 transition-all duration-700 blur-xl">
                        <Activity className="w-96 h-96 text-indigo-500" />
                     </div>
                     <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                           <Activity className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="space-y-4">
                           <div className="inline-block px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">Beringin Smart Engine</div>
                           <h4 className="text-4xl font-black">Algoritma Penyesuaian Harga</h4>
                           <p className="text-lg text-slate-400 leading-relaxed font-medium max-w-lg">Satu klik untuk mengkonversi modal dasar menjadi harga jual optimal di semua platform pesan antar secara otomatis.</p>
                        </div>
                     </div>
                  </BentoCard>

                  {/* Tall Card */}
                  <BentoCard className="p-10 !bg-slate-900 border-slate-800 hover:border-emerald-500/50 group relative overflow-hidden flex flex-col justify-between">
                     <div className="w-16 h-16 bg-emerald-500/20 rounded-3xl flex items-center justify-center border border-emerald-500/30">
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-3xl font-black">Anti-Boncos Protection</h4>
                        <p className="text-base text-slate-400 font-medium">Alert otomatis jika margin Anda mendekati batas bahaya akibat biaya layanan platform.</p>
                     </div>
                  </BentoCard>

                  <BentoCard className="p-10 !bg-slate-900 border-slate-800 hover:border-amber-500/50 group relative overflow-hidden">
                     <h4 className="text-2xl font-black mb-3">Multi-Outlet</h4>
                     <p className="text-sm text-slate-400 font-medium">Kelola banyak cabang dengan komposisi menu yang berbeda dalam satu dashboard terpusat.</p>
                  </BentoCard>

                  <BentoCard className="p-10 !bg-slate-900 border-slate-800 hover:border-pink-500/50 group relative overflow-hidden">
                     <h4 className="text-2xl font-black mb-3">AI Estimation</h4>
                     <p className="text-sm text-slate-400 font-medium">Input bahan baku kasar, AI kami akan mengestimasi HPP berdasarkan rata-rata harga pasar terkini.</p>
                  </BentoCard>

                  <BentoCard className="p-10 !bg-slate-900 border-slate-800 hover:border-blue-500/50 group relative overflow-hidden">
                     <h4 className="text-2xl font-black mb-3">Export to PDF</h4>
                     <p className="text-sm text-slate-400 font-medium">Cetak laporan kalkulasi harga untuk presentasi ke investor atau mitra bisnis dalam sekejap.</p>
                  </BentoCard>
               </div>
            </div>
         </section>

         {/* Discovery Section (Blog & Pricing) */}
         <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

               {/* Blog */}
               <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-indigo-900/50 rounded-xl text-indigo-400 border border-indigo-500/20"><BookOpen size={24} /></div>
                     <h3 className="text-2xl font-bold">Resep & Tips Bisnis</h3>
                  </div>
                  <BentoCard className="!bg-slate-900/50 border-slate-800 hover:bg-slate-900 cursor-pointer group" onClick={() => window.location.href = '/blog'}>
                     <p className="text-xs font-black text-indigo-400 mb-3 uppercase tracking-widest">Latest Article</p>
                     <h4 className="text-xl font-bold mb-4 group-hover:text-indigo-300 transition-colors">Positioning Manifesto: Mengapa "Murah" Bukan Strategi Terbaik</h4>
                     <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">Pelajari cara menentukan posisi pasar Anda tanpa harus perang harga menggunakan rumus matematika sederhana...</p>
                     <div className="mt-6 flex items-center text-xs font-black text-slate-400 group-hover:text-white transition-colors gap-2 uppercase tracking-widest">
                        Read More <ArrowRight size={12} />
                     </div>
                  </BentoCard>
               </div>

               {/* Pricing Snippet */}
               <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-emerald-900/50 rounded-xl text-emerald-400 border border-emerald-500/20"><CreditCard size={24} /></div>
                     <h3 className="text-2xl font-bold">Investasi Rendah</h3>
                  </div>
                  <GradientCard className="!p-1">
                     <div className="bg-slate-950 p-8 rounded-[1.8rem] flex items-center justify-between h-full">
                        <div>
                           <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mulai Dari</div>
                           <div className="text-4xl font-black text-white">Rp 0 <span className="text-lg font-bold text-slate-600">/ selamanya</span></div>
                        </div>
                        <button onClick={() => window.location.href = '/pricing'} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20">
                           Lihat Paket
                        </button>
                     </div>
                  </GradientCard>
                  <p className="text-sm text-slate-500 leading-relaxed px-2 font-medium">
                     Tersedia paket <strong className="text-white">Gratis Selamanya</strong> untuk UMKM baru. Upgrade ke <strong>Pro</strong> untuk fitur unlimited project & AI analysis.
                  </p>
               </div>

            </div>
         </section>

         {/* FAQ */}
         <section className="py-32 px-6 bg-slate-900/30 border-y border-white/5">
            <div className="max-w-3xl mx-auto space-y-12">
               <h3 className="text-3xl font-black text-center tracking-tight">Pertanyaan Umum (FAQ)</h3>

               <div className="space-y-4">
                  {[
                     { q: 'Apakah aplikasi ini gratis?', a: 'Ya! Fitur dasar kalkulator HPP dan simulasi harga tersedia gratis untuk UMKM.' },
                     { q: 'Apakah data saya aman?', a: 'Sangat aman. Data perhitungan tersimpan lokal di perangkat Anda (untuk versi gratis) dan terenkripsi untuk versi cloud.' },
                     { q: 'Bisa untuk retail non-makanan?', a: 'Bisa! Margin Pro juga mendukung perhitungan untuk toko baju, craft, dan jasa.' }
                  ].map((item, i) => (
                     <BentoCard key={i} className="!bg-slate-900 border-slate-800">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-3"><HelpCircle className="w-5 h-5 text-indigo-500" /> {item.q}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium pl-8">{item.a}</p>
                     </BentoCard>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA Footer */}
         <section className="py-32 px-6 text-center bg-gradient-to-b from-slate-950 to-indigo-950/40 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-4xl lg:text-5xl font-black mb-10 tracking-tighter">Siap Cuan Lebih Banyak?</h2>
               <button
                  onClick={onGetStarted}
                  className="w-full max-w-sm mx-auto py-5 bg-white text-indigo-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
               >
                  Gabung Sekarang — Gratis
               </button>
               <p className="text-[10px] text-indigo-300 mt-6 font-bold opacity-60 uppercase tracking-widest">Tanpa Kartu Kredit • Batal Kapan Saja</p>
            </div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${EXTERNAL_LINKS.BACKGROUND_PATTERN})` }}></div>
         </section>

         {/* Footer */}
         <footer className="py-16 px-6 border-t border-white/5 bg-slate-950 text-slate-500">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
               <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                     <Activity className="w-6 h-6 text-indigo-500" />
                     <span className="font-black text-white text-lg tracking-tight uppercase">Margin<span className="text-indigo-400">Pro</span></span>
                  </div>
                  <p className="text-xs font-medium text-center md:text-left max-w-xs leading-relaxed opacity-60">
                     © 2025 PT Koneksi Jaringan Indonesia.<br />
                     Dibuat dengan ❤️ untuk UMKM Indonesia.
                  </p>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full mt-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">System v2.4 Operational</span>
                  </div>
               </div>

               <div className="flex gap-16">
                  <div className="flex flex-col gap-4">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Product</span>
                     <a href="#features" className="text-xs font-bold hover:text-indigo-400 transition-colors">Features</a>
                     <a href="/pricing" className="text-xs font-bold hover:text-indigo-400 transition-colors">Pricing</a>
                     <a href="/demo" className="text-xs font-bold hover:text-indigo-400 transition-colors">Live Demo</a>
                  </div>
                  <div className="flex flex-col gap-4">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Resources</span>
                     <a href="/blog" className="text-xs font-bold hover:text-indigo-400 transition-colors">Tips & Tricks</a>
                     <a href="/legal/terms" className="text-xs font-bold hover:text-indigo-400 transition-colors">Terms of Service</a>
                     <a href="/legal/privacy" className="text-xs font-bold hover:text-indigo-400 transition-colors">Privacy Policy</a>
                  </div>
               </div>

               <div className="flex gap-6">
                  <a href={COMPANY.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href={COMPANY.LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
                  <a href={`mailto:${COMPANY.EMAIL}`} className="hover:text-indigo-400 transition-colors"><Mail className="w-5 h-5" /></a>
                  <a href={COMPANY.WEBSITE} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors hidden"><Globe className="w-5 h-5" /></a>
               </div>
            </div>
         </footer>
      </div>
   );
};