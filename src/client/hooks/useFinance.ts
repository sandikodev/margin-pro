
import { useState, useEffect } from 'react';
import { Liability, CashflowRecord } from '@shared/types';

const LIABILITIES_KEY = 'margins_pro_liabilities';
const CASHFLOW_KEY = 'margins_pro_cashflow';
const FINANCE_SETTINGS_KEY = 'margins_pro_finance_settings';

export const useFinance = () => {
  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem(LIABILITIES_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 'l1', name: 'Pinjaman KrediFazz', amount: 591030, dueDate: 8, isPaidThisMonth: false },
      { id: 'l2', name: 'Belanja Packaging', amount: 1500000, dueDate: 25, isPaidThisMonth: false }
    ];
  });
  
  const [cashflow, setCashflow] = useState<CashflowRecord[]>(() => {
    const saved = localStorage.getItem(CASHFLOW_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [monthlyFixedCost, setMonthlyFixedCost] = useState<number>(() => {
    const saved = localStorage.getItem(FINANCE_SETTINGS_KEY);
    return saved ? JSON.parse(saved).monthlyFixedCost : 3500000;
  });

  const [currentSavings, setCurrentSavings] = useState<number>(() => {
    const saved = localStorage.getItem(FINANCE_SETTINGS_KEY);
    return saved ? JSON.parse(saved).currentSavings : 2500000;
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(LIABILITIES_KEY, JSON.stringify(liabilities));
  }, [liabilities]);

  useEffect(() => {
    localStorage.setItem(CASHFLOW_KEY, JSON.stringify(cashflow));
  }, [cashflow]);

  useEffect(() => {
    localStorage.setItem(FINANCE_SETTINGS_KEY, JSON.stringify({ monthlyFixedCost, currentSavings }));
  }, [monthlyFixedCost, currentSavings]);

  const toggleLiabilityPaid = (id: string) => {
    setLiabilities(prev => prev.map(l => 
        l.id === id ? { ...l, isPaidThisMonth: !l.isPaidThisMonth } : l
    ));
  };

  const deleteCashflow = (id: string) => {
    if(window.confirm('Hapus catatan transaksi ini?')) {
        setCashflow(prev => prev.filter(c => c.id !== id));
    }
  };

  return {
    liabilities,
    setLiabilities,
    toggleLiabilityPaid,
    cashflow,
    setCashflow,
    deleteCashflow,
    monthlyFixedCost,
    setMonthlyFixedCost,
    currentSavings,
    setCurrentSavings
  };
};
