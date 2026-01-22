import React, { useState, useEffect } from 'react';
import { useMidtrans } from '@/hooks/useMidtrans';
import { Check, Star, Shield, History, Clock, FileText, ArrowRight, Activity, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/hooks/useAuth';
import { SUBSCRIPTION_PRICING } from '@shared/constants';
import { Invoice, User } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from '@koda/core/ui';
import { cn } from '@/lib/utils';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

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
    const isStarter = tier === 'starter';
    const isCurrentPlan = isStarter && (!user || (user && !('isPro' in user)));

    const Container = isPopular ? motion.div : 'div';
    const containerProps = isPopular ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        className: "relative h-full"
    } : { className: "relative h-full" };

    return (
        <Container {...containerProps}>
            <BentoCard
                className={cn(
                    "h-full flex flex-col relative overflow-hidden transition-all duration-300",
                    isPopular ? "!border-indigo-500/50 shadow-2xl shadow-indigo-500/10 bg-slate-900" : "bg-slate-900/50 hover:bg-slate-900 border-slate-800",
                    isStarter ? "opacity-80 hover:opacity-100" : ""
                )}
            >
                {/* Badges */}
                {isPopular && (
                    <div className="absolute top-0 right-0 p-6">
                        <Star className="w-6 h-6 text-indigo-400 fill-indigo-400 animate-pulse" />
                    </div>
                )}
                {isLifetime && (
                    <div className="absolute -top-6 -right-6 p-12 opacity-10 -rotate-12 pointer-events-none">
                        <Shield className="w-40 h-40 text-emerald-400" />
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4",
                        isPopular ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" :
                            isLifetime ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                "bg-slate-800 text-slate-400 border border-slate-700"
                    )}>
                        {isPopular ? 'Most Popular' : isLifetime ? 'Lifetime Deal' : 'Starter'}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white tracking-tight">{price}</span>
                        <span className="text-sm font-bold text-slate-500">{unit}</span>
                    </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-4 flex-1 mb-8">
                    {features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm font-bold text-slate-300">
                            <div className={cn(
                                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                isPopular ? "bg-indigo-500/20 text-indigo-400" : isLifetime ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                            )}>
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="leading-tight">{f}</span>
                        </li>
                    ))}
                </ul>

                {/* Action Button */}
                <button
                    onClick={onAction}
                    disabled={isLoading || isCurrentPlan || (isPopular && !isLoaded)}
                    className={cn(
                        "w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all relative z-10 flex items-center justify-center gap-2",
                        isCurrentPlan ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" :
                            isPopular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95" :
                                isLifetime ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95" :
                                    "bg-white text-slate-950 hover:bg-indigo-50 hover:-translate-y-0.5 active:scale-95"
                    )}
                >
                    {isLoading ? 'Processing...' :
                        isCurrentPlan ? 'Current Plan' :
                            !user ? (isStarter ? 'Start Free' : 'Get Started') :
                                'Upgrade Now'}

                    {!isLoading && !isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                </button>
            </BentoCard>
        </Container>
    );
};

