import { renderHook } from '@testing-library/react';
import { useFinanceAnalytics } from '../hooks/useFinanceAnalytics';
import { describe, it, expect } from 'vitest';
import { CashflowRecord, Liability, Project, BusinessProfile } from '@shared/types';
import { FINANCIAL_DEFAULTS } from '@shared/constants';

// MOCK DATA
const mockLiabilities: Liability[] = [
    { id: 'l1', name: 'Debt 1', amount: 500000, dueDate: 10, isPaidThisMonth: false },
    { id: 'l2', name: 'Debt 2', amount: 1000000, dueDate: 20, isPaidThisMonth: true },
];

const mockCashflow: CashflowRecord[] = [
    { id: 'c1', date: Date.now(), revenue: 1000000, expense: 0, note: 'Sales' },
    { id: 'c2', date: Date.now(), revenue: 0, expense: 300000, note: 'Expense' },
];

const mockProject: Project = {
    id: 'p1', name: 'Test Project', label: 'Test', costs: [], targetNet: 5000, lastModified: Date.now()
};

const mockBusiness: BusinessProfile = {
    id: 'b1', name: 'Test Biz', type: 'fnb_offline', initialCapital: 10000000, cashOnHand: 5000000, currentAssetValue: 0, establishedDate: Date.now()
};

describe('useFinanceAnalytics Hook', () => {

    it('should calculate total unpaid liabilities correctly', () => {
        const { result } = renderHook(() => useFinanceAnalytics({
            cashflow: [],
            liabilities: mockLiabilities,
            activeBusiness: mockBusiness,
            activeProject: mockProject,
            monthlyFixedCost: FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
            simDailySalesQty: 10,
            currentSavings: FINANCIAL_DEFAULTS.CURRENT_SAVINGS
        }));

        // Only Debt 1 is unpaid (500k)
        expect(result.current.totalUnpaidLiabilities).toBe(500000);
    });

    it('should calcluate net profit from cashflow', () => {
        const { result } = renderHook(() => useFinanceAnalytics({
            cashflow: mockCashflow,
            liabilities: [],
            activeBusiness: mockBusiness,
            activeProject: mockProject,
            monthlyFixedCost: 0,
            simDailySalesQty: 10,
            currentSavings: 0
        }));

        // Revenue 1.000.000 - Expense 300.000 = 700.000
        expect(result.current.totalNetProfit).toBe(700000);
    });

    it('should calculate ROI percentage', () => {
        const { result } = renderHook(() => useFinanceAnalytics({
            cashflow: mockCashflow,
            liabilities: [],
            activeBusiness: mockBusiness, // Capital 10.000.000
            activeProject: mockProject,
            monthlyFixedCost: 0,
            simDailySalesQty: 10,
            currentSavings: 0
        }));

        // Net Profit 700.000 / Capital 10.000.000 = 0.07 * 100 = 7%
        expect(result.current.roiPercentage).toBeCloseTo(7);
    });

    it('should return correct health stats structure', () => {
        const { result } = renderHook(() => useFinanceAnalytics({
            cashflow: [],
            liabilities: [],
            activeBusiness: mockBusiness,
            activeProject: mockProject,
            monthlyFixedCost: 3500000,
            simDailySalesQty: 30,
            currentSavings: 2000000
        }));

        expect(result.current.healthStats).toBeDefined();
        expect(result.current.healthStats.score).toBeDefined();
        expect(result.current.healthStats.label).toBeDefined();
        expect(result.current.healthStats.savingsPercentage).toBeDefined();
    });
});
