import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { users, creditTransactions } from "../db/schema";
import { getSession } from "../middleware/session";
import { eq, desc } from "drizzle-orm";

export const marketplaceRoutes = new Hono()
    .get("/balance", async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
            columns: { credits: true }
        });

        const history = await db.query.creditTransactions.findMany({
            where: eq(creditTransactions.userId, session.id),
            orderBy: [desc(creditTransactions.date)],
            limit: 20
        });

        return c.json({
            credits: user?.credits || 0,
            history: history.map(h => ({
                id: h.id,
                name: h.description,
                price: Math.abs(h.amount), // Client expects positive price for items? Or signed? Client hook uses price
                type: h.amount < 0 ? 'spend' : 'topup',
                date: h.date ? new Date(h.date).getTime() : Date.now()
            }))
        });
    })
    .post("/spend", zValidator("json", z.object({
        amount: z.number().positive(),
        itemName: z.string()
    })), async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);
        const { amount, itemName } = c.req.valid("json");

        // Transaction
        // Check balance
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
            columns: { credits: true }
        });

        if (!user || (user.credits || 0) < amount) {
            return c.json({ error: "Insufficient credits", success: false }, 400);
        }

        // Deduct
        await db.update(users)
            .set({ credits: (user.credits || 0) - amount })
            .where(eq(users.id, session.id));

        // Record
        await db.insert(creditTransactions).values({
            id: Math.random().toString(36).substring(2, 9),
            userId: session.id,
            amount: -amount,
            description: itemName,
            date: new Date()
        });

        // Return new balance
        const updatedUser = await db.query.users.findFirst({
            where: eq(users.id, session.id),
            columns: { credits: true }
        });

        return c.json({ success: true, credits: updatedUser?.credits || 0 });
    })
    // Mock Topup for Demo
    .post("/topup", zValidator("json", z.object({
        amount: z.number().positive()
    })), async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);
        const { amount } = c.req.valid("json");

        // Add
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
            columns: { credits: true }
        });

        await db.update(users)
            .set({ credits: (user?.credits || 0) + amount })
            .where(eq(users.id, session.id));

        await db.insert(creditTransactions).values({
            id: Math.random().toString(36).substring(2, 9),
            userId: session.id,
            amount: amount,
            description: "Top Up Credits",
            date: new Date()
        });

        return c.json({ success: true });
    });
