
import React from 'react';
import { GitCommit, Sparkles, Calendar } from 'lucide-react';

interface ChangelogViewProps {
  onBack: () => void;
}

export const ChangelogView: React.FC<ChangelogViewProps> = () => {
  const versions = [
    {
      version: 'v2.1.0',
      date: 'Current Release',
      label: 'Business Intelligence',
      type: 'major',
      changes: [
        'Fitur Multi-Profil Bisnis (Outlet Management)',
        'Sistem Akuntabilitas Aset & Modal Awal',
        'Refining algoritma ROI & BEP',
        'UI/UX Refresh: Glassmorphism Dashboard'
      ]
    },
    {
      version: 'v2.0.5',
      date: 'Feb 2025',
      label: 'AI Integration',
      type: 'minor',
      changes: [
        'Integrasi Google Gemini 2.0 Flash untuk Estimasi HPP Otomatis',
        'Fitur Text-to-Speech (Audio Summary) untuk laporan cepat',
        'Perbaikan performa kalkulasi real-time'
      ]
    },
    {
      version: 'v1.8.2',
      date: 'Jan 2025',
      label: 'Financial Core',
      type: 'minor',
      changes: [
        'Modul Finance Manager (Jurnal Harian)',
        'Simulator Kredit & Utang Usaha',
        'Visualisasi target Dana Darurat'
      ]
    },
    {
      version: 'v1.0.0',
      date: 'Dec 2024',
      label: 'Inisiasi',
      type: 'patch',
      changes: [
        'Rilis publik pertama',
        'Kalkulator HPP Dasar',
        'Simulasi harga ShopeeFood, GoFood, GrabFood'
      ]
    }
  ];

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-10 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 left-8 w-px h-full bg-slate-100"></div>
         
         <div className="space-y-12 relative z-10">
            {versions.map((ver, idx) => (
               <div key={idx} className="relative pl-10 lg:pl-12 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 -translate-x-[calc(50%-1px)] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${idx === 0 ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`}>
                     {idx === 0 && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit ${idx === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-500'}`}>
                        {ver.version}
                     </span>
                     <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {ver.date}
                     </span>
                     {idx === 0 && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">LATEST BUILD</span>}
                  </div>

                  <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${idx === 0 ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-slate-100'}`}>
                     <h4 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
                        {ver.label}
                        {ver.type === 'major' && <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                     </h4>
                     <ul className="space-y-3">
                        {ver.changes.map((change, cIdx) => (
                           <li key={cIdx} className="flex items-start gap-3 text-xs text-slate-600 font-medium leading-relaxed">
                              <GitCommit className={`w-4 h-4 mt-0.5 shrink-0 ${idx === 0 ? 'text-indigo-500' : 'text-slate-400'}`} />
                              {change}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
