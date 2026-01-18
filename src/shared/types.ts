
export enum Platform {
  // Food Delivery (Specific Channels)
  SHOPEE_FOOD = 'ShopeeFood',
  GO_FOOD = 'GoFood',
  GRAB_FOOD = 'GrabFood',

  // Local Marketplace (General Commerce)
  TOKOPEDIA = 'Tokopedia',
  SHOPEE_MP = 'Shopee Mrkt',

  // Global / Export
  ETSY = 'Etsy Global',
  AMAZON = 'Amazon US',

  // Real / Offline
  OFFLINE = 'Direct Selling'
}

export type PlatformCategory = 'food' | 'marketplace' | 'export' | 'offline';

export interface PlatformConfig {
  defaultCommission: number;
  defaultFixedFee: number;
  withdrawalFee: number;
  color: string;
  officialTermsUrl: string;
  category: PlatformCategory;
}

export interface PlatformOverrides {
  commission: number;
  fixedFee: number;
  withdrawal: number;
}

export type CostAllocation = 'unit' | 'bulk'; // 'unit' = per pcs/item, 'bulk' = per batch/stok
export type BulkUnit = 'units' | 'days'; // REFACTORED: 'portions' -> 'units'

export interface CostItem {
  id: string;
  name: string; // Nama Komponen Biaya (Bahan/Tenaga/Sewa)
  amount: number;
  minAmount?: number;
  maxAmount?: number;
  isRange?: boolean;
  allocation?: CostAllocation;
  batchYield?: number; // Kapasitas Output
  bulkUnit?: BulkUnit;

  // Detail Takaran (Universal Measurement)
  detailTotalQty?: number;
  detailPerPortion?: number; // Bisa dibaca "Per Unit Usage"
  detailUnit?: string; // e.g., 'gr', 'cm', 'hours', 'license'
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export interface ProductionConfig {
  period: PeriodType;
  daysActive: number;
  targetUnits: number; // REFACTORED: 'targetPortions' -> 'targetUnits'
}

export type PricingStrategy = 'markup' | 'competitor';

export interface Project {
  id: string;
  businessId?: string;
  name: string; // Nama Produk / Layanan
  label: string;
  costs: CostItem[];
  productionConfig?: ProductionConfig;
  pricingStrategy?: PricingStrategy;
  competitorPrice?: number;
  targetNet: number;
  confidence?: 'low' | 'medium' | 'high';
  lastModified: number;
  author?: string;
  price?: number;
  isFavorite?: boolean;
}

export interface MarketplaceItem extends Project {
  downloads: number;
  rating: number;
}

export interface Liability {
  id: string;
  businessId?: string;
  name: string;
  amount: number;
  dueDate: number;
  totalTenure?: number;
  remainingTenure?: number;
  isPaidThisMonth: boolean;
}

export type TransactionCategory = 'SALES' | 'COGS' | 'OPEX' | 'ASSET' | 'OTHER';

export interface CashflowRecord {
  id: string;
  businessId?: string;
  date: number;
  revenue: number;
  expense: number;
  category?: TransactionCategory; // New Field
  note: string;
}

export interface ScenarioResult {
  price: number;
  netProfit: number;
  totalDeductions: number;
  roi: number;
  marginPercent: number;
  isBleeding: boolean;
}

export interface CalculationResult {
  platform: Platform;
  recommended: ScenarioResult;
  market?: ScenarioResult;
  competitorProtection?: ScenarioResult;
  breakdown: {
    commissionAmount: number;
    fixedFeeAmount: number;
    withdrawalFeeAmount: number;
    promoAmount: number;
    taxOnServiceFee: number;
    totalProductionCost: number;
  };
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  locale: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  createdAt?: number;
}

export interface Business extends BusinessProfile {
  userId: string;
  updatedAt?: number;
}

// --- INVOICING ---
export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  snapToken?: string;
  createdAt?: number;
  items?: any[];
}


export interface SharedProps {
  user: User | null;
  business?: Business | BusinessProfile;
  projects: Project[];
  selectedCurrency: Currency;
}

export type LanguageMode = 'umkm' | 'pro';

export interface AppSettings {
  languageMode: LanguageMode;
}

// --- UNIVERSAL BUSINESS PROFILING ---

export type BusinessType = 'fnb_offline' | 'fnb_online' | 'retail' | 'services' | 'manufacturing' | 'fashion' | 'digital';

export interface BusinessProfile {
  id: string;
  name: string;
  type: BusinessType;
  description?: string;

  ownerName?: string;
  email?: string;
  phone?: string;
  category?: string;
  gmapsLink?: string;
  linkGofood?: string;
  linkGrab?: string;
  linkShopee?: string;

  initialCapital: number;
  currentAssetValue: number;
  cashOnHand: number;

  address?: string;
  establishedDate: number;

  themeColor?: string;
  avatarUrl?: string; // New Field for Photo Upload
}