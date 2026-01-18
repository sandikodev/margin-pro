import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BarChart3, Plus, X, Trash2, Star, Search, TrendingUp, LayoutGrid, Heart, Upload, Loader2, Pin, Store, ChevronUp, Check, Copy, FilePlus, ChevronRight, Globe, Building2, ArrowRightLeft, Layers, ArrowLeft, XCircle } from 'lucide-react';
import { Project, BusinessProfile } from '@shared/types';
import { useContextTrigger } from '../../hooks/useContextTrigger';
import { ContextMenu, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from '../ui/ContextMenu';
import { Modal } from '../ui/Modal';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  projects: Project[];
  allProjects: Project[]; 
  activeTab: string;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  createNewProject: () => void;
  addProject: (project: Project) => void;
  editProject: (id: string, updates: Partial<Project>) => void;
  importProjectWithAI: (jsonString: string) => Promise<string | null>;
  isImporting: boolean;
  deleteProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  activeBusiness?: BusinessProfile;
  businesses: BusinessProfile[];
  onSwitchBusiness: (id: string) => void;
}

const formatCompactCurrency = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'jt';
  if (val >= 1000) return (val / 1000).toFixed(0) + 'rb';
  return val.toString();
};

const SidebarItem: React.FC<{
  project: Project;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onRename: (newName: string) => void;
  onContextMenu: (coords: { x: number; y: number }) => void;
  onInteractionStart: () => void;
}> = ({ project, isActive, onClick, onDelete, onFavorite, onRename, onContextMenu, onInteractionStart }) => {
  // Swipe State
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const currentOffset = useRef(0);
  const isDragging = useRef(false);
  
  // Renaming State
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Modular Context Interaction Hook
  const { isPressing, triggerProps } = useContextTrigger({
    onTrigger: (coords) => {
      setOffset(0);
      currentOffset.current = 0;
      if (navigator.vibrate) navigator.vibrate(50);
      onContextMenu(coords);
    },
    longPressDelay: 500
  });

  useEffect(() => {
    if (isRenaming && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isRenaming]);

  // --- INTEGRATED TOUCH LOGIC (SWIPE + LONG PRESS) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRenaming) return;
    onInteractionStart(); 
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
    if (triggerProps.onTouchStart) triggerProps.onTouchStart(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (triggerProps.onTouchMove) triggerProps.onTouchMove(e);
    if (!isDragging.current || isRenaming) return;
    if (isPressing) return;

    const diff = e.touches[0].clientX - startX.current;
    
    if (diff < 0 && diff > -140) {
      currentOffset.current = diff;
      setOffset(diff);
    } else if (diff > 0) {
      currentOffset.current = diff * 0.2; 
      setOffset(diff * 0.2);
    }
  };

  const handleTouchEnd = () => {
    if (triggerProps.onTouchEnd) triggerProps.onTouchEnd();
    isDragging.current = false;
    
    if (currentOffset.current < -60) {
      setOffset(-120); 
      currentOffset.current = -120;
      if (navigator.vibrate) navigator.vibrate(20);
    } else {
      setOffset(0);
      currentOffset.current = 0;
    }
  };

  // State reset handled by key-based remounting in parent

  const handleFinishRename = () => {
    if (tempName.trim() && tempName !== project.name) {
        onRename(tempName);
    } else {
        setTempName(project.name);
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFinishRename();
    if (e.key === 'Escape') {
        setTempName(project.name);
        setIsRenaming(false);
    }
  };

  return (
    <div className="relative mb-2 select-none group">
      {/* Background Actions (Revealed on Swipe) */}
      <div className="absolute inset-0 flex justify-end overflow-hidden rounded-xl bg-slate-950">
         <button 
           onClick={(e) => { e.stopPropagation(); onFavorite(); setOffset(0); }}
           className="w-[60px] h-full flex flex-col items-center justify-center gap-1 text-slate-400 active:text-yellow-400 transition-colors bg-slate-900 border-l border-white/5"
         >
           <Star className={`w-5 h-5 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
           <span className="text-[8px] font-bold uppercase">Pin</span>
         </button>
         <button 
           onClick={(e) => { 
             e.stopPropagation(); 
             if(window.confirm(`Hapus produk/layanan "${project.name}" secara permanen?`)) {
                onDelete();
             } 
           }}
           className="w-[60px] h-full flex flex-col items-center justify-center gap-1 text-slate-400 active:text-rose-500 transition-colors bg-slate-900 border-l border-white/5"
         >
           <Trash2 className="w-5 h-5" />
           <span className="text-[8px] font-bold uppercase">Hapus</span>
         </button>
      </div>

      <div 
        onClick={() => {
            if (Math.abs(offset) > 5) {
                setOffset(0);
                currentOffset.current = 0;
                return;
            }
            if (isRenaming) return;
            onClick();
        }}
        onContextMenu={(e) => {
            onInteractionStart();
            if (triggerProps.onContextMenu) triggerProps.onContextMenu(e);
        }} 
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove}   
        onTouchEnd={handleTouchEnd}     
        className={`relative w-full p-3 transition-all duration-300 ease-out cursor-pointer will-change-transform rounded-xl border z-10
          ${isActive 
            ? 'bg-slate-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] translate-x-1' 
            : 'bg-slate-950 border-transparent hover:bg-slate-900'
          }
          ${isPressing ? 'scale-[0.98] opacity-80' : ''}
          `}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <div className="flex items-center gap-3">
            {/* Visual Thumbnail */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 border border-white/10 shadow-sm transition-colors
                ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'}
            `}>
                {project.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                    {isRenaming ? (
                        <input 
                            ref={inputRef}
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={handleFinishRename}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-slate-950 text-white text-sm font-bold rounded px-1 -ml-1 outline-none border border-indigo-500"
                            autoFocus
                        />
                    ) : (
                        <h4 className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-indigo-100' : 'text-slate-300'}`}>
                            {project.name}
                        </h4>
                    )}
                    
                    {/* Status Icons */}
                    <div className="flex items-center gap-1.5 pl-2 shrink-0">
                       {project.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                       {isActive && !isRenaming && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-black ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-500'}`}>
                            {project.pricingStrategy === 'competitor' ? 'Market' : 'Markup'}
                        </span>
                        {project.targetNet > 0 && (
                            <span className="text-[9px] font-medium text-emerald-400 flex items-center gap-0.5">
                                <TrendingUp className="w-2.5 h-2.5" /> {formatCompactCurrency(project.targetNet)}
                            </span>
                        )}
                    </div>
                    <span className="text-[9px] text-slate-600 font-medium">
                        {new Date(project.lastModified).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, setIsOpen, projects, allProjects, activeTab, activeProjectId, 
  setActiveProjectId, setActiveTab, createNewProject, addProject, editProject, importProjectWithAI, isImporting,
  deleteProject, toggleFavorite, 
  activeBusiness, businesses, onSwitchBusiness
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOutletMenuOpen, setIsOutletMenuOpen] = useState(false);
  
  // Creation Modal
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [creationView, setCreationView] = useState<'main' | 'clone'>('main');
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ project: Project; x: number; y: number } | null>(null);
  const [contextMenuView, setContextMenuView] = useState<'main' | 'outlets' | 'actions'>('main');
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outletMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Outlet Menu Outside Click
      if (outletMenuRef.current && !outletMenuRef.current.contains(event.target as Node)) {
        setIsOutletMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  const favoriteProjects = useMemo(() => filteredProjects.filter(p => p.isFavorite), [filteredProjects]);
  const recentProjects = useMemo(() => filteredProjects.filter(p => !p.isFavorite), [filteredProjects]);

  const totalFavorites = projects.filter(p => p.isFavorite).length;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  /* eslint-disable react-hooks/purity */ // Suppress purity check for event handler
  const handleCloneProject = (sourceProject: Project) => {
    if (!activeBusiness?.id) return; 

    const newId = Math.random().toString(36).substr(2, 9);
    const cloned: Project = {
      ...sourceProject,
      id: newId,
      businessId: activeBusiness.id, 
      name: `${sourceProject.name} (Copy)`,
      lastModified: Date.now(),
      isFavorite: false
    };

    addProject(cloned);
    setActiveProjectId(newId);
    setActiveTab('calc');
    setIsCreationModalOpen(false);
    setIsOpen(false);
  };
  /* eslint-enable react-hooks/purity */

  const handleTransferProject = (action: 'move' | 'copy') => {
    if (!contextMenu?.project || !transferTargetId) return;

    if (action === 'move') {
      editProject(contextMenu.project.id, { businessId: transferTargetId });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const cloned: Project = {
        ...contextMenu.project,
        id: newId,
        businessId: transferTargetId,
        name: `${contextMenu.project.name} (Copy)`,
        lastModified: Date.now(),
        isFavorite: false
      };
      addProject(cloned);
    }
    setContextMenu(null);
    setContextMenuView('main');
    setTransferTargetId(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (text) {
          const newId = await importProjectWithAI(text);
          if (newId) {
            setActiveProjectId(newId);
            setActiveTab('calc');
            setIsOpen(false);
          }
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCloseContext = () => {
    setContextMenu(null);
    setContextMenuView('main');
    setTransferTargetId(null);
  };

  return (
    <div className={`fixed inset-0 z-[60] lg:relative lg:translate-x-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-full lg:w-80 bg-slate-950 flex flex-col text-white shadow-2xl border-r border-white/5`}>
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
             <h1 className="text-lg font-black tracking-tighter uppercase leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Margin Pro</h1>
             <span className="text-[9px] font-medium text-slate-500 tracking-widest">Pricing Intelligence</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/5">
         <div className="p-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default group">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest group-hover:text-indigo-400 transition-colors">Total Items</span>
            <div className="flex items-center gap-2 mt-1">
               <LayoutGrid className="w-4 h-4 text-slate-600 group-hover:text-indigo-500 transition-colors" />
               <span className="text-xl font-black text-white">{projects.length}</span>
            </div>
         </div>
         <div className="p-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-default group">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest group-hover:text-yellow-400 transition-colors">Favorit</span>
            <div className="flex items-center gap-2 mt-1">
               <Heart className="w-4 h-4 text-slate-600 group-hover:text-yellow-500 transition-colors" />
               <span className="text-xl font-black text-white">{totalFavorites}</span>
            </div>
         </div>
      </div>

      {/* SEARCH & PRIMARY ACTION */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="px-5 py-4 space-y-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk atau proyek..." 
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-9 py-3 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all" 
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
           </div>
           
           <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Project Library</p>
              <div className="flex items-center gap-2">
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                 <button 
                   onClick={handleImportClick} 
                   disabled={isImporting}
                   title="Import JSON"
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
                 >
                    {isImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Upload className="w-3.5 h-3.5 text-slate-400" />}
                 </button>
                 <button 
                   onClick={() => { setIsCreationModalOpen(true); setCreationView('main'); }} 
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/50 group"
                 >
                    <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wide">Baru</span>
                 </button>
              </div>
           </div>
        </div>
        
        {/* PROJECTS LIST */}
        <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-6 scrollbar-hide">
          {filteredProjects.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 text-slate-600 gap-2 opacity-50">
                <LayoutGrid className="w-10 h-10 mb-2" />
                <span className="text-xs font-medium">Tidak ada produk ditemukan.</span>
             </div>
          ) : (
            <>
              {favoriteProjects.length > 0 && (
                <div className="space-y-2">
                  <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md py-2 z-10 flex items-center gap-2 px-2 border-b border-white/5">
                    <Pin className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Pinned Projects</span>
                  </div>
                  {favoriteProjects.map(p => (
                      <SidebarItem 
                        key={`${p.id}-${(activeProjectId === p.id && activeTab === 'calc') ? 'active' : 'inactive'}`}
                        project={p}
                        isActive={activeProjectId === p.id && activeTab === 'calc'}
                        onClick={() => { setActiveProjectId(p.id); setActiveTab('calc'); setIsOpen(false); }}
                        onDelete={() => deleteProject(p.id)}
                        onFavorite={() => toggleFavorite(p.id)}
                        onRename={(newName) => editProject(p.id, { name: newName })}
                        onContextMenu={(coords) => {
                            setContextMenu({ project: p, ...coords });
                            setContextMenuView('main');
                            setTransferTargetId(null);
                        }}
                        onInteractionStart={handleCloseContext}
                      />
                  ))}
                </div>
              )}

              {recentProjects.length > 0 && (
                <div className="space-y-2">
                   <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md py-2 z-10 flex items-center gap-2 px-2 border-b border-white/5">
                    <Layers className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">All Items</span>
                  </div>
                   {recentProjects.map(p => (
                      <SidebarItem 
                        key={`${p.id}-${(activeProjectId === p.id && activeTab === 'calc') ? 'active' : 'inactive'}`}
                        project={p}
                        isActive={activeProjectId === p.id && activeTab === 'calc'}
                        onClick={() => { setActiveProjectId(p.id); setActiveTab('calc'); setIsOpen(false); }}
                        onDelete={() => deleteProject(p.id)}
                        onFavorite={() => toggleFavorite(p.id)}
                        onRename={(newName) => editProject(p.id, { name: newName })}
                        onContextMenu={(coords) => {
                            setContextMenu({ project: p, ...coords });
                            setContextMenuView('main');
                            setTransferTargetId(null);
                        }}
                        onInteractionStart={handleCloseContext}
                      />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* FOOTER PROFILE WITH SWITCHER */}
      <div className="p-4 bg-slate-950 border-t border-white/5 relative z-30" ref={outletMenuRef}>
         {isOutletMenuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200 z-[70]">
               <div className="max-h-60 overflow-y-auto scrollbar-hide py-1">
                  {businesses.map(b => (
                     <button 
                        key={b.id} 
                        onClick={() => { onSwitchBusiness(b.id); setIsOutletMenuOpen(false); }}
                        className={`w-full p-3 px-4 flex items-center justify-between hover:bg-white/5 transition-colors group ${activeBusiness?.id === b.id ? 'bg-indigo-500/10' : ''}`}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg`} style={{ backgroundColor: b.themeColor === 'emerald' ? '#10b981' : b.themeColor === 'rose' ? '#f43f5e' : b.themeColor === 'orange' ? '#f97316' : '#6366f1' }}>
                              {b.name.charAt(0)}
                           </div>
                           <div className="flex flex-col text-left">
                              <span className={`text-[11px] font-bold truncate max-w-[140px] ${activeBusiness?.id === b.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{b.name}</span>
                              <span className="text-[8px] font-medium text-slate-500 uppercase tracking-tight">{b.type.replace('_', ' ')}</span>
                           </div>
                        </div>
                        {activeBusiness?.id === b.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                     </button>
                  ))}
               </div>
            </div>
         )}

         <button 
           onClick={() => setIsOutletMenuOpen(!isOutletMenuOpen)} 
           className={`w-full bg-slate-900 border rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all group relative overflow-hidden active:scale-95
           ${isOutletMenuOpen ? 'border-indigo-500 shadow-lg shadow-indigo-900/20 ring-1 ring-indigo-500/50' : 'border-white/5 hover:border-white/10 hover:bg-slate-800'}`}
         >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform`} style={{ backgroundColor: activeBusiness?.themeColor === 'emerald' ? '#10b981' : activeBusiness?.themeColor === 'rose' ? '#f43f5e' : activeBusiness?.themeColor === 'orange' ? '#f97316' : '#6366f1' }}>
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col truncate z-10 flex-grow">
              <span className="text-[11px] font-black uppercase tracking-widest text-white leading-none truncate mb-1">{activeBusiness?.name || 'My Business'}</span>
              <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {businesses.length > 1 ? 'Switch Business' : 'Active'}
              </span>
            </div>
            <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOutletMenuOpen ? 'rotate-180 text-indigo-400' : ''}`} />
         </button>
      </div>

      {/* --- DRILL-DOWN CONTEXT MENU --- */}
      {contextMenu && (
        <ContextMenu 
          position={contextMenu} 
          onClose={handleCloseContext}
          title={
             contextMenuView === 'main' ? contextMenu.project.name :
             contextMenuView === 'outlets' ? 'Pilih Tujuan' :
             'Konfirmasi Aksi'
          }
        >
           {/* ... Context Menu content remains the same ... */}
           {contextMenuView === 'main' && (
             <>
               <ContextMenuItem 
                  icon={Star} 
                  label={contextMenu.project.isFavorite ? 'Unpin' : 'Pin to Top'} 
                  onClick={() => { 
                    handleCloseContext(); 
                    editProject(contextMenu.project.id, { isFavorite: !contextMenu.project.isFavorite }); 
                  }}
                  rightSlot={contextMenu.project.isFavorite && <Check className="w-3 h-3 text-indigo-500" />}
               />
               
               <ContextMenuItem 
                  icon={Trash2} 
                  label="Hapus Item" 
                  variant="danger"
                  onClick={() => { 
                    handleCloseContext(); 
                    if(window.confirm(`Hapus item "${contextMenu.project.name}" secara permanen?`)) deleteProject(contextMenu.project.id); 
                  }}
               />

               <ContextMenuSeparator />
               <ContextMenuLabel>Transfer Data</ContextMenuLabel>
               
               <ContextMenuItem 
                  icon={ArrowRightLeft}
                  label="Pindah / Salin ke..."
                  onClick={() => setContextMenuView('outlets')}
                  rightSlot={<ChevronRight className="w-3 h-3 text-slate-400" />}
               />
             </>
           )}

           {contextMenuView === 'outlets' && (
             <>
               <div className="px-1 pb-1">
                  <button onClick={() => setContextMenuView('main')} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1">
                     <ArrowLeft className="w-3 h-3" /> Kembali
                  </button>
               </div>
               
               {businesses.filter(b => b.id !== activeBusiness?.id).length === 0 ? (
                  <div className="px-3 py-2 text-[10px] text-slate-400 italic text-center">Tidak ada cabang lain</div>
               ) : (
                  businesses.filter(b => b.id !== activeBusiness?.id).map(target => (
                     <ContextMenuItem 
                        key={target.id}
                        icon={Building2}
                        label={target.name}
                        onClick={() => {
                           setTransferTargetId(target.id);
                           setContextMenuView('actions');
                        }}
                        rightSlot={<ChevronRight className="w-3 h-3 text-slate-300" />}
                     />
                  ))
               )}
             </>
           )}

           {contextMenuView === 'actions' && transferTargetId && (
             <>
               <div className="px-1 pb-1">
                  <button onClick={() => setContextMenuView('outlets')} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1">
                     <ArrowLeft className="w-3 h-3" /> Kembali
                  </button>
               </div>
               
               <ContextMenuLabel>Pilih Metode Transfer</ContextMenuLabel>
               
               <ContextMenuItem 
                  icon={ArrowRightLeft} 
                  label="Pindahkan (Cut & Paste)" 
                  onClick={() => handleTransferProject('move')} 
               />
               <ContextMenuItem 
                  icon={Copy} 
                  label="Duplikat (Copy & Paste)" 
                  onClick={() => handleTransferProject('copy')} 
               />
             </>
           )}
        </ContextMenu>
      )}

      {/* --- CREATION OPTIONS MODAL (Using Reusable Modal with Footer) --- */}
      <Modal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        title={creationView === 'main' ? 'Buat Item Baru' : 'Pilih Template'}
        description={creationView === 'main' ? 'Node Creation Protocol' : 'Duplikasi Lintas Bisnis'}
        icon={FilePlus}
        footer={creationView === 'clone' ? (
           <button 
             onClick={() => setCreationView('main')}
             className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center gap-2"
           >
             <X className="w-3 h-3" /> Kembali ke Opsi Utama
           </button>
        ) : null}
      >
         <div className="p-6 lg:p-8">
            {creationView === 'main' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                   onClick={() => { createNewProject(); setIsCreationModalOpen(false); setIsOpen(false); }}
                   className="p-6 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left flex flex-col gap-4 group active:scale-95 shadow-sm"
                 >
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                       <FilePlus className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Mulai Dari Nol</h4>
                       <p className="text-[10px] text-slate-400 font-bold mt-1 leading-relaxed">Kanvas kosong. Cocok untuk produk baru.</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => setCreationView('clone')}
                   className="p-6 rounded-[2rem] border-2 border-slate-100 hover:border-violet-600 hover:bg-violet-50 transition-all text-left flex flex-col gap-4 group active:scale-95 shadow-sm"
                 >
                    <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-inner">
                       <Copy className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Duplikat Item</h4>
                       <p className="text-[10px] text-slate-400 font-bold mt-1 leading-relaxed">Salin data dari produk yang sudah ada.</p>
                    </div>
                 </button>
              </div>
            ) : (
              <div className="space-y-3 px-1 min-h-[300px]">
                 <div className="flex items-center gap-2 mb-4 px-1">
                    <Globe className="w-3 h-3 text-indigo-500" />
                    <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Global Database</span>
                 </div>
                 
                 {allProjects.length === 0 ? (
                   <div className="py-20 text-center opacity-40">
                      <LayoutGrid className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-xs font-black uppercase">Belum ada item yang bisa di-clone</p>
                   </div>
                 ) : (
                   allProjects.map(p => {
                     const sourceBusiness = businesses.find(b => b.id === p.businessId);
                     return (
                       <button 
                          key={p.id}
                          onClick={() => handleCloneProject(p)}
                          className="w-full p-4 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-between group text-left transition-all active:scale-[0.98] shadow-sm bg-white"
                       >
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0 group-hover:scale-110 transition-transform`} style={{ backgroundColor: sourceBusiness?.themeColor === 'emerald' ? '#10b981' : sourceBusiness?.themeColor === 'rose' ? '#f43f5e' : sourceBusiness?.themeColor === 'orange' ? '#f97316' : '#6366f1' }}>
                                {p.name.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                <span className="text-sm font-black text-slate-800 block leading-tight mb-1 truncate">{p.name}</span>
                                <div className="flex items-center gap-2">
                                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                      {sourceBusiness?.name || 'Unassigned'}
                                   </span>
                                </div>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                       </button>
                     );
                   })
                 )}
              </div>
            )}
         </div>
      </Modal>
    </div>
  );
};