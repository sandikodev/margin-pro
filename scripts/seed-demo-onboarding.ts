import { hash } from "bcrypt-ts";
import { db } from "../src/server/db";
import { users, businesses, projects, liabilities, cashflow } from "../src/server/db/schema";
import { eq, and } from "drizzle-orm";

async function seedDemoOnboarding() {
    console.log("🚀 Starting Detailed Onboarding Demo Seeding...");

    const TARGET_EMAIL = "owner@lumina.bistro";
    const USER_ID = "demo-owner-lumina"; // Consistent ID from previous steps

    // 1. Ensure User 
    const user = await db.query.users.findFirst({
        where: eq(users.email, TARGET_EMAIL)
    });

    const passwordHash = await hash("demo_access_2025", 10);

    if (!user) {
        console.log("Creating user...");
        await db.insert(users).values({
            id: USER_ID,
            email: TARGET_EMAIL,
            name: "Lumina Owner",
            password: passwordHash,
            role: "user",
            referralCode: "LUMINA2025",
            permissions: ["demo_mode"]
        });
    } else {
        // Update password if user exists to ensure it's hashed
        await db.update(users).set({ password: passwordHash }).where(eq(users.id, USER_ID));
    }

    const businessScenarios = [
        {
            id: "biz-shopee",
            name: "Lumina Fashion - Shopee Mall",
            type: "marketplace",
            themeColor: "#EE4D2D", // Shopee Orange
            cashOnHand: 15200000,
            monthlyFixedCost: 4500000,
            projects: [
                {
                    id: "project-pajamas",
                    name: "Panda Pajamas (Premium)",
                    label: "Trending",
                    costs: [
                        { id: 'sh1', name: 'Kain Katun Jepang (Roll)', amount: 1500000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' },
                        { id: 'sh2', name: 'Jasa Jahit per Lusin', amount: 360000, allocation: 'bulk', batchYield: 12, bulkUnit: 'units' },
                        { id: 'sh3', name: 'Packaging Box (Bundle 50)', amount: 400000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' },
                        { id: 'sh4', name: 'Label & Tag', amount: 500, allocation: 'unit' }
                    ],
                    productionConfig: { period: 'monthly', daysActive: 30, targetUnits: 200 },
                    pricingStrategy: 'competitor',
                    competitorPrice: 185000,
                    targetNet: 55000,
                    isFavorite: true
                }
            ],
            liabilities: [
                { id: 'lb-sh-1', name: 'Modal Stok Bahan', amount: 5000000, dueDateDay: 15 }
            ]
        },
        {
            id: "biz-gofood",
            name: "Lumina Bistro - GoFood",
            type: "fnb_offline",
            themeColor: "#00AA13", // Gojek Green
            cashOnHand: 8450000,
            monthlyFixedCost: 12000000,
            projects: [
                {
                    id: "project-wagyu",
                    name: "Wagyu Garlic Rice Bowl",
                    label: "Best Experience",
                    costs: [
                        { id: 'gf1', name: 'Daging Wagyu MB5 (1kg)', amount: 450000, allocation: 'bulk', batchYield: 10, bulkUnit: 'units' },
                        { id: 'gf2', name: 'Beras Premium (5kg)', amount: 75000, allocation: 'bulk', batchYield: 35, bulkUnit: 'units' },
                        { id: 'gf3', name: 'Condiments (Garlic/Butter)', amount: 5000, allocation: 'unit' },
                        { id: 'gf4', name: 'Premium Bowl + Cutlery', amount: 3500, allocation: 'unit' },
                        { id: 'gf5', name: 'Gas & Listrik (Proporsional)', amount: 1500, allocation: 'unit' }
                    ],
                    productionConfig: { period: 'daily', daysActive: 26, targetUnits: 30 },
                    pricingStrategy: 'target_net',
                    targetNet: 35000,
                    isFavorite: true
                }
            ],
            liabilities: [
                { id: 'lb-gf-1', name: 'Sewa Ruko (Monthly)', amount: 8000000, dueDateDay: 5 }
            ]
        },
        {
            id: "biz-freelance",
            name: "Lumina Creative Studio",
            type: "other",
            themeColor: "#6366F1", // Indigo
            cashOnHand: 4200000,
            monthlyFixedCost: 1500000,
            projects: [
                {
                    id: "project-uiux",
                    name: "UI/UX Mobile Design Package",
                    label: "Service",
                    costs: [
                        { id: 'fr1', name: 'Figma Pro (Subscription)', amount: 240000, allocation: 'bulk', batchYield: 22, bulkUnit: 'days' },
                        { id: 'fr2', name: 'Adobe CC (Monthly)', amount: 750000, allocation: 'bulk', batchYield: 22, bulkUnit: 'days' },
                        { id: 'fr3', name: 'Electricity & Internet', amount: 50000, allocation: 'bulk', batchYield: 1, bulkUnit: 'days' }
                    ],
                    productionConfig: { period: 'monthly', daysActive: 22, targetUnits: 2 }, // 2 Projects per month
                    pricingStrategy: 'competitor',
                    competitorPrice: 15000000,
                    targetNet: 12000000,
                    isFavorite: true
                }
            ],
            liabilities: [
                { id: 'lb-fr-1', name: 'Cicilan Laptop MacBook', amount: 2150000, dueDateDay: 25 }
            ]
        }
    ];

    const now = new Date();

    for (const scenario of businessScenarios) {
        console.log(`Processing scenario: ${scenario.name}`);

        // 2. Business
        const existingBiz = await db.query.businesses.findFirst({
            where: eq(businesses.id, scenario.id)
        });

        if (existingBiz) {
            await db.update(businesses).set({
                userId: USER_ID,
                name: scenario.name,
                type: scenario.type,
                themeColor: scenario.themeColor,
                cashOnHand: scenario.cashOnHand,
                data: { monthlyFixedCost: scenario.monthlyFixedCost } as any
            }).where(eq(businesses.id, scenario.id));
        } else {
            await db.insert(businesses).values({
                id: scenario.id,
                userId: USER_ID,
                name: scenario.name,
                type: scenario.type,
                themeColor: scenario.themeColor,
                cashOnHand: scenario.cashOnHand,
                data: { monthlyFixedCost: scenario.monthlyFixedCost } as any
            });
        }

        // 3. Projects
        for (const p of scenario.projects) {
            const existingProj = await db.query.projects.findFirst({
                where: eq(projects.id, p.id)
            });

            if (existingProj) {
                await db.update(projects).set({
                    businessId: scenario.id,
                    name: p.name,
                    label: p.label,
                    data: p as any,
                    isFavorite: p.isFavorite,
                    lastModified: now
                }).where(eq(projects.id, p.id));
            } else {
                await db.insert(projects).values({
                    id: p.id,
                    businessId: scenario.id,
                    name: p.name,
                    label: p.label,
                    data: p as any,
                    isFavorite: p.isFavorite,
                    lastModified: now
                });
            }
        }

        // 4. Liabilities
        for (const l of scenario.liabilities) {
            const dueDate = new Date(now.getFullYear(), now.getMonth(), l.dueDateDay);
            const existingLiab = await db.query.liabilities.findFirst({
                where: eq(liabilities.id, l.id)
            });

            if (existingLiab) {
                await db.update(liabilities).set({
                    businessId: scenario.id,
                    name: l.name,
                    amount: l.amount,
                    dueDate,
                    isPaidThisMonth: false
                }).where(eq(liabilities.id, l.id));
            } else {
                await db.insert(liabilities).values({
                    id: l.id,
                    businessId: scenario.id,
                    name: l.name,
                    amount: l.amount,
                    dueDate,
                    totalTenure: 12,
                    remainingTenure: 8,
                    isPaidThisMonth: false
                });
            }
        }

        // 5. Cashflow (Last 30 days)
        console.log(`Generating cashflow for ${scenario.name}...`);
        // Clean old cashflow for this scenario to avoid duplicates on re-run
        await db.delete(cashflow).where(eq(cashflow.businessId, scenario.id));

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);

            // Randomish but trended revenue
            const multiplier = scenario.id === 'biz-freelance' ? 0.2 : 1.0; // Freelance has fewer but larger hits
            const revenue = Math.random() < multiplier ? (Math.random() * 2000000 + 500000) : 0;
            const expense = revenue > 0 ? (revenue * 0.4 + Math.random() * 200000) : (Math.random() * 100000);

            await db.insert(cashflow).values({
                id: `cf-${scenario.id}-${i}`,
                businessId: scenario.id,
                date,
                revenue,
                expense,
                category: revenue > 0 ? "SALES" : "OPEX",
                note: `Daily ${revenue > 0 ? 'Sales' : 'Expense'} for ${scenario.name}`
            });
        }
    }

    console.log("✅ Detailed Onboarding Demo Seeding Complete!");
}

seedDemoOnboarding().catch(console.error);
