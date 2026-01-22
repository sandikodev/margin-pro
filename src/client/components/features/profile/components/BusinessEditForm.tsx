import React from 'react';
import { Activity, HelpCircle, Target, ShieldCheck, MapPin, Map, CheckCircle2, Save, Trash2 } from 'lucide-react';
import { BusinessProfile, BusinessType } from '@shared/types';
import { BentoCard } from '@/components/ui/design-system/BentoCard';

interface BusinessEditFormProps {
    editForm: Partial<BusinessProfile>;
    setEditForm: (updates: Partial<BusinessProfile>) => void;
    isSaved: boolean;
    handleSaveBusiness: () => void;
    businesses: BusinessProfile[];
    deleteBusiness: (id: string) => void;
    setIsEditingProfile: (val: boolean) => void;
}

export const BusinessEditForm: React.FC<BusinessEditFormProps> = ({
    editForm,
    setEditForm,
    isSaved,
    handleSaveBusiness,
    businesses,
    deleteBusiness,
    setIsEditingProfile
}) => {
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300 pb-32">
            <BentoCard className="space-y-8 p-6 sm:p-10 shadow-xl">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Warung / Brand</label>
                        <input
                            name="name"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full text-2xl font-black border-b-2 border-slate-100 py-3 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Contoh: Ayam Bakar Pak Kumis"
                        />
                        <p className="text-[9px] text-slate-400">Gunakan nama yang mudah dikenali pelanggan.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jenis Usaha</label>
                            <select
                                value={editForm.type}
                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as BusinessType })}
                                className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border border-slate-100 outline-none"
                            >
                                <option value="fnb_offline">Warung / Resto Makan Ditempat</option>
                                <option value="fnb_online">Cloud Kitchen (Hanya Online)</option>
                                <option value="retail">Toko Kelontong / Retail</option>
                                <option value="services">Penyedia Jasa</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Warna Identitas</label>
                            <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 items-center justify-between">
                                {['indigo', 'emerald', 'rose', 'orange', 'slate'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setEditForm({ ...editForm, themeColor: color })}
                                        className={`w-8 h-8 rounded-full border-4 transition-all ${editForm.themeColor === color ? 'border-white ring-2 ring-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                        style={{ backgroundColor: color === 'slate' ? '#64748b' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#f43f5e' : color === 'orange' ? '#f97316' : '#6366f1' }}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            <BentoCard className="space-y-8 p-6 sm:p-10 shadow-xl border-indigo-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase text-indigo-900 tracking-widest">Financial Blueprint</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Basic targets for all products</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Target Margin</label>
                            <div className="group relative">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                    Persentase keuntungan bersih yang Anda inginkan setelah dikurangi modal dan biaya aplikasi.
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input type="number" value={editForm.targetMargin || ''} onChange={(e) => setEditForm({ ...editForm, targetMargin: Number(e.target.value) })} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="30" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Pajak (PPN)</label>
                            <div className="group relative">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                    Besaran pajak pertambahan nilai yang berlaku (Standar 11% di Indonesia).
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input type="number" value={editForm.taxRate || ''} onChange={(e) => setEditForm({ ...editForm, taxRate: Number(e.target.value) })} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="11" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Fixed Cost</label>
                            <div className="group relative">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                    Biaya rutin bulanan (Gaji, Listrik, Sewa) yang harus ditutup oleh penjualan.
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 group-focus-within:text-indigo-600 transition-colors">Rp</span>
                            <input type="number" value={editForm.monthlyFixedCost || ''} onChange={(e) => setEditForm({ ...editForm, monthlyFixedCost: Number(e.target.value) })} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all" placeholder="5,000,000" />
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                    <p className="text-[10px] text-indigo-700 leading-relaxed font-bold flex items-start gap-2">
                        <span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"></span>
                        Pengaturan ini akan diterapkan otomatis pada setiap menu baru yang Anda buat di Kalkulator. Anda tetap bisa merubahnya per-produk jika dibutuhkan.
                    </p>
                </div>
            </BentoCard>

            <BentoCard className="space-y-6 p-6 sm:p-10 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-xs font-black uppercase text-indigo-900 tracking-widest">Lokasi Operasional</h4>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Alamat Lengkap Cabang</label>
                        <textarea rows={2} value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all resize-none" placeholder="Isi alamat cabang ini..." />
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Link Google Maps (Opsional)</label>
                        <div className="relative">
                            <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                            <input value={editForm.gmapsLink || ''} onChange={(e) => setEditForm({ ...editForm, gmapsLink: e.target.value })} className="w-full pl-11 pr-4 py-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-xs font-bold outline-none" placeholder="Tempel link maps disini..." />
                        </div>
                    </div>
                </div>
            </BentoCard>

            <div className="px-2 pt-4">
                <button onClick={handleSaveBusiness} className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white hover:bg-indigo-600'}`}>
                    {isSaved ? <CheckCircle2 className="w-6 h-6 animate-in zoom-in" /> : <Save className="w-6 h-6" />}
                    {isSaved ? 'Berhasil Disimpan' : 'Simpan Perubahan'}
                </button>
                {businesses.length > 1 && editForm.id && (
                    <button onClick={() => {
                        if (confirm("Yakin hapus cabang ini? Data tidak bisa dikembalikan.")) {
                            deleteBusiness(editForm.id!);
                            setIsEditingProfile(false);
                        }
                    }} className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 mt-4">
                        <Trash2 className="w-4 h-4" /> Hapus Cabang Ini
                    </button>
                )}
            </div>
        </div>
    );
};
