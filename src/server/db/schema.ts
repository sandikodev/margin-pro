import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { CostItem, ProductionConfig } from "../../shared/types";

// --- Users ---
export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(), // Hashed
    name: text("name"),
    role: text("role").default("user"), // user, super_admin, affiliate
    referralCode: text("referral_code").unique(), // Unique code for this user
    referredBy: text("referred_by"), // Code of the referrer
    affiliateEarnings: integer("affiliate_earnings").default(0),
    permissions: text("permissions", { mode: "json" }).$type<string[]>().default(sql`'[]'`), // ['can_manage_users', 'can_view_revenue']
    credits: integer("credits").default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const creditTransactions = sqliteTable("credit_transactions", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    amount: integer("amount").notNull(), // Negative for spend, positive for topup
    description: text("description").notNull(), // e.g. "Purchased Feature X"
    date: integer("date", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// --- Businesses ---
export const businesses = sqliteTable("businesses", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'fnb_offline', etc.
    initialCapital: real("initial_capital").default(0),
    currentAssetValue: real("current_asset_value").default(0),
    cashOnHand: real("cash_on_hand").default(0),
    themeColor: text("theme_color"),
    avatarUrl: text("avatar_url"),

    // Extended Profile Data (Address, Contacts, Links) stored as JSON
    data: text("data", { mode: "json" }).$type<{
        address?: string;
        description?: string;
        phone?: string;
        gmapsLink?: string;
        linkGofood?: string;
        linkGrab?: string;
        linkShopee?: string;
        establishedDate?: number;
    }>(),

    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// --- Projects (Calculator Data) ---
export const projects = sqliteTable("projects", {
    id: text("id").primaryKey(),
    businessId: text("business_id").references(() => businesses.id).notNull(),
    name: text("name").notNull(),
    label: text("label"),

    // Complex Data (Costs, ProductionConfig, PricingStrategy) stored as JSON
    // We use the existing interfaces from types.ts conceptually
    data: text("data", { mode: "json" }).$type<{
        costs: CostItem[];
        productionConfig: ProductionConfig;
        pricingStrategy?: string;
        competitorPrice?: number;
        targetNet: number;
        price?: number;
        confidence?: string;
    }>().notNull(),

    isFavorite: integer("is_favorite", { mode: "boolean" }).default(false),
    lastModified: integer("last_modified", { mode: "timestamp" }).notNull(),
});

// --- Finance (Cashflow) ---
export const cashflow = sqliteTable("cashflow", {
    id: text("id").primaryKey(),
    businessId: text("business_id").references(() => businesses.id).notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    revenue: real("revenue").default(0),
    expense: real("expense").default(0),
    category: text("category").default("OTHER"), // SALES, COGS, OPEX...
    note: text("note"),
});

// --- Liabilities ---
export const liabilities = sqliteTable("liabilities", {
    id: text("id").primaryKey(),
    businessId: text("business_id").references(() => businesses.id).notNull(),
    name: text("name").notNull(),
    amount: real("amount").notNull(),
    dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
    totalTenure: integer("total_tenure"),
    remainingTenure: integer("remaining_tenure"),
    isPaidThisMonth: integer("is_paid_this_month", { mode: "boolean" }).default(false),
});

// --- System Configuration (Global Settings) ---
export const systemSettings = sqliteTable("system_settings", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    description: text("description"),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// --- Platforms (Dynamic Platform Data) ---
export const platforms = sqliteTable("platforms", {
    id: text("id").primaryKey(), // SHOPEE_FOOD, etc.
    name: text("name").notNull(),
    defaultCommission: real("default_commission").notNull(),
    defaultFixedFee: integer("default_fixed_fee").default(0),
    withdrawalFee: integer("withdrawal_fee").default(0),
    color: text("color"),
    officialTermsUrl: text("official_terms_url"),
    category: text("category").notNull(), // food, marketplace, export, offline
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// --- Translations (UMKM vs PRO Lexicon) ---
export const translations = sqliteTable("translations", {
    key: text("key").primaryKey(),
    umkmLabel: text("umkm_label").notNull(),
    proLabel: text("pro_label").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// --- Payments & Invoicing ---
export const invoices = sqliteTable("invoices", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    amount: integer("amount").notNull(), // Amount in IDR
    status: text("status", { enum: ["PENDING", "PAID", "EXPIRED", "FAILED"] }).default("PENDING"),
    snapToken: text("snap_token"),
    items: text("items", { mode: "json" }).$type<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[]>(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const transactions = sqliteTable("transactions", {
    orderId: text("order_id").primaryKey(), // Matches Midtrans Order ID
    invoiceId: text("invoice_id").references(() => invoices.id).notNull(),
    paymentType: text("payment_type"), // credit_card, bank_transfer, etc.
    transactionStatus: text("transaction_status"), // capture, settlement, pending, etc.
    fraudStatus: text("fraud_status"), // accept, deny
    rawResponse: text("raw_response", { mode: "json" }), // Full Midtrans JSON
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
