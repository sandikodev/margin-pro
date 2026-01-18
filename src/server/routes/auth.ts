
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const auth = new Hono()
    .post("/login", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string()
    })), async (c) => {
        const { email } = c.req.valid("json");
        // TODO: Verify password hash
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return c.json({ error: "Invalid credentials" }, 401);

        return c.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, permissions: user.permissions } });
    })
    .post("/register", zValidator("json", z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        referralCode: z.string().optional()
    })), async (c) => {
        const { name, email, password, referralCode } = c.req.valid("json");

        // ... (existing existing check & referral logic) ...
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

        // 3. Generate IDs
        const newUserId = Math.random().toString(36).substring(2, 9);
        const newReferralCode = name.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

        // 4. Create User
        await db.insert(users).values({
            id: newUserId,
            name,
            email,
            password,
            role: "user",
            referralCode: newReferralCode,
            referredBy: validReferrerCode,
            affiliateEarnings: 0,
            permissions: [] // Default empty
        });

        return c.json({
            status: "created",
            user: { id: newUserId, name, email, role: "user", permissions: [] },
            referralCode: newReferralCode
        });
    });
