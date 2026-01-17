import { useState } from 'react';

export const useMarketplace = () => {
  const [credits, setCredits] = useState<number>(250);
  const [transactionHistory, setTransactionHistory] = useState<{id: string, name: string, price: number, date: number}[]>([]);

  const deductCredits = (amount: number, itemName: string) => {
    if (credits < amount) return false;
    
    setCredits(prev => prev - amount);
    setTransactionHistory(prev => [{
      id: Math.random().toString(36).substr(2, 5),
      name: itemName,
      price: amount,
      date: Date.now()
    }, ...prev]);
    
    return true;
  };

  const topUpCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return {
    credits,
    transactionHistory,
    deductCredits,
    topUpCredits
  };
};