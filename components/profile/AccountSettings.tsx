
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, Upload, CheckCircle2 } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

interface AccountSettingsProps {
  onBack: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onBack }) => {
  const { activeBusiness, updateBusiness } = useProfile();
  
  const [profile, setProfile] = useState({
    ownerName: activeBusiness.ownerName || '',
    email: activeBusiness.email || '',
    phone: activeBusiness.phone || '',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile({
      ownerName: activeBusiness.ownerName || '',
      email: activeBusiness.email || '',
      phone: activeBusiness.phone || '',
    });
  }, [activeBusiness]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (activeBusiness.id) {
        updateBusiness(activeBusiness.id, profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-40 max-w-2xl mx-auto">
      <div className="space-y-8">
         {/* 1. PERSONAL INFO */}
         <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-black uppercase text-indigo-900 tracking-[0.2em] flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg"><User className="w-4 h-4 text-indigo-600" /></div>
                    Identitas Pemilik
                </h4>
            </div>
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
               <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                  <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative group cursor-pointer overflow-hidden transition-all hover:scale-105">
                      <User className="w-12 h-12 text-slate-200 group-hover:text-indigo-200 transition-colors" />
                      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Upload className="w-6 h-6 text-white mb-1" />
                         <span className="text-[8px] text-white font-black uppercase">Upload</span>
                      </div>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline bg-indigo-50 px-3 py-1 rounded-full">Ganti Foto</span>
               </div>

               <div className="grid grid-cols-1 gap-6 flex-grow w-full">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                          <input name="ownerName" value={profile.ownerName} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-inner" placeholder="Masukkan nama..." />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Bisnis</label>
                      <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                          <input name="email" value={profile.email} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-inner" placeholder="name@business.com" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Aktif</label>
                      <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                          <input name="phone" value={profile.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-inner" placeholder="08xxxxxxxx" />
                      </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-10 border-t border-slate-100 mt-6">
                <button 
                    onClick={handleSave}
                    className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95
                    ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-900 text-white shadow-indigo-900/30 hover:bg-indigo-600'}`}
                >
                    {isSaved ? (
                    <>
                        <CheckCircle2 className="w-5 h-5 animate-in zoom-in" />
                        Pengaturan Disimpan
                    </>
                    ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Simpan Perubahan Akun
                    </>
                    )}
                </button>
                <p className="text-[9px] text-slate-400 mt-4 text-center italic uppercase tracking-widest">Detail outlet dan link marketplace dapat dikelola melalui tab Profil &gt; Edit Cabang</p>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
         </section>
      </div>
    </div>
  );
};
