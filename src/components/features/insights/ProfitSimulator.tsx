
import React, { useState, useMemo } from 'react';
import { TrendingUp, Flame, AlertCircle, ChevronDown, Layers, ShieldCheck, Store, Globe, Utensils, Box, ArrowRight, Settings2, Sliders, CreditCard, Coins, CheckCircle2, Clock, Activity, Package, BarChart3, Eye, EyeOff, AlertTriangle, Tag, Receipt, Wallet, Info, LayoutGrid, PieChart, X, Scissors } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { CalculationResult, Platform, Project, PlatformOverrides } from '../../../types';
import { PLATFORM_DATA, TERMINOLOGY } from '../../../lib/constants';
import { calculateTotalHPP } from '../../../lib/utils';
import { FloatingActionMenu } from '../../ui/FloatingActionMenu';
import { Modal } from '../../ui/Modal';
import { TabNavigation, TabItem } from '../../ui/TabNavigation';
import { Carousel, CarouselItem } from '../../ui/Carousel';

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

interface ProfitSimulatorProps {
  results: CalculationResult[];
  chartData: any[];
  feeComparisonData: any[];
  promoPercent: number;
  setPromoPercent: (val: number) => void;
  expandedPlatform: Platform | null;
  setExpandedPlatform: (p: Platform | null) => void;
  formatValue: (val: number) => string;
  selectedCurrency: any;
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  overrides: Record<Platform, PlatformOverrides>;
  setOverrides: React.Dispatch<React.SetStateAction<Record<Platform, PlatformOverrides>>>;
  onBack: () => void;
  onOpenSidebar: () => void;
  t: (key: keyof typeof TERMINOLOGY) => string;
}

