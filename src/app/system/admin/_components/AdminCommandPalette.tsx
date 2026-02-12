import React from 'react';
import { Search, LayoutDashboard, Settings, Layers, Languages, Cpu, FileText, Brush, Download, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type AdminTab = 'overview' | 'users' | 'settings' | 'platforms' | 'translations' | 'intelligence' | 'invoices' | 'branding';

interface AdminCommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveTab: (tab: AdminTab) => void;
    exportDictionary: () => void;
    setFilterMissing: (val: boolean) => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({ isOpen, onClose, setActiveTab, exportDictionary, setFilterMissing }) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
                            <Search className="w-6 h-6 text-indigo-600" />
                            <input
                                autoFocus
                                placeholder="Type a command or search settings..."
                                className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800"
                            />
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">ESC to Close</div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                            <div className="px-4 py-2">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Navigation</h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'overview', label: 'Jump to Overview', icon: LayoutDashboard },
                                        { id: 'settings', label: 'Jump to Settings', icon: Settings },
                                        { id: 'platforms', label: 'Jump to Platforms', icon: Layers },
                                        { id: 'translations', label: 'Jump to Dictionary', icon: Languages },
                                        { id: 'intelligence', label: 'Jump to Intelligence', icon: Cpu },
                                        { id: 'invoices', label: 'Jump to Invoices', icon: FileText },
                                        { id: 'branding', label: 'Jump to Design', icon: Brush },
                                    ].map(cmd => (
                                        <button
                                            key={cmd.id}
                                            onClick={() => { setActiveTab(cmd.id as AdminTab); onClose(); }}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all text-xs font-bold"
                                        >
                                            <cmd.icon className="w-4 h-4" /> {cmd.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="px-4 py-2">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quick Actions</h5>
                                <button onClick={() => { exportDictionary(); onClose(); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all text-xs font-bold">
                                    <div className="flex items-center gap-3"><Download className="w-4 h-4" /> Export Lexicon (JSON)</div>
                                    <ChevronRight className="w-4 h-4 opacity-30" />
                                </button>
                                <button onClick={() => { setFilterMissing(true); setActiveTab('translations'); onClose(); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-all text-xs font-bold">
                                    <div className="flex items-center gap-3"><AlertCircle className="w-4 h-4" /> Show Untranslated Terms</div>
                                    <ChevronRight className="w-4 h-4 opacity-30" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tip: Use arrows to navigate results (Coming Soon)</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
