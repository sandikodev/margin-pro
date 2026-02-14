import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Platform, Project, PlatformOverrides, CalculationResult, CostItem, ProductionConfig, ScenarioResult } from '@shared/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ==========================================
 * AI & DATA SAFETY UTILITIES
 * ==========================================
 */

export const cleanAIJSON = (text: string): string => {
  if (!text) return '{}';
  const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
  if (match) return match[1];
  return text;
};

/**
 * ==========================================
 * OPERATIONAL CALCULATIONS (HPP & BURN RATE)
 * ==========================================
 */

export const calculateEffectiveCost = (cost: CostItem, prodConfig?: ProductionConfig): number => {
  if (cost.allocation === 'bulk' && cost.batchYield && cost.batchYield > 0) {
    if (cost.bulkUnit === 'days' && prodConfig) {
      const avgPortionPerDay = prodConfig.daysActive > 0 ? prodConfig.targetUnits / prodConfig.daysActive : 1;
      const totalPortionYield = cost.batchYield * avgPortionPerDay;
      return totalPortionYield > 0 ? cost.amount / totalPortionYield : 0;
    } else {
      return cost.amount / cost.batchYield;
    }
  }
  return cost.amount;
};

export const calculateTotalHPP = (costs: CostItem[], prodConfig?: ProductionConfig): number => {
  return costs.reduce((acc, cost) => acc + calculateEffectiveCost(cost, prodConfig), 0);
};

export const calculateOperationalBurnRate = (bulkCosts: CostItem[], prodConfig: ProductionConfig) => {
  const totalPurchase = bulkCosts.reduce((acc, c) => acc + c.amount, 0);

  const dailyBurnRate = bulkCosts.reduce((acc, c) => {
    if (c.bulkUnit === 'days' && c.batchYield) {
      return acc + (c.amount / c.batchYield);
    }
    if (c.bulkUnit !== 'days' && c.batchYield) {
      const dailyPortions = prodConfig.period === 'weekly'
        ? (prodConfig.targetUnits / prodConfig.daysActive)
        : prodConfig.targetUnits;
      return acc + ((c.amount / c.batchYield) * dailyPortions);
    }
    return acc;
  }, 0);

  const cycleBurnRate = dailyBurnRate * (prodConfig.period === 'weekly' ? prodConfig.daysActive : 7);

  return { totalPurchase, dailyBurnRate, cycleBurnRate };
};

/**
 * ==========================================
 * SMART PRICING ENGINE
 * ==========================================
 */

/**
 * Smart Rounding: Membulatkan harga ke angka psikologis yang wajar.
 * - < 50.000 -> Bulatkan ke 100 terdekat (Lebih presisi untuk Direct Selling/Offline)
 * - >= 50.000 -> Bulatkan ke 500 terdekat
 */
export const smartRoundUp = (amount: number): number => {
  if (amount <= 0) return 0;
  if (amount < 50000) return Math.ceil(amount / 100) * 100;
  return Math.ceil(amount / 500) * 500;
};

const calculateScenario = (
  sellingPrice: number,
  hpp: number,
  variableFee: number,
  fixedFees: number
): ScenarioResult => {
  const totalVarFee = sellingPrice * variableFee;
  const totalDeductions = totalVarFee + fixedFees;
  const netProfit = sellingPrice - totalDeductions - hpp;
  const roi = hpp > 0 ? (netProfit / hpp) * 100 : 0;
  const marginPercent = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;

  return {
    price: sellingPrice,
    netProfit,
    totalDeductions,
    roi,
    marginPercent,
    isBleeding: netProfit < 0
  };
};

