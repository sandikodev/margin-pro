import React, { useState, useMemo } from 'react';
import { 
  Banknote, AlertTriangle, Plus, CalendarClock, TrendingUp, 
  ArrowDownRight, ArrowUpRight, Calculator, CheckCircle2, Trash2, 
  Target, Sliders, ShieldAlert, Wallet, Hourglass, ShieldCheck, 
  XCircle, ShoppingCart, Package, Zap, Building2, HelpCircle, 
  PieChart, ChevronDown, Calendar, Search, Filter, X 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Liability, CashflowRecord, Project, TransactionCategory, BusinessProfile } from '../../../types';
import { calculateLoanPayment, calculateFinancialHealth } from '../../../lib/utils';
import { Modal } from '../../ui/Modal';
import { FloatingActionMenu, FloatingActionItem } from '../../ui/FloatingActionMenu';
import { TabNavigation, TabItem } from '../../ui/TabNavigation';

interface FinanceManagerProps {
  liabilities: Liability[];
  setLiabilities: React.Dispatch<React.SetStateAction<Liability[]>>;
  cashflow: CashflowRecord[];
  setCashflow: React.Dispatch<React.SetStateAction<CashflowRecord[]>>;
  activeProject: Project;
  formatValue: (val: number) => string;
  toggleLiabilityPaid?: (id: string) => void;
  deleteCashflow?: (id: string) => void;
  activeBusiness?: BusinessProfile;
  updateBusiness?: (updates: Partial<BusinessProfile>) => void;
}

interface ExtendedFinanceManagerProps extends FinanceManagerProps {
  monthlyFixedCost?: number;
  setMonthlyFixedCost?: (val: number) => void;
  currentSavings?: number;
  setCurrentSavings?: (val: number) => void;
}

