import { createClient } from "@libsql/client";
// Bun automatically loads .env files

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
    console.log("Fixing database schema...");

    try {
        // 1. Add referral_code
        console.log("Adding referral_code...");
        await client.execute("ALTER TABLE users ADD COLUMN referral_code text");
        await client.execute("CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_unique ON users (referral_code)");
        console.log("referral_code added.");
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log("referral_code might already exist:", msg);
    }

    try {
        // 2. Add referred_by
        console.log("Adding referred_by...");
        await client.execute("ALTER TABLE users ADD COLUMN referred_by text");
        console.log("referred_by added.");
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log("referred_by might already exist:", msg);
    }

    try {
        // 3. Add affiliate_earnings
        console.log("Adding affiliate_earnings...");
        await client.execute("ALTER TABLE users ADD COLUMN affiliate_earnings integer DEFAULT 0");
        console.log("affiliate_earnings added.");
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log("affiliate_earnings might already exist:", msg);
    }

    try {
        // 4. Add permissions
        console.log("Adding permissions...");
        await client.execute("ALTER TABLE users ADD COLUMN permissions text DEFAULT '[]'");
        console.log("permissions added.");
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log("permissions might already exist:", msg);
    }

    console.log("Database fix complete.");
}

main();
