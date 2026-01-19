import { BusinessProfile, Project, CashflowRecord, Liability } from '@shared/types';
import { FINANCIAL_DEFAULTS, EXTERNAL_LINKS } from '@shared/constants';

export const DEMO_USER_CREDENTIALS = {
  email: 'demo@margins.pro',
  password: 'demo123'
};

export const DEMO_BUSINESS: BusinessProfile = {
  id: 'b_demo_123',
  name: "Rasa Nusantara Express",
  type: 'fnb_offline',
  address: "Jl. Merdeka No. 45, Jakarta Selatan",
  phone: "081234567890",
  category: "fnb",
  gmapsLink: EXTERNAL_LINKS.GMAPS_PLACEHOLDER,
  initialCapital: FINANCIAL_DEFAULTS.INITIAL_CAPITAL,
  cashOnHand: 8500000,
  currentAssetValue: 12000000,
  avatarUrl: EXTERNAL_LINKS.UNSPLASH_RESTAURANT, // Restaurant Mock Image
  establishedDate: Date.now() - 1000 * 60 * 60 * 24 * 365
};

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'p-ricebowl',
    businessId: 'demo-biz-001',
    name: 'Rice Bowl Blackpepper',
    label: 'Best Seller',
    confidence: 'high',
    isFavorite: true,
    costs: [
      { id: 'c1', name: 'Beras Premium (Karung 25kg)', amount: 320000, allocation: 'bulk', batchYield: 300, bulkUnit: 'units' },
      { id: 'c2', name: 'Daging Sapi Slice (1kg)', amount: 110000, allocation: 'bulk', batchYield: 20, bulkUnit: 'units' },
      { id: 'c3', name: 'Saus Blackpepper (Jerigen)', amount: 85000, allocation: 'bulk', batchYield: 100, bulkUnit: 'units' },
      { id: 'c4', name: 'Paper Bowl + Tutup', amount: 1800, allocation: 'unit' },
      { id: 'c5', name: 'Gas & Listrik (Estimasi)', amount: 500, allocation: 'unit' }
    ],
    productionConfig: { period: 'monthly', daysActive: 26, targetUnits: 1500 },
    pricingStrategy: 'competitor',
    competitorPrice: 28000,
    targetNet: 6000,
    lastModified: Date.now()
  },
  {
    id: 'p-tea',
    businessId: 'demo-biz-001',
    name: 'Es Teh Jumbo Solo',
    label: 'High Margin',
    confidence: 'high',
    isFavorite: true,
    costs: [
      { id: 't1', name: 'Teh Racik (Pack)', amount: 15000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' },
      { id: 't2', name: 'Gula Pasir (1kg)', amount: 16000, allocation: 'bulk', batchYield: 30, bulkUnit: 'units' },
      { id: 't3', name: 'Cup Jumbo 22oz + Lid', amount: 800, allocation: 'unit' },
      { id: 't4', name: 'Es Kristal (Harian)', amount: 10000, allocation: 'bulk', batchYield: 1, bulkUnit: 'days' }
    ],
    productionConfig: { period: 'daily', daysActive: 30, targetUnits: 100 },
    pricingStrategy: 'markup',
    competitorPrice: 5000,
    targetNet: 2000,
    lastModified: Date.now() - 100000
  },
  {
    id: 'p-coffee',
    businessId: 'demo-biz-002',
    name: 'Kopi Susu Gula Aren',
    label: 'Cloud Menu',
    confidence: 'medium',
    isFavorite: false,
    costs: [
      { id: 'k1', name: 'Espresso Beans (1kg)', amount: 180000, allocation: 'bulk', batchYield: 55, bulkUnit: 'units' },
      { id: 'k2', name: 'Susu UHT (1L)', amount: 19000, allocation: 'bulk', batchYield: 5, bulkUnit: 'units' },
      { id: 'k3', name: 'Gula Aren Cair', amount: 1500, allocation: 'unit' },
      { id: 'k4', name: 'Cup & Straw', amount: 1200, allocation: 'unit' }
    ],
    productionConfig: { period: 'daily', daysActive: 30, targetUnits: 50 },
    pricingStrategy: 'competitor',
    competitorPrice: 18000,
    targetNet: 5000,
    lastModified: Date.now() - 500000
  }
];

export const DEMO_CASHFLOW: CashflowRecord[] = [
  { id: 'cf-1', date: Date.now(), revenue: 1500000, expense: 0, category: 'SALES', note: 'Omset Harian GoFood' },
  { id: 'cf-2', date: Date.now(), revenue: 850000, expense: 0, category: 'SALES', note: 'Omset Harian Offline' },
  { id: 'cf-3', date: Date.now(), revenue: 0, expense: 450000, category: 'COGS', note: 'Belanja Pasar (Sayur & Daging)' },
  { id: 'cf-4', date: Date.now() - 86400000, revenue: 2100000, expense: 0, category: 'SALES', note: 'Omset Kemarin' },
  { id: 'cf-5', date: Date.now() - 86400000, revenue: 0, expense: 150000, category: 'OPEX', note: 'Beli Pulsa Listrik Token' },
  { id: 'cf-6', date: Date.now() - 172800000, revenue: 1800000, expense: 0, category: 'SALES', note: 'Omset Lusa' },
];

export const DEMO_LIABILITIES: Liability[] = [
  { id: 'l-1', name: 'Cicilan Kulkas Showcase', amount: 450000, dueDate: 25, isPaidThisMonth: false, totalTenure: 12, remainingTenure: 5 },
  { id: 'l-2', name: 'Pinjaman Modal KUR', amount: 1200000, dueDate: 10, isPaidThisMonth: true, totalTenure: 24, remainingTenure: 18 }
];