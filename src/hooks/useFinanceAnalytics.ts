import { useMemo } from 'react';
import { Liability, CashflowRecord, Project, BusinessProfile } from '@shared/types';
import { calculateFinancialHealth } from '@/lib/utils';

interface UseFinanceAnalyticsProps {
    cashflow: CashflowRecord[];
    liabilities: Liability[];
    activeBusiness?: BusinessProfile;
    activeProject?: Project;
    monthlyFixedCost: number;
    simDailySalesQty: number;
    currentSavings: number;
}

export const useFinanceAnalytics = ({
    cashflow,
    liabilities,
    activeBusiness,
    activeProject,
    monthlyFixedCost,
    simDailySalesQty,
    currentSavings
}: UseFinanceAnalyticsProps) => {

    // --- CALCULATIONS ---
    const totalUnpaidLiabilities = useMemo(() =>
        liabilities.filter(l => !l.isPaidThisMonth).reduce((acc, l) => acc + l.amount, 0),
        [liabilities]);

    // Chart Data Preparation (Last 10 Days or Transactions)
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

    const totalRevenue = useMemo(() => cashflow.reduce((acc, c) => acc + c.revenue, 0), [cashflow]);
    const totalExpense = useMemo(() => cashflow.reduce((acc, c) => acc + c.expense, 0), [cashflow]);
    const totalNetProfit = totalRevenue - totalExpense;
    const initialCapital = activeBusiness?.initialCapital || 1;
    const roiPercentage = initialCapital > 0 ? (totalNetProfit / initialCapital) * 100 : 0;


    const healthStats = useMemo(() => calculateFinancialHealth(
        totalRevenue,
        totalExpense,
        totalUnpaidLiabilities,
        monthlyFixedCost,
        activeProject?.targetNet || 0,
        simDailySalesQty,
        activeBusiness?.cashOnHand || currentSavings
    ), [totalRevenue, totalExpense, totalUnpaidLiabilities, monthlyFixedCost, activeProject, simDailySalesQty, activeBusiness, currentSavings]);

    return {
        chartData,
        monthlySummary,
        groupedCashflow,
        totalRevenue,
        totalExpense,
        totalNetProfit,
        roiPercentage,
        healthStats,
        totalUnpaidLiabilities
    };
};
