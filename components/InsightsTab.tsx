
import React from 'react';
import { TrendingUp, Flame, Scissors, AlertCircle, ChevronDown, Receipt, Percent, Layers, Tag, ShieldCheck, Banknote, Wallet, ShoppingCart, Info, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { CalculationResult, Platform } from '../types';
import { PLATFORM_DATA } from '../constants';

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
}

export const ProfitSimulator: React.FC<ProfitSimulatorProps> = ({
  results, chartData, feeComparisonData, promoPercent, setPromoPercent, expandedPlatform, setExpandedPlatform, formatValue, selectedCurrency
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
              <ResponsiveContainer width="100%" height="100%">
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
                <ResponsiveContainer width="100%" height="100%">
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
                          <span className="text-sm font-black text-rose-500">{((r.totalDeductions / r.recommendedPrice) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {results.map(res => (
          <div key={res.platform} className={`bg-white rounded-[2.5rem] border-2 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col ${expandedPlatform === res.platform ? 'border-indigo-600 ring-4 ring-indigo-500/5' : 'border-transparent'}`}>
            <div className="absolute top-0 left-0 w-full h-1.5" style={{backgroundColor: PLATFORM_DATA[res.platform].color}}></div>
            
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: PLATFORM_DATA[res.platform].color}}></div>
                  <span className="text-xs font-black uppercase text-slate-800 tracking-widest">{res.platform}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rekomendasi Harga Jual</p>
                  <p className="text-4xl font-black tracking-tighter" style={{color: PLATFORM_DATA[res.platform].color}}>{formatValue(res.recommendedPrice)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center min-w-[160px]">
                  <span className="text-[9px] font-black uppercase opacity-70 tracking-widest mb-1">Cuan Bersih</span>
                  <span className="text-2xl font-black leading-none">{formatValue(res.netProfit)}</span>
                  <span className="text-[10px] font-black mt-2 opacity-80 italic">ROI {res.roi.toFixed(0)}%</span>
                </div>
                <button onClick={() => setExpandedPlatform(expandedPlatform === res.platform ? null : res.platform)} className={`p-6 rounded-2xl transition-all flex flex-col items-center justify-center gap-2 border ${expandedPlatform === res.platform ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-indigo-600'}`}>
                    <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${expandedPlatform === res.platform ? 'rotate-180' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{expandedPlatform === res.platform ? 'Tutup' : 'Bedah'}</span>
                </button>
              </div>
            </div>

            {expandedPlatform === res.platform && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-6 lg:p-8 animate-in slide-in-from-top-4 duration-300">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-indigo-500" /> Rincian Struktur Harga
                    </h5>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                      <Percent className="w-3 h-3 text-indigo-600" />
                      <span className="text-[10px] font-black text-slate-700">Efisiensi: {((res.netProfit / res.recommendedPrice) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* VISUAL BREAKDOWN BAR (Stacked) */}
                  <div className="space-y-2">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Komposisi Harga Jual</p>
                     <div className="h-6 w-full bg-slate-200 rounded-lg overflow-hidden flex">
                        {/* HPP Part */}
                        <div 
                           className="h-full bg-slate-500 flex items-center justify-center relative group" 
                           style={{ width: `${(res.breakdown.totalProductionCost / res.recommendedPrice) * 100}%` }}
                        >
                           {((res.breakdown.totalProductionCost / res.recommendedPrice) * 100) > 10 && (
                              <span className="text-[8px] font-black text-white/90">HPP</span>
                           )}
                           <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              HPP: {((res.breakdown.totalProductionCost / res.recommendedPrice) * 100).toFixed(1)}%
                           </div>
                        </div>
                        {/* Fees Part */}
                        <div 
                           className="h-full bg-rose-500 flex items-center justify-center relative group" 
                           style={{ width: `${(res.totalDeductions / res.recommendedPrice) * 100}%` }}
                        >
                           {((res.totalDeductions / res.recommendedPrice) * 100) > 10 && (
                              <span className="text-[8px] font-black text-white/90">FEES</span>
                           )}
                           <div className="absolute bottom-full mb-2 bg-rose-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Fees: {((res.totalDeductions / res.recommendedPrice) * 100).toFixed(1)}%
                           </div>
                        </div>
                        {/* Profit Part */}
                        <div 
                           className="h-full bg-emerald-500 flex items-center justify-center relative group" 
                           style={{ width: `${(res.netProfit / res.recommendedPrice) * 100}%` }}
                        >
                           {((res.netProfit / res.recommendedPrice) * 100) > 10 && (
                              <span className="text-[8px] font-black text-white/90">CUAN</span>
                           )}
                           <div className="absolute bottom-full mb-2 bg-emerald-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Profit: {((res.netProfit / res.recommendedPrice) * 100).toFixed(1)}%
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center py-3 border-b border-slate-200 group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-200 rounded-lg"><Layers className="w-4 h-4 text-slate-600" /></div>
                          <span className="text-xs font-bold text-slate-700">Modal Produksi (HPP)</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{formatValue(res.breakdown.totalProductionCost)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b border-slate-200 group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-50 rounded-lg"><Tag className="w-4 h-4 text-rose-500" /></div>
                          <span className="text-xs font-bold text-slate-700">Komisi Platform (Net)</span>
                        </div>
                        <span className="text-sm font-black text-rose-600">+{formatValue(res.breakdown.commissionAmount)}</span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-slate-200 group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-50 rounded-lg"><Receipt className="w-4 h-4 text-rose-500" /></div>
                          <span className="text-xs font-bold text-slate-700">Pajak Jasa & Layanan (11%)</span>
                        </div>
                        <span className="text-sm font-black text-rose-600">+{formatValue(res.breakdown.taxOnServiceFee)}</span>
                      </div>

                      {res.breakdown.fixedFeeAmount > 0 && (
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 rounded-lg"><ShieldCheck className="w-4 h-4 text-rose-500" /></div>
                            <span className="text-xs font-bold text-slate-700">Fixed Fee Per Order</span>
                          </div>
                          <span className="text-sm font-black text-rose-600">+{formatValue(res.breakdown.fixedFeeAmount)}</span>
                        </div>
                      )}

                      {res.breakdown.withdrawalFeeAmount > 0 && (
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 rounded-lg"><Banknote className="w-4 h-4 text-rose-500" /></div>
                            <span className="text-xs font-bold text-slate-700">Biaya Tarik Saldo</span>
                          </div>
                          <span className="text-sm font-black text-rose-600">+{formatValue(res.breakdown.withdrawalFeeAmount)}</span>
                        </div>
                      )}

                      {res.breakdown.promoAmount > 0 && (
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 rounded-lg"><Flame className="w-4 h-4 text-orange-500" /></div>
                            <span className="text-xs font-bold text-slate-700">Subsidi Promo Merchant</span>
                          </div>
                          <span className="text-sm font-black text-orange-600">+{formatValue(res.breakdown.promoAmount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-5 border-b-4 border-double border-slate-300 group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg"><Wallet className="w-4 h-4 text-emerald-600" /></div>
                          <span className="text-xs font-black text-emerald-700">Target Profit (Ambilan)</span>
                        </div>
                        <span className="text-lg font-black text-emerald-600">+{formatValue(res.netProfit)}</span>
                      </div>
                    </div>

                    <div className="bg-indigo-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total Harga Konsumen</span>
                        <span className="text-2xl font-black">{formatValue(res.recommendedPrice)}</span>
                      </div>
                      <ShoppingCart className="w-8 h-8 opacity-20" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                      <Info className="w-4 h-4 text-yellow-600 shrink-0" />
                      <p className="text-[10px] font-bold text-yellow-800 leading-relaxed uppercase tracking-tight">
                        Harga di atas adalah batas aman minimal agar target profit Anda tidak berkurang oleh potongan sistem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
