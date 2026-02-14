import React from 'react';
import { Settings2, Sliders, Activity, Layers, Tag, Receipt, Flame, Wallet, Info, ShieldCheck } from 'lucide-react';
import { CalculationResult, Platform, PlatformOverrides, ScenarioResult } from '@shared/types';
import { Modal } from '@/components/ui/Modal';
import { TabNavigation, TabItem } from '@/components/ui/TabNavigation';

interface PlatformDetailModalProps {
  expandedPlatform: Platform | null;
  activeResult?: CalculationResult;
  onClose: () => void;
  modalTab: 'settings' | 'breakdown';
  setModalTab: (tab: 'settings' | 'breakdown') => void;
  modalTabsData: TabItem[];
  primaryScenario?: ScenarioResult;
  overrides: Record<Platform, PlatformOverrides>;
  updateFee: (platform: Platform, field: keyof PlatformOverrides, value: number) => void;
  currentTaxRate: number;
  formatValue: (val: number) => string;
  t: (key: string) => string;
}

export const PlatformDetailModal: React.FC<PlatformDetailModalProps> = ({
  expandedPlatform,
  activeResult,
  onClose,
  modalTab,
  setModalTab,
  modalTabsData,
  primaryScenario,
  overrides,
  updateFee,
  currentTaxRate,
  formatValue,
  t
}) => {
  const safePercent = (numerator: number | undefined, denominator: number | undefined) => {
    if (!numerator || !denominator) return '0';
    return ((numerator / denominator) * 100).toFixed(1);
  };

  return (
    <Modal
      isOpen={!!expandedPlatform && !!activeResult}
      onClose={onClose}
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
          onChange={(id) => setModalTab(id as 'settings' | 'breakdown')}
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
                      <span className="text-xs font-bold text-slate-700">Pajak Admin (PPN {currentTaxRate}%)</span>
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
  );
};
