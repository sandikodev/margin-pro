
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index";
import { businesses } from "../db/schema";
import { businessSchema } from "../../shared/schemas";
import { getSession } from "../middleware/session";

const app = new Hono()
    .get("/", async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const list = await db.select().from(businesses).where(eq(businesses.userId, session.id));

        // Map DB structure back to flat structure for client
        const flatList = list.map(b => ({
            id: b.id,
            name: b.name,
            type: b.type as any,
            initialCapital: b.initialCapital || 0,
            currentAssetValue: b.currentAssetValue || 0,
            cashOnHand: b.cashOnHand || 0,
            themeColor: b.themeColor || undefined,
            avatarUrl: b.avatarUrl || undefined,
            // Spread JSON data
            ...(b.data || {})
        }));

        return c.json(flatList);
    })
    .post("/", zValidator("json", businessSchema), async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const raw = c.req.valid("json");
        const id = raw.id || Math.random().toString(36).substr(2, 9);

        // Separate core columns from JSON data
        const {
            name, type, initialCapital, currentAssetValue, cashOnHand, themeColor, avatarUrl,
            ...extraData
        } = raw;

        await db.insert(businesses).values({
            id,
            userId: session.id,
            name,
            type,
            initialCapital,
            currentAssetValue,
            cashOnHand,
            themeColor: themeColor || null,
            avatarUrl: avatarUrl || null,
            data: extraData
        });

        return c.json({ success: true, id });
    })
    .put("/:id", zValidator("json", businessSchema), async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const id = c.req.param("id");
        const raw = c.req.valid("json");

        // Verify ownership
        const existing = await db.select().from(businesses)
            .where(and(eq(businesses.id, id), eq(businesses.userId, session.id)))
            .limit(1);

        if (!existing.length) return c.json({ error: "Not found or forbidden" }, 404);

        const {
            name, type, initialCapital, currentAssetValue, cashOnHand, themeColor, avatarUrl,
            ...extraData
        } = raw;

        await db.update(businesses).set({
            name,
            type,
            initialCapital,
            currentAssetValue,
            cashOnHand,
            themeColor: themeColor || null,
            avatarUrl: avatarUrl || null,
            data: extraData,
            updatedAt: new Date() // Force TS Date for timestamp
        }).where(eq(businesses.id, id));

        return c.json({ success: true });
    })
    .delete("/:id", async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const id = c.req.param("id");

        // Verify ownership
        const result = await db.delete(businesses)
            .where(and(eq(businesses.id, id), eq(businesses.userId, session.id)))
            .returning({ id: businesses.id });

        if (!result.length) return c.json({ error: "Not found" }, 404);

        return c.json({ success: true });
    });

export { app as businessRoutes };
