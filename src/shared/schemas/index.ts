
import { z } from "zod";

// --- Business Profile Schema ---

export const businessSchema = z.object({
    id: z.string().optional(), // Server generated on insert, but explicit on update
    name: z.string().min(3, "Nama bisnis minimal 3 karakter"),
    type: z.enum(['fnb_offline', 'fnb_online', 'retail', 'services', 'manufacturing', 'fashion', 'digital']),
    description: z.string().optional(),

    // Contact
    ownerName: z.string().optional(),
    email: z.string().email("Format email salah").optional().or(z.literal('')),
    phone: z.string().optional(),

    // Links
    gmapsLink: z.string().url("Link Google Maps tidak valid").optional().or(z.literal('')),
    linkGofood: z.string().url("Link GoFood tidak valid").optional().or(z.literal('')),
    linkGrab: z.string().url("Link GrabFood tidak valid").optional().or(z.literal('')),
    linkShopee: z.string().url("Link ShopeeFood tidak valid").optional().or(z.literal('')),

    // Financials
    initialCapital: z.coerce.number().min(0),
    currentAssetValue: z.coerce.number().default(0),
    cashOnHand: z.coerce.number().default(0),

    // Meta
    address: z.string().optional(),
    establishedDate: z.coerce.number().default(() => Date.now()),

    themeColor: z.string().optional(),
    avatarUrl: z.string().optional(),

    // Finance Settings (stored in data JSON)
    monthlyFixedCost: z.coerce.number().optional(),
    currentSavings: z.coerce.number().optional().default(0)
});

export type BusinessSchema = z.infer<typeof businessSchema>;

// --- Project Schema (Base) ---

export const costItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    amount: z.coerce.number(),
    allocation: z.enum(['unit', 'bulk']).optional(),
    bulkUnit: z.enum(['units', 'days']).optional(),
    batchYield: z.coerce.number().optional()
});


// --- Project Schema ---

export const productionConfigSchema = z.object({
    period: z.enum(['daily', 'weekly', 'monthly']),
    daysActive: z.coerce.number().min(1).max(31),
    targetUnits: z.coerce.number().min(1)
});

export const projectSchema = z.object({
    id: z.string().optional(),
    businessId: z.string().optional(),
    name: z.string().min(1, "Nama produk wajib diisi"),
    label: z.string().optional(),
    costs: z.array(costItemSchema),
    productionConfig: productionConfigSchema.optional(),
    pricingStrategy: z.enum(['markup', 'competitor']).optional(),
    competitorPrice: z.coerce.number().optional(),
    targetNet: z.coerce.number(),
    confidence: z.enum(['low', 'medium', 'high']).optional(),
    isFavorite: z.boolean().optional(),
    price: z.coerce.number().optional(), // Calculated or override
    lastModified: z.coerce.number().optional().default(() => Date.now()),
    author: z.string().optional()
});

export type ProjectSchema = z.infer<typeof projectSchema>;

// --- Finance Schemas ---

export const liabilitySchema = z.object({
    id: z.string().optional(),
    businessId: z.string().optional(),
    name: z.string().min(1, "Nama kewajiban wajib diisi"),
    amount: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
    dueDate: z.coerce.number(), // Timestamp
    totalTenure: z.coerce.number().optional(),
    remainingTenure: z.coerce.number().optional(),
    isPaidThisMonth: z.boolean().default(false)
});

export type LiabilitySchema = z.infer<typeof liabilitySchema>;

export const cashflowSchema = z.object({
    id: z.string().optional(),
    businessId: z.string().optional(),
    date: z.coerce.number(),
    revenue: z.coerce.number().default(0),
    expense: z.coerce.number().default(0),
    category: z.enum(['SALES', 'COGS', 'OPEX', 'ASSET', 'OTHER']).optional(),
    note: z.string().optional()
});

export type CashflowSchema = z.infer<typeof cashflowSchema>;

export const financeSettingsSchema = z.object({
    monthlyFixedCost: z.coerce.number().default(0),
    currentSavings: z.coerce.number().default(0)
});

export type FinanceSettingsSchema = z.infer<typeof financeSettingsSchema>;
