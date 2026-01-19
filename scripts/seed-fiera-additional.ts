
import { db } from "../src/server/db";
import { users, businesses, projects } from "../src/server/db/schema";
import { eq, and } from "drizzle-orm";

async function seedFieraAdditional() {
    console.log("🌱 Seeding Additional Fiera Food Mangiran Menu...");

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

    // 3. Define New Projects

    // --- Es Teh Jumbo ---
    const esTehProject = {
        id: "fiera-esteh-jumbo",
        name: "Es Teh Jumbo",
        label: "Best Seller",
        costs: [
            // Bahan Baku
            { id: 'et1', name: 'Teh Tubruk (Pack)', amount: 15000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' }, // ~300/cup
            { id: 'et2', name: 'Gula Pasir (1kg)', amount: 16000, allocation: 'bulk', batchYield: 30, bulkUnit: 'units' }, // ~533/cup
            { id: 'et3', name: 'Es Kristal (Bag)', amount: 10000, allocation: 'bulk', batchYield: 20, bulkUnit: 'units' }, // ~500/cup
            { id: 'et4', name: 'Air Galon (Refill)', amount: 5000, allocation: 'bulk', batchYield: 100, bulkUnit: 'units' }, // ~50/cup

            // Packaging
            { id: 'et5', name: 'Cup Jumbo 22oz (50pcs)', amount: 25000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' }, // ~500/cup
            { id: 'et6', name: 'Sealer Lid / Tutup', amount: 30000, allocation: 'bulk', batchYield: 1000, bulkUnit: 'units' }, // ~30/cup
            { id: 'et7', name: 'Sedotan Steril', amount: 10000, allocation: 'bulk', batchYield: 100, bulkUnit: 'units' }, // ~100/cup
        ],
        productionConfig: { period: 'daily', daysActive: 30, targetUnits: 50 },
        pricingStrategy: 'competitor',
        competitorPrice: 3000, // Harga Jual Offline
        targetNet: 1000,
        confidence: 'high',
        price: 0
    };

    // --- Mie Tektek ---
    const mieTektekProject = {
        id: "fiera-mie-tektek",
        name: "Mie Tektek",
        label: "Warm Food",
        costs: [
            // Bahan Utama
            { id: 'mt1', name: 'Mie Kuning Basah (1kg)', amount: 12000, allocation: 'bulk', batchYield: 8, bulkUnit: 'units' }, // ~1500/porsi
            { id: 'mt2', name: 'Telur Ayam (1kg)', amount: 28000, allocation: 'bulk', batchYield: 16, bulkUnit: 'units' }, // ~1750/porsi (approx 16 eggs/kg)
            { id: 'mt3', name: 'Sayur (Sawi/Kol)', amount: 5000, allocation: 'bulk', batchYield: 10, bulkUnit: 'units' }, // ~500/porsi

            // Bumbu & Ops
            { id: 'mt4', name: 'Bumbu Halus (Racik)', amount: 10000, allocation: 'bulk', batchYield: 20, bulkUnit: 'units' }, // ~500/porsi
            { id: 'mt5', name: 'Minyak & Gas', amount: 20000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' }, // ~500/porsi

            // Packaging
            { id: 'mt6', name: 'Styrofoam/Paper Bowl', amount: 800, allocation: 'unit' },
            { id: 'mt7', name: 'Sendok Plastik', amount: 100, allocation: 'unit' },
        ],
        productionConfig: { period: 'daily', daysActive: 25, targetUnits: 20 },
        pricingStrategy: 'competitor',
        competitorPrice: 8000, // Harga Jual Offline
        targetNet: 2000,
        confidence: 'medium',
        price: 0
    };

    // --- Susu Murni ---
    const susuMurniProject = {
        id: "fiera-susu-murni",
        name: "Susu Murni",
        label: "Healthy Drink",
        costs: [
            // Bahan Utama
            { id: 'sm1', name: 'Susu Sapi Murni (1L)', amount: 12000, allocation: 'bulk', batchYield: 4, bulkUnit: 'units' }, // ~3000/cup (250ml)
            { id: 'sm2', name: 'Perasa / Sirup', amount: 30000, allocation: 'bulk', batchYield: 30, bulkUnit: 'units' }, // ~1000/cup
            { id: 'sm3', name: 'Gula Cair', amount: 15000, allocation: 'bulk', batchYield: 30, bulkUnit: 'units' }, // ~500/cup

            // Packaging & Ops
            { id: 'sm4', name: 'Cup 16oz + Lid', amount: 700, allocation: 'unit' },
            { id: 'sm5', name: 'Gas (Pemanas)', amount: 22000, allocation: 'bulk', batchYield: 100, bulkUnit: 'units' }, // ~220/cup
        ],
        productionConfig: { period: 'daily', daysActive: 30, targetUnits: 15 },
        pricingStrategy: 'competitor',
        competitorPrice: 7000, // Harga Jual Offline
        targetNet: 2000,
        confidence: 'high',
        price: 0
    };

    const newProjects = [esTehProject, mieTektekProject, susuMurniProject];

    for (const p of newProjects) {
        const existing = await db.query.projects.findFirst({
            where: eq(projects.id, p.id)
        });

        if (existing) {
            console.log(`Updating ${p.name}...`);
            await db.update(projects)
                .set({
                    businessId: business.id,
                    name: p.name,
                    label: p.label,
                    data: p as any,
                    lastModified: new Date()
                })
                .where(eq(projects.id, p.id));
        } else {
            console.log(`Creating ${p.name}...`);
            await db.insert(projects).values({
                id: p.id,
                businessId: business.id,
                name: p.name,
                label: p.label,
                data: p as any,
                lastModified: new Date(),
                isFavorite: false
            });
        }
    }

    console.log("✅ All additional menu items seeded successfully.");
}

seedFieraAdditional().catch(console.error);
