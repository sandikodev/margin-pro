import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// --- Users ---
export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(), // Hashed
    name: text("name"),
    role: text("role").default("user"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
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
        costs: any[]; // cost items
        productionConfig?: any;
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