export const calculatePricingStrategies = (
  activeProject: Project | undefined,
  overrides: Record<Platform, PlatformOverrides>,
  promoPercent: number,
  businessTaxRate: number = 0.11,
  businessTargetMargin: number = 20
): CalculationResult[] => {
  if (!activeProject) return [];

  const totalProductionCost = calculateTotalHPP(activeProject.costs, activeProject.productionConfig);

  // Tax Rate: Project override > Business settings
  const taxRate = activeProject.taxRate !== undefined ? activeProject.taxRate / 100 : businessTaxRate / 100;

  // Base Profit Target (from Manual Markup)
  // Logic: If targetNet is 0, we can use targetMargin to suggest a profit
  let manualTargetProfit = activeProject.targetNet || 0;

  if (manualTargetProfit === 0 && (activeProject.targetMargin || businessTargetMargin)) {
    const targetMarginPct = (activeProject.targetMargin || businessTargetMargin) / 100;
    // Profit = Price * Margin -> Price = Cost / (1 - Margin) -> Profit = Price - Cost
    // Or simpler: Profit = Cost * (Margin / (1 - Margin))
    manualTargetProfit = targetMarginPct < 1 ? totalProductionCost * (targetMarginPct / (1 - targetMarginPct)) : 0;
  }

  // Base Profit Target (from Competitor Price)
  // Logic: Market Price - HPP = The profit we want to secure (protect) on other platforms
  const competitorPrice = activeProject.competitorPrice || 0;
  const competitorBaseProfit = competitorPrice - totalProductionCost;

  return Object.values(Platform).map(platform => {
    const pOverride = overrides[platform] || { commission: 0, fixedFee: 0, withdrawal: 0 };
    const comm = pOverride.commission / 100;
    const fixedFee = pOverride.fixedFee;
    const withdrawal = pOverride.withdrawal;
    const promo = promoPercent / 100;

    // Total variable deduction % (Commission + Tax on Comm + Promo Subsidy)
    const effectiveVariableFee = comm + (comm * taxRate) + promo;
    const totalFixedFees = fixedFee + withdrawal;
    const denominator = 1 - effectiveVariableFee;

    // --- SCENARIO 1: MARKUP STRATEGY (Protect Manual Target) ---
    const numMarkup = totalProductionCost + manualTargetProfit + totalFixedFees;
    const rawMarkupPrice = denominator > 0 ? numMarkup / denominator : 0;
    const markupRecommendedPrice = smartRoundUp(rawMarkupPrice);
    const markupScenario = calculateScenario(markupRecommendedPrice, totalProductionCost, effectiveVariableFee, totalFixedFees);

    // --- SCENARIO 2: MARKET REALITY (If we simply used the input price) ---
    let marketScenario: ScenarioResult | undefined;
    if (competitorPrice > 0) {
      marketScenario = calculateScenario(competitorPrice, totalProductionCost, effectiveVariableFee, totalFixedFees);
    }

    // --- SCENARIO 3: COMPETITOR STRATEGY PROTECTION (Protect Competitor Profit) ---
    // We want to secure 'competitorBaseProfit' even on this platform with high fees.
    // If competitorBaseProfit is negative (bleeding offline), we default to protecting HPP (0 profit) or keep bleeding?
    // Usually, we want to at least match the implied profit.
    const targetProfitComp = Math.max(0, competitorBaseProfit); // Safe guard: don't protect a loss, aim for BEP minimum
    const numComp = totalProductionCost + targetProfitComp + totalFixedFees;
    const rawCompPrice = denominator > 0 ? numComp / denominator : 0;
    const compProtectionPrice = smartRoundUp(rawCompPrice);
    const compProtectionScenario = calculateScenario(compProtectionPrice, totalProductionCost, effectiveVariableFee, totalFixedFees);

    // Breakdown components (Based on Markup Recommended for consistent visual, or switch based on UI)
    // Here we return breakdown for the Markup Scenario as default, UI can recalculate if needed but usually structurally similar ratio
    const breakdownPrice = markupRecommendedPrice;
    const commAmt = breakdownPrice * comm;
    const taxAmt = commAmt * taxRate;
    const promoAmt = breakdownPrice * promo;

    return {
      platform,
      recommended: markupScenario,
      market: marketScenario,
      competitorProtection: compProtectionScenario,
      breakdown: {
        commissionAmount: commAmt,
        fixedFeeAmount: fixedFee,
        withdrawalFeeAmount: withdrawal,
        promoAmount: promoAmt,
        taxOnServiceFee: taxAmt,
        totalProductionCost
      }
    };
  });
};

/**
 * ==========================================
 * FINANCIAL SIMULATIONS (LOAN & PROJECTIONS)
 * ==========================================
 */

export const calculateLoanPayment = (principal: number, annualRatePercent: number, tenureMonths: number): number => {
  const P = principal;
  const r = annualRatePercent / 100 / 12;
  const n = tenureMonths;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

export const calculateFinancialHealth = (
  totalRevenue: number,
  totalExpense: number,
  totalLiabilities: number,
  monthlyFixedCost: number,
  marginPerPortion: number,
  simDailySalesQty: number,
  currentSavings: number
) => {
  const netCashflow = totalRevenue - totalExpense;
  const totalMonthlyBurden = totalLiabilities + monthlyFixedCost;

  const minPortionsPerMonth = marginPerPortion > 0 ? Math.ceil(totalMonthlyBurden / marginPerPortion) : 0;
  const minPortionsPerDay = Math.ceil(minPortionsPerMonth / 30);

  const projectedDailyProfit = (simDailySalesQty * marginPerPortion);
  const projectedMonthlyProfit = projectedDailyProfit * 30;
  const projectedNetFreeCashflow = projectedMonthlyProfit - totalMonthlyBurden;

  const targetBufferMonths = 3;
  const targetBufferAmount = totalMonthlyBurden * targetBufferMonths;
  const gapToBuffer = targetBufferAmount - currentSavings;
  const monthsToReachBuffer = (gapToBuffer > 0 && projectedNetFreeCashflow > 0)
    ? (gapToBuffer / projectedNetFreeCashflow).toFixed(1)
    : '∞';



  // Scoring Logic
  let score = 0;
  const savingsPct = Math.min((currentSavings / targetBufferAmount) * 100, 100);
  if (savingsPct >= 50) score += 30;
  if (savingsPct >= 100) score += 20;
  if (projectedNetFreeCashflow > 0) score += 30;
  if (monthsToReachBuffer !== '∞' && Number(monthsToReachBuffer) < 6) score += 20;

  let label: 'Healthy' | 'Warning' | 'Danger' = 'Danger';
  if (score >= 80) label = 'Healthy';
  else if (score >= 50) label = 'Warning';

  return {
    netCashflow,
    totalMonthlyBurden,
    minPortionsPerDay,
    projectedMonthlyProfit,
    projectedNetFreeCashflow,
    targetBufferAmount,
    monthsToReachBuffer,
    savingsPercentage: savingsPct,
    score,
    label
  };
};