export const FinanceManager: React.FC<ExtendedFinanceManagerProps> = ({
  liabilities, setLiabilities, cashflow, setCashflow, activeProject, formatValue,
  monthlyFixedCost = 3500000, setMonthlyFixedCost = (_: number) => {},
  currentSavings = 2500000, setCurrentSavings = (_: number) => {},
  toggleLiabilityPaid = (_: string) => {},
  deleteCashflow = (_: string) => {},
  activeBusiness, updateBusiness
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'debt' | 'strategy'>('journal');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false); 
  
  // Transaction Input State
  const [journalDate, setJournalDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [journalAmount, setJournalAmount] = useState<string>('');
  const [journalType, setJournalType] = useState<'IN' | 'OUT'>('IN');
  const [journalCategory, setJournalCategory] = useState<TransactionCategory>('SALES');
  const [journalNote, setJournalNote] = useState<string>('');

  // Loan Simulator State
  const [simPlafon, setSimPlafon] = useState<string>('');
  const [simTenor, setSimTenor] = useState<string>('12');
  const [simRate, setSimRate] = useState<string>('5');
  const [simResult, setSimResult] = useState<number | null>(null);

  // Strategy Simulator State
  const [simDailySalesQty, setSimDailySalesQty] = useState<number>(30); 

  const tabs: TabItem[] = [
    { id: 'journal', label: 'Journal', icon: CalendarClock },
    { id: 'debt', label: 'Debts', icon: ShieldAlert },
    { id: 'strategy', label: 'Forecast', icon: Target }
  ];

  // --- CALCULATIONS ---
  const totalUnpaidLiabilities = liabilities.filter(l => !l.isPaidThisMonth).reduce((acc, l) => acc + l.amount, 0);
  
  // Chart Data Preparation (Last 7 Days or Transactions)
  const chartData = useMemo(() => {
    const sorted = [...cashflow].sort((a, b) => a.date - b.date).slice(-10); // Take last 10
    if (sorted.length === 0) return [{ name: 'Start', balance: activeBusiness?.initialCapital || 0 }];
    
    return sorted.map((c, i) => ({
      name: i.toString(),
      amount: c.revenue - c.expense,
      date: new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }));
  }, [cashflow, activeBusiness]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRecords = cashflow.filter(c => {
      const d = new Date(c.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return {
      income: monthlyRecords.reduce((acc, c) => acc + c.revenue, 0),
      expense: monthlyRecords.reduce((acc, c) => acc + c.expense, 0),
      count: monthlyRecords.length
    };
  }, [cashflow]);

  // Group Cashflow by Date
  const groupedCashflow = useMemo(() => {
    const groups: { [key: string]: CashflowRecord[] } = {};
    cashflow.forEach(record => {
      const dateKey = new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(record);
    });
    return groups;
  }, [cashflow]);

  const totalRevenue = cashflow.reduce((acc, c) => acc + c.revenue, 0);
  const totalExpense = cashflow.reduce((acc, c) => acc + c.expense, 0);
  const totalNetProfit = totalRevenue - totalExpense;
  const initialCapital = activeBusiness?.initialCapital || 1;
  const roiPercentage = (totalNetProfit / initialCapital) * 100;
  
  const {
      projectedNetFreeCashflow,
      targetBufferAmount,
      monthsToReachBuffer,
      savingsPercentage,
  } = useMemo(() => calculateFinancialHealth(
      totalRevenue, 
      totalExpense, 
      totalUnpaidLiabilities, 
      monthlyFixedCost, 
      activeProject?.targetNet || 0, 
      simDailySalesQty, 
      activeBusiness?.cashOnHand || currentSavings
  ), [totalRevenue, totalExpense, totalUnpaidLiabilities, monthlyFixedCost, activeProject, simDailySalesQty, activeBusiness, currentSavings]);

  // --- HANDLERS ---

  const handleAddJournal = () => {
    if (!journalAmount) return;
    const amount = Number(journalAmount);
    const revenue = journalType === 'IN' ? amount : 0;
    const expense = journalType === 'OUT' ? amount : 0;

    const newRecord: CashflowRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(journalDate).getTime(),
      revenue,
      expense,
      category: journalCategory,
      note: journalNote
    };

    setCashflow([newRecord, ...cashflow]);

    if (activeBusiness && updateBusiness) {
        let newCash = activeBusiness.cashOnHand;
        let newAssets = activeBusiness.currentAssetValue;

        if (journalType === 'IN') {
            newCash += amount;
        } else {
            newCash -= amount;
            if (journalCategory === 'ASSET') {
                newAssets += amount;
            }
        }

        updateBusiness({
            cashOnHand: newCash,
            currentAssetValue: newAssets
        });
    }

    setJournalAmount('');
    setJournalNote('');
    setIsInputModalOpen(false); // Close Modal
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
    alert("Kewajiban dicatat.");
  };

  const openInput = (type: 'IN' | 'OUT') => {
    setJournalType(type);
    setJournalCategory(type === 'IN' ? 'SALES' : 'COGS');
    setIsInputModalOpen(true);
  };

  const fabItems: FloatingActionItem[] = [
    {
      id: 'income',
      label: 'Pemasukan',
      icon: ArrowDownRight,
      onClick: () => openInput('IN'),
      variant: 'success'
    },
    {
      id: 'expense',
      label: 'Pengeluaran',
      icon: ArrowUpRight,
      onClick: () => openInput('OUT'),
      variant: 'danger'
    }
  ];

  const getCategoryIcon = (cat: TransactionCategory | undefined) => {
      switch(cat) {
          case 'SALES': return <ShoppingCart className="w-4 h-4" />;
          case 'COGS': return <Package className="w-4 h-4" />;
          case 'OPEX': return <Zap className="w-4 h-4" />;
          case 'ASSET': return <Building2 className="w-4 h-4" />;
          default: return <HelpCircle className="w-4 h-4" />;
      }
  };

  const getCategoryColor = (cat: TransactionCategory | undefined) => {
      switch(cat) {
          case 'SALES': return 'text-emerald-600 bg-emerald-100';
          case 'COGS': return 'text-orange-600 bg-orange-100';
          case 'OPEX': return 'text-rose-600 bg-rose-100';
          case 'ASSET': return 'text-indigo-600 bg-indigo-100';
          default: return 'text-slate-600 bg-slate-100';
      }
  };

  // Helper to safely display toFixed
  const safeToFixed = (val: number | undefined, digits: number = 0) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    return val.toFixed(digits);
  };

  return (
    <div className="space-y-6 pb-24 relative max-w-xl mx-auto lg:max-w-none">
      
      {/* 1. NATIVE APP HEADER CARD */}
      <section className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Total Balance</span>
                    <h2 className="text-4xl font-black tracking-tighter">{formatValue(activeBusiness?.cashOnHand || 0)}</h2>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block mb-1">ROI Status</span>
                    <div className="flex items-center justify-end gap-1">
                       <span className="text-xl font-black">{safeToFixed(roiPercentage, 0)}%</span>
                       {roiPercentage >= 100 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-indigo-400" />}
                    </div>
                </div>
            </div>

            {/* Mini Chart */}
            <div className="h-24 w-full -mx-2">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="amount" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorGradient)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>

            <div className="flex gap-2 mt-4">
                <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center justify-between border border-white/5">
                   <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg"><ArrowDownRight className="w-3 h-3 text-emerald-400" /></div>
                      <div className="flex flex-col">
                         <span className="text-[8px] uppercase text-slate-400 font-bold">Income</span>
                         <span className="text-xs font-black">{formatValue(monthlySummary.income)}</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center justify-between border border-white/5">
                   <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-500/20 rounded-lg"><ArrowUpRight className="w-3 h-3 text-rose-400" /></div>
                      <div className="flex flex-col">
                         <span className="text-[8px] uppercase text-slate-400 font-bold">Expense</span>
                         <span className="text-xs font-black">{formatValue(monthlySummary.expense)}</span>
                      </div>
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* 2. MODULAR TABS */}
      <TabNavigation 
        variant="sticky" 
        tabs={tabs} 
        activeTab={activeSubTab} 
        onChange={(id) => setActiveSubTab(id as any)} 
      />

      {activeSubTab === 'journal' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
           
           {/* List View */}
           {Object.keys(groupedCashflow).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                 <Wallet className="w-16 h-16 text-slate-300 mb-4" />
                 <p className="text-sm font-bold text-slate-500">Belum ada transaksi bulan ini.</p>
                 <button onClick={() => openInput('IN')} className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest underline">Catat Transaksi Pertama</button>
              </div>
           ) : (
              Object.entries(groupedCashflow)
                .sort(([, recordsA], [, recordsB]) => {
                   const timeA = recordsA[0]?.date || 0;
                   const timeB = recordsB[0]?.date || 0;
                   return timeB - timeA;
                })
                .map(([date, records]: [string, CashflowRecord[]]) => (
                 <div key={date} className="space-y-2 px-1">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest sticky top-10 bg-slate-50/95 backdrop-blur-sm py-3 z-10 px-4 rounded-xl shadow-sm flex items-center">
                       {date}
                    </h4>
                    <div className="space-y-2">
                       {records.map(record => {
                          const isIncome = record.revenue > 0;
                          const amount = isIncome ? record.revenue : record.expense;
                          const catColor = getCategoryColor(record.category);
                          
                          return (
                             <div key={record.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catColor}`}>
                                      {getCategoryIcon(record.category)}
                                   </div>
                                   <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{record.note || record.category}</p>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{record.category}</span>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <span className={`text-sm font-black block ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {isIncome ? '+' : '-'}{formatValue(amount)}
                                   </span>
                                   <button onClick={() => deleteCashflow(record.id)} className="text-[9px] text-slate-300 hover:text-rose-500 transition-colors">Hapus</button>
                                </div>
                             </div>
                          )
                       })}
                    </div>
                 </div>
              ))
           )}

           {/* Reusable FAB with Menu */}
           <FloatingActionMenu 
              icon={Plus} 
              items={fabItems}
              isOpen={isFabOpen}
              setIsOpen={setIsFabOpen}
           />
        </div>
      )}

      {/* MODAL INPUT TRANSACTION */}
      <Modal 
        isOpen={isInputModalOpen} 
        onClose={() => setIsInputModalOpen(false)} 
        title="Input Transaksi" 
        icon={Plus}
        footer={
            <button 
               onClick={handleAddJournal} 
               className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
               <CheckCircle2 className="w-4 h-4" /> Simpan Data
            </button>
        }
      >
         <div className="p-6 space-y-6">
            {/* Type Selector */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
               <button onClick={() => { setJournalType('IN'); setJournalCategory('SALES'); }} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${journalType === 'IN' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}>Pemasukan</button>
               <button onClick={() => { setJournalType('OUT'); setJournalCategory('COGS'); }} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${journalType === 'OUT' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}>Pengeluaran</button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nominal (Rp)</label>
               <input 
                  type="number" 
                  value={journalAmount} 
                  autoFocus
                  onChange={(e) => setJournalAmount(e.target.value)} 
                  className={`w-full text-3xl font-black text-center py-4 bg-transparent border-b-2 outline-none ${journalType === 'IN' ? 'border-emerald-200 text-emerald-600 placeholder-emerald-200' : 'border-rose-200 text-rose-600 placeholder-rose-200'}`}
                  placeholder="0"
               />
            </div>

            {/* Category Grid */}
            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Kategori</label>
               <div className="grid grid-cols-3 gap-3">
                  {journalType === 'IN' ? (
                     <button onClick={() => setJournalCategory('SALES')} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${journalCategory === 'SALES' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 text-slate-400'}`}>
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase">Penjualan</span>
                     </button>
                  ) : (
                     <>
                        <button onClick={() => setJournalCategory('COGS')} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${journalCategory === 'COGS' ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500/20' : 'bg-white border-slate-200 text-slate-400'}`}>
                           <Package className="w-5 h-5" />
                           <span className="text-[8px] font-black uppercase">Bahan Baku</span>
                        </button>
                        <button onClick={() => setJournalCategory('OPEX')} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${journalCategory === 'OPEX' ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20' : 'bg-white border-slate-200 text-slate-400'}`}>
                           <Zap className="w-5 h-5" />
                           <span className="text-[8px] font-black uppercase">Operasional</span>
                        </button>
                        <button onClick={() => setJournalCategory('ASSET')} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${journalCategory === 'ASSET' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20' : 'bg-white border-slate-200 text-slate-400'}`}>
                           <Building2 className="w-5 h-5" />
                           <span className="text-[8px] font-black uppercase">Investasi Aset</span>
                        </button>
                     </>
                  )}
               </div>
            </div>

            {/* Note & Date */}
            <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Catatan</label>
                  <input type="text" placeholder="Ket. Transaksi" value={journalNote} onChange={(e) => setJournalNote(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Tanggal</label>
                  <input type="date" value={journalDate} onChange={(e) => setJournalDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-xs font-bold outline-none text-center" />
               </div>
            </div>
         </div>
      </Modal>

      {/* TAB DEBT & STRATEGY (Simplified for Mobile) */}
      {activeSubTab === 'debt' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
           {/* LOAN CALCULATOR CARD */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-widest mb-4 flex items-center gap-2">
                 <Calculator className="w-4 h-4 text-indigo-500" /> Quick Loan Sim
              </h4>
              <div className="space-y-3">
                 <input type="number" value={simPlafon} onChange={(e) => setSimPlafon(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Jumlah Pinjaman (Rp)" />
                 <div className="flex gap-3">
                    <input type="number" value={simRate} onChange={(e) => setSimRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Bunga %" />
                    <input type="number" value={simTenor} onChange={(e) => setSimTenor(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder="Bulan" />
                 </div>
                 <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                    <span className="text-[10px] font-black uppercase text-indigo-400">Cicilan/Bulan</span>
                    <span className="text-lg font-black text-indigo-700">{simResult ? formatValue(simResult) : '-'}</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={calculateLoan} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600">Hitung</button>
                    {simResult && <button onClick={saveLoanToLiability} className="flex-1 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg">Simpan</button>}
                 </div>
              </div>
           </div>

           {/* LIABILITY LIST */}
           <div className="space-y-3">
              {liabilities.map(l => (
                 <div key={l.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between ${l.isPaidThisMonth ? 'border-emerald-200 opacity-60' : 'border-slate-100'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${l.isPaidThisMonth ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                           <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                           <h5 className="font-black text-slate-800 text-sm">{l.name}</h5>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Due: Tgl {l.dueDate}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-sm font-black ${l.isPaidThisMonth ? 'text-emerald-600' : 'text-slate-900'}`}>{formatValue(l.amount)}</p>
                        <button onClick={() => toggleLiabilityPaid(l.id)} className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-1">{l.isPaidThisMonth ? 'Lunas' : 'Bayar'}</button>
                     </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'strategy' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
           {/* SLIDERS */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Jual Harian</span>
                    <span className="text-lg font-black text-indigo-600">{simDailySalesQty} Porsi</span>
                 </div>
                 <input type="range" min="0" max="200" step="5" value={simDailySalesQty} onChange={(e) => setSimDailySalesQty(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-indigo-600" />
              </div>
              <div className="h-px bg-slate-100"></div>
              <div>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Biaya Tetap (Gaji+Listrik)</span>
                 <input type="number" value={monthlyFixedCost} onChange={(e) => setMonthlyFixedCost(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
              </div>
           </div>

           {/* RESULT CARDS */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500 text-white p-5 rounded-[2rem] shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Potensi Cashflow</span>
                 <p className="text-xl font-black mt-1 leading-tight">{formatValue(projectedNetFreeCashflow)}</p>
                 <TrendingUp className="absolute bottom-[-10px] right-[-10px] w-16 h-16 text-white/20" />
              </div>
              <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Target Dana Darurat</span>
                    <p className="text-xl font-black mt-1 leading-tight">{monthsToReachBuffer} Bulan</p>
                    <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                       <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(Number(safeToFixed(savingsPercentage, 0)), 100)}%` }}></div>
                    </div>
                    <span className="text-[7px] mt-1 block opacity-70">{safeToFixed(savingsPercentage, 0)}% Terkumpul</span>
                 </div>
                 <ShieldCheck className="absolute bottom-[-10px] right-[-10px] w-16 h-16 text-white/10" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};