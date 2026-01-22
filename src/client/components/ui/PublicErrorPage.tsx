import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ArrowLeft, Terminal, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErrorDX } from '@framework/dx';

export const PublicErrorPage: React.FC = () => {
    const {
        statusCode,
        errorMessage,
        errorStack,
        snippet,
        copied,
        handleCopy,
        openInEditor,
        showDevTools
    } = useErrorDX();

    const navigate = useNavigate();

    // --- ERROR DATA (Localized/UX) ---
    let title = "Oops! Ada yang Salah";
    let message = "Sepertinya terjadi kesalahan. Jangan khawatir, tim kami sedang menanganinya.";

    if (statusCode === 404) {
        title = "Halaman Tidak Ditemukan";
        message = "Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.";
    } else if (statusCode === 403) {
        title = "Akses Ditolak";
        message = "Anda tidak memiliki izin untuk mengakses halaman ini.";
    } else if (statusCode >= 500) {
        title = "Server Sedang Bermasalah";
        message = "Server kami sedang mengalami gangguan. Silakan coba lagi dalam beberapa menit.";
    }


    return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
            {/* Luxurious Background Blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(2,4,10,1)_80%)]" />
            </div>

            <div className={`relative z-10 w-full flex flex-col items-center ${snippet ? 'max-w-7xl' : 'max-w-xl'}`}>

                <div className={`flex flex-col lg:flex-row gap-16 w-full items-start ${snippet ? 'justify-start' : 'items-center text-center'}`}>

                    {/* LEFT: Branding & Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`w-full ${snippet ? 'lg:w-[45%] lg:text-left' : 'text-center'}`}
                    >
                        {/* Status Chip */}
                        <div className={`mb-8 flex ${snippet ? 'justify-start' : 'justify-center'}`}>
                            <span className="px-5 py-2 bg-indigo-500/5 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/10 uppercase tracking-[0.2em] backdrop-blur-md shadow-2xl shadow-indigo-500/10">
                                Connection Error // {statusCode}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9] [text-shadow:0_0_40px_rgba(99,102,241,0.2)]">
                            {title}
                        </h1>

                        <p className="text-slate-400 text-xl md:text-2xl leading-relaxed mb-10 font-medium tracking-tight">
                            {message}
                        </p>

                        <div className={`flex flex-col sm:flex-row gap-4 ${snippet ? 'justify-start' : 'justify-center'}`}>
                            <button
                                onClick={() => navigate(-1)}
                                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10 active:scale-95 backdrop-blur-xl"
                            >
                                <ArrowLeft className="w-5 h-5 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
                                Kembali
                            </button>
                            <Link
                                to="/"
                                className="flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black transition-all shadow-[0_20px_40px_-12px_rgba(79,70,229,0.4)] active:scale-95"
                            >
                                <Home className="w-5 h-5" />
                                Beranda
                            </Link>
                        </div>

                        {/* Public Metadata (Dev Only) */}
                        {showDevTools && !snippet && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-12 text-xs font-mono text-indigo-300/40 bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/10 text-left backdrop-blur-sm"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="uppercase font-black tracking-widest text-[10px]">Transmission Debug</span>
                                    <button onClick={handleCopy} className="hover:text-white transition-colors flex items-center gap-1">
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'COPIED' : 'CLONE_TRACE'}
                                    </button>
                                </div>
                                <div className="truncate mb-2 font-bold text-indigo-200">{errorMessage}</div>
                                <div className="opacity-40 text-[10px] break-all max-h-32 overflow-auto custom-scrollbar">{errorStack}</div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* RIGHT: DX Tools (Dev Only) */}
                    <AnimatePresence>
                        {snippet && showDevTools && (
                            <motion.div
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="w-full lg:w-[55%] flex flex-col gap-8"
                            >
                                {/* Source Snippet */}
                                <div className="rounded-[2.5rem] border border-red-500/30 bg-[#080303] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.1)] flex flex-col group/snippet">
                                    <div className="flex items-center justify-between px-8 py-5 bg-red-600/5 border-b border-red-500/10">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                                            <Terminal className="w-4 h-4" /> SRC::{snippet.file}:{snippet.line}
                                        </div>
                                        <button
                                            onClick={openInEditor}
                                            className="text-[10px] uppercase font-black text-red-600 hover:text-white transition-all ring-1 ring-red-500/20 px-3 py-1 rounded-full hover:bg-red-600/20"
                                        >
                                            OPEN_EDITOR
                                        </button>
                                    </div>
                                    <div className="p-8 font-mono text-[11px] overflow-x-auto leading-relaxed custom-scrollbar">
                                        {snippet.snippet.map((s) => (
                                            <div
                                                key={s.line}
                                                className={`flex gap-6 px-4 py-1.5 rounded-xl transition-colors ${s.isErrorLine ? 'bg-red-600/20 text-red-100 border-l-4 border-red-600 -ml-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'text-gray-600 hover:text-gray-400'}`}
                                            >
                                                <span className="w-8 text-right shrink-0 opacity-30 select-none font-bold">{s.line}</span>
                                                <span className="whitespace-pre">{s.content || ' '}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mini Stack Trace */}
                                <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-8 py-5 bg-white/5 border-b border-white/5">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Terminal className="w-4 h-4" /> DUMP_SIGNAL_TRACE
                                        </div>
                                        <button onClick={handleCopy} className="text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-full">
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copied ? 'CAPTURED' : 'CLONE'}
                                        </button>
                                    </div>
                                    <div className="p-8 max-h-[350px] overflow-auto font-mono text-[10px] text-red-400/60 leading-relaxed custom-scrollbar">
                                        {errorStack}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* Brand Footer */}
                <div className="mt-24 pt-10 border-t border-white/5 w-full flex flex-col items-center opacity-30 hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            Built for the next billion margins
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-gray-600 font-bold uppercase tracking-widest">
                        <span>PT Koneksi Jaringan Indonesia</span>
                        <div className="w-1 h-1 bg-gray-800 rounded-full" />
                        <span>v1.0.1</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
