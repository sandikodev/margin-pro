/**
 * Pricing Constants
 * Centralized pricing configuration for the application
 */

export const PRICING_TIERS = {
    STARTER: {
        id: 'starter',
        label: 'Starter',
        price: 0,
        priceFormatted: 'Rp 0',
        period: 'selamanya',
        description: 'Gratis untuk memulai',
    },
    PRO_MONTHLY: {
        id: 'pro_monthly',
        label: 'Pro',
        price: 150000,
        priceFormatted: 'Rp 150k',
        period: '/bulan',
        description: 'Untuk bisnis yang berkembang',
    },
    PRO_LIFETIME: {
        id: 'pro_lifetime',
        label: 'Lifetime',
        price: 2500000,
        priceFormatted: 'Rp 2.5jt',
        period: 'sekali bayar',
        description: 'Akses selamanya',
    },
} as const;

export const PRICING_OPTIONS = [
    PRICING_TIERS.STARTER,
    PRICING_TIERS.PRO_MONTHLY,
    PRICING_TIERS.PRO_LIFETIME,
] as const;

// Credit packages for top-up
export const CREDIT_PACKAGES = {
    SMALL: { credits: 100, price: 50000 },
    MEDIUM: { credits: 250, price: 100000 },
    LARGE: { credits: 600, price: 200000 },
} as const;

// Demo values for demo-tour
export const DEMO_VALUES = {
    SAMPLE_COST: 12500,
    SAMPLE_SELLING_PRICE: 25000,
    PLATFORM_COMMISSION: 6000,
    TARGET_PROFIT: 6000,
} as const;

export type PricingTierId = keyof typeof PRICING_TIERS;
export type PricingTier = typeof PRICING_TIERS[PricingTierId];
