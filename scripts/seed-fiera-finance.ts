
import { db } from "../src/server/db";
import { users, businesses, liabilities } from "../src/server/db/schema";
import { eq, and } from "drizzle-orm";

// Data from useFinance.ts
const LIABILITIES_DATA = [
    { id: 'l1', name: 'Pinjaman KrediFazz', amount: 591030, dueDateDay: 8, isPaidThisMonth: false },
    { id: 'l2', name: 'Belanja Packaging', amount: 1500000, dueDateDay: 25, isPaidThisMonth: false }
];

const FINANCE_DATA = {
    monthlyFixedCost: 3500000,
    currentSavings: 2500000
};

async function seedFieraFinance() {
    console.log("🌱 Seeding Fiera Food Mangiran Finance Data...");

    const TARGET_EMAIL = "androxoss@hotmail.com";
    const BUSINESS_NAME = "Fiera Food Mangiran";

    // 1. Get User
    const user = await db.query.users.findFirst({
        where: eq(users.email, TARGET_EMAIL)
    });

    if (!user) {
        console.error("❌ User not found! Please run the main seed script first.");
        process.exit(1);
    }

    // 2. Get Business
    const business = await db.query.businesses.findFirst({
        where: and(
            eq(businesses.userId, user.id),
            eq(businesses.name, BUSINESS_NAME)
        )
    });

    if (!business) {
        console.error("❌ Business not found! Please run the main seed script first.");
        process.exit(1);
    }

    // 3. Update Business Finance Stats (Fixed Cost & Savings)
    // We'll store monthlyFixedCost in 'data' field since it's not a core column, 
    // and currentSavings in 'cashOnHand'
    console.log(`Updating Business Finance Stats...`);

    // Existing data check to preserve other fields
    const currentData = business.data || {};

    await db.update(businesses).set({
        cashOnHand: FINANCE_DATA.currentSavings,
        data: {
            ...currentData,
            monthlyFixedCost: FINANCE_DATA.monthlyFixedCost // Storing as extended data
        } as any
    }).where(eq(businesses.id, business.id));


    // 4. Seed Liabilities
    console.log(`Seeding Liabilities...`);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    for (const l of LIABILITIES_DATA) {
        // Calculate appropriate due date for this month
        const dueDate = new Date(currentYear, currentMonth, l.dueDateDay);

        // If due date has passed for this month, maybe set it for next month? 
        // For accurate simulation based on "isPaidThisMonth: false", we keep it in this month to show as pending/overdue.

        const existingLiability = await db.query.liabilities.findFirst({
            where: eq(liabilities.id, l.id)
        });

        if (existingLiability) {
            await db.update(liabilities).set({
                businessId: business.id,
                name: l.name,
                amount: l.amount,
                dueDate: dueDate,
                isPaidThisMonth: l.isPaidThisMonth
            }).where(eq(liabilities.id, l.id));
            console.log(`Updated liability: ${l.name}`);
        } else {
            await db.insert(liabilities).values({
                id: l.id,
                businessId: business.id,
                name: l.name,
                amount: l.amount,
                dueDate: dueDate,
                isPaidThisMonth: l.isPaidThisMonth,
                totalTenure: 1, // Default assumption
                remainingTenure: 1
            });
            console.log(`Created liability: ${l.name}`);
        }
    }

    console.log("✅ Fiera Food Finance Data Seeding Complete.");
}

seedFieraFinance().catch(console.error);
