import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2, Github } from 'lucide-react';
import { User } from '@shared/types';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface AuthPageProps {
    initialMode: 'login' | 'register';
    initialEmail?: string;
    initialPassword?: string;
    initialReferralCode?: string;
    isDemo?: boolean;
    onSuccess: (user: User) => void;
    onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
    initialMode, initialEmail = '', initialPassword = '', initialReferralCode = '', isDemo = false, onSuccess, onBack
}) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
    const [referralCode, setReferralCode] = useState(initialReferralCode);
    const [isLoading, setIsLoading] = useState(false);

    // Demo Mode Specifics
    const [demoRole, setDemoRole] = useState<'owner' | 'manager'>('owner');

    const { login } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Artificial Delay for Premium Feel
            await new Promise(r => setTimeout(r, 800));

            if (isDemo) {
                // Mock Demo Login
                const demoUser: User = {
                    id: 'demo_' + Math.random().toString(36).substr(2, 9),
                    email: email || 'demo@margins.pro',
                    name: 'Demo User',
                    role: 'user',
                    permissions: ['demo_mode', demoRole],
                    isPro: true,
                    createdAt: Date.now()
                };
                // Store session
                login('demo-token', demoUser);
                onSuccess(demoUser);
                return;
            }

            // Real Auth Logic
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = mode === 'login'
                ? { email, password }
                : { email, password, referralCode };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Authentication failed');
            }

            const data = await res.json();
            // Assuming API returns { token, user }
            if (data.token && data.user) {
                login(data.token, data.user);
                onSuccess(data.user);
            } else {
                throw new Error("Invalid response from server");
            }

        } catch (error: any) {
            console.error("Auth Error:", error);
            showToast(error.message || 'Authentication Failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => setMode(prev => prev === 'login' ? 'register' : 'login');

    return (
        <div className="min-h-screen grid lg:grid-cols-2 font-sans bg-slate-950 text-white overflow-hidden">

            {/* LEFT COLUMN: Visuals */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-indigo-950/20">
                {/* Background FX */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-950/0 to-slate-950/0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <Link to="/" className="flex items-center gap-2 text-indigo-400 font-bold tracking-tight mb-8">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Home
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                    <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">
                        {isDemo ? (
                            <span>Experience the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future of Finance.</span></span>
                        ) : (
                            <span>Master Your <br /><span className="text-emerald-400">Margins.</span></span>
                        )}
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                        {isDemo
                            ? "Explore the full power of Margins Pro in a sandboxed environment. No credit card required."
                            : "Join over 2,000+ F&B owners optimizing their profitability with AI-driven insights."
                        }
                    </p>

                    <div className="flex gap-4 pt-4">
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm font-bold text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Credit Card
                        </div>
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm font-bold text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Setup
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs font-bold text-slate-600 uppercase tracking-widest">
                    &copy; 2024 Margins Pro Inc.
                </div>
            </div>

            {/* RIGHT COLUMN: Form */}
            <div className="relative flex flex-col justify-center p-6 md:p-20 bg-slate-950">
                <div className="max-w-md w-full mx-auto space-y-8">

                    {/* Standard Headline for Mobile / Form Context */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            {isDemo ? "Start Demo Tour" : (mode === 'login' ? 'Welcome Back' : 'Create Account')}
                        </h2>
                        <p className="text-slate-400">
                            {isDemo ? "Select a role to explore the platform." : (mode === 'login' ? "Enter your credentials to access your dashboard." : "Get started with your free account today.")}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {isDemo ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setDemoRole('owner')}
                                    className={cn(
                                        "p-4 rounded-xl border text-left transition-all",
                                        demoRole === 'owner' ? "bg-indigo-600 border-indigo-500 ring-2 ring-indigo-500/30" : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                    )}
                                >
                                    <div className="font-bold text-lg mb-1">Business Owner</div>
                                    <div className="text-xs opacity-70">Full access to all features and settings.</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDemoRole('manager')}
                                    className={cn(
                                        "p-4 rounded-xl border text-left transition-all",
                                        demoRole === 'manager' ? "bg-indigo-600 border-indigo-500 ring-2 ring-indigo-500/30" : "bg-slate-900 border-slate-800 hover:border-slate-700"
                                    )}
                                >
                                    <div className="font-bold text-lg mb-1">Store Manager</div>
                                    <div className="text-xs opacity-70">Day-to-day operations and reporting.</div>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                                        {mode === 'login' && <button type="button" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Forgot?</button>}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {mode === 'register' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-2 overflow-hidden"
                                        >
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Referral Code (Optional)</label>
                                            <input
                                                type="text"
                                                value={referralCode}
                                                onChange={(e) => setReferralCode(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                                placeholder="REF-12345"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                isDemo ? <span>Launch Demo <ArrowRight className="inline w-4 h-4 ml-1" /></span> :
                                    mode === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </button>

                        {!isDemo && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-950 px-2 text-slate-500 font-bold tracking-widest">Or continue with</span></div>
                            </div>
                        )}

                        {!isDemo && (
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                    <Github className="w-5 h-5 text-white" />
                                    <span className="text-sm font-bold text-slate-300">GitHub</span>
                                </button>
                                <button type="button" className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                    <span className="text-sm font-bold text-slate-300">Google</span>
                                </button>
                            </div>
                        )}

                        {!isDemo && (
                            <p className="text-center text-sm text-slate-500">
                                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button type="button" onClick={toggleMode} className="text-indigo-400 font-bold hover:underline underline-offset-4 decoration-indigo-500/50">
                                    {mode === 'login' ? 'Sign up' : 'Log in'}
                                </button>
                            </p>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
};
