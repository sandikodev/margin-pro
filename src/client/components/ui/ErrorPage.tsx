import React, { useState, useEffect } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { RefreshCw, Home, Github, Terminal, Copy, Check, Wifi, WifiOff, Cpu, Activity, Globe } from 'lucide-react';

export const ErrorPage: React.FC = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'Online' : 'Offline');
  const [memoryUsage] = useState<string>(() => {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
        const mem = (performance as any).memory;
        return `${Math.round(mem.usedJSHeapSize / 1048576)} MB / ${Math.round(mem.jsHeapSizeLimit / 1048576)} MB`;
    }
    return 'N/A';
  });

  useEffect(() => {
    // Network Listeners
    const handleOnline = () => setNetworkStatus('Online');
    const handleOffline = () => setNetworkStatus('Offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Gather Diagnostic Information
  const timestamp = new Date().toISOString();
  const url = window.location.href;
  const userAgent = navigator.userAgent;
  
  let errorMessage = "Unknown Runtime Error";
  let errorStack = "No stack trace available";
  let errorName = "Error";

  // Error Parsing Logic
  if (isRouteErrorResponse(error)) {
        errorMessage = `${error.status} ${error.statusText}`;
        errorName = `HTTP ${error.status}`;
        if (error.status === 404) {
            errorMessage = `Page not found: ${window.location.pathname}`;
            errorStack = "Route matched no known routes.";
        }
  } else if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack || errorStack;
        errorName = error.name;
  } else if (typeof error === 'string') {
        errorMessage = error;
  } else if (error?.payload?.message) {
      errorMessage = error.payload.message;
  }

  // 2. Format GitHub Issue Body
  const issueTitle = `[Bug]: ${errorMessage.substring(0, 80)}`;
  const issueBody = `
### 🚨 Runtime Error
**Error**: \`${errorMessage}\`
**Location**: \`${window.location.pathname}\`

### 🛠 System Context
- **Host**: ${window.location.host}
- **User Agent**: ${userAgent}
- **Network**: ${networkStatus}
- **Memory**: ${memoryUsage}
- **Time**: ${timestamp}

### 📄 Stack Trace
\`\`\`text
${errorStack}
\`\`\`

### 📝 User Notes
(Add details here)

---
*MarginPro Debugger*
`.trim();

  const githubUrl = `https://github.com/sandikodev/margin-pro/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${errorName}: ${errorMessage}\n\n${errorStack}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-mono flex flex-col overflow-auto relative selection:bg-red-500/30">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Navbar / Header */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between p-6 md:p-8 border-b border-white/5">
         <div className="flex items-center gap-4">
            <div className="relative">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse"></div>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-gray-100 tracking-tight text-sm uppercase">System Failure</span>
                <span className="text-[10px] text-gray-600 font-medium tracking-widest">{timestamp}</span>
            </div>
         </div>
         <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                {window.location.hostname}
            </div>
            <div className="hidden md:flex items-center gap-2">
                <Activity className="w-3 h-3" />
                v1.0.0
            </div>
         </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex-grow flex flex-col md:flex-row gap-8 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* LEFT COLUMN: Error Details */}
        <div className="flex-grow space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                {errorName}
                </h1>
                <p className="text-xl md:text-2xl text-red-400 font-medium leading-relaxed font-sans">
                {errorMessage}
                </p>
            </div>

            {/* System Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
                        {networkStatus === 'Online' ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
                        Network
                    </div>
                    <span className="text-sm font-medium text-white">{networkStatus}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
                        <Cpu className="w-3 h-3 text-indigo-500" />
                        Memory
                    </div>
                    <span className="text-sm font-medium text-white">{memoryUsage}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
                        <Activity className="w-3 h-3 text-amber-500" />
                        Route
                    </div>
                    <span className="text-xs font-medium text-white truncate" title={url}>{window.location.pathname}</span>
                </div>
            </div>

             {/* Action Bar */}
            <div className="flex flex-wrap gap-3 pt-4">
                <button 
                    onClick={() => window.open(githubUrl, '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    <Github className="w-4 h-4" /> Report Issue
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium border border-gray-700 transition-all active:scale-95"
                >
                    <RefreshCw className="w-4 h-4" /> Reload
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 text-gray-400 rounded-xl text-sm font-medium border border-white/10 transition-all active:scale-95"
                >
                    <Home className="w-4 h-4" /> Home
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN: Stack Trace */}
        <div className="w-full md:w-[45%] flex flex-col">
            <div className="flex-grow rounded-2xl border border-white/10 bg-[#000000] overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Terminal className="w-3 h-3" /> Stack Trace
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
                </div>
                <div className="p-4 overflow-auto flex-grow relative group">
                    <pre className="text-[10px] md:text-xs leading-relaxed text-red-300/90 whitespace-pre-wrap font-mono relative z-10 selection:bg-red-500/40">
                        {errorStack}
                    </pre>
                </div>
            </div>
            
            {/* Footer Attribution */}
            <div className="mt-6 text-right space-y-1 opacity-40 hover:opacity-100 transition-opacity">
                 <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                    Crafted with precision by
                 </p>
                 <div className="text-xs font-bold text-gray-300 flex flex-col items-end">
                    <span>Sandikodev</span>
                    <span className="text-indigo-400">PT Koneksi Jaringan Indonesia</span>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};
