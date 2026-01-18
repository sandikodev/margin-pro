
import React, { useState, useEffect } from 'react';
import { useMidtrans } from '../hooks/useMidtrans';
import { Check, Star, Shield, History, Clock, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { Invoice, User } from '@shared/types';
import { useNavigate } from 'react-router-dom';

// --- SUB COMPONENTS ---

interface PricingCardProps {
    tier: 'starter' | 'pro_monthly' | 'pro_lifetime';
    price: string;
    unit: string;
    features: string[];
    isPopular?: boolean;
    isLifetime?: boolean;
    isLoading?: boolean;
    user?: User | null;
    isLoaded?: boolean;
    onAction: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
    tier, price, unit, features, isPopular, isLifetime, isLoading, user, isLoaded, onAction 
}) => {
    // Assumption: 'starter' is current for free users, 'pro' requires checking actual subscription
    // For demo simplicity, we assume free user unless they have paid
    const isStarter = tier === 'starter';
    const isCurrentPlan = isStarter && (!user || (user && !('isPro' in user))); 

    // Dynamic Visuals
    const Container = isPopular ? motion.div : 'div';
    const containerProps = isPopular ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        className: "bg-slate-900 rounded-[2.5rem] p-8 border-4 border-indigo-500 relative flex flex-col gap-6 shadow-2xl shadow-indigo-500/20"
    } : {
        className: `bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col gap-6 relative overflow-hidden ${isStarter ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`
    };

    return (
        <Container {...containerProps}>
            {/* Badges */}
            {isPopular && (
                <div className="absolute top-0 right-0 p-6">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                </div>
            )}
            {isLifetime && (
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
                    <Shield className="w-32 h-32 text-slate-900" />
                </div>
            )}

            {/* Header */}
            <div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isPopular ? 'bg-indigo-500 text-white' : 
                    isLifetime ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                    {isPopular ? 'Most Popular' : isLifetime ? 'Lifetime Deal' : 'Starter'}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${isPopular ? 'text-white' : 'text-slate-800'}`}>{price}</span>
                    <span className={`text-sm font-bold ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>{unit}</span>
                </div>
            </div>

            {/* Feature List */}
            <ul className="space-y-4 flex-1 relative z-10">
                {features.map(f => (
                    <li key={f} className={`flex items-center gap-3 text-sm font-bold ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                        <Check className={`w-4 h-4 ${isPopular ? 'text-indigo-400' : isLifetime ? 'text-emerald-500' : 'text-slate-300'}`} /> 
                        {f}
                    </li>
                ))}
            </ul>

            {/* Action Button */}
            <button 
                onClick={onAction}
                disabled={isLoading || isCurrentPlan || (isPopular && !isLoaded)}
                className={`w-full py-4 rounded-xl font-black text-sm transition-all relative z-10 flex items-center justify-center gap-2 ${
                    isCurrentPlan ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                    isPopular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50' :
                    isLifetime ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' :
                    'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
                {isLoading ? 'Processing...' : 
                 isCurrentPlan ? 'Current Plan' : 
                 !user ? (isStarter ? 'Start Free' : 'Get Started') :
                 'Upgrade Now'}
                 
                {!isLoading && !isCurrentPlan && <ArrowRight className="w-4 h-4" />}
            </button>
        </Container>
    );
};

// --- HELPER DATA ---
const TIERS = [
    { id: 'starter', label: 'Starter', price: 'Rp 0' },
    { id: 'pro_monthly', label: 'Pro', price: 'Rp 150k' },
    { id: 'pro_lifetime', label: 'Lifetime', price: 'Rp 2.5jt' }
] as const;

// --- MAIN PAGE ---

export const PricingPage = () => {
    const { isLoaded, pay } = useMidtrans();
    const { showToast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    
    // Mobile Tab State
    const [activeTab, setActiveTab] = useState<typeof TIERS[number]['id']>('pro_monthly');

    useEffect(() => {
        if (user?.id) {
            // Mock fetching invoices
        }
    }, [user]);

    const handleAction = async (tier: 'starter' | 'pro_monthly' | 'pro_lifetime') => {
        // 1. PUBLIC FLOW: Redirect to Register
        if (!user) {
            navigate('/auth', { state: { mode: 'register' } });
            return;
        }

        // 2. STARTER FLOW: No Action (Already Active)
        if (tier === 'starter') return;

        // 3. AUTHENTICATED FLOW: Trigger Payment
        setIsLoading(true);
        try {
            const res = await fetch('/api/midtrans/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: tier === 'pro_monthly' ? 150000 : 2500000,
                    items: [{
                        id: tier,
                        name: tier === 'pro_monthly' ? 'Margins Pro Monthly' : 'Margins Pro Lifetime',
                        price: tier === 'pro_monthly' ? 150000 : 2500000,
                        quantity: 1
                    }],
                    userId: user.id
                })
            });

            if (!res.ok) throw new Error('Failed to create invoice');
            const data = await res.json();
            const { snapToken, invoiceId } = data;

            // Optimistic update
            const newInvoice: Invoice = {
                id: invoiceId,
                userId: user.id,
                amount: tier === 'pro_monthly' ? 150000 : 2500000,
                status: 'PENDING',
                snapToken,
                createdAt: Date.now()
            };
            setInvoices(prev => [newInvoice, ...prev]);

            // Snap Payment
            pay(snapToken, 
                (_result) => {
                    showToast('Payment Successful! Welcome to Pro.', 'success');
                    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv));
                },
                (_result) => {
                    showToast('Payment Pending...', 'info');
                },
                (_result) => {
                    showToast('Payment Failed', 'error');
                    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'FAILED' } : inv));
                },
                () => setIsLoading(false)
            );

        } catch (e) {
            console.error(e);
            showToast('Something went wrong', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    {!user && (
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                            <Star className="w-3 h-3 fill-indigo-600" /> Public Pricing
                         </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight">
                        Unlock <span className="text-indigo-600">Margins Pro</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Take full control of your business finance with AI-driven insights, unlimited projects, and advanced simulations.
                    </p>
                    
                    {/* Login Reminder for Guest */}
                    {!user && (
                         <p className="text-sm text-slate-400">
                            Already have an account? <a href="/auth" className="text-indigo-600 font-bold hover:underline">Log In</a>
                         </p>
                    )}
                </div>

                {/* MOBILE SEGMENTED CONTROL */}
                <div className="md:hidden flex justify-center sticky top-2 z-30 mb-4">
                     <div className="bg-slate-200/80 backdrop-blur-md p-1.5 rounded-2xl flex items-center shadow-lg border border-white/20">
                        {TIERS.map(t => {
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-xl shadow-sm"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{t.label}</span>
                                </button>
                            );
                        })}
                     </div>
                </div>

                {/* DESKTOP GRID (Hidden on Mobile) */}
                <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                    <PricingCard 
                        tier="starter"
                        price="Rp 0"
                        unit="/ forever"
                        features={['Basic Calculators', '1 Project Limit', 'Community Support']}
                        user={user}
                        onAction={() => handleAction('starter')}
                    />
                     <PricingCard 
                        tier="pro_monthly"
                        price="Rp 150k"
                        unit="/ month"
                        features={['Unlimited Projects', 'AI Intelligence Hub', 'Global Branding Engine', 'Priority Support', 'Advanced Exports']}
                        isPopular
                        isLoading={isLoading}
                        user={user}
                        isLoaded={isLoaded}
                        onAction={() => handleAction('pro_monthly')}
                    />
                     <PricingCard 
                        tier="pro_lifetime"
                        price="Rp 2.5jt"
                        unit="/ once"
                        features={['Everything in Pro', 'Lifetime Updates', 'No Recurring Fees', 'Founder Status Badge']}
                        isLifetime
                        isLoading={isLoading}
                        user={user}
                        isLoaded={isLoaded}
                        onAction={() => handleAction('pro_lifetime')}
                    />
                </div>

                {/* MOBILE TAB CONTENT (Shown only on mobile) */}
                <div className="md:hidden">
                    <div className="max-w-md mx-auto">
                        {activeTab === 'starter' && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <PricingCard 
                                    tier="starter"
                                    price="Rp 0"
                                    unit="/ forever"
                                    features={['Basic Calculators', '1 Project Limit', 'Community Support']}
                                    user={user}
                                    onAction={() => handleAction('starter')}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'pro_monthly' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <PricingCard 
                                    tier="pro_monthly"
                                    price="Rp 150k"
                                    unit="/ month"
                                    features={['Unlimited Projects', 'AI Intelligence Hub', 'Global Branding Engine', 'Priority Support', 'Advanced Exports']}
                                    isPopular
                                    isLoading={isLoading}
                                    user={user}
                                    isLoaded={isLoaded}
                                    onAction={() => handleAction('pro_monthly')}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'pro_lifetime' && (
                             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <PricingCard 
                                    tier="pro_lifetime"
                                    price="Rp 2.5jt"
                                    unit="/ once"
                                    features={['Everything in Pro', 'Lifetime Updates', 'No Recurring Fees', 'Founder Status Badge']}
                                    isLifetime
                                    isLoading={isLoading}
                                    user={user}
                                    isLoaded={isLoaded}
                                    onAction={() => handleAction('pro_lifetime')}
                                />
                             </motion.div>
                        )}
                    </div>
                </div>

                {/* INVOICE HISTORY (Auth Only) */}
                {user && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto pt-16 border-t border-slate-200"
                    >
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <History className="w-5 h-5 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700">Billing History</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                {user.email}
                            </span>
                         </div>

                         {invoices.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-400 flex flex-col items-center gap-4">
                                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                     <FileText className="w-8 h-8 opacity-20" />
                                 </div>
                                 <span className="text-sm font-medium">No billing history found</span>
                            </div>
                         ) : (
                            <div className="space-y-4">
                                {invoices.map(inv => (
                                    <div key={inv.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                                inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                                                inv.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                                'bg-rose-100 text-rose-600'
                                            }`}>
                                                {inv.status === 'PAID' ? <Check size={20} /> : 
                                                 inv.status === 'PENDING' ? <Clock size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-lg">Invoice #{inv.id.slice(0, 8)}</div>
                                                <div className="text-xs text-slate-400 font-medium flex gap-2">
                                                    <span>{new Date(inv.createdAt || Date.now()).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{new Date(inv.createdAt || Date.now()).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-slate-100 pt-4 md:pt-0">
                                            <div className="text-right">
                                                <div className="font-black text-slate-800 text-lg">Rp {inv.amount.toLocaleString()}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                                                 inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' :
                                                 inv.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                                 'bg-rose-100 text-rose-600'
                                            }`}>
                                                {inv.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         )}
                    </motion.div>
                )}

                <div className="flex justify-center gap-8 text-slate-300 grayscale opacity-50 pt-4">
                     <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Secured by Midtrans
                     </span>
                </div>
            </div>
        </div>
    );
};