// --- HELPER DATA ---
// Using centralized pricing constants
import { PRICING_OPTIONS } from '@/constants/pricing';
const TIERS = PRICING_OPTIONS.map(tier => ({
    id: tier.id,
    label: tier.label,
    price: tier.priceFormatted
}));

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
        if (!user) {
            navigate('/auth', { state: { mode: 'register' } });
            return;
        }

        if (tier === 'starter') return;

        setIsLoading(true);
        try {
            const payload = {
                id: Math.random().toString(36).substr(2, 9),
                tier: tier,
                amount: tier === 'pro_monthly' ? SUBSCRIPTION_PRICING.PRO_MONTHLY : SUBSCRIPTION_PRICING.PRO_LIFETIME,
                currency: 'IDR',
                status: 'pending',
                items: [
                    {
                        id: tier,
                        name: tier === 'pro_monthly' ? 'Margin Pro Monthly' : 'Margin Pro Lifetime',
                        price: tier === 'pro_monthly' ? SUBSCRIPTION_PRICING.PRO_MONTHLY : SUBSCRIPTION_PRICING.PRO_LIFETIME,
                        quantity: 1
                    }
                ],
                userId: user.id
            };

            const res = await fetch('/api/midtrans/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to create invoice');
            const data = await res.json();
            const { snapToken, invoiceId } = data;

            const newInvoice: Invoice = {
                id: invoiceId,
                userId: user.id,
                amount: tier === 'pro_monthly' ? SUBSCRIPTION_PRICING.PRO_MONTHLY : SUBSCRIPTION_PRICING.PRO_LIFETIME,
                status: 'PENDING',
                snapToken,
                createdAt: Date.now()
            };
            setInvoices(prev => [newInvoice, ...prev]);

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
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            {/* Header / Nav */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 group-hover:bg-slate-800 flex items-center justify-center transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Back to Home</span>
                </button>
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <span className="font-black tracking-tight">MARGIN PRO</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20 space-y-16">

                {/* Hero */}
                <div className="text-center space-y-6 max-w-3xl mx-auto pt-10">
                    {!user && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4">
                            <Star className="w-3 h-3 fill-indigo-300" /> Public Pricing
                        </div>
                    )}
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-4 delay-100">
                        Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Pro Power.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 delay-200">
                        Take full control of your business finance with AI-driven insights, unlimited projects, and advanced simulations.
                    </p>
                </div>

                {/* MOBILE SEGMENTED CONTROL */}
                <div className="md:hidden flex justify-center sticky top-4 z-30">
                    <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl flex items-center shadow-xl border border-white/10">
                        {TIERS.map(t => {
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={cn(
                                        "relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                                        isActive ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
                                    )}
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
                <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
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
                        <AnimatePresence mode="wait">
                            {activeTab === 'starter' && (
                                <motion.div key="starter" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
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
                                <motion.div key="pro" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
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
                                <motion.div key="lifetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
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
                        </AnimatePresence>
                    </div>
                </div>

                {/* INVOICE HISTORY (Auth Only) */}
                {user && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto pt-20 border-t border-slate-800"
                    >
                        <DashboardSectionHeader
                            icon={History}
                            title="Billing History"
                            subtitle={`Manage your invoices for ${user.email}`}
                        />

                        <div className="mt-8">
                            {invoices.length === 0 ? (
                                <BentoCard className="py-20 flex flex-col items-center justify-center text-center gap-6 border-dashed border-slate-800 bg-slate-900/30">
                                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                                        <FileText className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">No billing history found</h4>
                                        <p className="text-slate-500 text-sm">Once you upgrade, your invoices will appear here.</p>
                                    </div>
                                </BentoCard>
                            ) : (
                                <div className="space-y-4">
                                    {invoices.map(inv => (
                                        <BentoCard key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                    inv.status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                        inv.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                            'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                )}>
                                                    {inv.status === 'PAID' ? <Check size={20} /> :
                                                        inv.status === 'PENDING' ? <Clock size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-lg">Invoice #{inv.id.slice(0, 8)}</div>
                                                    <div className="text-xs text-slate-500 font-bold flex gap-2 mt-1">
                                                        <span>{new Date(inv.createdAt || Date.now()).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{new Date(inv.createdAt || Date.now()).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-0 border-slate-800 pt-4 md:pt-0">
                                                <div className="text-right">
                                                    <div className="font-black text-white text-lg">Rp {inv.amount.toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Total Amount</div>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                                    inv.status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                        inv.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                            'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                )}>
                                                    {inv.status}
                                                </div>
                                            </div>
                                        </BentoCard>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                <div className="flex justify-center gap-8 text-slate-600 opacity-50 pt-10">
                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Secured by Midtrans
                    </span>
                </div>
            </div>
        </div>
    );
};
