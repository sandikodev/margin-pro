import React from 'react';
import { Briefcase, CheckCircle2, Save, History, ChevronRight, Bell, LogOut } from 'lucide-react';
import { BentoCard } from '@koda/core/ui';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

interface AccountSettingsFormProps {
    accountForm: { ownerName: string; email: string; phone: string };
    setAccountForm: (updates: { ownerName: string; email: string; phone: string }) => void;
    handleSaveAccount: () => void;
    isSaved: boolean;
    setShowNotifications: (val: boolean) => void;
    setActiveTab: (tab: 'outlets' | 'account' | 'ledger') => void;
    handleSignOut: () => void;
}

export const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
    accountForm,
    setAccountForm,
    handleSaveAccount,
    isSaved,
    setShowNotifications,
    setActiveTab,
    handleSignOut
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT SIDE: ACCOUNT INFO */}
            <BentoCard className="p-8 lg:p-12 w-full">
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
                        <input
                            value={accountForm.ownerName}
                            onChange={(e) => setAccountForm({ ...accountForm, ownerName: e.target.value })}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            placeholder="Nama Lengkap Sesuai KTP"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Resmi</label>
                            <input
                                value={accountForm.email}
                                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                placeholder="email@bisnis.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kontak WhatsApp</label>
                            <input
                                value={accountForm.phone}
                                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                                placeholder="08xxxxxxxx"
                            />
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end">
                        <button
                            onClick={handleSaveAccount}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2"
                        >
                            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {isSaved ? 'Tersimpan' : 'Update Data'}
                        </button>
                    </div>
                </div>
            </BentoCard>

            {/* RIGHT SIDE: ACTIONS */}
            <aside className="w-full lg:w-80 space-y-4">
                <BentoCard className="p-6">
                    <DashboardSectionHeader title="Quick Actions" className="mb-4 px-0" />
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
                        <button
                            onClick={() => setActiveTab('ledger')}
                            className="w-full py-4 px-6 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 transition-all"
                        >
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
                </BentoCard>
            </aside>
        </div>
    );
};
