
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
    label: 'Premium',
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
    name: 'Es Kopi Susu Gula Aren',
    label: 'Best Seller',
    costs: [{ id: '1', name: 'Espresso', amount: 4000 }, { id: '2', name: 'Susu Fresh', amount: 5000 }],
    targetNet: 8000,
    lastModified: Date.now(),
    author: 'Barista_Indo',
    price: 25,
    downloads: 3500,
    rating: 4.9
  },
  {
    id: 'm3',
    name: 'Nasi Kebuli Kambing',
    label: 'Exclusive',
    costs: [{ id: '1', name: 'Beras Basmati', amount: 8000 }, { id: '2', name: 'Daging Kambing', amount: 20000 }],
    targetNet: 25000,
    lastModified: Date.now(),
    author: 'Sultan_Kuliner',
    price: 150,
    downloads: 450,
    rating: 5.0
  }
];
