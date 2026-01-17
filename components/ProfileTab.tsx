
import React, { useState } from 'react';
import { User, Settings, Bell, ChevronRight, LogOut, History, ShoppingBag, Layers, Zap } from 'lucide-react';
import { AccountSettings } from './profile/AccountSettings';

interface MerchantProfileProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  transactionHistory: any[];
}

export const MerchantProfile: React.FC<MerchantProfileProps> = ({ credits, setCredits, transactionHistory }) => {
  const [activeView, setActiveView] = useState<'main' | 'settings'>('main');

  if (activeView === 'settings') {
    return <AccountSettings onBack={() => setActiveView('main')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="space-y-2">
        <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900 leading-none">Merchant Profile</h3>
        <p className="text-slate-500 text-sm">Kelola akun, saldo credits, dan riwayat transaksi Anda.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-600/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Chef Budi Santoso</h4>
            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-50 px-3 py-1 rounded-full mt-2">Elite Merchant</p>
            
            <div className="w-full mt-10 space-y-3">
                <button onClick={() => setActiveView('settings')} className="w-full py-4 px-6 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 transition-all">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </button>
                <button className="w-full py-4 px-6 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-indigo-50 transition-all">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">Notifications</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </button>
                <button className="w-full py-4 px-6 bg-rose-50 rounded-2xl flex items-center justify-between group hover:bg-rose-100 transition-all mt-4">
                  <div className="flex items-center gap-3 text-rose-600">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-bold">Sign Out</span>
                  </div>
                </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Current Balance</p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-6xl font-black tracking-tighter">{credits}</span>
                    <span className="text-lg font-black uppercase opacity-60">Credits</span>
                </div>
              </div>
              <button onClick={() => setCredits(c => c + 100)} className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 relative z-10">
                Top Up Balance <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </button>
              <Layers className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-500" /> Transaction History
                </h4>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{transactionHistory.length} Total</span>
              </div>
              <div className="divide-y divide-slate-100 min-h-[300px]">
                {transactionHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                      <History className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No transactions yet</p>
                  </div>
                ) : (
                  transactionHistory.map(tx => (
                    <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                              <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                              <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Purchase: {tx.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{new Date(tx.date).toLocaleDateString()} • ID: #{tx.id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-slate-900">-{tx.price} Cr</span>
                          <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest mt-1">Success</span>
                        </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
