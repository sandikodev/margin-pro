import React, { useState } from 'react';
import {
   Plus, CalendarClock, TrendingUp,
   ArrowDownRight, ArrowUpRight, CheckCircle2,
   Target, ShieldAlert,
   ShoppingCart, Package, Zap, Building2
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Liability, CashflowRecord, Project, TransactionCategory, BusinessProfile } from '@shared/types';
import { FINANCIAL_DEFAULTS } from '@shared/constants';
import { calculateLoanPayment } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { FloatingActionItem } from '@/components/ui/FloatingActionMenu';
import { TabNavigation, TabItem } from '@/components/ui/TabNavigation';
import { useToast } from '@/context/toast-context';
import { useFinanceAnalytics } from '@/hooks/useFinanceAnalytics';
import { BentoCard } from '@koda/core/ui';

// Modular Components
import { JournalTab } from './components/JournalTab';
import { DebtTab } from './components/DebtTab';
import { ForecastTab } from './components/ForecastTab';

interface FinanceManagerProps {
   liabilities: Liability[];
   setLiabilities: React.Dispatch<React.SetStateAction<Liability[]>>;
   cashflow: CashflowRecord[];
   setCashflow: React.Dispatch<React.SetStateAction<CashflowRecord[]>>;
   activeProject: Project | undefined;
   formatValue: (val: number) => string;
   toggleLiabilityPaid?: (id: string) => void;
   deleteCashflow?: (id: string) => void;
   addLiability?: (l: Liability) => void;
   activeBusiness?: BusinessProfile;
   updateBusiness?: (updates: Partial<BusinessProfile>) => void;
}

interface ExtendedFinanceManagerProps extends FinanceManagerProps {
   monthlyFixedCost?: number;
   setMonthlyFixedCost?: (val: number) => void;
   currentSavings?: number;
}

export const FinanceManager: React.FC<ExtendedFinanceManagerProps> = ({
   liabilities, setLiabilities, cashflow, setCashflow, activeProject, formatValue,
   monthlyFixedCost = FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST, setMonthlyFixedCost = (_: number) => { },
   currentSavings = FINANCIAL_DEFAULTS.CURRENT_SAVINGS,
   toggleLiabilityPaid = (_: string) => { },
   deleteCashflow = (_: string) => { },
   addLiability = (_: Liability) => { },
   activeBusiness, updateBusiness
}) => {
   const { showToast } = useToast();
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
   const {
      chartData,
      monthlySummary,
      groupedCashflow,
      roiPercentage,
      healthStats
   } = useFinanceAnalytics({
      cashflow,
      liabilities,
      activeBusiness,
      activeProject,
      monthlyFixedCost,
      simDailySalesQty,
      currentSavings
   });

   const {
      projectedNetFreeCashflow,
      monthsToReachBuffer,
      savingsPercentage,
   } = healthStats;

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
      if (addLiability) {
         addLiability(newLiability);
      } else {
         setLiabilities([...liabilities, newLiability]);
      }
      setSimResult(null);
      setSimPlafon('');
      showToast("Kewajiban dicatat.", "success");
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

   const safeToFixed = (val: number | undefined, digits: number = 0) => {
      if (val === undefined || val === null || isNaN(val)) return '0';
      return val.toFixed(digits);
   };

   return (
      <div className="space-y-6 pb-24 relative max-w-xl mx-auto lg:max-w-none animate-in fade-in slide-in-from-bottom-6 duration-700">

         {/* 1. NATIVE APP HEADER CARD */}
         <BentoCard noPadding className="bg-slate-900 border-slate-800 p-6 lg:p-8 text-white shadow-2xl">
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
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
         </BentoCard>

         {/* 2. MODULAR TABS */}
         <TabNavigation
            variant="sticky"
            tabs={tabs}
            activeTab={activeSubTab}
            onChange={(id) => setActiveSubTab(id as 'journal' | 'debt' | 'strategy')}
         />

         {activeSubTab === 'journal' && (
            <JournalTab
               groupedCashflow={groupedCashflow}
               formatValue={formatValue}
               deleteCashflow={deleteCashflow}
               openInput={openInput}
               isFabOpen={isFabOpen}
               setIsFabOpen={setIsFabOpen}
               fabItems={fabItems}
            />
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

         {activeSubTab === 'debt' && (
            <DebtTab
               simPlafon={simPlafon}
               setSimPlafon={setSimPlafon}
               simRate={simRate}
               setSimRate={setSimRate}
               simTenor={simTenor}
               setSimTenor={setSimTenor}
               simResult={simResult}
               calculateLoan={calculateLoan}
               saveLoanToLiability={saveLoanToLiability}
               liabilities={liabilities}
               toggleLiabilityPaid={toggleLiabilityPaid}
               formatValue={formatValue}
            />
         )}

         {activeSubTab === 'strategy' && (
            <ForecastTab
               simDailySalesQty={simDailySalesQty}
               setSimDailySalesQty={setSimDailySalesQty}
               monthlyFixedCost={monthlyFixedCost}
               setMonthlyFixedCost={setMonthlyFixedCost}
               projectedNetFreeCashflow={projectedNetFreeCashflow}
               monthsToReachBuffer={monthsToReachBuffer}
               savingsPercentage={safeToFixed(savingsPercentage, 0)}
               minPortionsPerDay={healthStats.minPortionsPerDay}
               formatValue={formatValue}
            />
         )}
      </div>
   );
};