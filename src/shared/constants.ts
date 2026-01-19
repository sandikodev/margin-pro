
import { Platform, PlatformConfig, MarketplaceItem } from './types';

export const PLATFORM_DATA: Record<Platform, PlatformConfig> = {
  // --- FOOD DELIVERY ---
  [Platform.SHOPEE_FOOD]: {
    defaultCommission: 0.20,
    defaultFixedFee: 0,
    withdrawalFee: 3000,
    color: '#ee4d2d',
    officialTermsUrl: "https://www.shopeefood.co.id/merchants/terms",
    category: 'food'
  },
  [Platform.GO_FOOD]: {
    defaultCommission: 0.20,
    defaultFixedFee: 1000,
    withdrawalFee: 0,
    color: '#00aa13',
    officialTermsUrl: "https://app.gobiz.com/files/terms-and-condition/gofood-merchant-v04.2025",
    category: 'food'
  },
  [Platform.GRAB_FOOD]: {
    defaultCommission: 0.30,
    defaultFixedFee: 0,
    withdrawalFee: 0,
    color: '#00b14f',
    officialTermsUrl: "https://www.grab.com/id/merchant/food/merchant-terms/",
    category: 'food'
  },

  // --- LOCAL MARKETPLACE ---
  [Platform.TOKOPEDIA]: {
    defaultCommission: 0.045,
    defaultFixedFee: 0,
    withdrawalFee: 0,
    color: '#42b549',
    officialTermsUrl: "https://seller.tokopedia.com/edu/biaya-layanan-tokopedia/",
    category: 'marketplace'
  },
  [Platform.SHOPEE_MP]: {
    defaultCommission: 0.06,
    defaultFixedFee: 0,
    withdrawalFee: 0,
    color: '#ff5722',
    officialTermsUrl: "https://seller.shopee.co.id/edu/article/13739",
    category: 'marketplace'
  },

  // --- GLOBAL EXPORT ---
  [Platform.ETSY]: {
    defaultCommission: 0.15,
    defaultFixedFee: 3000,
    withdrawalFee: 0,
    color: '#f1641e',
    officialTermsUrl: "https://www.etsy.com/legal/fees/",
    category: 'export'
  },
  [Platform.AMAZON]: {
    defaultCommission: 0.15,
    defaultFixedFee: 0,
    withdrawalFee: 0,
    color: '#232f3e',
    officialTermsUrl: "https://sell.amazon.com/pricing",
    category: 'export'
  },

  // --- OFFLINE / POS ---
  [Platform.OFFLINE]: {
    defaultCommission: 0.007,
    defaultFixedFee: 0,
    withdrawalFee: 0,
    color: '#64748b',
    officialTermsUrl: "#",
    category: 'offline'
  }
};

export const CURRENCIES = [
  { code: 'IDR', symbol: 'Rp', locale: 'id-ID' },
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' }
];

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'm1',
    name: 'Steak Ayam Krispi Viral',
    label: 'F&B Example',
    costs: [{ id: '1', name: 'Fillet Dada', amount: 15000 }, { id: '2', name: 'Tepung & Bumbu', amount: 3000 }],
    targetNet: 12000,
    lastModified: Date.now(),
    author: 'Chef_Budi',
    price: 50,
    downloads: 1240,
    rating: 4.8
  },
  {
    id: 'm2',
    name: 'T-Shirt Cotton Combed 30s',
    label: 'Retail Example',
    costs: [{ id: '1', name: 'Kain (Yard)', amount: 25000 }, { id: '2', name: 'Sablon Plastisol', amount: 15000 }],
    targetNet: 35000,
    lastModified: Date.now(),
    author: 'Distro_Master',
    price: 40,
    downloads: 350,
    rating: 4.9
  },
  {
    id: 'm3',
    name: 'Jasa Desain Logo',
    label: 'Service Example',
    costs: [{ id: '1', name: 'Software Subs (Hourly)', amount: 5000 }, { id: '2', name: 'Listrik & Internet', amount: 3000 }],
    targetNet: 492000,
    lastModified: Date.now(),
    author: 'Studio_One',
    price: 100,
    downloads: 450,
    rating: 5.0
  }
];

