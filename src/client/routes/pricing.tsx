
import React, { useState, useEffect } from 'react';
import { useMidtrans } from '../hooks/useMidtrans';
import { Check, Star, Shield, History, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { Invoice } from '@shared/types';

export const PricingPage = () => {
    const { isLoaded, pay } = useMidtrans();
    const { showToast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        if (user?.id) {
            // Mock fetching invoices since we don't have a GET /invoices endpoint exposed yet in this scope
            // In a real app, we would fetch from /api/invoices?userId={user.id}
        }
    }, [user]);

    const handleSubscribe = async (tier: 'pro_monthly' | 'pro_lifetime') => {
        if (!user) {
            showToast('Please login to subscribe', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Create Invoice & Get Token
            const res = await fetch('/api/midtrans/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: tier === 'pro_monthly' ? 150000 : 2500000,
                    items: [
                        {
                            id: tier,
                            name: tier === 'pro_monthly' ? 'Margins Pro Monthly' : 'Margins Pro Lifetime',
                            price: tier === 'pro_monthly' ? 150000 : 2500000,
                            quantity: 1
                        }
                    ],
                    userId: user.id
                })
            });

            if (!res.ok) throw new Error('Failed to create invoice');
            const data = await res.json();
            const { snapToken, invoiceId } = data;

            // Optimistic update for UI demo
            const newInvoice: Invoice = {
                id: invoiceId,
                userId: user.id,
                amount: tier === 'pro_monthly' ? 150000 : 2500000,
                status: 'PENDING',
                snapToken,
                createdAt: Date.now()
            };
            setInvoices(prev => [newInvoice, ...prev]);

            // 2. Open Snap
            pay(snapToken, 
                (result) => {
                    console.log('Success', result);
                    showToast('Payment Successful! Welcome to Pro.', 'success');
                    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv));
                },
                (result) => {
                    console.log('Pending', result);
                    showToast('Payment Pending...', 'info');
                },
                (result) => {
                    console.log('Error', result);
                    showToast('Payment Failed or Denied', 'error');
                    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'FAILED' } : inv));
                },
                () => {
                    console.log('Closed');
                    setIsLoading(false);
                }
            );

        } catch (e) {
            console.error(e);
            showToast('Something went wrong', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-16">
                
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                        Unlock <span className="text-indigo-600">Margins Pro</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Take full control of your business finance with AI-driven insights, unlimited projects, and advanced simulations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* STARTER */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col gap-6 opacity-70 hover:opacity-100 transition-opacity">
                        <div>
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Starter</span>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-800">Rp 0</span>
                                <span className="text-sm font-bold text-slate-400">/ forever</span>
                            </div>
                        </div>
                        <ul className="space-y-4 flex-1">
                            {['Basic Calculators', '1 Project Limit', 'Community Support'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                    <Check className="w-4 h-4 text-slate-300" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button disabled className="w-full py-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed">Current Plan</button>
                    </div>

                    {/* PRO MONTHLY */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-indigo-500 relative flex flex-col gap-6 shadow-2xl shadow-indigo-500/20"
                    >
                         <div className="absolute top-0 right-0 p-6">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                        </div>
                        <div>
                            <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</span>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">Rp 150k</span>
                                <span className="text-sm font-bold text-slate-400">/ month</span>
                            </div>
                        </div>
                         <ul className="space-y-4 flex-1">
                            {['Unlimited Projects', 'AI Intelligence Hub', 'Global Branding Engine', 'Priority Support', 'Advanced Exports'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                    <Check className="w-4 h-4 text-indigo-400" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleSubscribe('pro_monthly')}
                            disabled={!isLoaded || isLoading}
                            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm transition-all shadow-lg hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? 'Processing...' : 'Upgrade now'}
                        </button>
                    </motion.div>

                    {/* LIFETIME */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
                            <Shield className="w-32 h-32 text-slate-900" />
                        </div>
                        <div>
                            <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Lifetime Deal</span>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-800">Rp 2.5jt</span>
                                <span className="text-sm font-bold text-slate-400">/ once</span>
                            </div>
                        </div>
                        <ul className="space-y-4 flex-1 relative z-10">
                            {['Everything in Pro', 'Lifetime Updates', 'No Recurring Fees', 'Founder Status Badge'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                    <Check className="w-4 h-4 text-emerald-500" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button 
                             onClick={() => handleSubscribe('pro_lifetime')}
                             disabled={!isLoaded || isLoading}
                             className="w-full py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition-all relative z-10"
                        >
                            Buy Lifetime
                        </button>
                    </div>
                </div>

                {/* INVOICE HISTORY SECTION */}
                <div className="max-w-4xl mx-auto pt-12 border-t border-slate-200">
                     <div className="flex items-center gap-2 mb-6">
                        <History className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-700">Billing History</h3>
                     </div>

                     {invoices.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 text-slate-400 flex flex-col items-center gap-2">
                             <FileText className="w-8 h-8 opacity-20" />
                             <span className="text-sm">No billing history found</span>
                        </div>
                     ) : (
                        <div className="space-y-3">
                            {invoices.map(inv => (
                                <div key={inv.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                                            inv.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                            'bg-rose-100 text-rose-600'
                                        }`}>
                                            {inv.status === 'PAID' ? <Check size={18} /> : 
                                             inv.status === 'PENDING' ? <Clock size={18} /> : <FileText size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">Invoice #{inv.id.slice(0, 8)}...</div>
                                            <div className="text-xs text-slate-400">{new Date(inv.createdAt || Date.now()).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-800">Rp {inv.amount.toLocaleString()}</div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${
                                             inv.status === 'PAID' ? 'text-emerald-500' :
                                             inv.status === 'PENDING' ? 'text-amber-500' :
                                             'text-rose-500'
                                        }`}>
                                            {inv.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     )}
                </div>

                <div className="flex justify-center gap-8 text-slate-300 grayscale opacity-50">
                     {/* Trust Badges / Logos here */}
                     <div className="text-xs font-black uppercase tracking-widest">Secured by Midtrans</div>
                </div>
            </div>
        </div>
    );
};
