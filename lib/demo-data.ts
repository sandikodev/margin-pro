import { BusinessProfile, Project, CashflowRecord, Liability } from '../types';

export const DEMO_USER_CREDENTIALS = {
  email: 'demo@margins.pro',
  password: 'demo123'
};

export const DEMO_BUSINESS: BusinessProfile[] = [
  {
    id: 'demo-biz-001',
    name: 'Fiera Food Mangiran',
    type: 'fnb_offline',
    ownerName: 'Demo User',
    email: 'demo@margins.pro',
    phone: '081234567890',
    address: 'Jl. Raya Mangiran No. 45, Bantul, Yogyakarta',
    gmapsLink: 'https://maps.app.goo.gl/example',
    initialCapital: 25000000,
    currentAssetValue: 18500000,
    cashOnHand: 8500000,
    themeColor: 'indigo',
    establishedDate: Date.now() - 1000 * 60 * 60 * 24 * 365, // 1 year ago
    avatarUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=200&q=80' // Mock Image
  },
  {
    id: 'demo-biz-002',
    name: 'Fiera Coffee Express',
    type: 'fnb_online',
    ownerName: 'Demo User',
    email: 'demo@margins.pro',
    phone: '081234567890',
    address: 'Cloud Kitchen Seturan, Slot B-12',
    initialCapital: 10000000,
    currentAssetValue: 8000000,
    cashOnHand: 3200000,
    themeColor: 'orange',
    establishedDate: Date.now() - 1000 * 60 * 60 * 24 * 90 // 3 months ago
  }
];

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