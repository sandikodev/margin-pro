import React, { useContext } from 'react';
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import { useProfile } from '@/hooks/useProfile';
import { FullPageLoader } from '@/components/ui/design-system/Loading';
import { ArrowLeft, FlaskConical, Share2, Zap } from 'lucide-react';
import { useLaboratoryStore } from '@/store/useLaboratoryStore';

export const LabsLayout = () => {
    const { user, isLoading: authLoading } = useContext(AuthContext) || {};
    const profile = useProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const { setSimulation } = useLaboratoryStore();

    const hasBusinesses = profile.businesses && profile.businesses.length > 0;

    if (authLoading || profile.isLoading) {
        return <FullPageLoader text="Entering Laboratory..." />;
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (!hasBusinesses) {
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Minimalist Labs Header */}
            <header className="h-16 border-b border-white/5 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/app')}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-indigo-400" />
                        <span className="font-black tracking-tighter text-lg uppercase">Innovation <span className="text-indigo-400">Lab</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all">
                        <Share2 className="w-3.5 h-3.5" />
                        Collaborate
                    </button>
                    <button
                        onClick={() => setSimulation('spike')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Run Simulation
                    </button>
                </div>
            </header>

            <main className="relative h-[calc(100vh-64px)] overflow-hidden">
                <Outlet />
            </main>

            {/* Subtle Gradient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
};
