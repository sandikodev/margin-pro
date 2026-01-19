
import React, { useState, useMemo } from 'react';
import { Banknote, AlertTriangle, Plus, TrendingUp, ArrowDownRight, ArrowUpRight, Calculator, CheckCircle2, Trash2, Target, Sliders, ShieldAlert, Hourglass, ShieldCheck } from 'lucide-react';
import { Liability, CashflowRecord, Project } from '@shared/types';
import { FINANCIAL_DEFAULTS } from '@shared/constants';
import { calculateLoanPayment, calculateFinancialHealth } from '../utils';
import { useToast } from '../context/ToastContext';

interface FinanceManagerProps {
  liabilities: Liability[];
  setLiabilities: React.Dispatch<React.SetStateAction<Liability[]>>;
  cashflow: CashflowRecord[];
  setCashflow: React.Dispatch<React.SetStateAction<CashflowRecord[]>>;
  activeProject: Project;
  formatValue: (val: number) => string;
}

interface ExtendedFinanceManagerProps extends FinanceManagerProps {
  monthlyFixedCost?: number;
  setMonthlyFixedCost?: (val: number) => void;
  currentSavings?: number;
  setCurrentSavings?: (val: number) => void;
}

export const FinanceManager: React.FC<ExtendedFinanceManagerProps> = ({
  liabilities, setLiabilities, cashflow, setCashflow, activeProject, formatValue,
  monthlyFixedCost = FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST, setMonthlyFixedCost = (_: number) => {},
  currentSavings = FINANCIAL_DEFAULTS.CURRENT_SAVINGS, setCurrentSavings = (_: number) => {}
}) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'debt' | 'strategy'>('journal');
  
  // States for Daily Journal Input
  const [journalDate, setJournalDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [journalRevenue, setJournalRevenue] = useState<string>('');
  const [journalExpense, setJournalExpense] = useState<string>('');
  const [journalNote, setJournalNote] = useState<string>('');

  // States for Loan Simulator
  const [simPlafon, setSimPlafon] = useState<string>('');
  const [simTenor, setSimTenor] = useState<string>('12');
  const [simRate, setSimRate] = useState<string>('5');
  const [simResult, setSimResult] = useState<number | null>(null);

  // States for Strategy Simulator
  const [simDailySalesQty, setSimDailySalesQty] = useState<number>(30); // Porsi per hari

  // Aggregates
  const totalLiabilities = liabilities.reduce((acc, l) => acc + l.amount, 0);
  const totalRevenue = cashflow.reduce((acc, c) => acc + c.revenue, 0);
  const totalExpense = cashflow.reduce((acc, c) => acc + c.expense, 0);
  
  // Financial Health Calculation via Utils
  const {
      netCashflow,
      totalMonthlyBurden,
      minPortionsPerDay,
      projectedMonthlyProfit,
      projectedNetFreeCashflow,
      targetBufferAmount,
      monthsToReachBuffer,
      savingsPercentage
  } = useMemo(() => calculateFinancialHealth(
      totalRevenue, 
      totalExpense, 
      totalLiabilities, 
      monthlyFixedCost, 
      activeProject.targetNet, 
      simDailySalesQty, 
      currentSavings
  ), [totalRevenue, totalExpense, totalLiabilities, monthlyFixedCost, activeProject.targetNet, simDailySalesQty, currentSavings]);

  const handleAddJournal = () => {
    if (!journalRevenue || !journalExpense) return;
    const newRecord: CashflowRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(journalDate).getTime(),
      revenue: Number(journalRevenue),
      expense: Number(journalExpense),
      note: journalNote
    };
    setCashflow([newRecord, ...cashflow]);
    setJournalExpense('');
    setJournalNote('');
    showToast("Jurnal harian berhasil disimpan!", "success");
  };

  const calculateLoan = () => {
    const P = Number(simPlafon);
    const r = Number(simRate);
    const n = Number(simTenor);
    const result = calculateLoanPayment(P, r, n);
    setSimResult(result);
  };

  const saveLoanToLiability = () => {
    if (!simResult) return;
    const today = new Date();
    const dueDate = today.getDate();
    const newLiability: Liability = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Pinjaman ${formatValue(Number(simPlafon))}`,
      amount: Math.ceil(simResult),
      dueDate: dueDate,
      isPaidThisMonth: false,
      totalTenure: Number(simTenor),
      remainingTenure: Number(simTenor)
    };
    setLiabilities([...liabilities, newLiability]);
    setSimResult(null);
    setSimPlafon('');
    showToast("Cicilan berhasil ditambahkan ke daftar kewajiban!", "success");
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-black uppercase tracking-tight italic text-slate-900 leading-none">Financial Command</h3>
          <p className="text-slate-500 text-sm">Pusat kendali arus kas dan kewajiban hutang usaha.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'journal', label: 'Jurnal' },
            { id: 'debt', label: 'Utang' },
            { id: 'strategy', label: 'Simulasi' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id as 'journal' | 'debt' | 'strategy')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{tab.label}</button>
          ))}
        </div>
      </header>

      {/* SUMMARY CARDS (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Net Cashflow (Bulan Ini)</p>
          <p className="text-2xl font-black">{formatValue(netCashflow)}</p>
          <TrendingUp className="absolute bottom-4 right-4 text-white/10 w-12 h-12" />
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Beban Tetap</p>
          <p className="text-2xl font-black text-slate-800">{formatValue(totalMonthlyBurden)}</p>
          <p className="text-[9px] font-bold text-rose-500 mt-1">Termasuk Utang & Ops</p>
          <ShieldAlert className="absolute bottom-4 right-4 text-slate-100 w-12 h-12" />
        </div>
        <div className="bg-emerald-500 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
           <p className="text-[10px] font-black uppercase text-emerald-200 tracking-widest mb-1">Target Aman Harian</p>
           <p className="text-2xl font-black">{minPortionsPerDay} <span className="text-sm">Porsi</span></p>
           <p className="text-[9px] mt-1 opacity-80">Untuk Titik Impas (BEP)</p>
           <Target className="absolute bottom-4 right-4 text-white/10 w-12 h-12" />
        </div>
      </div>

      {activeSubTab === 'journal' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           {/* INPUT FORM */}
           <div className="bg-white rounded-[2rem] border border-slate-200 p-6 lg:p-8 shadow-sm">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-widest mb-6 flex items-center gap-2">
                 <Plus className="w-4 h-4 text-indigo-500" /> Catat Transaksi Hari Ini
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Tanggal</label>
                    <input type="date" value={journalDate} onChange={(e) => setJournalDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-emerald-600">Total Omset (Gross)</label>
                    <input type="number" placeholder="0" value={journalRevenue} onChange={(e) => setJournalRevenue(e.target.value)} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-rose-600">Pengeluaran Operasional</label>
                    <input type="number" placeholder="0" value={journalExpense} onChange={(e) => setJournalExpense(e.target.value)} className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm font-black text-rose-700 focus:ring-2 focus:ring-rose-500 outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Catatan</label>
                    <input type="text" placeholder="Hujan deras, sepi..." value={journalNote} onChange={(e) => setJournalNote(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
              </div>
              <button onClick={handleAddJournal} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg">Simpan Laporan</button>
           </div>

           {/* LIST */}
           <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Riwayat Transaksi</h4>
              {cashflow.length === 0 ? (
                 <div className="text-center py-10 opacity-50 text-sm font-bold">Belum ada catatan jurnal.</div>
              ) : (
                cashflow.map(record => (
                   <div key={record.id} className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                         <div className="bg-slate-100 p-3 rounded-xl text-center min-w-[60px]">
                            <span className="block text-lg font-black leading-none text-slate-700">{new Date(record.date).getDate()}</span>
                            <span className="block text-[9px] font-black uppercase text-slate-400">{new Date(record.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-600 italic">"{record.note || 'Tanpa catatan'}"</p>
                            <div className="flex gap-3 mt-1">
                               <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {formatValue(record.revenue)}</span>
                               <span className="text-[10px] font-black text-rose-600 flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> {formatValue(record.expense)}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black uppercase text-slate-400">Net Profit</p>
                         <p className={`text-lg font-black ${record.revenue - record.expense >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {record.revenue - record.expense >= 0 ? '+' : ''}{formatValue(record.revenue - record.expense)}
                         </p>
                      </div>
                   </div>
                ))
              )}
           </div>
        </div>
      )}

      {activeSubTab === 'debt' && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
           {/* LOAN CALCULATOR */}
           <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                 <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6 flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> Simulator Kredit Usaha
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-400">Plafon Pinjaman</label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black">Rp</span>
                           <input type="number" value={simPlafon} onChange={(e) => setSimPlafon(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10000000" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-400">Bunga (% per tahun)</label>
                        <input type="number" value={simRate} onChange={(e) => setSimRate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="5" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-400">Tenor (Bulan)</label>
                        <input type="number" value={simTenor} onChange={(e) => setSimTenor(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="12" />
                    </div>
                 </div>

                 <div className="mt-6 flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">Estimasi Cicilan</p>
                        <p className="text-2xl font-black text-indigo-300">{simResult ? formatValue(simResult) : 'Rp 0'} <span className="text-xs text-white">/bln</span></p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={calculateLoan} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-500">Hitung</button>
                       {simResult && (
                           <button onClick={saveLoanToLiability} className="px-4 py-2 bg-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-500 flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Simpan</button>
                       )}
                    </div>
                 </div>
              </div>
              <Banknote className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
           </div>

           {/* LIABILITY LIST */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Daftar Kewajiban Aktif</h4>
              {liabilities.map(l => (
                 <div key={l.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="bg-rose-50 p-4 rounded-xl text-rose-500">
                           <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                           <h5 className="font-black text-slate-800">{l.name}</h5>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Jatuh Tempo: Tgl {l.dueDate}</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between md:justify-end gap-6 flex-grow border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <div className="text-right">
                           <p className="text-[9px] font-black uppercase text-slate-400">Nominal</p>
                           <p className="text-xl font-black text-slate-900">{formatValue(l.amount)}</p>
                        </div>
                        <button onClick={() => setLiabilities(liabilities.filter(x => x.id !== l.id))} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'strategy' && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
           {/* SETUP SECTION */}
           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-slate-100 rounded-lg"><Sliders className="w-5 h-5 text-slate-600" /></div>
               <div>
                  <h4 className="text-sm font-black text-slate-900">Konfigurasi Dasar</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Input data operasional untuk akurasi simulasi</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase text-slate-400">Biaya Operasional Tetap (Sebulan)</label>
                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                      <span className="text-xs font-black text-slate-400 mr-2">Rp</span>
                      <input 
                        type="number" 
                        value={monthlyFixedCost} 
                        onChange={(e) => setMonthlyFixedCost(Number(e.target.value))} 
                        className="bg-transparent w-full text-sm font-bold outline-none" 
                        placeholder="Contoh: 3000000 (Gaji + Listrik)" 
                      />
                   </div>
                   <p className="text-[9px] text-slate-400">Total Utang: {formatValue(totalLiabilities)} + Fixed Cost: {formatValue(monthlyFixedCost)}</p>
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase text-slate-400">Tabungan Kas Saat Ini</label>
                   <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                      <span className="text-xs font-black text-slate-400 mr-2">Rp</span>
                      <input 
                        type="number" 
                        value={currentSavings} 
                        onChange={(e) => setCurrentSavings(Number(e.target.value))} 
                        className="bg-transparent w-full text-sm font-bold outline-none" 
                      />
                   </div>
                </div>
             </div>
           </div>

           {/* SIMULATOR */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
                 <div className="relative z-10 space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase text-emerald-400 tracking-widest mb-1">Simulator Harian</h4>
                      <p className="text-xs text-slate-400">Jika rata-rata penjualan per hari adalah...</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-4xl font-black">{simDailySalesQty}</span>
                          <span className="text-sm font-bold uppercase opacity-60 mb-1">Porsi / Hari</span>
                       </div>
                       <input 
                          type="range" 
                          min="0" 
                          max="200" 
                          step="5" 
                          value={simDailySalesQty} 
                          onChange={(e) => setSimDailySalesQty(Number(e.target.value))} 
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                       />
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                       <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase opacity-60">Estimasi Laba Kotor (Bulan)</span>
                          <span className="text-[10px] font-bold">{formatValue(projectedMonthlyProfit)}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase opacity-60">Beban Bulanan (Fixed + Utang)</span>
                          <span className="text-[10px] font-bold text-rose-400">-{formatValue(totalMonthlyBurden)}</span>
                       </div>
                       <div className="h-px bg-white/10 my-1"></div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-emerald-400">Free Cashflow (Bersih)</span>
                          <span className={`text-sm font-black ${projectedNetFreeCashflow > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                            {formatValue(projectedNetFreeCashflow)}
                          </span>
                       </div>
                    </div>
                 </div>
                 <div className={`absolute top-0 right-0 w-32 h-full ${projectedNetFreeCashflow > 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'} -skew-x-12`}></div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                 <div className="space-y-2 relative z-10">
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
                       <Hourglass className="w-4 h-4 text-indigo-500" /> Timeline Dana Darurat
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">Target: 3 Bulan Pengeluaran ({formatValue(targetBufferAmount)})</p>
                 </div>

                 <div className="relative pt-4 pb-2 z-10">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                       <span>Sekarang ({savingsPercentage.toFixed(0)}%)</span>
                       <span>Target</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${savingsPercentage}%` }}></div>
                    </div>
                 </div>

                 <div className="mt-auto bg-indigo-50 rounded-xl p-5 border border-indigo-100 relative z-10">
                    {projectedNetFreeCashflow > 0 ? (
                       <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                          <div>
                             <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                                Dengan surplus <span className="font-black">{formatValue(projectedNetFreeCashflow)}/bulan</span>, 
                                Anda akan mencapai target dana darurat dalam waktu:
                             </p>
                             <p className="text-2xl font-black text-indigo-600 mt-2">{monthsToReachBuffer} Bulan <span className="text-xs font-bold opacity-60 uppercase">Lagi</span></p>
                          </div>
                       </div>
                    ) : (
                       <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />
                          <div>
                             <p className="text-xs font-bold text-rose-900 leading-relaxed">
                                Arus kas bulanan Anda negatif. Tingkatkan penjualan minimal ke <span className="font-black underline">{minPortionsPerDay} porsi/hari</span> untuk mulai menabung.
                             </p>
                          </div>
                       </div>
                    )}
                 </div>
                 <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-50 pointer-events-none" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
