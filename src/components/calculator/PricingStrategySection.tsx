
import React from 'react';
import { Store, Target, Wallet, ArrowRight, Zap, Info, ShieldCheck } from 'lucide-react';
import { Project, ProductionConfig } from '../../types';

interface PricingStrategySectionProps {
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  formatValue: (val: number) => string;
  prodConfig: ProductionConfig;
  totalEffectiveCost: number;
  onSimulate: () => void;
}

export const PricingStrategySection: React.FC<PricingStrategySectionProps> = ({ 
  activeProject, updateProject, formatValue, prodConfig, totalEffectiveCost, onSimulate 
}) => {
  const strategy = activeProject.pricingStrategy || 'markup';
  
  const baseProfitCompetitor = (activeProject.competitorPrice || 0) - totalEffectiveCost;
  const basePrice = totalEffectiveCost + (activeProject.targetNet || 0);

  const totalSimulatedProfit = strategy === 'competitor' 
      ? baseProfitCompetitor * prodConfig.targetUnits
      : (activeProject.targetNet || 0) * prodConfig.targetUnits;

  return (
    <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Strategy Toggle */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-500" /> Strategi Dasar
                 </h3>
              </div>
           </div>
           
           <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                 onClick={() => updateProject({ pricingStrategy: 'markup' })}
                 className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${strategy === 'markup' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 Set Target Profit
              </button>
              <button 
                 onClick={() => updateProject({ pricingStrategy: 'competitor' })}
                 className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${strategy === 'competitor' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 Ikut Harga Pasar
              </button>
           </div>
        </div>

        {/* Input & Result Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
            {/* INPUT SIDE - High Visiblity */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-6 lg:p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden flex flex-col justify-center min-h-[180px] group transition-all hover:scale-[1.01]">
               <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                        {strategy === 'markup' ? <Target className="w-4 h-4 text-indigo-200" /> : <Store className="w-4 h-4 text-indigo-200" />}
                     </div>
                     <span className="text-[10px] text-indigo-200 font-black uppercase tracking-widest">
                        {strategy === 'markup' ? 'Nominal Profit Bersih' : 'Input Harga Jual'}
                     </span>
                  </div>
                  
                  <div className="relative border-b-2 border-indigo-400/30 pb-2 group-focus-within:border-indigo-400 transition-colors">
                     <span className="absolute top-0 left-0 text-2xl font-black text-indigo-300/50">Rp</span>
                     <input 
                        type="number" 
                        value={strategy === 'markup' ? (activeProject.targetNet || '') : (activeProject.competitorPrice || '')} 
                        onChange={(e) => updateProject(strategy === 'markup' ? { targetNet: Number(e.target.value) } : { competitorPrice: Number(e.target.value) })} 
                        className="w-full bg-transparent border-none text-4xl lg:text-5xl font-black text-white focus:ring-0 placeholder-indigo-400/30 p-0 pl-10 lg:pl-12 outline-none drop-shadow-md" 
                        placeholder="0" 
                     />
                  </div>
                  <p className="text-[9px] text-indigo-200/60 font-medium leading-relaxed">
                     {strategy === 'markup' 
                        ? 'Keuntungan bersih (net) yang ingin Anda kantongi per porsi/produk secara manual.' 
                        : 'Harga jual produk serupa di pasaran (Benchmark) sebagai acuan.'}
                  </p>
               </div>
               
               {/* Glow Effect */}
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all"></div>
            </div>

            {/* PREVIEW SIDE - Contrast Card */}
            <div className={`rounded-[2rem] p-6 lg:p-8 border shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[180px] transition-colors ${strategy === 'competitor' ? (baseProfitCompetitor > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100') : 'bg-slate-50 border-slate-200'}`}>
                {strategy === 'markup' ? (
                   // Preview for Markup Mode (BASE PRICE FOCUS)
                   <div className="flex flex-col items-center text-center space-y-4">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest shadow-sm">
                        Harga Jual Dasar
                      </span>
                      <div>
                        <p className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight animate-in fade-in zoom-in duration-300">
                           {formatValue(basePrice)}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium px-4 leading-relaxed">
                           Harga ini aman untuk penjualan offline/direct.
                        </p>
                      </div>
                      
                      <div className="w-full pt-4 border-t border-slate-200/50">
                         <button 
                            onClick={onSimulate}
                            className="w-full group relative overflow-hidden bg-slate-900 text-white px-4 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                         >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-indigo-500 rounded-lg group-hover:bg-indigo-400 transition-colors">
                                        <Zap className="w-3.5 h-3.5 text-white fill-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Simulasi Markup Apps</p>
                                        <p className="text-[8px] font-medium text-slate-400 mt-0.5">Agar profit dasar tidak tergerus</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                            <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                         </button>
                      </div>
                   </div>
                ) : (
                   // Preview for Competitor Mode (GROSS/BASE PROFIT FOCUS)
                   <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center pb-4 border-b border-black/5">
                         <div>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Profit Dasar (Base)</p>
                            <p className={`text-2xl font-black animate-in fade-in zoom-in duration-300 ${baseProfitCompetitor > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                               {baseProfitCompetitor > 0 ? '+' : ''}{formatValue(baseProfitCompetitor)}
                            </p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Base Margin</p>
                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-black ${baseProfitCompetitor > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                               {activeProject.competitorPrice ? ((baseProfitCompetitor / activeProject.competitorPrice) * 100).toFixed(0) : 0}%
                            </span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${totalSimulatedProfit > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            <Wallet className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Potensi Profit ({prodConfig.period})</p>
                            <p className={`text-lg font-black ${totalSimulatedProfit > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                               {totalSimulatedProfit > 0 ? '+' : ''}{formatValue(totalSimulatedProfit)}
                            </p>
                         </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200/50 mt-2">
                         <div className="flex items-start gap-2 mb-3">
                            <ShieldCheck className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-[9px] text-slate-500 leading-tight">
                               Ini adalah profit bersih jika jual offline. Gunakan <b>Simulasi</b> untuk menghitung markup harga di aplikasi agar profit ini aman.
                            </p>
                         </div>
                         <button 
                            onClick={onSimulate}
                            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-3 rounded-xl transition-colors border border-indigo-100"
                         >
                            <Zap className="w-3.5 h-3.5 fill-indigo-600" />
                            <span>Simulasi Markup Harga Apps</span>
                         </button>
                      </div>
                   </div>
                )}
            </div>
        </div>
      </div>
  );
};
