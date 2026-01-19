import { useSearchParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, ArrowLeft, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { User } from '@shared/types';
import { useToast } from '../../context/toast-context';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GradientCard } from '@/components/ui/design-system/GradientCard';

// --- FRONTEND AUTH LOGIC ---

interface AuthPageProps {
  onSuccess: (user: User) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
  initialEmail?: string;
  initialPassword?: string;
  initialReferralCode?: string;
  isDemo?: boolean; 
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onSuccess, 
  onBack, 
  initialMode = 'register',
  initialEmail = '',
  initialPassword = '',
  initialReferralCode = '',
  isDemo = false
}) => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Derived state from URL or props
  const modeParam = searchParams.get('mode');
  const activeMode = (modeParam === 'login' || modeParam === 'register') ? modeParam : initialMode;

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Focus Refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Sync Focus on Mode Change
  useEffect(() => {
    if (activeMode === 'register' && nameInputRef.current) {
        setTimeout(() => nameInputRef.current?.focus(), 50);
    } else if (activeMode === 'login' && emailInputRef.current) {
        setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [activeMode]);

  const handleModeSwitch = (newMode: 'login' | 'register') => {
      setSearchParams(prev => {
          prev.set('mode', newMode);
          return prev;
      });
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail || (isDemo ? 'owner@lumina.bistro' : ''),
    password: initialPassword || (isDemo ? 'demo_access_2025' : ''),
    referralCode: initialReferralCode || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    if (activeMode === 'register' && !formData.name) return;

    setLoading(true);
    
    if (isDemo) {
        try {
            const res = await fetch('/api/auth/demo', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error("Failed to start demo session");
            onSuccess(data.user);
        } catch {
            alert("Demo session unavailable");
        } finally {
            setLoading(false);
        }
        return;
    }

    try {
        const url = activeMode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const body = activeMode === 'login' 
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password, referralCode: formData.referralCode };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Authentication failed');

        onSuccess(data.user);
    } catch (err) {
        showToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex overflow-hidden font-sans">
      
      {/* --- DESKTOP LEFT PANEL (LUXURY ARTBOARD) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center p-16 overflow-hidden">
         {/* Dynamic Aurora Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
         
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>

         {/* Content */}
         <div className="relative z-10 text-white max-w-xl space-y-10">
            <GradientCard className="inline-flex py-2 px-4 !rounded-full !bg-none bg-white/5 border border-white/10 backdrop-blur-md w-auto">
               <div className="flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-indigo-300" />
                   <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Intelligence Pricing Engine</span>
               </div>
            </GradientCard>
            
            <h1 className="text-6xl font-black tracking-tighter leading-[1.1]">
               Stop Guessing.<br/>
               Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Profiting.</span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-md">
               "Margin Pro transformed our unit economics. It's not just a calculator, it's a cheat sheet for profitability."
            </p>
            
            {/* Stats/Social Proof */}
            <div className="pt-8 border-t border-white/10 flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold ring-2 ring-white/5 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:scale-110 transition-all z-0 hover:z-10">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                     </div>
                  ))}
               </div>
               <div>
                   <div className="text-lg font-black text-white">500+ Founders</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trust Margin Pro</div>
               </div>
            </div>
         </div>
      </div>

      {/* --- RIGHT PANEL (DYNAMIC FORM) --- */}
      <div className="w-full lg:w-1/2 flex flex-col h-[100dvh] relative bg-white">
        {/* Header */}
        <div className="shrink-0 flex justify-between items-start px-6 pt-6 lg:px-12 lg:pt-12 relative z-20">
            <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">Back</span>
            </button>
            
            {isDemo && (
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-full flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Demo Mode Active</span>
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto w-full flex flex-col">
            <div className="w-full max-w-md mx-auto px-8 py-12">
                <div className="mb-10 space-y-2">
                    <motion.div
                        key={activeMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                            {isDemo 
                            ? 'Akses Akun Demo.' 
                            : (activeMode === 'login' ? 'Welcome Back.' : 'Create Account.')}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            {isDemo
                            ? 'Masuk sebagai Owner Lumina Bistro untuk simulasi.'
                            : (activeMode === 'login' 
                                ? 'Enter your credentials to access your dashboard.' 
                                : 'Start your journey to better margins today.')
                            }
                        </p>
                    </motion.div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {activeMode === 'register' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 overflow-hidden"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input 
                                            ref={nameInputRef} 
                                            name="name"
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:shadow-xl focus:shadow-indigo-500/5 ring-0"
                                            placeholder="Business Owner Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Referral Code <span className="text-slate-200">(Optional)</span></label>
                                    <div className="relative group">
                                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input 
                                            name="referralCode"
                                            type="text" 
                                            value={formData.referralCode}
                                            onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:shadow-xl focus:shadow-indigo-500/5 ring-0"
                                            placeholder="e.g. PARTNER2025"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDemo ? 'text-indigo-500' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                            <input 
                                ref={emailInputRef} 
                                name="email"
                                type="email" 
                                value={formData.email}
                                readOnly={isDemo}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={cn(
                                    "w-full rounded-2xl pl-12 pr-4 py-4 font-bold outline-none transition-all placeholder:text-slate-300 ring-0",
                                    isDemo 
                                        ? "bg-indigo-50 border-2 border-indigo-100 text-indigo-900 cursor-not-allowed" 
                                        : "bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-indigo-100 text-slate-900 focus:shadow-xl focus:shadow-indigo-500/5"
                                )}
                                placeholder="name@business.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDemo ? 'text-indigo-500' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                            <input 
                                name="password"
                                type={showPass ? "text" : "password"} 
                                value={formData.password}
                                readOnly={isDemo}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className={cn(
                                    "w-full rounded-2xl pl-12 pr-12 py-4 font-bold outline-none transition-all placeholder:text-slate-300 ring-0",
                                    isDemo 
                                        ? "bg-indigo-50 border-2 border-indigo-100 text-indigo-900 cursor-not-allowed" 
                                        : "bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-indigo-100 text-slate-900 focus:shadow-xl focus:shadow-indigo-500/5"
                                )}
                                placeholder="••••••••"
                            />
                            {!isDemo && (
                                <button 
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                {isDemo ? 'Access Demo Dashboard' : (activeMode === 'login' ? 'Sign In' : 'Create Account')} 
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    {!isDemo && (
                        <p className="text-xs text-slate-500 font-medium">
                            {activeMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => handleModeSwitch(activeMode === 'login' ? 'register' : 'login')}
                                className="ml-2 text-indigo-600 font-black hover:underline uppercase tracking-wide text-[10px]"
                            >
                                {activeMode === 'login' ? 'Register Now' : 'Login Here'}
                            </button>
                        </p>
                    )}
                    {isDemo && (
                        <p className="text-[10px] text-slate-400 font-medium italic">
                            This is a simulation environment. No real data is stored.
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
