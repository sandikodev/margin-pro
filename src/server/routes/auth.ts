
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { sessionMiddleware, getSession } from "../middleware/session";
import { authLimiter } from "../middleware/security";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only_change_in_prod";
if (JWT_SECRET === "fallback_secret_for_dev_only_change_in_prod" && process.env.NODE_ENV === "production") {
    throw new Error("FATAL: You are using the default insecure JWT_SECRET in production. Change it immediately.");
}

export const auth = new Hono()
    .use("*", sessionMiddleware) // Apply session middleware to everything here (mostly for /me)
    .use("/login", authLimiter)
    .use("/register", authLimiter)

    .post("/login", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string()
    })), async (c) => {
        const { email, password } = c.req.valid("json");

        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return c.json({ error: "Invalid credentials" }, 401);

        // Verify Password
        const isMatch = await Bun.password.verify(password, user.password);
        if (!isMatch) return c.json({ error: "Invalid credentials" }, 401);

        // Create JWT
        const token = await sign({
            id: user.id,
            role: user.role,
            permissions: user.permissions,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 Days
        }, JWT_SECRET);

        // Set Cookie
        setCookie(c, "auth_token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "Strict",
        });

        return c.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, permissions: user.permissions }
        });
    })

    .post("/register", zValidator("json", z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        referralCode: z.string().optional()
    })), async (c) => {
        const { name, email, password, referralCode } = c.req.valid("json");

        // 1. Check existing user
        const existing = await db.query.users.findFirst({
            where: eq(users.email, email)
        });
        if (existing) return c.json({ error: "Email already registered" }, 409);

        // 2. Validate Referral
        let validReferrerCode = null;
        if (referralCode) {
            const referrer = await db.query.users.findFirst({
                where: eq(users.referralCode, referralCode)
            });
            if (referrer) {
                validReferrerCode = referralCode;
            }
        }

        // 3. Generate IDs & Hash Password
        const newUserId = Math.random().toString(36).substring(2, 9);
        const newReferralCode = name.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
        const hashedPassword = await Bun.password.hash(password);

        // 4. Create User
        await db.insert(users).values({
            id: newUserId,
            name,
            email,
            password: hashedPassword,
            role: "user",
            referralCode: newReferralCode,
            referredBy: validReferrerCode,
            affiliateEarnings: 0,
            permissions: []
        });

        // Auto Login after Register
        const token = await sign({
            id: newUserId,
            role: "user",
            permissions: [],
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
        }, JWT_SECRET);

        setCookie(c, "auth_token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "Strict",
        });

        return c.json({
            status: "created",
            user: { id: newUserId, name, email, role: "user", permissions: [] },
            referralCode: newReferralCode
        });
    })

    .post("/logout", (c) => {
        deleteCookie(c, "auth_token");
        return c.json({ success: true });
    })

    .post("/demo", async (c) => {
        // Create an ephemeral demo user in memory/JWT (no DB persistence needed for read-only demo if possible, 
        // but our app expects DB user for some things. We will use a consistent Demo ID or Random Ephemeral).

        // Strategy: Create a new random "Demo User" in DB so they don't conflict, 
        // BUT for cleanup we might want a cron.
        // For now: Let's create a real user in DB flagged as 'demo'.

        const demoId = `demo-${Math.random().toString(36).substring(2, 9)}`;
        const demoEmail = `${demoId}@demo.local`;

        // Insert ephemeral demo user
        await db.insert(users).values({
            id: demoId,
            name: "Demo Merchant",
            email: demoEmail,
            password: "demo-password-hash-placeholder", // No login possible via password
            role: "user",
            referralCode: "DEMO123",
            permissions: ["demo_mode"]
        });

        const token = await sign({
            id: demoId,
            role: "user",
            permissions: ["demo_mode"],
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2 // 2 Hours Demo Session
        }, JWT_SECRET);

        setCookie(c, "auth_token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 60 * 60 * 2, // 2 Hours
            sameSite: "Strict",
        });

        return c.json({
            success: true,
            user: {
                id: demoId,
                name: "Demo Merchant",
                email: demoEmail,
                role: "user",
                permissions: ["demo_mode"]
            }
        });
    })

    .get("/me", async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ user: null }, 200);

        // Fetch fresh user data from DB to ensure role/name is up to date
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                permissions: true
            }
        });

        if (!user) {
            deleteCookie(c, "auth_token");
            return c.json({ user: null }, 200);
        }

        return c.json({ user });
    })

    .get("/validate-ref/:code", async (c) => {
        const code = c.req.param("code");
        const referrer = await db.query.users.findFirst({
            where: eq(users.referralCode, code),
            columns: { name: true, referralCode: true }
        });

        if (!referrer) {
            return c.json({ valid: false, message: "Invalid referral code" }, 200);
        }
        return c.json({ valid: true, referrer: { name: referrer.name, code: referrer.referralCode } });
    });
