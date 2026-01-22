import { describe, it, expect } from 'vitest';
import {
    calculateTotalHPP,
    calculatePricingStrategies,
    smartRoundUp,
    calculateFinancialHealth
} from './utils';
import { Platform, Project, PlatformOverrides, CostItem } from '@shared/types';

describe('utils logic', () => {

    describe('smartRoundUp', () => {
        it('should round small amounts to nearest 100', () => {
            expect(smartRoundUp(1234)).toBe(1300);
            expect(smartRoundUp(49950)).toBe(50000);
        });

        it('should round large amounts to nearest 500', () => {
            expect(smartRoundUp(50100)).toBe(50500);
            expect(smartRoundUp(150200)).toBe(150500);
        });
    });

    describe('calculateTotalHPP', () => {
        const mockCosts: CostItem[] = [
            { id: '1', name: 'Item 1', amount: 1000, allocation: 'unit' },
            { id: '2', name: 'Item 2', amount: 5000, allocation: 'bulk', batchYield: 10 }
        ];

        it('should calculate total HPP correctly', () => {
            // Item 1: 1000
            // Item 2: 5000 / 10 = 500
            // Total: 1500
            expect(calculateTotalHPP(mockCosts)).toBe(1500);
        });
    });

    describe('calculatePricingStrategies', () => {
        const mockProject: Project = {
            id: 'p1',
            name: 'Kopi Susu',
            label: 'Beverage',
            costs: [
                { id: '1', name: 'Susu', amount: 5000, allocation: 'unit' },
                { id: '2', name: 'Kopi', amount: 3000, allocation: 'unit' }
            ],
            targetNet: 10000,
            productionConfig: { period: 'daily', targetUnits: 1, daysActive: 1 },
            lastModified: Date.now()
        };

        const mockOverrides: Record<string, PlatformOverrides> = {
            [Platform.GO_FOOD]: { commission: 20, fixedFee: 1000, withdrawal: 0 },
            [Platform.GRAB_FOOD]: { commission: 20, fixedFee: 1000, withdrawal: 0 },
            [Platform.SHOPEE_FOOD]: { commission: 20, fixedFee: 1000, withdrawal: 0 },
            [Platform.OFFLINE]: { commission: 0, fixedFee: 0, withdrawal: 0 }
        };

        it('should calculate recommended price for GoFood correctly', () => {
            const results = calculatePricingStrategies(mockProject, mockOverrides as Record<Platform, PlatformOverrides>, 0, 0, 0);
            const gofood = results.find(r => r.platform === Platform.GO_FOOD)!;

            // HPP = 8000
            // Target Profit = 10000
            // Fixed Fee = 1000
            // Numerator = 8000 + 10000 + 1000 = 19000
            // Denominator = 1 - 0.2 = 0.8
            // Price = 19000 / 0.8 = 23750
            // Rounded = 23800
            expect(gofood.recommended.price).toBe(23800);
            expect(gofood.recommended.netProfit).toBeGreaterThan(10000);
        });
    });

    describe('calculateFinancialHealth', () => {
        it('should return "Healthy" label when score is high', () => {
            const health = calculateFinancialHealth(
                10000000, // revenue
                5000000,  // expense
                1000000,  // liabilities
                2000000,  // fixed cost
                5000,     // margin per portion
                50,       // daily qty
                10000000  // current savings (exceeds buffer)
            );

            expect(health.label).toBe('Healthy');
            expect(health.score).toBeGreaterThanOrEqual(80);
        });

        it('should return "Danger" label when profit is negative', () => {
            const health = calculateFinancialHealth(
                1000000,  // revenue
                2000000,  // expense
                5000000,  // liabilities
                5000000,  // fixed cost
                1000,     // margin per portion
                5,        // low daily qty
                0         // no savings
            );

            expect(health.label).toBe('Danger');
            expect(health.score).toBeLessThan(50);
        });
    });
});
