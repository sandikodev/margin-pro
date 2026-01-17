import React, { useState, useEffect, useRef } from 'react';
import { Menu, RefreshCw, Volume2, User, ChevronRight, ArrowLeft, PenLine } from 'lucide-react';
import { CURRENCIES } from '../../lib/constants';
import { Project, BusinessProfile } from '@shared/types';

import { Currency } from '@shared/types';
import { TabId } from './MobileNav';

interface HeaderProps {
  setSidebarOpen: (val: boolean) => void;
  activeTab: string;
  activeProject?: Project;
  updateProject?: (updates: Partial<Project>) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (c: Currency) => void;
  fetchLiveRates: () => void;
  isRefreshingRates: boolean;
  isSpeaking: boolean;
  handleAudioSummary: () => void;
  setActiveTab: (tab: TabId) => void;
  credits: number;
  activeBusiness?: BusinessProfile;
  isProfileEditing?: boolean;
  onProfileBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setSidebarOpen, activeTab, activeProject, updateProject, selectedCurrency, setSelectedCurrency,
  fetchLiveRates, isRefreshingRates, isSpeaking, handleAudioSummary, setActiveTab, credits, activeBusiness,
  isProfileEditing, onProfileBack
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Removed state-syncing effect to prevent render cascades

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (activeProject && updateProject && tempTitle.trim() && tempTitle !== activeProject.name) {
      updateProject({ name: tempTitle });
    } else if (activeProject) {
        setTempTitle(activeProject.name);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const getPageTitle = () => {
    if (isProfileEditing) return 'Edit Detail Bisnis';
    switch(activeTab) {
      case 'home': return 'Dashboard';
      case 'market': return 'Marketplace';
      case 'profile': return 'Merchant Profile';
      case 'topup': return 'Top Up Credits';
      case 'edu': return 'Academy';
      case 'cashflow': return 'Finance Manager';
      case 'calc': return activeProject?.name || 'Calculator';
      case 'insights': return 'Simulasi Profit';
      case 'about': return 'Tentang Platform';
      case 'changelog': return 'System Changelog';
      default: return 'Margins Pro';
    }
  };

  const getSubTitle = () => {
    if (isProfileEditing) return 'Profil Bisnis';
    if (activeTab === 'calc' && activeProject) return activeProject.label;
    if (activeTab === 'home') return 'Overview';
    if (activeTab === 'insights') return activeProject?.name || 'Detail';
    if (activeTab === 'about') return 'Company';
    if (activeTab === 'changelog') return 'History';
    if (activeTab === 'profile') return 'Management';
    if (activeTab === 'topup') return 'Billing';
    return 'Menu';
  };

  const handleBack = () => {
    if (isProfileEditing && onProfileBack) {
      onProfileBack();
      return;
    }
    if (activeTab === 'insights') {
      setActiveTab('calc');
    } else if (activeTab === 'topup') {
      setActiveTab('profile');
    } else if (activeTab === 'about') {
      setActiveTab('edu');
    } else if (activeTab === 'changelog') {
      setActiveTab('about');
    }
  };

  const showBackButton = isProfileEditing || ['insights', 'topup', 'about', 'changelog'].includes(activeTab);
  const isEditable = activeTab === 'calc' && !!activeProject && !!updateProject;

  return (
    <header className="h-16 lg:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-10 flex items-center justify-between z-30 shrink-0 sticky top-0 transition-all">
      <div className="flex items-center gap-3 lg:gap-4 overflow-hidden flex-grow mr-4">
        {showBackButton ? (
           <button 
             onClick={handleBack} 
             className="p-2 -ml-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95 group"
             title="Kembali"
           >
             <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
           </button>
        ) : (
           <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors active:scale-95">
             <Menu className="w-6 h-6" />
           </button>
        )}
        
        <div className="flex flex-col justify-center overflow-hidden w-full max-w-md">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
             <span className="truncate">{getSubTitle()}</span>
             {(isProfileEditing || activeTab === 'calc' || activeTab === 'insights' || activeTab === 'topup' || activeTab === 'about' || activeTab === 'changelog') && <ChevronRight className="w-3 h-3 opacity-50 flex-shrink-0" />}
          </div>
          
          {isEditable && isEditingTitle ? (
             <input 
                ref={titleInputRef}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-sm lg:text-lg font-black text-indigo-600 uppercase tracking-tight w-full outline-none bg-transparent placeholder-indigo-300"
                placeholder="NAMA PROJECT..."
             />
          ) : (
             <h2 
                onClick={() => {
                  if (isEditable) {
                    setTempTitle(activeProject.name);
                    setIsEditingTitle(true);
                  }
                }}
                className={`text-sm lg:text-lg font-black uppercase tracking-tight truncate w-full flex items-center gap-2 group ${isEditable ? 'text-slate-900 cursor-text hover:text-indigo-600' : 'text-slate-900'}`}
                title={isEditable ? "Klik untuk ganti nama" : ""}
             >
                {getPageTitle()}
                {isEditable && <PenLine className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400" />}
             </h2>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
           <select 
             value={selectedCurrency.code} 
             onChange={(e) => setSelectedCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
             className="bg-transparent text-[10px] font-black text-slate-600 pl-2 pr-1 py-1.5 outline-none appearance-none cursor-pointer hover:text-indigo-600 transition-colors"
           >
             {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
           </select>
           <button onClick={fetchLiveRates} className={`p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-all shadow-sm ${isRefreshingRates ? 'animate-spin text-indigo-500' : ''}`}>
             <RefreshCw className="w-3 h-3" />
           </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'calc' && (
            <button 
              onClick={handleAudioSummary} 
              className={`p-2 lg:p-2.5 rounded-full border transition-all active:scale-95 ${isSpeaking ? 'bg-indigo-100 text-indigo-600 border-indigo-200 animate-pulse ring-2 ring-indigo-500/20' : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200'}`}
              title="Dengarkan Analisa AI"
            >
              <Volume2 className="w-4 h-4 lg:w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pl-1 pr-1 lg:pr-3 py-1 rounded-full flex items-center gap-2 transition-all border ${activeTab === 'profile' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
          >
            <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shadow-sm ${activeTab === 'profile' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
              <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className={`text-[9px] font-black uppercase tracking-tight leading-none ${activeTab === 'profile' ? 'text-white' : 'text-slate-900'} truncate max-w-[80px]`}>
                 {activeBusiness?.name || 'Chef Budi'}
              </span>
              <span className={`text-[8px] font-bold leading-none mt-1 ${activeTab === 'profile' ? 'text-indigo-200' : 'text-indigo-600'}`}>{credits} Cr</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};