// --- TERMINOLOGY DICTIONARY ---
export const TERMINOLOGY = {
  // General Financials
  netProfit: { umkm: 'Cuan Bersih', pro: 'Laba Bersih (Net Profit)' },
  profitTarget: { umkm: 'Target Cuan per Unit', pro: 'Target Margin Profit' },
  loss: { umkm: 'Rugi / Boncos', pro: 'Defisit Keuangan' },
  revenue: { umkm: 'Total Omset', pro: 'Pendapatan Kotor' },

  // Costs & Pricing
  hppUnit: { umkm: 'Modal Dasar per Unit', pro: 'HPP / COGS Unit' },
  hppTotal: { umkm: 'Total Biaya Produksi', pro: 'Total Cost of Sales' },
  sellingPrice: { umkm: 'Harga Jual ke Pembeli', pro: 'Harga Jual (Selling Price)' },
  marketPrice: { umkm: 'Harga Pasaran', pro: 'Market Benchmark' },

  // Strategy
  strategyMarkup: { umkm: 'Hitung Cuan Manual', pro: 'Strategi Markup' },
  strategyCompetitor: { umkm: 'Ikut Harga Pasar', pro: 'Market-Based Pricing' },
  strategyProtection: { umkm: 'Profit Aman', pro: 'Margin Protection' },

  // Fees & Deductions
  totalDeductions: { umkm: 'Total Potongan', pro: 'Total Service Fees' },
  appCommission: { umkm: 'Komisi Platform', pro: 'Platform Commission' },
  serviceFee: { umkm: 'Biaya Admin', pro: 'Transaction Fee' },
  promoSubsidy: { umkm: 'Diskon Penjual', pro: 'Promo Subsidy' },

  // Actions
  simulate: { umkm: 'Cek Simulasi', pro: 'Simulation' },
  recommendation: { umkm: 'Saran Harga', pro: 'Recommended Price' },

  // Descriptions
  desc_bleeding: {
    umkm: 'Hati-hati! Harga ini berisiko rugi.',
    pro: 'Warning: Negative margin detected.'
  },
  desc_safe: {
    umkm: 'Aman! Modal tertutup & profit terjaga.',
    pro: 'Optimal: Target margin secured.'
  }
};

// --- STORAGE KEYS ---
export const STORAGE_KEYS = {
  PROJECTS: 'margin_pro_v12_final',
  BUSINESSES: 'margin_pro_businesses_v3',
  ACTIVE_BUSINESS_ID: 'margin_pro_active_business_id_v3',
  ONBOARDED: 'margin_pro_onboarded',
  SETTINGS: 'margin_pro_settings',
  LIABILITIES: 'margin_pro_liabilities',
  CASHFLOW: 'margin_pro_cashflow',
  FINANCE_SETTINGS: 'margin_pro_finance_settings_v3'
};

// --- FINANCIAL DEFAULTS ---
export const FINANCIAL_DEFAULTS = {
  MONTHLY_FIXED_COST: 3_500_000,
  CURRENT_SAVINGS: 2_500_000,
  INITIAL_CAPITAL: 25_000_000,
};

// --- SUBSCRIPTION PRICING ---
export const SUBSCRIPTION_PRICING = {
  PRO_MONTHLY: 150_000,
  PRO_LIFETIME: 2_500_000,
};

// --- EXTERNAL LINKS ---
export const EXTERNAL_LINKS = {
  GMAPS_PLACEHOLDER: 'https://maps.app.goo.gl/example',
  UNSPLASH_RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
  BACKGROUND_PATTERN: 'https://www.transparenttextures.com/patterns/cubes.png'
};