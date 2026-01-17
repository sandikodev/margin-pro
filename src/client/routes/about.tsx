import React, { useState } from 'react';
import { Github, Globe, Code2, Heart, Building2, Users, Rocket, ExternalLink, Terminal, Coffee, ChevronRight, Briefcase, Mail } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
  onOpenChangelog: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack, onOpenChangelog }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleAvatarClick = () => {
    if (showEasterEgg) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setShowEasterEgg(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* 1. PT KONEKSI JARINGAN INDONESIA (Corporate) */}
      <section className="bg-indigo-900 rounded-[2.5rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
               <Building2 className="w-10 h-10 text-indigo-200" />
            </div>
            <div className="space-y-4">
               <h4 className="text-2xl lg:text-3xl font-black tracking-tight">PT Koneksi Jaringan Indonesia</h4>
               <p className="text-sm text-indigo-100/80 leading-relaxed max-w-2xl font-medium">
                  Perusahaan teknologi yang berdedikasi membangun ekosistem digital inklusif. Kami percaya bahwa teknologi canggih seperti AI dan Financial Modeling harus dapat diakses oleh semua lapisan pelaku usaha, dari pedagang kaki lima hingga franchise besar.
               </p>
               <p className="text-xs font-black uppercase tracking-widest text-indigo-300 pt-2">
                  Maintenance & Scalability Partner
               </p>
               <div className="flex gap-3 pt-2">
                  <a href="#" className="px-4 py-2 bg-white text-indigo-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2">
                     <Globe className="w-3 h-3" /> Website Resmi
                  </a>
                  <a href="mailto:contact@konxc.space" className="px-4 py-2 bg-indigo-800 text-white border border-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                     <Mail className="w-3 h-3" /> Hubungi Kami
                  </a>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* 2. SANDIKODEV (The Creator / Easter Egg) */}
         <section className={`rounded-[2.5rem] p-8 border-2 transition-all relative overflow-hidden group ${showEasterEgg ? 'bg-slate-900 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-white border-slate-200 shadow-sm'}`}>
            {showEasterEgg && (
               <div className="absolute inset-0 opacity-20 pointer-events-none font-mono text-[10px] text-green-500 p-4 break-all leading-none overflow-hidden">
                  {Array(1000).fill('01 ').join('')}
               </div>
            )}
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
               <div 
                  onClick={handleAvatarClick}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black transition-all cursor-pointer select-none shadow-xl ${showEasterEgg ? 'bg-green-500 text-black scale-110 rotate-12' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 hover:scale-105 active:scale-95'}`}
               >
                  {showEasterEgg ? <Terminal className="w-10 h-10 animate-pulse" /> : 'S'}
               </div>
               
               <div className="space-y-2">
                  <h4 className={`text-xl font-black uppercase tracking-tight ${showEasterEgg ? 'text-green-400 font-mono' : 'text-slate-900'}`}>
                     {showEasterEgg ? 'SYSTEM_OVERRIDE_ENABLED' : 'Sandikodev'}
                  </h4>
                  <p className={`text-xs font-medium max-w-sm mx-auto ${showEasterEgg ? 'text-green-200 font-mono' : 'text-slate-500'}`}>
                     {showEasterEgg 
                        ? '"Code is the weapon, Prosperity is the victory. Keep building for the people!"' 
                        : 'Pengembang open-source yang berfokus pada pemberdayaan UMKM melalui teknologi tepat guna. Menjembatani kompleksitas kode dengan kebutuhan nyata pedagang.'}
                  </p>
               </div>

               <a 
                  href="https://github.com/sandikodev" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${showEasterEgg ? 'bg-green-500 text-black hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}`}
               >
                  <Github className="w-4 h-4" /> 
                  {showEasterEgg ? 'ACCESS_MAINFRAME' : 'Visit Github Profile'}
               </a>
            </div>
         </section>

         {/* 3. HIRING / LOKER */}
         <section className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                     <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-white text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                     We Are Hiring
                  </span>
               </div>
               <div>
                  <h4 className="text-2xl font-black leading-tight mb-2">Dicari: Pendekar Kode!</h4>
                  <p className="text-xs text-orange-100 font-medium leading-relaxed">
                     Bersedia me-maintenance platform ini? PT Koneksi Jaringan Indonesia mencari programmer yang punya skill teknis (React/TS/AI) dan hati untuk memajukan ekonomi kerakyatan.
                  </p>
               </div>
            </div>
            
            <a 
               href="mailto:career@konxc.space?subject=Application for Developer Position"
               className="mt-8 w-full py-4 bg-white text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
               Apply Now <Rocket className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </a>

            <Code2 className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12 pointer-events-none" />
         </section>
      </div>

      {/* 4. SHORTCUT TO CHANGELOG */}
      <div 
         onClick={onOpenChangelog}
         className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 flex items-center justify-between cursor-pointer hover:bg-white hover:shadow-lg hover:border-indigo-200 transition-all group"
      >
         <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <Coffee className="w-6 h-6" />
            </div>
            <div>
               <h5 className="font-black text-slate-900 text-sm">Platform Changelog</h5>
               <p className="text-xs text-slate-500">Lihat perjalanan update fitur aplikasi.</p>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>

      <div className="text-center pt-8 opacity-50">
         <Heart className="w-4 h-4 text-rose-400 mx-auto mb-2 fill-rose-400" />
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dibuat dengan cinta untuk UMKM Indonesia</p>
      </div>
    </div>
  );
};