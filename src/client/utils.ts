import { Platform, Project, PlatformOverrides, CalculationResult, CostItem, ProductionConfig, ScenarioResult } from '@shared/types';

/**
 * ==========================================
 * OPERATIONAL CALCULATIONS (HPP & BURN RATE)
 * ==========================================
 */

/**
 * Menghitung biaya efektif per porsi untuk satu item biaya.
 * Menangani logika Unit, Bulk (Porsi), dan Bulk (Hari).
 */
export const calculateEffectiveCost = (cost: CostItem, prodConfig?: ProductionConfig): number => {
  if (cost.allocation === 'bulk' && cost.batchYield && cost.batchYield > 0) {
    if (cost.bulkUnit === 'days' && prodConfig) {
      // Logic: Cost / (YieldHari * (TargetPorsi / HariKerja))
      const avgPortionPerDay = prodConfig.daysActive > 0 ? prodConfig.targetUnits / prodConfig.daysActive : 1;
      const totalPortionYield = cost.batchYield * avgPortionPerDay;
      return totalPortionYield > 0 ? cost.amount / totalPortionYield : 0;
    } else {
      // Standard Bulk (Yield in Portions)
      return cost.amount / cost.batchYield;
    }
  }
  // Unit Cost
  return cost.amount;
};

/**
 * Menghitung Total HPP (Harga Pokok Penjualan) per porsi untuk satu project.
 */
export const calculateTotalHPP = (costs: CostItem[], prodConfig?: ProductionConfig): number => {
  return costs.reduce((acc, cost) => acc + calculateEffectiveCost(cost, prodConfig), 0);
};

/**
 * Menghitung Burn Rate (Kecepatan uang keluar) untuk operasional.
 * Berguna untuk estimasi belanja mingguan/bulanan.
 */
export const calculateOperationalBurnRate = (bulkCosts: CostItem[], prodConfig: ProductionConfig) => {
  const totalPurchase = bulkCosts.reduce((acc, c) => acc + c.amount, 0);

  const dailyBurnRate = bulkCosts.reduce((acc, c) => {
    // Jika unit days: cost / yield (hari)
    if (c.bulkUnit === 'days' && c.batchYield) {
      return acc + (c.amount / c.batchYield);
    }
    // Jika unit portions: (cost / yield) * dailyPortions
    if (c.bulkUnit !== 'days' && c.batchYield) {
      const dailyPortions = prodConfig.period === 'weekly'
        ? (prodConfig.targetUnits / prodConfig.daysActive)
        : prodConfig.targetUnits; // Asumsi daily period target = daily
      return acc + ((c.amount / c.batchYield) * dailyPortions);
    }
    return acc;
  }, 0);

  const cycleBurnRate = dailyBurnRate * (prodConfig.period === 'weekly' ? prodConfig.daysActive : 7);

  return { totalPurchase, dailyBurnRate, cycleBurnRate };
};

/**
 * ==========================================
 * PRICING STRATEGY ENGINE
 * ==========================================
 */

export const smartRoundUp = (amount: number): number => {
  if (amount <= 0) return 0;
  if (amount < 1000) return Math.ceil(amount / 100) * 100;
  if (amount < 50000) return Math.ceil(amount / 500) * 500;
  return Math.ceil(amount / 1000) * 1000;
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
  taxRate: number
): CalculationResult[] => {
  if (!activeProject) return [];

  const totalProductionCost = calculateTotalHPP(activeProject.costs, activeProject.productionConfig);
  // Base Profit Target (Profit Dasar yang ingin diamankan)
  const targetBaseProfit = activeProject.targetNet || 0;

  return Object.values(Platform).map(platform => {
    const pOverride = overrides[platform];
    const comm = pOverride.commission / 100;
    const fixedFee = pOverride.fixedFee;
    const withdrawal = pOverride.withdrawal;
    const promo = promoPercent / 100;

    // Total variable deduction % (Commission + Tax on Comm + Promo Subsidy)
    const effectiveVariableFee = comm + (comm * taxRate) + promo;
    const totalFixedFees = fixedFee + withdrawal;

    // --- SCENARIO 1: RECOMMENDED (PROTECTION MODE) ---
    // Formula: Price = (HPP + TargetProfit + FixedFees) / (1 - VariableFee%)
    // Ini menghitung harga jual agar TargetProfit tetap utuh.
    const numerator = totalProductionCost + targetBaseProfit + totalFixedFees;
    const denominator = 1 - effectiveVariableFee;

    const rawRecommendedPrice = denominator > 0 ? numerator / denominator : 0;
    const recommendedPrice = smartRoundUp(rawRecommendedPrice);

    const recommendedScenario = calculateScenario(recommendedPrice, totalProductionCost, effectiveVariableFee, totalFixedFees);

    // --- SCENARIO 2: MARKET / COMPETITOR ---
    // Jika user memasukkan harga kompetitor, hitung profit real-nya.
    let marketScenario: ScenarioResult | undefined;
    if (activeProject.competitorPrice && activeProject.competitorPrice > 0) {
      marketScenario = calculateScenario(activeProject.competitorPrice, totalProductionCost, effectiveVariableFee, totalFixedFees);
    }

    // Breakdown Components
    const commAmt = recommendedPrice * comm;
    const taxAmt = commAmt * taxRate;
    const promoAmt = recommendedPrice * promo;

    return {
      platform,
      recommended: recommendedScenario,
      market: marketScenario,
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
  const r = annualRatePercent / 100 / 12; // Bunga per bulan
  const n = tenureMonths;

  if (r === 0) return P / n;

  // Rumus Anuitas: P * (r * (1+r)^n) / ((1+r)^n - 1)
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

  // 1. BEP (Titik Impas)
  const minPortionsPerMonth = marginPerPortion > 0 ? Math.ceil(totalMonthlyBurden / marginPerPortion) : 0;
  const minPortionsPerDay = Math.ceil(minPortionsPerMonth / 30);

  // 2. Proyeksi Laba
  const projectedDailyProfit = (simDailySalesQty * marginPerPortion);
  const projectedMonthlyProfit = projectedDailyProfit * 30;
  const projectedNetFreeCashflow = projectedMonthlyProfit - totalMonthlyBurden;

  // 3. Buffer (Dana Darurat)
  const targetBufferMonths = 3;
  const targetBufferAmount = totalMonthlyBurden * targetBufferMonths;
  const gapToBuffer = targetBufferAmount - currentSavings;
  const monthsToReachBuffer = (gapToBuffer > 0 && projectedNetFreeCashflow > 0)
    ? (gapToBuffer / projectedNetFreeCashflow).toFixed(1)
    : '∞';

  return {
    netCashflow,
    totalMonthlyBurden,
    minPortionsPerDay,
    projectedMonthlyProfit,
    projectedNetFreeCashflow,
    targetBufferAmount,
    monthsToReachBuffer,
    savingsPercentage: Math.min((currentSavings / targetBufferAmount) * 100, 100)
  };
};