import { hash } from "bcrypt-ts";
import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function seedUsers() {
    console.log("🌱 Seeding Users...");

    const passwordHash = await hash("password123", 10);

    const usersToSeed = [
        {
            id: "admin-user-01",
            name: "Super Admin",
            email: "admin@marginpro.com",
            password: passwordHash,
            role: "super_admin",
            referralCode: "ADMIN001",
            permissions: ["*"],
        },
        {
            id: "demo-merchant-01",
            name: "Andi Merchant",
            email: "user@marginpro.com",
            password: passwordHash,
            role: "user",
            referralCode: "ANDI88",
            permissions: [],
        },
        {
            id: "demo-user-02",
            name: "Demo User",
            email: "demo@marginpro.com",
            password: passwordHash,
            role: "user",
            referralCode: "DEMO002",
            permissions: [],
        }
    ];

    for (const u of usersToSeed) {
        // 1. Try to find by Referral Code (primary migration key)
        const byRef = await db.query.users.findFirst({
            where: eq(users.referralCode, u.referralCode)
        });

        if (byRef) {
            // Update existing user (migration)
            await db.update(users)
                .set({
                    email: u.email, // Update email to new domain
                    name: u.name,
                    password: u.password,
                    role: u.role as "user" | "admin" | "super_admin",
                    permissions: u.permissions
                })
                .where(eq(users.id, byRef.id));
            console.log(`✅ Updated existing user by RefCode: ${u.referralCode} -> ${u.email}`);
            continue;
        }

        // 2. Try to find by Email (idempotency)
        const byEmail = await db.query.users.findFirst({
            where: eq(users.email, u.email)
        });

        if (byEmail) {
            await db.update(users)
                .set({
                    name: u.name,
                    password: u.password,
                    role: u.role as "user" | "admin" | "super_admin",
                    referralCode: u.referralCode,
                    permissions: u.permissions
                })
                .where(eq(users.id, byEmail.id));
            console.log(`✅ Updated existing user by Email: ${u.email}`);
            continue;
        }

        // 3. Insert New
        await db.insert(users).values({ ...u, role: u.role as "user" | "admin" | "super_admin" });
        console.log(`✅ Created user: ${u.email}`);
    }

    console.log("✅ User Seeding Complete.");
}

seedUsers().catch(console.error);
