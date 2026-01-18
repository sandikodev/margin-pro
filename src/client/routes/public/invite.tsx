
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferrerData {
    name: string;
    code: string;
}

export const InvitePage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'valid' | 'invalid'>(code ? 'verifying' : 'invalid');
    const [referrer, setReferrer] = useState<ReferrerData | null>(null);

    useEffect(() => {
        if (!code) return; // Handled by initial state

        // Simulate a slight delay for "Premium Feeel" 
        // (even if API is fast, anticipation builds value)
        const checkReferral = async () => {
            try {
                // Minimum 1.5s delay for animation
                const [res] = await Promise.all([
                    fetch(`/api/auth/validate-ref/${code}`),
                    new Promise(r => setTimeout(r, 1500)) 
                ]);

                if (res.ok) {
                    const data = await res.json();
                    
                    if (data.valid) {
                        setReferrer(data.referrer);
                        setStatus('valid');
                        
                        // Auto redirect after showing success state
                        setTimeout(() => {
                            navigate(`/auth?mode=register&ref=${data.referrer.code}`);
                        }, 2000);
                    } else {
                        setStatus('invalid');
                    }
                } else {
                    setStatus('invalid');
                }
            } catch {
                setStatus('invalid');
            }
        };

        checkReferral();
    }, [code, navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center relative z-10 shadow-2xl shadow-black/50"
            >
                <AnimatePresence mode='wait'>
                    {status === 'verifying' && (
                        <motion.div 
                            key="verifying"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
                                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Verifying Invitation</h2>
                                <p className="text-slate-400 text-sm font-medium">Checking secure referral token...</p>
                            </div>
                        </motion.div>
                    )}

                    {status === 'valid' && referrer && (
                        <motion.div 
                            key="valid"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Invitation Verified!</h2>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    You've been personally invited by <br/>
                                    <span className="text-emerald-400 font-bold text-lg">{referrer.name}</span>
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-white/5 mt-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">VIP Access Unlocked</span>
                            </div>

                            <p className="text-xs text-slate-500 animate-pulse mt-4">
                                Redirecting to secure registration...
                            </p>
                        </motion.div>
                    )}

                    {status === 'invalid' && (
                        <motion.div 
                            key="invalid"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]">
                                <XCircle className="w-10 h-10 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Link Expired</h2>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                                    Maaf, link undangan ini sudah tidak berlaku atau kadaluarsa.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/auth?mode=register')}
                                className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 mt-4 group"
                            >
                                Daftar Jalur Umum <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
