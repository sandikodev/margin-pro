import React, { useState } from 'react';
import { Settings, Trash2, X, FilePlus, Share2, FileJson, Copy, FileText, Check, ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import { OperationalContext } from './calculator/OperationalContext';
import { CostList } from './calculator/CostList';
import { PricingStrategySection } from './calculator/PricingStrategySection';
import { calculateTotalHPP } from '../utils'; // Import Centralized Math
import { jsPDF } from "jspdf";

interface MenuBuilderProps {
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  createNewProject: () => void;
  deleteProject: (id: string) => void;
  formatValue: (val: number) => string;
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({
  activeProject, updateProject, createNewProject, deleteProject, formatValue
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false); 
  const [fabMode, setFabMode] = useState<'main' | 'export'>('main'); 
  const [copySuccess, setCopySuccess] = useState(false);

  // Use Centralized HPP Calculation
  const totalEffectiveCost = calculateTotalHPP(activeProject.costs, activeProject.productionConfig);
  const prodConfig = activeProject.productionConfig || { period: 'weekly', daysActive: 5, targetUnits: 40 };

  const handleDelete = () => {
    if (window.confirm(`Yakin ingin menghapus menu "${activeProject.name}"?`)) {
       deleteProject(activeProject.id);
       setIsMenuOpen(false);
    }
  };

  const handleCreate = () => {
    createNewProject();
    setIsMenuOpen(false);
  };

  // --- EXPORT LOGIC ---
  const handleCopyJSON = () => {
    const json = JSON.stringify(activeProject, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        setShowExportMenu(false);
        setIsMenuOpen(false);
        setFabMode('main');
    });
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(activeProject, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `margins-pro-${activeProject.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
    setIsMenuOpen(false);
    setFabMode('main');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("MARGINS PRO REPORT", 14, 20);
    doc.setFontSize(12);
    doc.text(`Project: ${activeProject.name}`, 14, 30);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

    // Summary
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 45, 180, 25, 'F');
    doc.text(`Total Cost/Portion: ${formatValue(totalEffectiveCost)}`, 20, 55);
    doc.text(`Target Net Profit: ${formatValue(activeProject.targetNet)}`, 20, 62);
    
    // Costs Table Header
    let yPos = 85;
    doc.setFontSize(10);
    doc.text("Cost Breakdown:", 14, 80);
    doc.line(14, 82, 190, 82);
    
    doc.setFont("helvetica", "bold");
    doc.text("Item Name", 14, yPos);
    doc.text("Price", 120, yPos);
    doc.text("Yield", 160, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 8;
    
    // Items
    activeProject.costs.forEach((cost) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(cost.name.substring(0, 50), 14, yPos);
        doc.text(formatValue(cost.amount), 120, yPos);
        doc.text(cost.allocation === 'bulk' ? 'Bulk' : 'Unit', 160, yPos);
        yPos += 7;
    });

    doc.save(`report-${activeProject.name}.pdf`);
    setShowExportMenu(false);
    setIsMenuOpen(false);
    setFabMode('main');
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
        setIsMenuOpen(false);
        setTimeout(() => setFabMode('main'), 300);
    } else {
        setIsMenuOpen(true);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 relative pb-32">
      
      {/* EXPORT HEADER ACTIONS (Desktop Only) */}
      <div className="hidden lg:flex justify-end relative">
         <button 
           onClick={() => setShowExportMenu(!showExportMenu)}
           className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
         >
           <Share2 className="w-3.5 h-3.5" /> Export Data
         </button>
         
         {showExportMenu && (
             <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl w-48 p-2 z-20 animate-in fade-in zoom-in-95 origin-top-right">
                <button onClick={handleDownloadJSON} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left group">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100"><FileJson className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-slate-700">Download JSON</span>
                </button>
                <button onClick={handleDownloadPDF} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left group">
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100"><FileText className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-slate-700">PDF Report</span>
                </button>
                <button onClick={handleCopyJSON} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left group">
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100">
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{copySuccess ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
             </div>
         )}
      </div>

      <OperationalContext 
        activeProject={activeProject}
        updateProject={updateProject}
        prodConfig={prodConfig}
      />

      <CostList 
        activeProject={activeProject}
        updateProject={updateProject}
        formatValue={formatValue}
        prodConfig={prodConfig}
        totalEffectiveCost={totalEffectiveCost}
      />

      <PricingStrategySection 
        activeProject={activeProject}
        updateProject={updateProject}
        formatValue={formatValue}
        prodConfig={prodConfig}
        totalEffectiveCost={totalEffectiveCost}
      />
      
      {/* FLOATING GEAR MENU */}
      <div className="lg:hidden fixed bottom-28 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
         <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              
              {fabMode === 'main' ? (
                <>
                  <button 
                    onClick={() => setFabMode('export')} 
                    className="flex items-center gap-3 group mr-1"
                  >
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all origin-right">
                        Export
                     </span>
                     <div className="w-12 h-12 bg-white text-slate-600 border border-slate-200 rounded-full shadow-xl flex items-center justify-center group-active:scale-90 transition-transform">
                        <Share2 className="w-5 h-5" />
                     </div>
                  </button>

                  <button 
                    onClick={handleDelete} 
                    className="flex items-center gap-3 group mr-1"
                  >
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all origin-right">
                        Hapus
                     </span>
                     <div className="w-12 h-12 bg-rose-600 text-white rounded-full shadow-xl shadow-rose-600/40 flex items-center justify-center group-active:scale-90 transition-transform">
                        <Trash2 className="w-5 h-5" />
                     </div>
                  </button>

                  <button 
                    onClick={handleCreate} 
                    className="flex items-center gap-3 group mr-1"
                  >
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all origin-right">
                        Menu Baru
                     </span>
                     <div className="w-12 h-12 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-600/40 flex items-center justify-center group-active:scale-90 transition-transform">
                        <FilePlus className="w-5 h-5" />
                     </div>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleDownloadPDF} className="flex items-center gap-3 group mr-1 animate-in slide-in-from-right-4 duration-300 delay-75">
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100">PDF Report</span>
                     <div className="w-12 h-12 bg-rose-500 text-white rounded-full shadow-xl flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                  </button>
                  <button onClick={handleDownloadJSON} className="flex items-center gap-3 group mr-1 animate-in slide-in-from-right-4 duration-300 delay-100">
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100">JSON Data</span>
                     <div className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center"><FileJson className="w-5 h-5" /></div>
                  </button>
                  <button onClick={handleCopyJSON} className="flex items-center gap-3 group mr-1 animate-in slide-in-from-right-4 duration-300 delay-150">
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100">{copySuccess ? 'Copied' : 'Copy'}</span>
                     <div className="w-12 h-12 bg-indigo-500 text-white rounded-full shadow-xl flex items-center justify-center">
                        {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                     </div>
                  </button>
                  <button onClick={() => setFabMode('main')} className="flex items-center gap-3 group mr-1 animate-in slide-in-from-right-4 duration-300">
                     <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100">Batal</span>
                     <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-full shadow-xl flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></div>
                  </button>
                </>
              )}
         </div>

         <button 
            onClick={toggleMenu} 
            className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center pointer-events-auto transition-all duration-300 active:scale-90 ${isMenuOpen ? 'bg-slate-800 text-white rotate-90 shadow-slate-900/50' : 'bg-indigo-600 text-white shadow-indigo-600/50'}`}
         >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
         </button>
      </div>
    </div>
  );
};