import React, { useState } from 'react';
import { Calculator, PlusCircle, Trash2, Loader2, Package, Sparkles, CheckCircle2, ArrowRightLeft, Scale, Layers, Ruler, Plus, Info, CalendarClock, PieChart as PieChartIcon, Hammer, Box } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Project, ProductionConfig, CostItem } from '@shared/types';
import { calculateEffectiveCost, calculateOperationalBurnRate } from '../../lib/utils';
import { useAIEstimator } from '../../hooks/useAIEstimator';
import { BentoCard } from '../ui/design-system/BentoCard';
import { DashboardSectionHeader } from '../ui/design-system/SectionHeader';

interface CostListProps {
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  formatValue: (val: number) => string;
  prodConfig: ProductionConfig;
  totalEffectiveCost: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16'];

const CostItemRow: React.FC<{
  cost: CostItem;
  updateCost: (updated: CostItem) => void;
  deleteCost: () => void;
  prodConfig: ProductionConfig;
  formatValue: (val: number) => string;
  index: number;
}> = ({ cost, updateCost, deleteCost, prodConfig, formatValue, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <BentoCard 
        noPadding
        className="p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-backwards"
        style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
         <div className="flex-grow">
            <input 
              placeholder="Nama Komponen Biaya..." 
              value={cost.name} 
              onChange={(e) => updateCost({ ...cost, name: e.target.value })} 
              className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder-slate-300 outline-none focus:text-indigo-600 transition-colors" 
            />
         </div>
         <button onClick={deleteCost} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-5 lg:col-span-4 space-y-1">
             <label className="text-[8px] font-bold text-slate-400 uppercase">Biaya / Harga {cost.allocation === 'bulk' ? 'Beli' : 'Satuan'}</label>
             <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">Rp</span>
                <input 
                  type="number" 
                  value={cost.amount || ''} 
                  onChange={(e) => updateCost({ ...cost, amount: Number(e.target.value) })} 
                  className={`w-full pl-6 pr-2 py-2 rounded-lg text-xs font-black outline-none border transition-all ${cost.allocation === 'bulk' ? 'bg-emerald-50 border-emerald-100 text-emerald-800 focus:ring-2 focus:ring-emerald-500/20' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'}`}
                  placeholder="0"
                />
             </div>
          </div>

          <div className="col-span-7 lg:col-span-5 flex items-center justify-end lg:justify-start gap-1 pb-0.5">
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                <button 
                    onClick={() => updateCost({ ...cost, allocation: 'unit', batchYield: undefined })}
                    className={`p-1.5 rounded-md transition-all ${!cost.allocation || cost.allocation === 'unit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                    title="Per Unit"
                >
                    <Package className="w-3.5 h-3.5" />
                </button>
                <button 
                    onClick={() => updateCost({ ...cost, allocation: 'bulk', batchYield: prodConfig.targetUnits, bulkUnit: 'units' })}
                    className={`p-1.5 rounded-md transition-all ${cost.allocation === 'bulk' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
                    title="Bulk / Stok"
                >
                    <Layers className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <button 
                onClick={() => updateCost({ ...cost, isRange: !cost.isRange, minAmount: cost.amount, maxAmount: cost.amount })}
                className={`p-1.5 rounded-lg border transition-all ${cost.isRange ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-slate-50 border-transparent text-slate-300'}`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {cost.allocation === 'bulk' && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-1.5 rounded-lg border transition-all ${isExpanded ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-300'}`}
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              )}
          </div>

          <div className="col-span-12 lg:col-span-3 flex items-center justify-between lg:justify-end border-t border-slate-100 pt-2 lg:border-t-0 lg:pt-0 mt-1 lg:mt-0">
             {cost.allocation === 'bulk' && (
                <div className="flex items-center gap-1 mr-auto lg:mr-3">
                    <input 
                       type="number" 
                       value={cost.batchYield ? Math.round(cost.batchYield * 10) / 10 : ''} 
                       onChange={(e) => updateCost({ ...cost, batchYield: Number(e.target.value) })}
                       className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    />
                    <button 
                       onClick={() => updateCost({ ...cost, bulkUnit: cost.bulkUnit === 'units' ? 'days' : 'units' })}
                       className="text-[8px] font-black uppercase text-slate-500 bg-slate-100 px-1.5 py-1 rounded hover:bg-slate-200 transition-colors"
                    >
                       {cost.bulkUnit === 'days' ? 'Hari' : 'Unit'}
                    </button>
                </div>
             )}
             
             <div className="text-right ml-auto">
                 <span className="text-[8px] font-bold text-slate-300 uppercase block">BEBAN/UNIT</span>
                 <span className={`text-sm font-black ${cost.allocation === 'bulk' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {formatValue(calculateEffectiveCost(cost, prodConfig))}
                 </span>
             </div>
          </div>
      </div>

      {cost.isRange && (
          <div className="mt-3 grid grid-cols-2 gap-3 bg-orange-50/50 p-2 rounded-xl border border-orange-100/50 animate-in zoom-in-95 duration-300">
             <div className="space-y-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase ml-1">Min</span>
                <input 
                  type="number" 
                  value={cost.minAmount || ''} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const avg = (val + (cost.maxAmount || val)) / 2;
                    updateCost({ ...cost, minAmount: val, amount: avg });
                  }} 
                  className="w-full px-2 py-1 bg-white border border-orange-100 rounded text-xs font-bold"
                />
             </div>
             <div className="space-y-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase ml-1">Max</span>
                <input 
                  type="number" 
                  value={cost.maxAmount || ''} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const avg = ((cost.minAmount || val) + val) / 2;
                    updateCost({ ...cost, maxAmount: val, amount: avg });
                  }} 
                  className="w-full px-2 py-1 bg-white border border-orange-100 rounded text-xs font-bold"
                />
             </div>
          </div>
      )}

      {isExpanded && cost.allocation === 'bulk' && (
         <div className="mt-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100/50">
               <Ruler className="w-3 h-3 text-indigo-500" />
               <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Detail Usage</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
               <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Total Qty</label>
                  <input 
                    type="number" 
                    value={cost.detailTotalQty || ''}
                    onChange={(e) => {
                       const total = Number(e.target.value);
                       const perPortion = cost.detailPerPortion || 1;
                       updateCost({ ...cost, detailTotalQty: total, batchYield: perPortion > 0 ? total / perPortion : 1 });
                    }}
                    className="w-full px-2 py-1 text-xs font-bold rounded border border-indigo-100"
                    placeholder="1000"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Per Unit</label>
                  <input 
                    type="number" 
                    value={cost.detailPerPortion || ''}
                    onChange={(e) => {
                       const perPortion = Number(e.target.value);
                       const total = cost.detailTotalQty || 0;
                       updateCost({ ...cost, detailPerPortion: perPortion, batchYield: perPortion > 0 ? total / perPortion : cost.batchYield });
                    }}
                    className="w-full px-2 py-1 text-xs font-bold rounded border border-indigo-100"
                    placeholder="25"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Satuan</label>
                  <input 
                    value={cost.detailUnit || ''}
                    onChange={(e) => updateCost({ ...cost, detailUnit: e.target.value })}
                    className="w-full px-2 py-1 text-xs font-bold rounded border border-indigo-100"
                    placeholder="gr/ml"
                  />
               </div>
            </div>
         </div>
      )}
    </BentoCard>
  );
};

const CostSection: React.FC<{
  title: string;
  icon: React.ElementType;
  className?: string; // Replaced colorClass with text-based classes or handle inside
  variant?: 'default' | 'accent';
  items: CostItem[];
  children: React.ReactNode;
}> = ({ title, icon: Icon, variant = 'default', items, children }) => (
  <div className="space-y-3">
    <DashboardSectionHeader 
       title={title} 
       subtitle={`${items.length} Item`}
       variant={variant}
       action={<Icon className="w-4 h-4 text-slate-400" />}
    />
    <div className="space-y-3">
       {children}
    </div>
  </div>
);

const OperationalBurnRate: React.FC<{
  bulkCosts: CostItem[];
  prodConfig: ProductionConfig;
  formatValue: (val: number) => string;
}> = ({ bulkCosts, prodConfig, formatValue }) => {
  if (bulkCosts.length === 0) return null;

  const { totalPurchase, dailyBurnRate, cycleBurnRate } = calculateOperationalBurnRate(bulkCosts, prodConfig);

  return (
    <BentoCard noPadding className="mt-8 bg-slate-900 border-slate-800 p-6 lg:p-8 text-white relative overflow-hidden shadow-xl">
       <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6 opacity-80">
             <CalendarClock className="w-4 h-4 text-emerald-400" />
             <h4 className="text-xs font-black uppercase tracking-widest">Analisa Biaya Operasional</h4>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:gap-8 divide-x divide-white/10">
             <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Belanja</p>
                <p className="text-lg lg:text-xl font-black text-white">{formatValue(totalPurchase)}</p>
                <p className="text-[8px] text-slate-500">Modal stok awal</p>
             </div>
             <div className="pl-4 lg:pl-8 space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Burn Rate / Hari</p>
                <p className="text-lg lg:text-xl font-black text-emerald-400">{formatValue(dailyBurnRate)}</p>
                <p className="text-[8px] text-slate-500">Biaya habis per hari</p>
             </div>
             <div className="pl-4 lg:pl-8 space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estimasi Siklus</p>
                <p className="text-lg lg:text-xl font-black text-indigo-400">{formatValue(cycleBurnRate)}</p>
                <p className="text-[8px] text-slate-500">Total operasional 1 periode</p>
             </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
             <Info className="w-4 h-4 text-slate-500" />
             <p className="text-[9px] text-slate-400 leading-relaxed italic">
                Angka ini membantu Anda menyiapkan cashflow periodik untuk belanja ulang bahan bulk & operasional.
             </p>
          </div>
       </div>
       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
    </BentoCard>
  );
};

export const CostList: React.FC<CostListProps> = ({ 
  activeProject, updateProject, formatValue, prodConfig, totalEffectiveCost 
}) => {
  const { estimateCosts, isGenerating } = useAIEstimator();

  const chartData = activeProject.costs.map(cost => ({
      name: cost.name, 
      value: calculateEffectiveCost(cost, prodConfig)
  })).filter(item => item.value > 0);

  const handleMagicEstimate = async () => {
    if (!activeProject.name || isGenerating) return;
    
    const newCosts = await estimateCosts(activeProject.name);
    
    if (newCosts && newCosts.length > 0) {
       updateProject({ costs: [...activeProject.costs, ...newCosts] });
    }
  };

  const handleUpdateCost = (updatedCost: CostItem) => {
    updateProject({ costs: activeProject.costs.map(c => c.id === updatedCost.id ? updatedCost : c) });
  };

  const handleDeleteCost = (id: string) => {
    updateProject({ costs: activeProject.costs.filter(c => c.id !== id) });
  };

  const directCosts = activeProject.costs.filter(c => !c.allocation || c.allocation === 'unit');
  const bulkCosts = activeProject.costs.filter(c => c.allocation === 'bulk');

  return (
    <BentoCard className="space-y-8 relative overflow-hidden p-5 lg:p-10" noPadding>
        
        <DashboardSectionHeader 
            title="Komponen Biaya (HPP)" 
            subtitle="Input modal langsung & tidak langsung."
            variant="default"
            action={
                <button 
                  onClick={handleMagicEstimate} 
                  disabled={isGenerating || !activeProject.name.trim()}
                  className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all shadow-sm ${isGenerating ? 'bg-slate-50' : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100'}`}
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
                  <span className="hidden lg:inline text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    {isGenerating ? 'Analyzing...' : 'Auto-Estimate'}
                  </span>
                </button>
            }
        />

        {activeProject.costs.length === 0 && (
          <button onClick={() => updateProject({ costs: [{ id: '1', name: '', amount: 0, allocation: 'unit' }] })} className="w-full py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group">
             <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform"><Plus className="w-8 h-8 text-indigo-400" /></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Mulai Tambah Komponen</p>
          </button>
        )}

        {chartData.length > 0 && (
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 animate-in fade-in duration-500">
               <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-[10px] font-black uppercase text-slate-700 tracking-widest">Visualisasi Beban</h4>
               </div>
               <div className="flex flex-col md:flex-row items-center justify-center h-[220px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         formatter={(value: number) => formatValue(value)}
                         contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                         itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend 
                         layout="vertical" 
                         verticalAlign="middle" 
                         align="right"
                         iconType="circle"
                         wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
        )}

        {directCosts.length > 0 && (
          <CostSection title="Biaya Langsung (Per Unit)" icon={Box} items={directCosts}>
             {directCosts.map((cost, idx) => (
                <CostItemRow 
                  key={cost.id} 
                  cost={cost} 
                  updateCost={handleUpdateCost} 
                  deleteCost={() => handleDeleteCost(cost.id)} 
                  prodConfig={prodConfig}
                  formatValue={formatValue}
                  index={idx}
                />
             ))}
          </CostSection>
        )}

        {bulkCosts.length > 0 && (
          <CostSection title="Operasional & Overhead (Bulk)" icon={Hammer} variant="accent" items={bulkCosts}>
             {bulkCosts.map((cost, idx) => (
                <CostItemRow 
                  key={cost.id} 
                  cost={cost} 
                  updateCost={handleUpdateCost} 
                  deleteCost={() => handleDeleteCost(cost.id)} 
                  prodConfig={prodConfig}
                  formatValue={formatValue}
                  index={idx}
                />
             ))}
          </CostSection>
        )}

        <button 
           onClick={() => updateProject({ costs: [...activeProject.costs, { id: Math.random().toString(), name: '', amount: 0, allocation: 'unit', bulkUnit: 'units' }] })} 
           className="w-full py-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
           <PlusCircle className="w-4 h-4" /> Tambah Item Lain
        </button>

        <OperationalBurnRate bulkCosts={bulkCosts} prodConfig={prodConfig} formatValue={formatValue} />

        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-6 pb-2 border-t border-slate-100 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                  <Layers className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total HPP / Unit</p>
                  <p className="text-2xl font-black text-indigo-900 leading-none">{formatValue(totalEffectiveCost)}</p>
               </div>
            </div>
            {activeProject.confidence === 'high' && (
               <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Akurat</span>
               </div>
            )}
        </div>
    </BentoCard>
  );
};