type CategoryType = 'food' | 'marketplace' | 'export' | 'offline';

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({
  results, chartData, feeComparisonData, promoPercent, setPromoPercent, 
  expandedPlatform, setExpandedPlatform, formatValue, selectedCurrency, 
  activeProject, updateProject, overrides, setOverrides, onBack, onOpenSidebar, t
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('food');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [modalTab, setModalTab] = useState<'settings' | 'breakdown'>('settings');

  const totalHPP = useMemo(() => calculateTotalHPP(activeProject.costs, activeProject.productionConfig), [activeProject]);
  const targetPortions = activeProject.productionConfig?.targetUnits || 0;

  const realStrategy = activeProject.pricingStrategy || 'markup';
  const effectiveStrategy = isPreviewing 
    ? (realStrategy === 'competitor' ? 'markup' : 'competitor')
    : realStrategy;

  let displayProfit = 0;
  let displayLabel = '';
  let displaySubLabel = '';

  if (effectiveStrategy === 'markup') {
     displayProfit = activeProject.targetNet || 0;
     displayLabel = t('strategyMarkup');
     displaySubLabel = t('profitTarget');
  } else {
     displayProfit = (activeProject.competitorPrice || 0) - totalHPP;
     displayLabel = t('strategyCompetitor');
     displaySubLabel = 'Sesuai Harga Saingan';
  }

  const displayTotalPotential = displayProfit * targetPortions;

  const filteredResults = useMemo(() => {
    return results.filter(r => PLATFORM_DATA[r.platform].category === activeCategory);
  }, [results, activeCategory]);

  // Updated to match TabItem interface (using LucideIcon type implicitly)
  const categories: TabItem[] = [
    { id: 'food', label: 'Aplikasi Food', icon: Utensils },
    { id: 'marketplace', label: 'Toko Online', icon: Store },
    { id: 'offline', label: 'Jual Langsung', icon: Box },
    { id: 'export', label: 'Luar Negeri', icon: Globe },
  ];

  const updateFee = (platform: Platform, field: keyof PlatformOverrides, value: number) => {
    setOverrides(prev => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value }
    }));
  };

  // Helper to get active result for modal
  const activeResult = useMemo(() => {
    if (!expandedPlatform) return null;
    return results.find(r => r.platform === expandedPlatform);
  }, [expandedPlatform, results]);

  const primaryScenario = useMemo(() => {
    if (!activeResult) return null;
    const isCompetitorStrategy = effectiveStrategy === 'competitor';
    return isCompetitorStrategy ? (activeResult.competitorProtection || activeResult.recommended) : activeResult.recommended;
  }, [activeResult, effectiveStrategy]);

  // Define Tabs Data for Modal
  const modalTabsData: TabItem[] = [
    { id: 'settings', label: 'Atur Biaya', icon: Sliders },
    { id: 'breakdown', label: 'Komposisi Harga', icon: PieChart }
  ];

  // Safe Percentage helper
  const safePercent = (numerator: number | undefined, denominator: number | undefined) => {
    if (!numerator || !denominator || denominator === 0 || isNaN(numerator) || isNaN(denominator)) return '0.0';
    return ((numerator / denominator) * 100).toFixed(1);
  };

  // Safe toFixed helper
  const safeToFixed = (val: number | undefined, digits: number = 0) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return val.toFixed(digits);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. RINGKASAN STRATEGI */}
      <div className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500 ${isPreviewing ? 'bg-slate-800 scale-[0.99]' : 'bg-slate-900'}`}>
         {/* ... (Existing Summary Content) ... */}
         <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-4 w-full">
               <div className="flex flex-wrap items-center gap-2">
                  {isPreviewing ? (
                     <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-[9px] font-black uppercase tracking-widest border border-orange-500/30 flex items-center gap-1.5 animate-pulse">
                        <Eye className="w-3 h-3" /> Intip Strategi Lain
                     </span>
                  ) : (
                     <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[9px] font-black uppercase tracking-widest border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                        <Activity className="w-3 h-3" /> Monitor Harga Aktif
                     </span>
                  )}
               </div>
               
               <div>
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-1">{activeProject.name}</h2>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                     <Clock className="w-3 h-3" /> Estimasi Jual {targetPortions} Porsi
                  </div>
               </div>

               <div className="flex items-center gap-3 pt-2">
                  <div className={`inline-flex flex-col border rounded-2xl px-5 py-3 transition-all duration-300 ${isPreviewing ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                     <span className={`text-[8px] font-bold uppercase tracking-widest ${isPreviewing ? 'text-orange-200' : 'text-slate-500'}`}>Gaya Perhitungan:</span>
                     <span className={`text-sm font-black uppercase tracking-wider ${effectiveStrategy === 'competitor' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                         {displayLabel}
                     </span>
                  </div>
                  <button
                     onMouseDown={() => setIsPreviewing(true)}
                     onMouseUp={() => setIsPreviewing(false)}
                     onMouseLeave={() => setIsPreviewing(false)}
                     onTouchStart={() => setIsPreviewing(true)}
                     onTouchEnd={() => setIsPreviewing(false)}
                     className={`h-full aspect-square flex items-center justify-center rounded-2xl border transition-all active:scale-90 select-none ${isPreviewing ? 'bg-white text-indigo-900 border-white shadow-xl' : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'}`}
                  >
                     {isPreviewing ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
               </div>
            </div>

            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
               <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t('hppUnit')}</span>
                  <div>
                     <p className="text-lg font-black text-white leading-none mb-1">{formatValue(totalHPP)}</p>
                     <p className="text-[8px] text-slate-600">Modal Dasar Warung</p>
                  </div>
               </div>

               <div className={`rounded-2xl p-4 border flex flex-col justify-between transition-colors ${isPreviewing ? 'bg-orange-900/20 border-orange-500/30' : 'bg-indigo-900/30 border-indigo-500/20'}`}>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isPreviewing ? 'text-orange-300' : 'text-indigo-300'}`}>
                     {isPreviewing ? 'Preview Cuan' : t('netProfit')}
                  </span>
                  <div>
                     <p className={`text-lg font-black ${displayProfit < 0 ? 'text-rose-400' : 'text-white'}`}>
                        {displayProfit < 0 ? '-' : ''}{formatValue(Math.abs(displayProfit))}
                     </p>
                     <p className={`text-[8px] ${isPreviewing ? 'text-orange-400/80' : 'text-indigo-400/80'}`}>Masuk Kantong Bersih</p>
                  </div>
               </div>

               <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Satu Siklus</span>
                  <div>
                     <p className="text-lg font-black text-white leading-none mb-1">{targetPortions}</p>
                     <p className="text-[8px] text-slate-600">Total Porsi Dijual</p>
                  </div>
               </div>

               <div className={`rounded-2xl p-4 border flex flex-col justify-between ${isPreviewing ? 'bg-orange-900/20 border-orange-500/30' : 'bg-emerald-900/20 border-emerald-500/20'}`}>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isPreviewing ? 'text-orange-300' : 'text-emerald-300'}`}>Total Laba</span>
                  <div>
                     <p className={`text-lg font-black ${displayTotalPotential < 0 ? 'text-rose-400' : 'text-white'}`}>
                        {displayTotalPotential < 0 ? '-' : ''}{formatValue(Math.abs(displayTotalPotential))}
                     </p>
                     <p className={`text-[8px] ${isPreviewing ? 'text-orange-400/80' : 'text-emerald-400/80'}`}>Jika Semua Laku</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none"></div>
      </div>

      {/* 2. PILIH CHANNEL JUALAN (MODULAR TAB NAVIGATION) */}
      <TabNavigation 
        variant="sticky" 
        tabs={categories} 
        activeTab={activeCategory} 
        onChange={(id) => setActiveCategory(id as CategoryType)} 
      />

      {/* 3. SIMULASI DISKON */}
      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-10">
         <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
            <Flame className="w-7 h-7 text-orange-500" />
            <div className="flex-grow">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rencana Diskon Warung</p>
               <p className="text-lg font-black text-slate-800">{promoPercent}% <span className="text-[10px] text-slate-400 font-bold">Diskon Promo</span></p>
            </div>
         </div>
         <div className="flex-grow w-full space-y-4">
            <input 
               type="range" min="0" max="50" step="5" value={promoPercent} 
               onChange={(e) => setPromoPercent(Number(e.target.value))} 
               className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" 
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               <span>Tanpa Diskon (0%)</span>
               <span>Promo Tengah (25%)</span>
               <span>Promo Besar (50%)</span>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Komparasi Profitabilitas
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urutan platform dari yang paling menguntungkan.</p>
            </div>
            <div className="h-[250px] lg:h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} width={80} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-white/10 ring-4 ring-black/5 animate-in zoom-in-95">
                          <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">{data.name}</p>
                          <p className="text-xs font-black">Profit: {formatValue(data.profit)}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="profit" radius={[0, 8, 8, 0]} barSize={36}>
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex-grow space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /><span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Subsidi Promo</span></div>
                  <span className="text-[10px] font-black text-orange-600 bg-orange-100/50 px-3 py-1 rounded-full border border-orange-200">{promoPercent}%</span>
                </div>
                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>
                  <div className="absolute h-1.5 bg-orange-500 rounded-full" style={{ width: `${(promoPercent/50)*100}%` }}></div>
                  <input type="range" min="0" max="50" step="5" value={promoPercent} onChange={(e) => setPromoPercent(Number(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />
                </div>
                <p className="text-[9px] font-bold text-slate-400 italic text-center">Simulasikan beban diskon/promo platform.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10 relative overflow-hidden">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-500" /> Komparasi Beban Biaya (Fees)
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perbandingan total potongan di setiap platform.</p>
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span className="text-[10px] font-black uppercase text-rose-700 tracking-tight">Cek Potongan Terbesar</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 h-[250px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={feeComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#fff1f2' }} 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-2xl animate-in zoom-in-95">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.name}</p>
                              <p className="text-sm font-black text-rose-600">Total Fee: {selectedCurrency.symbol}{payload[0].value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="Fees" radius={[12, 12, 0, 0]} barSize={50}>
                      {feeComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="lg:col-span-5 space-y-4">
                {results.sort((a,b) => b.totalDeductions - a.totalDeductions).map((r, idx) => (
                  <div key={r.platform} className={`p-5 rounded-2xl border transition-all ${idx === 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: PLATFORM_DATA[r.platform].color}}></div>
                          <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">{r.platform}</span>
                        </div>
                        {idx === 0 && <span className="text-[8px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">Tertinggi</span>}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beban Potongan</span>
                          <span className="text-lg font-black text-slate-900">{formatValue(r.totalDeductions)}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">% Dari Harga</span>
                          <span className="text-sm font-black text-rose-500">{safePercent(r.totalDeductions, r.recommendedPrice)}%</span>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredResults.map(res => {
          const isCompetitorStrategy = effectiveStrategy === 'competitor';
          const cardScenario = isCompetitorStrategy ? (res.competitorProtection || res.recommended) : res.recommended;

          const displayPrice = cardScenario.price;
          const displayProfit = cardScenario.netProfit;
          
          return (
            <div key={res.platform} className={`bg-white rounded-[2.5rem] border-2 transition-all shadow-sm flex flex-col relative overflow-hidden ${expandedPlatform === res.platform ? 'border-indigo-600 ring-4 ring-indigo-500/5' : 'border-slate-100'}`}>
              <div className="absolute top-0 left-0 w-full h-1.5" style={{backgroundColor: PLATFORM_DATA[res.platform].color}}></div>
              
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg" style={{backgroundColor: PLATFORM_DATA[res.platform].color}}>
                       {res.platform.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 leading-none">{res.platform}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${cardScenario.isBleeding ? 'text-rose-500' : 'text-emerald-500'}`}>
                           {cardScenario.isBleeding ? 'Status: Kurang Untung / Rugi' : 'Status: Keuntungan Aman'}
                        </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Jual Yang Disarankan</p>
                    <p className="text-4xl lg:text-5xl font-black tracking-tighter" style={{color: PLATFORM_DATA[res.platform].color}}>
                       {formatValue(displayPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`rounded-[2rem] p-7 text-white shadow-xl flex flex-col justify-center min-w-[180px] bg-emerald-500 shadow-emerald-500/20`}>
                    <span className="text-[10px] font-black uppercase opacity-80 tracking-widest mb-1">{t('netProfit')}</span>
                    <span className="text-2xl font-black leading-none">{formatValue(displayProfit)}</span>
                    <span className="text-[10px] font-black mt-2 opacity-80 italic">Profit {safePercent(displayProfit, totalHPP)}% dari Modal</span>
                  </div>
                  <button 
                    onClick={() => {
                        setExpandedPlatform(res.platform);
                        setModalTab('settings'); // Default tab
                    }} 
                    className="p-7 rounded-[1.8rem] transition-all flex flex-col items-center justify-center gap-2 border bg-slate-50 text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200"
                  >
                      <Settings2 className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
                  </button>
                </div>
              </div>

              {/* DUAL MODE BOXES - CAROUSEL MODE */}
              <Carousel className="px-4 pb-10 lg:px-8">
                  <CarouselItem className="rounded-3xl p-6 bg-slate-50 border-2 border-slate-100 space-y-5">
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">{t('simulate')}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Ubah angka ini untuk tes cuan anda</p>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-4 py-4 rounded-2xl border border-slate-200">
                        <span className="text-sm font-black text-slate-400">Rp</span>
                        <input 
                           type="number" 
                           value={activeProject.competitorPrice || ''}
                           onChange={(e) => updateProject({ competitorPrice: Number(e.target.value) })}
                           className="w-full text-2xl font-black text-slate-900 outline-none"
                           placeholder="Tes harga jual..."
                        />
                     </div>
                     {res.market && (
                        <div className={`p-5 rounded-2xl flex justify-between items-center ${res.market.isBleeding ? 'bg-rose-100 text-rose-700' : 'bg-white border border-slate-200'}`}>
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest">Cuan Di Harga Ini</span>
                              {res.market.isBleeding && <span className="text-[8px] font-bold">Resiko Rugi Terdeteksi</span>}
                           </div>
                           <span className="text-xl font-black">{formatValue(res.market.netProfit)}</span>
                        </div>
                     )}
                  </CarouselItem>

                  <CarouselItem className="rounded-3xl p-6 bg-indigo-50 border-2 border-indigo-100 space-y-5">
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">{t('recommendation')}</span>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase">Harga paling pas agar {t('profitTarget')} Aman</p>
                     </div>
                     <div className="flex items-center justify-between py-2">
                        <span className="text-3xl font-black text-indigo-700">{formatValue(cardScenario.price)}</span>
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-200"><ShieldCheck className="w-6 h-6 text-indigo-600" /></div>
                     </div>
                     <div className="p-5 bg-indigo-600 rounded-2xl flex justify-between items-center text-white shadow-lg shadow-indigo-600/20">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest">Cuan Yang Dijaga</span>
                           <span className="text-[8px] font-bold opacity-70">Sesuai Target Laba Anda</span>
                        </div>
                        <span className="text-xl font-black">{formatValue(cardScenario.netProfit)}</span>
                     </div>
                  </CarouselItem>
              </Carousel>
            </div>
        )})}
      </div>

      {/* DETAIL MODAL (Replaces Accordion) */}
      <Modal
        isOpen={!!expandedPlatform && !!activeResult}
        onClose={() => setExpandedPlatform(null)}
        title={expandedPlatform ? `Analisa ${expandedPlatform}` : 'Analisa Channel'}
        description="Detail struktur biaya dan komposisi harga jual"
        icon={Settings2}
        maxWidth="max-w-3xl"
        headerContent={
          <TabNavigation 
            variant="inline" 
            layout="stretch" 
            tabs={modalTabsData} 
            activeTab={modalTab} 
            onChange={(id) => setModalTab(id as any)} 
            className="p-0 border-none mt-2" 
          />
        }
      >
         {activeResult && primaryScenario && (
            <div className="p-6 lg:p-8 space-y-8">
               {/* TAB 1: SETTINGS */}
               {modalTab === 'settings' && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-left-4 duration-300">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-50 rounded-xl"><Sliders className="w-5 h-5 text-indigo-600" /></div>
                        <h4 className="text-sm font-black uppercase text-slate-800 tracking-widest">Konfigurasi Potongan</h4>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                 {activeResult.platform === Platform.OFFLINE ? 'Biaya Pembayaran (MDR %)' : 'Potongan Komisi (%)'}
                              </label>
                              <span className="text-lg font-black text-indigo-600">{overrides[activeResult.platform].commission}%</span>
                           </div>
                           <input 
                              type="range" min="0" max={activeResult.platform === Platform.OFFLINE ? "5" : "35"} step="0.5"
                              value={overrides[activeResult.platform].commission}
                              onChange={(e) => updateFee(activeResult.platform, 'commission', Number(e.target.value))}
                              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                           />
                           <div className="flex gap-2">
                              {activeResult.platform === Platform.OFFLINE ? (
                                 [{ label: 'Tunai', val: 0 }, { label: 'QRIS', val: 0.7 }, { label: 'Kartu', val: 1.8 }].map(opt => (
                                    <button key={opt.label} onClick={() => updateFee(activeResult.platform, 'commission', opt.val)} className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${overrides[activeResult.platform].commission === opt.val ? 'bg-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>{opt.label}</button>
                                 ))
                              ) : (
                                 [15, 20, 25, 30].map(val => (
                                    <button key={val} onClick={() => updateFee(activeResult.platform, 'commission', val)} className={`flex-1 py-2 rounded-lg text-[10px] font-black border transition-all ${overrides[activeResult.platform].commission === val ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>{val}%</button>
                                 ))
                              )}
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Biaya Tetap per Pesanan (Rp)</label>
                           <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:bg-white transition-all">
                              <span className="text-sm font-black text-slate-400 mr-3">Rp</span>
                              <input 
                                 type="number" value={overrides[activeResult.platform].fixedFee}
                                 onChange={(e) => updateFee(activeResult.platform, 'fixedFee', Number(e.target.value))}
                                 className="bg-transparent w-full text-lg font-black text-slate-800 outline-none"
                              />
                           </div>
                           <p className="text-[9px] text-slate-400 italic">Beberapa aplikasi menarik biaya tambahan seperti Rp1.000 per transaksi.</p>
                        </div>
                     </div>
                  </div>
               )}

               {/* TAB 2: BREAKDOWN */}
               {modalTab === 'breakdown' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                     {/* VISUAL KOMPOSISI HARGA */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <Activity className="w-4 h-4 text-slate-400" />
                           <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Visualisasi Struktur Harga</h5>
                        </div>
                        <div className="h-12 w-full bg-slate-200 rounded-2xl overflow-hidden flex shadow-inner">
                           <div className="h-full bg-slate-500 flex items-center justify-center relative border-r border-white/10" style={{ width: `${safePercent(activeResult.breakdown.totalProductionCost, primaryScenario.price)}%` }}>
                              <span className="text-[9px] font-black text-white/90">MODAL</span>
                           </div>
                           <div className="h-full bg-rose-500 flex items-center justify-center relative border-r border-white/10" style={{ width: `${safePercent(primaryScenario.totalDeductions, primaryScenario.price)}%` }}>
                              <span className="text-[9px] font-black text-white/90">POTONGAN</span>
                           </div>
                           <div className="h-full bg-emerald-500 flex items-center justify-center" style={{ width: `${safePercent(primaryScenario.netProfit, primaryScenario.price)}%` }}>
                              <span className="text-[9px] font-black text-white/90">CUAN</span>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase text-slate-400 justify-center">
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Modal Warung</div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Potongan Aplikasi</div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cuan Bersih Anda</div>
                        </div>
                     </div>

                     {/* RINCIAN STRUKTUR HARGA */}
                     <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                       <div className="space-y-1">
                         <div className="flex justify-between items-center py-4 border-b border-slate-200">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-200 rounded-xl text-slate-600"><Layers className="w-4 h-4" /></div>
                             <span className="text-xs font-bold text-slate-700">{t('hppTotal')}</span>
                           </div>
                           <span className="text-base font-black text-slate-900">{formatValue(activeResult.breakdown.totalProductionCost)}</span>
                         </div>
                         
                         <div className="flex justify-between items-center py-4 border-b border-slate-200">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Tag className="w-4 h-4" /></div>
                             <span className="text-xs font-bold text-slate-700">{activeResult.platform === Platform.OFFLINE ? 'Biaya Transaksi' : t('appCommission')}</span>
                           </div>
                           <span className="text-base font-black text-rose-600">+{formatValue(activeResult.breakdown.commissionAmount)}</span>
                         </div>

                         <div className="flex justify-between items-center py-4 border-b border-slate-200">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Receipt className="w-4 h-4" /></div>
                             <span className="text-xs font-bold text-slate-700">Pajak Admin (Ppn 11%)</span>
                           </div>
                           <span className="text-base font-black text-rose-600">+{formatValue(activeResult.breakdown.taxOnServiceFee)}</span>
                         </div>

                         {activeResult.breakdown.fixedFeeAmount > 0 && (
                           <div className="flex justify-between items-center py-4 border-b border-slate-200">
                             <div className="flex items-center gap-3">
                               <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><ShieldCheck className="w-4 h-4" /></div>
                               <span className="text-xs font-bold text-slate-700">Biaya Admin Pesanan</span>
                             </div>
                             <span className="text-base font-black text-rose-600">+{formatValue(activeResult.breakdown.fixedFeeAmount)}</span>
                           </div>
                         )}

                         {activeResult.breakdown.promoAmount > 0 && (
                           <div className="flex justify-between items-center py-4 border-b border-slate-200">
                             <div className="flex items-center gap-3">
                               <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><Flame className="w-4 h-4" /></div>
                               <span className="text-xs font-bold text-slate-700">{t('promoSubsidy')}</span>
                             </div>
                             <span className="text-base font-black text-orange-600">+{formatValue(activeResult.breakdown.promoAmount)}</span>
                           </div>
                         )}

                         <div className="flex justify-between items-center py-6 border-b-4 border-double border-slate-300">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Wallet className="w-4 h-4" /></div>
                             <span className="text-xs font-black text-emerald-700">{t('profitTarget')}</span>
                           </div>
                           <span className="text-xl font-black text-emerald-600">+{formatValue(primaryScenario.netProfit)}</span>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-4 p-5 bg-yellow-50 border border-yellow-100 rounded-[1.5rem]">
                         <Info className="w-6 h-6 text-yellow-600 shrink-0" />
                         <p className="text-[10px] font-bold text-yellow-800 leading-relaxed uppercase tracking-tight">
                           Ringkasan: Anda menjual seharga <b>{formatValue(primaryScenario.price)}</b>, dipotong biaya sistem <b>{formatValue(primaryScenario.totalDeductions)}</b>, sisa uang bersih yang diterima adalah <b>{formatValue(primaryScenario.netProfit)}</b>.
                         </p>
                       </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </Modal>

      <div className="lg:hidden">
         <FloatingActionMenu 
            icon={LayoutGrid}
            onMainClick={onOpenSidebar}
         />
      </div>
    </div>
  );
};
