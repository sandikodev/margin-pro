
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { systemSettings, platforms, translations, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { sessionMiddleware, requireRole } from "../middleware/session";

export const adminRoutes = new Hono()
    .use("*", sessionMiddleware)
    .use("*", requireRole(["super_admin"]))

    .put("/settings/:key", zValidator("json", z.object({ value: z.string() })), async (c) => {
        const key = c.req.param("key");
        const { value } = c.req.valid("json");
        await db.update(systemSettings).set({ value, updatedAt: new Date() }).where(eq(systemSettings.key, key));
        return c.json({ status: "updated" });
    })
    .put("/platforms/:id", zValidator("json", z.any()), async (c) => {
        const id = c.req.param("id");
        const body = c.req.valid("json");
        await db.update(platforms).set({ ...body, updatedAt: new Date() }).where(eq(platforms.id, id));
        return c.json({ status: "updated" });
    })
    .get("/platforms", async (c) => {
        return c.json(await db.select().from(platforms));
    })
    .put("/translations/:key", zValidator("json", z.object({ umkm: z.string(), pro: z.string() })), async (c) => {
        const key = c.req.param("key");
        const { umkm, pro } = c.req.valid("json");
        await db.update(translations).set({ umkmLabel: umkm, proLabel: pro, updatedAt: new Date() }).where(eq(translations.key, key));
        return c.json({ status: "updated" });
    })
    .get("/users", async (c) => {
        // Return all users (filtering out sensitive data like password in a real app, though here we just return what's needed)
        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            referralCode: users.referralCode,
            affiliateEarnings: users.affiliateEarnings,
            createdAt: users.createdAt,
            referredBy: users.referredBy
        }).from(users);
        return c.json(allUsers);
    })
    .put("/users/:id", zValidator("json", z.object({ role: z.string(), ban: z.boolean().optional() })), async (c) => {
        const id = c.req.param("id");
        const { role } = c.req.valid("json");

        await db.update(users).set({ role }).where(eq(users.id, id));
        return c.json({ status: "updated", id, role });
    });
