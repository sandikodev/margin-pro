
import React, { useState } from 'react';
import { Share2, FileText, FileJson, Copy, Check } from 'lucide-react';
import { Project } from '@shared/types';
import { generateIntelligencePDF, downloadProjectJSON, copyProjectToClipboard } from '../../../lib/export-service';
import { useConfig } from '../../../hooks/useConfig';

interface ExportActionsProps {
  activeProject: Project;
  formatValue: (val: number) => string;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ activeProject, formatValue }) => {
  const { platforms } = useConfig();
  const [showMenu, setShowMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const success = await copyProjectToClipboard(activeProject);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/10"
      >
        <Share2 className="w-3.5 h-3.5" /> Export Analysis
      </button>
      
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl w-56 p-2 z-20 animate-in fade-in zoom-in-95 origin-top-right ring-1 ring-black/5">
            <div className="px-3 py-2 border-b border-slate-50 mb-1">
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Select Format</p>
            </div>
            
            <button onClick={() => { generateIntelligencePDF(activeProject, formatValue, platforms); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-rose-50 rounded-xl text-left group transition-colors">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-all"><FileText className="w-4 h-4" /></div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">PDF Intelligence Report</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Siap cetak & arsip</span>
              </div>
            </button>

            <button onClick={() => { downloadProjectJSON(activeProject); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-emerald-50 rounded-xl text-left group transition-colors">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all"><FileJson className="w-4 h-4" /></div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">JSON Project Data</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Transfer antar akun</span>
              </div>
            </button>

            <button onClick={handleCopy} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-indigo-50 rounded-xl text-left group transition-colors">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">{copySuccess ? 'Copied!' : 'Copy to Clipboard'}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Fast share data</span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
