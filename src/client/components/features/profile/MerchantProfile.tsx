
import React, { useState, useEffect } from 'react';
import { 
  User, Settings, Bell, ChevronRight, LogOut, History, ShoppingBag, Layers, 
  Store, GraduationCap, PlusCircle, Check, 
  Building2, MapPin, 
  Map, Save, CheckCircle2, LayoutGrid, 
  ShieldCheck, Upload, Trash2,
  TrendingUp, Wallet, Coins, Briefcase, Gem, Activity
} from 'lucide-react';
import { AppSettings, BusinessProfile, BusinessType } from '@shared/types';
import { ProfileIdentity } from './ProfileIdentity';
import { ProfileFinancials } from './ProfileFinancials';
import { AccountSettings } from './AccountSettings';
import { NotificationModal } from '../../modals/NotificationModal';
import { TabNavigation, TabItem } from '../../ui/TabNavigation';

interface MerchantProfileProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  transactionHistory: any[];
  settings: AppSettings;
  toggleLanguage: () => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  onTopUpClick?: () => void;
  businesses: BusinessProfile[];
  activeBusinessId: string;
  activeBusiness: BusinessProfile;
  addBusiness: (b: BusinessProfile) => void;
  switchBusiness: (id: string) => void;
  updateBusiness: (id: string, updates: Partial<BusinessProfile>) => void;
  deleteBusiness: (id: string) => void;
  initialTab?: 'outlets' | 'account' | 'ledger';
  onLogout?: () => void; // New prop
}

