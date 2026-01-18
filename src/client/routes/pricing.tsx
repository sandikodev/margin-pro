
import React, { useState } from 'react';
import { useMidtrans } from '../hooks/useMidtrans';
import { Check, Star, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

export const PricingPage = () => {
    const { isLoaded, pay } = useMidtrans();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (tier: 'pro_monthly' | 'pro_lifetime') => {
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
                    userId: 'user_123' // TODO: Get from context
                })
            });

            if (!res.ok) throw new Error('Failed to create invoice');
            const { snapToken } = await res.json();

            // 2. Open Snap
            pay(snapToken, 
                (result) => {
                    console.log('Success', result);
                    showToast('Payment Successful! Welcome to Pro.', 'success');
                },
                (result) => {
                    console.log('Pending', result);
                    showToast('Payment Pending...', 'info');
                },
                (result) => {
                    console.log('Error', result);
                    showToast('Payment Failed or Denied', 'error');
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
        <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-8">
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

                <div className="flex justify-center gap-8 text-slate-300 grayscale opacity-50">
                     {/* Trust Badges / Logos here */}
                     <div className="text-xs font-black uppercase tracking-widest">Secured by Midtrans</div>
                </div>
            </div>
        </div>
    );
};
