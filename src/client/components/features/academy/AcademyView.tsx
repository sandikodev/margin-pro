
import React from 'react';
import { GraduationCap, Lightbulb, Calculator, Target, ShieldCheck, BookOpen, ExternalLink, Globe } from 'lucide-react';
import { Platform } from '@shared/types';
import { useConfig } from '../../../context/ConfigContext';

interface AcademyViewProps {
  onOpenAbout?: () => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ onOpenAbout }) => {
  const { platforms } = useConfig();

  const getPlatformHighlights = (p: Platform) => {
    switch (p) {
      case Platform.GO_FOOD:
        return [
          "Komisi GoFood standar: 20% + Rp1.000 (Biaya Jasa Aplikasi).",
          "Pencairan dana otomatis setiap hari kerja (H+1) ke rekening terdaftar.",
          "Promo merchant dibebankan sepenuhnya ke mitra, kecuali promo subsidi Gojek.",
          "Wajib menyertakan foto menu asli & jelas untuk verifikasi."
        ];
      case Platform.GRAB_FOOD:
        return [
          "Skema Preferred Merchant: Komisi 30% (Visibilitas tinggi, subsidi promo Grab).",
          "Skema Regular/Self-Delivery: Komisi 20% (Jangkauan standar).",
          "Pajak restoran (PB1) ditanggung oleh konsumen jika merchant mengaktifkannya.",
          "Grab memotong komisi langsung dari total penjualan harian."
        ];
      case Platform.SHOPEE_FOOD:
        return [
          "Komisi standar 20% dari harga jual sebelum diskon.",
          "Biaya layanan dikenakan PPN 11% (Peraturan Pajak Digital).",
          "Pencairan saldo ShopeePay Merchant ke rekening bank bebas biaya admin (kuota tertentu).",
          "Program 'Partner' mendapatkan prioritas slot flash sale."
        ];
      default:
        return ["Pelajari syarat dan ketentuan terbaru langsung dari dokumen resmi."];
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <section className="bg-indigo-600 rounded-[2.5rem] lg:rounded-[3.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="p-8 bg-white/10 rounded-[2.5rem] backdrop-blur-md shadow-2xl border border-white/10 ring-8 ring-white/5 shrink-0">
            <GraduationCap className="w-16 h-16 text-indigo-200" />
          </div>
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase italic leading-none">Academy Central</h3>
            <p className="text-indigo-100 text-sm max-w-sm leading-relaxed opacity-80 font-medium">Bimbingan strategis agar jualan di marketplace tetap profit meskipun biaya layanan naik.</p>
          </div>
      </section>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-10 shadow-sm relative overflow-hidden">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-500" /> Cara Kerja Simulator
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-black text-slate-900">1. Input Modal (HPP)</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Masukkan biaya bahan baku, kemasan, dan operasional per porsi dengan detail.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-black text-slate-900">2. Tentukan Target</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Isi nominal keuntungan bersih yang ingin Anda dapatkan dari setiap penjualan.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-black text-slate-900">3. Hasil Otomatis</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Sistem menghitung markup harga jual yang aman untuk menutup komisi dan pajak platform.</p>
            </div>
          </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Knowledge Hub & Terms
          </h4>
        </div>
        <div className="divide-y divide-slate-100">
          {Object.entries(platforms).map(([p, data]: [string, any]) => (
            <div key={p} className="p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50 transition-all group">
              <div className="flex items-start gap-6 flex-grow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-xl shrink-0" style={{backgroundColor: data.color}}>{p.charAt(0)}</div>
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 tracking-tight text-lg">{p} Merchant</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Poin Penting Syarat & Ketentuan</span>
                  </div>
                  <ul className="bg-slate-100/50 p-4 rounded-xl border border-slate-100 space-y-2">
                      {getPlatformHighlights(p as Platform).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <a href={data.officialTermsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all self-start md:self-center whitespace-nowrap">
                  Baca Dokumen Resmi <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-60">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Developed by</p>
          <button onClick={onOpenAbout} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white/50 px-4 py-2 rounded-xl border border-slate-200">
            PT Koneksi Jaringan Indonesia <Globe className="w-3 h-3" />
          </button>
          <span className="text-[9px] text-slate-400">www.konxc.space</span>
      </div>
    </div>
  );
};
