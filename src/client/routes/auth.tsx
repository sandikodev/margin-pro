
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, ArrowLeft, Mail, Lock, User, Sparkles } from 'lucide-react';

// --- FRONTEND AUTH LOGIC ---

interface AuthPageProps {
  onSuccess: (mode: 'login' | 'register', email?: string, password?: string) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
  initialEmail?: string;
  initialPassword?: string;
  initialReferralCode?: string; // New Prop
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
  const [mode, setMode] = useState<'login' | 'register'>(
    (initialEmail || initialPassword) ? 'login' : initialMode
  );
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail || '',
    password: initialPassword || '',
    referralCode: initialReferralCode || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    if (mode === 'register' && !formData.name) return;

    setLoading(true);
    
    if (isDemo) {
        // Mock demo login
        setTimeout(() => {
            setLoading(false);
            onSuccess(mode, formData.email, formData.password);
        }, 1500);
        return;
    }

    try {
        const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const body = mode === 'login' 
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password, referralCode: formData.referralCode };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Authentication failed');

        onSuccess(mode, formData.email, formData.password); // In real app, we might use data.user/token
    } catch (err) {
        alert(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-white text-slate-900 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 overflow-hidden">
      {/* ... Header ... */}
       {/* Header with Smart Safe Area */}
       <div className="shrink-0 flex justify-between items-start px-3 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:px-6 md:pb-6 md:pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {isDemo && (
           <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Demo Mode</span>
           </div>
        )}
      </div>

       <div className="flex-1 overflow-y-auto px-8 w-full">
        <div className="flex flex-col justify-center min-h-full max-w-md mx-auto py-6">
            <div className="mb-10">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                {isDemo 
                  ? 'Akses Akun Demo.' 
                  : (mode === 'login' ? 'Selamat Datang Kembali.' : 'Buat Akun Baru.')}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                {isDemo
                  ? 'Masuk sebagai Owner Fiera Food untuk simulasi.'
                  : (mode === 'login' 
                      ? 'Masuk untuk mengelola margin profit Anda.' 
                      : 'Mulai perjalanan bisnis yang lebih profitable.')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <>
                <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Nama Pemilik Bisnis"
                    />
                  </div>
                </div>
                 <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kode Referral (Opsional)</label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.referralCode}
                      onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Contoh: ANDI88"
                    />
                  </div>
                </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDemo ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <input 
                    type="email" 
                    value={formData.email}
                    readOnly={isDemo}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full border rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-900 outline-none transition-all
                      ${isDemo 
                        ? 'bg-indigo-50/50 border-indigo-200 focus:ring-0 cursor-not-allowed' 
                        : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                    placeholder="nama@bisnis.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDemo ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={formData.password}
                    readOnly={isDemo}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full border rounded-2xl pl-11 pr-12 py-4 text-sm font-bold text-slate-900 outline-none transition-all
                      ${isDemo 
                        ? 'bg-indigo-50/50 border-indigo-200 focus:ring-0 cursor-not-allowed' 
                        : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                    placeholder="••••••••"
                  />
                  {!isDemo && (
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {isDemo ? 'Masuk Dashboard Demo' : (mode === 'login' ? 'Masuk Sekarang' : 'Daftar Gratis')} 
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pb-8">
              {!isDemo && (
                <p className="text-xs text-slate-500 font-medium">
                  {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="ml-1 text-indigo-600 font-black hover:underline"
                  >
                    {mode === 'login' ? 'Daftar disini' : 'Login disini'}
                  </button>
                </p>
              )}
              {isDemo && (
                 <p className="text-[10px] text-slate-400 font-medium italic">
                    Ini adalah simulasi. Data tidak akan disimpan permanen.
                 </p>
              )}
            </div>
        </div>
      </div>
      
      {/* Footer Decoration Removed */}
    </div>
  );
};