export const MerchantProfile: React.FC<MerchantProfileProps> = ({ 
  credits, setCredits, transactionHistory, settings, toggleLanguage,
  isEditingProfile, setIsEditingProfile, onTopUpClick,
  businesses, activeBusinessId, activeBusiness, addBusiness, switchBusiness, updateBusiness, deleteBusiness,
  initialTab = 'outlets',
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'outlets' | 'account' | 'ledger'>(initialTab);
  const [editForm, setEditForm] = useState<Partial<BusinessProfile>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [accountForm, setAccountForm] = useState({
    ownerName: activeBusiness?.ownerName || '',
    email: activeBusiness?.email || '',
    phone: activeBusiness?.phone || '',
  });

  useEffect(() => {
    if (activeBusiness) {
      setAccountForm({
        ownerName: activeBusiness.ownerName || '',
        email: activeBusiness.email || '',
        phone: activeBusiness.phone || '',
      });
    }
  }, [activeBusiness]);

  const startEdit = (b: BusinessProfile) => {
    setEditForm(b);
    setIsEditingProfile(true);
    setIsSaved(false);
  };

  const startNew = () => {
    const newData: BusinessProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      type: 'fnb_offline' as BusinessType,
      initialCapital: 0,
      currentAssetValue: 0,
      cashOnHand: 0,
      themeColor: 'indigo',
      establishedDate: Date.now(),
      address: '',
      gmapsLink: ''
    };
    setEditForm(newData);
    setIsEditingProfile(true);
    setIsSaved(false);
  };

  const handleSaveBusiness = () => {
    if (!editForm.id) return;
    const exists = businesses.find(b => b.id === editForm.id);
    if (exists) {
      updateBusiness(editForm.id, editForm);
    } else {
      addBusiness(editForm as BusinessProfile);
    }
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
        setIsEditingProfile(false);
    }, 1000);
  };

  const handleSaveAccount = () => {
    updateBusiness(activeBusiness.id, accountForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSignOut = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sesi ini?")) {
        if (onLogout) {
          onLogout();
        } else {
          // Fallback if prop not provided
          window.location.reload();
        }
    }
  };

  const formatIDR = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'M';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'jt';
    return (val / 1000).toFixed(0) + 'rb';
  };

  const totalAssets = businesses.reduce((a,b) => a + (b.currentAssetValue || 0), 0);
  const totalCash = businesses.reduce((a,b) => a + (b.cashOnHand || 0), 0);

  const tabs: TabItem[] = [
    { id: 'outlets', label: 'Unit Cabang', icon: Store },
    { id: 'account', label: 'Identitas & Akun', icon: ShieldCheck },
    { id: 'ledger', label: 'Buku Kas', icon: History }
  ];

  if (isEditingProfile) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300 pb-32">
         {/* ... Existing Edit Form UI ... */}
         <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Warung / Brand</label>
                    <input name="name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full text-2xl font-black border-b-2 border-slate-100 py-3 focus:border-indigo-500 outline-none transition-all" placeholder="Contoh: Ayam Bakar Pak Kumis" />
                    <p className="text-[9px] text-slate-400">Gunakan nama yang mudah dikenali pelanggan.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jenis Usaha</label>
                        <select value={editForm.type} onChange={(e) => setEditForm({...editForm, type: e.target.value as any})} className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border border-slate-100 outline-none">
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
                              <button key={color} onClick={() => setEditForm({...editForm, themeColor: color})} className={`w-8 h-8 rounded-full border-4 transition-all ${editForm.themeColor === color ? 'border-white ring-2 ring-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`} style={{ backgroundColor: color === 'slate' ? '#64748b' : color === 'emerald' ? '#10b981' : color === 'rose' ? '#f43f5e' : color === 'orange' ? '#f97316' : '#6366f1' }}></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
         </div>

         <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black uppercase text-indigo-900 tracking-widest">Lokasi Operasional</h4>
            </div>
            <div className="space-y-4">
                <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Alamat Lengkap Cabang</label>
                   <textarea rows={2} value={editForm.address || ''} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all resize-none" placeholder="Isi alamat cabang ini..." />
                </div>
                <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Link Google Maps (Opsional)</label>
                   <div className="relative">
                      <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input value={editForm.gmapsLink || ''} onChange={(e) => setEditForm({...editForm, gmapsLink: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-xs font-bold outline-none" placeholder="Tempel link maps disini..." />
                   </div>
                </div>
            </div>
         </div>

         <div className="px-2 pt-4">
            <button onClick={handleSaveBusiness} className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white hover:bg-indigo-600'}`}>
                {isSaved ? <CheckCircle2 className="w-6 h-6 animate-in zoom-in" /> : <Save className="w-6 h-6" />}
                {isSaved ? 'Berhasil Disimpan' : 'Simpan Perubahan'}
            </button>
            {businesses.length > 1 && editForm.id && (
                <button onClick={() => deleteBusiness(editForm.id!)} className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 mt-4">
                  <Trash2 className="w-4 h-4" /> Hapus Cabang Ini
                </button>
            )}
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      
      <header className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 shadow-2xl border border-white/5">
         <div className="p-8 sm:p-12 lg:p-16 text-white relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <ProfileIdentity business={activeBusiness} ownerName={accountForm.ownerName} />
            <ProfileFinancials credits={credits} onTopUp={onTopUpClick || (() => {})} />
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
      </header>

      <section aria-label="Business Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
         <dl className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between h-32">
            <dt className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <Building2 className="w-4 h-4 text-indigo-500" /> Total Outlets
            </dt>
            <dd className="text-3xl font-black text-slate-900">{businesses.length}</dd>
         </dl>
         <dl className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between h-32">
            <dt className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <TrendingUp className="w-4 h-4 text-emerald-500" /> Asset Value
            </dt>
            <dd className="text-3xl font-black text-slate-900 tracking-tight">{formatIDR(totalAssets)}</dd>
         </dl>
         <dl className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between h-32">
            <dt className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <Wallet className="w-4 h-4 text-rose-500" /> Liquid Cash
            </dt>
            <dd className="text-3xl font-black text-slate-900 tracking-tight">{formatIDR(totalCash)}</dd>
         </dl>
         <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-lg text-white flex flex-col justify-between h-32 relative overflow-hidden group cursor-pointer" onClick={toggleLanguage}>
            <div className="relative z-10 space-y-1">
               <span className="text-[9px] font-black uppercase tracking-widest opacity-70">System Mode</span>
               <p className="text-lg font-black leading-tight">
                  {settings.languageMode === 'umkm' ? 'Bahasa Santai' : 'Professional'}
               </p>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-[9px] font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
               <Settings className="w-3 h-3" /> Switch
            </div>
            <Gem className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
         </div>
      </section>

      {/* Modular Tab Navigation */}
      <TabNavigation 
        variant="sticky" 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={(id) => setActiveTab(id as any)} 
      />

      <div className="animate-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
        {/* ... Tab Contents (Outlets, Account, Ledger) remain same ... */}
        {activeTab === 'outlets' && (
          <section className="space-y-6">
             <div className="flex justify-end">
                <button onClick={startNew} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                   <PlusCircle className="w-4 h-4" /> Tambah Unit
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businesses.map(b => (
                  <article 
                    key={b.id} 
                    onClick={() => switchBusiness(b.id)} 
                    className={`bg-white rounded-[2.5rem] p-7 border-2 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]
                    ${activeBusinessId === b.id 
                      ? 'border-indigo-600 ring-4 ring-indigo-500/10 shadow-2xl' 
                      : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg'}`}
                  >
                    <div className="flex justify-between items-start mb-6 relative z-10">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg`} style={{ backgroundColor: b.themeColor === 'emerald' ? '#10b981' : b.themeColor === 'rose' ? '#f43f5e' : b.themeColor === 'orange' ? '#f97316' : '#6366f1' }}>
                          {b.name.charAt(0)}
                       </div>
                       {activeBusinessId === b.id ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                             <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                       ) : (
                          <button onClick={(e) => { e.stopPropagation(); startEdit(b); }} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                             <Settings className="w-5 h-5" />
                          </button>
                       )}
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                       <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{b.name}</h3>
                       <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <Store className="w-3.5 h-3.5" /> {b.type.replace('_', ' ').toUpperCase()}
                       </p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2 border-t border-slate-50 mt-4">
                          Asset: {formatIDR(b.currentAssetValue)}
                       </p>
                    </div>

                    {activeBusinessId === b.id && (
                       <button onClick={(e) => { e.stopPropagation(); startEdit(b); }} className="absolute bottom-0 right-0 bg-slate-50 text-slate-400 p-4 rounded-tl-[2rem] hover:bg-indigo-600 hover:text-white transition-all">
                          <Settings className="w-5 h-5" />
                       </button>
                    )}
                  </article>
                ))}
             </div>
          </section>
        )}

        {activeTab === 'account' && (
          <div className="flex flex-col lg:flex-row gap-8">
             {/* LEFT SIDE: ACCOUNT INFO */}
             <section className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-200 shadow-sm w-full">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                   <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <Briefcase className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900">Principal Identity</h3>
                      <p className="text-xs text-slate-500 font-medium">Informasi ini digunakan untuk verifikasi kepemilikan.</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Pemilik</label>
                      <input value={accountForm.ownerName} onChange={(e) => setAccountForm({...accountForm, ownerName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all" placeholder="Nama Lengkap Sesuai KTP" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Resmi</label>
                         <input value={accountForm.email} onChange={(e) => setAccountForm({...accountForm, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all" placeholder="email@bisnis.com" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kontak WhatsApp</label>
                         <input value={accountForm.phone} onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all" placeholder="08xxxxxxxx" />
                      </div>
                   </div>
                   <div className="pt-6 flex justify-end">
                      <button onClick={handleSaveAccount} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2">
                         {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                         {isSaved ? 'Tersimpan' : 'Update Data'}
                      </button>
                   </div>
                </div>
             </section>

             {/* RIGHT SIDE: ACTIONS */}
             <aside className="w-full lg:w-80 space-y-4">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Quick Actions</h4>
                   <div className="space-y-2">
                      <button 
                        onClick={() => setShowNotifications(true)}
                        className="w-full py-4 px-6 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                          <span className="text-xs font-bold text-slate-700">Notifications</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200" />
                      </button>
                      <button onClick={() => setActiveTab('ledger')} className="w-full py-4 px-6 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 transition-all">
                        <div className="flex items-center gap-3">
                          <History className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                          <span className="text-xs font-bold text-slate-700">View History</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200" />
                      </button>
                      <button 
                        onClick={handleSignOut} 
                        className="w-full py-4 px-6 bg-rose-50 rounded-2xl flex items-center justify-between group hover:bg-rose-100 transition-all mt-4"
                      >
                        <div className="flex items-center gap-3 text-rose-600">
                          <LogOut className="w-4 h-4" />
                          <span className="text-xs font-bold">Sign Out</span>
                        </div>
                      </button>
                   </div>
                </div>
             </aside>
          </div>
        )}

        {activeTab === 'ledger' && (
          <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                   <History className="w-4 h-4 text-indigo-500" /> Transaction Ledger
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                   {transactionHistory.length} Records
                </span>
             </div>
             
             <div className="divide-y divide-slate-50">
               {transactionHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"><ShoppingBag className="w-8 h-8 text-slate-400" /></div>
                     <p className="text-xs font-black uppercase tracking-widest">No Transactions Found</p>
                  </div>
               ) : (
                  transactionHistory.map((tx, idx) => (
                     <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              <Activity className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900">{tx.name}</h4>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                                 {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-lg font-black text-rose-500 block">-{tx.price}</span>
                           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Credits</span>
                        </div>
                     </div>
                  ))
               )}
             </div>
          </section>
        )}

      </div>

      <NotificationModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};
