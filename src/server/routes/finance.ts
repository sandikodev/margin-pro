
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { liabilities, cashflow } from "../db/schema";
import { liabilitySchema, cashflowSchema } from "../../shared/schemas";
import { TransactionCategory } from "../../shared/types";
import { getSession } from "../middleware/session";

const app = new Hono();

// --- LIABILITIES ---

app.get("/liabilities", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const businessId = c.req.query('businessId');
    if (!businessId) {
        // Return emtpy or all user liabilities? simpler to require businessId or return all
        // Let's require businessId for finance context usually.
        // Or if filter not present, return []
        return c.json([]);
    }

    // Verify ownership
    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, businessId), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    const list = await db.select().from(liabilities).where(eq(liabilities.businessId, businessId));

    return c.json(list.map(l => ({
        ...l,
        dueDate: l.dueDate.getTime(),
        isPaidThisMonth: l.isPaidThisMonth || false
    })));
});

app.post("/liabilities", zValidator("json", liabilitySchema), async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const raw = c.req.valid("json");
    if (!raw.businessId) return c.json({ error: "Business ID required" }, 400);

    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, raw.businessId!), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    const id = raw.id || Math.random().toString(36).substring(2, 9);

    await db.insert(liabilities).values({
        id,
        businessId: raw.businessId!,
        name: raw.name,
        amount: raw.amount,
        dueDate: new Date(raw.dueDate),
        totalTenure: raw.totalTenure || null,
        remainingTenure: raw.remainingTenure || null,
        isPaidThisMonth: raw.isPaidThisMonth
    });

    return c.json({ success: true, id });
});

app.put("/liabilities/:id", zValidator("json", liabilitySchema), async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const id = c.req.param("id");
    const raw = c.req.valid("json");

    // Check ownership via existing record
    const existing = await db.query.liabilities.findFirst({ where: (l, { eq }) => eq(l.id, id) });
    if (!existing) return c.json({ error: "Not found" }, 404);

    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, existing.businessId), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    await db.update(liabilities).set({
        name: raw.name,
        amount: raw.amount,
        dueDate: new Date(raw.dueDate),
        totalTenure: raw.totalTenure || null,
        remainingTenure: raw.remainingTenure || null,
        isPaidThisMonth: raw.isPaidThisMonth
    }).where(eq(liabilities.id, id));

    return c.json({ success: true });
});

app.delete("/liabilities/:id", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param("id");

    const existing = await db.query.liabilities.findFirst({ where: (l, { eq }) => eq(l.id, id) });
    if (!existing) return c.json({ error: "Not found" }, 404);

    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, existing.businessId), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    await db.delete(liabilities).where(eq(liabilities.id, id));
    return c.json({ success: true });
});


// --- CASHFLOW ---

app.get("/cashflow", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const businessId = c.req.query('businessId');
    if (!businessId) return c.json([]);

    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, businessId), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    const list = await db.select().from(cashflow).where(eq(cashflow.businessId, businessId));

    return c.json(list.map(rec => ({
        ...rec,
        date: rec.date.getTime(),
        category: (rec.category || 'OTHER') as TransactionCategory
    })));
});

app.post("/cashflow", zValidator("json", cashflowSchema), async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const raw = c.req.valid("json");
    if (!raw.businessId) return c.json({ error: "Business ID required" }, 400);

    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, raw.businessId!), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    const id = raw.id || Math.random().toString(36).substring(2, 9);

    await db.insert(cashflow).values({
        id,
        businessId: raw.businessId!,
        date: new Date(raw.date),
        revenue: raw.revenue,
        expense: raw.expense,
        category: raw.category || 'OTHER',
        note: raw.note || null
    });

    return c.json({ success: true, id });
});

app.delete("/cashflow/:id", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param("id");

    const existing = await db.query.cashflow.findFirst({ where: (l, { eq }) => eq(l.id, id) });
    if (!existing) return c.json({ error: "Not found" }, 404);

    const business = await db.query.businesses.findFirst({
        where: (b, { eq, and }) => and(eq(b.id, existing.businessId), eq(b.userId, session.id))
    });
    if (!business) return c.json({ error: "Access denied" }, 403);

    await db.delete(cashflow).where(eq(cashflow.id, id));
    return c.json({ success: true });
});

export { app as financeRoutes };
