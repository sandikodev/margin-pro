import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, Github, Terminal, Copy, Check, Wifi, WifiOff, Cpu, Activity, Globe } from 'lucide-react';
import { useErrorDX } from '@framework/dx';

export const AppErrorPage: React.FC = () => {
    const {
        errorName,
        errorMessage,
        errorStack,
        snippet,
        copied,
        handleCopy,
        openInEditor
    } = useErrorDX();

    const navigate = useNavigate();
    const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'Online' : 'Offline');
    const [memoryUsage] = useState<string>(() => {
        const performanceWithMemory = performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } };
        if (typeof performance !== 'undefined' && performanceWithMemory.memory) {
            const mem = performanceWithMemory.memory;
            return `${Math.round(mem.usedJSHeapSize / 1048576)} MB / ${Math.round(mem.jsHeapSizeLimit / 1048576)} MB`;
        }
        return 'N/A';
    });

    useEffect(() => {
        const handleOnline = () => setNetworkStatus('Online');
        const handleOffline = () => setNetworkStatus('Offline');
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const timestamp = new Date().toISOString();
    const url = window.location.href;

    const issueTitle = `[Bug]: ${errorMessage.substring(0, 80)}`;
    const issueBody = `
### 🚨 Runtime Error
**Error**: \`${errorMessage}\`
**Location**: \`${window.location.pathname}\`

### 🛠 System Context
- **Host**: ${window.location.host}
- **Network**: ${networkStatus}
- **Time**: ${timestamp}

### 📄 Stack Trace
\`\`\`text
${errorStack}
\`\`\`
`.trim();

    const githubUrl = `https://github.com/sandikodev/margin-pro/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;


    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-mono flex flex-col overflow-auto relative selection:bg-red-500/30 selection:text-white">

            {/* Background Grid & Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20"></div>

            {/* Navbar */}
            <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between p-6 border-b border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-200 tracking-tighter text-xs uppercase">Kernel Panic // Core Failure</span>
                        <span className="text-[9px] text-gray-600 font-medium tracking-widest">{timestamp}</span>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-red-500/50" />
                        {window.location.hostname}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Activity className="w-3 h-3 text-red-500/50" />
                        v1.0.1
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-12 p-6 md:p-12 animate-in fade-in zoom-in-95 duration-700">

                {/* LEFT COLUMN */}
                <div className="flex-grow space-y-10">
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            {errorName} Detected
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none [text-shadow:0_0_30px_rgba(255,255,255,0.1)]">
                            FATAL_ERROR
                        </h1>
                        <p className="text-2xl md:text-3xl text-red-50 font-bold leading-tight font-sans max-w-2xl bg-red-950/40 p-4 border-l-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.15)] backdrop-blur-sm">
                            {errorMessage}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                {networkStatus === 'Online' ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
                                Connectivity
                            </div>
                            <span className="text-sm font-bold text-white tracking-tight">{networkStatus}</span>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                <Cpu className="w-3 h-3 text-red-500" />
                                Heap Memory
                            </div>
                            <span className="text-sm font-bold text-white tracking-tight">{memoryUsage}</span>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-xl col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                <Activity className="w-3 h-3 text-red-500" />
                                Entry Point
                            </div>
                            <span className="text-[10px] font-bold text-red-400 truncate" title={url}>{window.location.pathname}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={() => window.open(githubUrl, '_blank')}
                            className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-red-500 hover:text-white rounded-2xl text-sm font-black transition-all active:scale-95 group"
                        >
                            <Github className="w-5 h-5" /> REPORT_INCIDENT
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-sm font-bold border border-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw className="w-5 h-5" /> HOT_RELOAD
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 px-8 py-4 bg-transparent hover:bg-white/5 text-gray-500 hover:text-white rounded-2xl text-sm font-bold border border-white/5 transition-all active:scale-95"
                        >
                            <Home className="w-5 h-5" /> RETURN_BASE
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full lg:w-[45%] flex flex-col gap-8">

                    {snippet && (
                        <div className="rounded-3xl border border-red-500/40 bg-[#0a0000] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="flex items-center justify-between px-6 py-4 bg-red-600/10 border-b border-red-500/20">
                                <div className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-tighter">
                                    <Terminal className="w-4 h-4" /> TRACE::{snippet.file}
                                </div>
                                <button
                                    onClick={openInEditor}
                                    className="text-[10px] uppercase font-black text-red-600 hover:text-white underline underline-offset-4 decoration-red-900 transition-all"
                                >
                                    OPEN_IN_IDE
                                </button>
                            </div>
                            <div className="p-6 font-mono text-xs overflow-x-auto leading-relaxed">
                                {snippet.snippet.map((s) => (
                                    <div
                                        key={s.line}
                                        className={`flex gap-6 px-3 py-1 rounded-lg ${s.isErrorLine ? 'bg-red-600/25 text-red-100 border-l-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'text-gray-600'}`}
                                    >
                                        <span className="w-8 text-right shrink-0 opacity-40 select-none font-bold text-[10px]">{s.line}</span>
                                        <span className="whitespace-pre font-medium">{s.content || ' '}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-grow rounded-3xl border border-white/10 bg-[#000000] overflow-hidden shadow-2xl flex flex-col min-h-[350px]">
                        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Terminal className="w-4 h-4" /> DUMP_STACK_TRACE
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 hover:text-indigo-400 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'CAPTURED' : 'CLONE'}
                            </button>
                        </div>
                        <div className="p-6 overflow-auto flex-grow relative group bg-black/40 backdrop-blur-sm">
                            <pre className="text-[11px] leading-relaxed text-red-100/70 whitespace-pre-wrap font-mono selection:bg-red-500/30">
                                {errorStack}
                            </pre>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 opacity-20 hover:opacity-100 transition-all duration-500">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Engineered for Resilience</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">SANDIKODEV</span>
                            <div className="w-4 h-px bg-red-600"></div>
                            <span className="text-[10px] text-gray-500 font-medium">CORE_OVERSIGHT</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
