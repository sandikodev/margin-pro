
import { db } from "../src/server/db";
import { users, businesses, projects } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

async function seedFiera() {
    console.log("🌱 Seeding Fiera Food Mangiran...");

    const TARGET_EMAIL = "androxoss@hotmail.com";
    const TARGET_REF_CODE = "ANDROXOSS"; // Generating a ref code based on email
    const BUSINESS_NAME = "Fiera Food Mangiran";
    const PROJECT_ID = "fiera-real-v2";

    // 1. Ensure User Exists
    let user = await db.query.users.findFirst({
        where: eq(users.email, TARGET_EMAIL)
    });

    if (!user) {
        console.log(`User ${TARGET_EMAIL} not found. Creating...`);
        const passwordHash = await Bun.password.hash("password123");
        
        // Generate a simple ID
        const userId = `user-${Date.now()}`;
        
        await db.insert(users).values({
            id: userId,
            email: TARGET_EMAIL,
            password: passwordHash,
            name: "Androxoss",
            role: "user",
            referralCode: TARGET_REF_CODE,
            permissions: [],
        });
        
        user = await db.query.users.findFirst({
            where: eq(users.email, TARGET_EMAIL)
        });
        
        if (!user) throw new Error("Failed to create user");
        console.log(`✅ User created: ${user.id}`);
    } else {
        console.log(`ℹ️ User found: ${user.id}`);
    }

    // 2. Ensure Business Exists
    let business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(
            eq(b.userId, user!.id),
            eq(b.name, BUSINESS_NAME)
        )
    });

    if (!business) {
        console.log(`Business '${BUSINESS_NAME}' not found. Creating...`);
        const businessId = `biz-${Date.now()}`;
        
        await db.insert(businesses).values({
            id: businessId,
            userId: user.id,
            name: BUSINESS_NAME,
            type: "fnb_offline",
            initialCapital: 0,
            currentAssetValue: 0,
            cashOnHand: 0,
            themeColor: "#FF5733", // Example color
            data: {
                address: "Mangiran",
                description: "Fiera Food Branch Mangiran"
            }
        });

        business = await db.query.businesses.findFirst({
            where: eq(businesses.id, businessId)
        });

        if (!business) throw new Error("Failed to create business");
        console.log(`✅ Business created: ${business.id}`);
    } else {
        console.log(`ℹ️ Business found: ${business.id}`);
    }

    // 3. Seed Project (Rice Bowl)
    // Transform data from useProjects.ts
    const projectData = {
        costs: [
            // Protein (Ayam)
            { id: '1', name: 'Ayam Broiler (Range Fluktuatif)', amount: 68000, minAmount: 66000, maxAmount: 70000, isRange: true, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' }, // portions -> units
            
            // Carbohydrate
            { id: '2', name: 'Beras (Weekly Usage)', amount: 42000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
            
            // Packaging Complex
            { id: '9', name: 'Bowl + Tutup (Pack 20pcs)', amount: 12500, minAmount: 10000, maxAmount: 15000, isRange: true, allocation: 'bulk', batchYield: 20, bulkUnit: 'units' },
            { id: '10', name: 'Cup 22oz (50pcs)', amount: 15000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' },
            { id: '11', name: 'Sealer Lid (2000pcs)', amount: 31500, minAmount: 30000, maxAmount: 33000, isRange: true, allocation: 'bulk', batchYield: 2000, bulkUnit: 'units' },

            // Ops (Bensin Satuan Hari)
            { id: '3', name: 'Minyak Goreng (1L)', amount: 17000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
            { id: '4', name: 'Tepung Terigu (1kg)', amount: 10000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
            { id: '5', name: 'Saus & Bumbu', amount: 20000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
            { id: '6', name: 'Sayur & Pelengkap', amount: 25000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
            
            // Operational using 'DAYS' unit
            { id: '7', name: 'Gas LPG (Habis 5 Hari)', amount: 22000, allocation: 'bulk', batchYield: 5, bulkUnit: 'days' },
            { id: '8', name: 'Bensin Ops (Habis 5 Hari)', amount: 25000, allocation: 'bulk', batchYield: 5, bulkUnit: 'days' },
        ],
        productionConfig: { period: 'weekly', daysActive: 5, targetUnits: 40 }, // targetPortions -> targetUnits
        pricingStrategy: 'competitor',
        competitorPrice: 10000,
        targetNet: 2500,
        confidence: 'high',
        price: 0 // Will be calculated by app or nullable
    };

    // Check if project exists
    const existingProject = await db.query.projects.findFirst({
        where: eq(projects.id, PROJECT_ID)
    });

    if (existingProject) {
        console.log(`Updating existing project: ${PROJECT_ID}`);
        await db.update(projects)
            .set({
                businessId: business.id,
                name: 'Rice Bowl Fiera Food',
                label: 'Real Ops',
                data: projectData as any, // Cast to any because Drizzle JSON typing can be strict
                lastModified: new Date()
            })
            .where(eq(projects.id, PROJECT_ID));
    } else {
        console.log(`Creating new project: ${PROJECT_ID}`);
        await db.insert(projects).values({
            id: PROJECT_ID,
            businessId: business.id,
            name: 'Rice Bowl Fiera Food',
            label: 'Real Ops',
            data: projectData as any,
            lastModified: new Date(),
            isFavorite: true
        });
    }

    console.log("✅ Seeding Fiera Food Mangiran Complete.");
}

seedFiera().catch(console.error);
