
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { projects } from "../db/schema";
import { projectSchema } from "../../shared/schemas";
import { getSession } from "../middleware/session";

const app = new Hono()
    .get("/", async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        // Optional: Filter by specific businessId if provided in query, otherwise return all accessible
        // For now, valid business check is likely done at the DB level via implicit ownership logic if we had business_members.
        // But since businesses are tied to userId, we can just return all projects for businesses owned by user?
        // Wait, projects link to businessId.
        // We should query projects where businessId is IN (businesses owned by user).
        // OR, just trust the client sends businessId? No, that's insecure.

        // Simpler for this phase: Client sends ?businessId. We verify user owns that businessId.
        const businessId = c.req.query('businessId');

        if (!businessId) {
            // Return ALL projects for user (requires join or two steps)
            // Step 1: Get user businesses
            const userBusinesses = await db.query.businesses.findMany({
                where: (b, { eq }) => eq(b.userId, session.id),
                columns: { id: true }
            });
            const bIds = userBusinesses.map(b => b.id);

            if (bIds.length === 0) return c.json([]);

            const all = await db.query.projects.findMany({
                where: (p, { inArray }) => inArray(p.businessId, bIds)
            });

            return c.json(all.map(p => ({
                id: p.id,
                businessId: p.businessId,
                name: p.name,
                label: p.label || undefined,
                isFavorite: p.isFavorite || false,
                lastModified: p.lastModified.getTime(),
                ...(p.data as any) // Flatten JSON data
            })));
        }

        // Verify ownership of requested businessId
        const business = await db.query.businesses.findFirst({
            where: (b, { eq, and }) => and(eq(b.id, businessId), eq(b.userId, session.id))
        });

        if (!business) return c.json({ error: "Business not found or access denied" }, 403);

        const list = await db.select().from(projects).where(eq(projects.businessId, businessId));

        return c.json(list.map(p => ({
            id: p.id,
            businessId: p.businessId,
            name: p.name,
            label: p.label || undefined,
            isFavorite: p.isFavorite || false,
            lastModified: p.lastModified.getTime(),
            ...(p.data as any)
        })));
    })
    .post("/", zValidator("json", projectSchema), async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const raw = c.req.valid("json");

        if (!raw.businessId) return c.json({ error: "Business ID required" }, 400);

        // Verify ownership
        const business = await db.query.businesses.findFirst({
            where: (b, { eq, and }) => and(eq(b.id, raw.businessId!), eq(b.userId, session.id))
        });
        if (!business) return c.json({ error: "Business not found" }, 403);

        const id = raw.id || Math.random().toString(36).substring(2, 9);

        // Extract core fields vs JSON fields
        const { name, label, businessId, isFavorite, lastModified: _lastModified, id: _id, ...jsonData } = raw;

        // DB Data Object (Merge with defaults to satisfy strict schema)
        const dbData = {
            ...jsonData,
            productionConfig: jsonData.productionConfig || { period: 'weekly', daysActive: 5, targetUnits: 40 }, // Default
        };

        await db.insert(projects).values({
            id,
            businessId: businessId!,
            name,
            label: label || null,
            isFavorite: isFavorite || false,
            lastModified: new Date(),
            data: dbData
        });

        return c.json({ success: true, id });
    })
    .put("/:id", zValidator("json", projectSchema), async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const id = c.req.param("id");
        const raw = c.req.valid("json");

        // Verify ownership (join not easy in update, select first)
        // We need to check if existing project belongs to a business owned by user
        const existingProject = await db.query.projects.findFirst({
            where: (p, { eq }) => eq(p.id, id)
        });

        if (!existingProject) return c.json({ error: "Project not found" }, 404);

        const business = await db.query.businesses.findFirst({
            where: (b, { eq, and }) => and(eq(b.id, existingProject.businessId), eq(b.userId, session.id))
        });

        if (!business) return c.json({ error: "Access denied" }, 403);

        const { name, label, businessId: _businessId, isFavorite, lastModified: _lastModified, id: _id, ...jsonData } = raw;

        const dbData = {
            ...jsonData,
            // For updates, we might want to preserve existing props if partial update, 
            // but PUT usually implies full replacement of the resource or controlled partial.
            // Zod schema makes everything optional? No, Zod schema has structure.
            // The client hook sends the FULL object.
            productionConfig: jsonData.productionConfig || { period: 'weekly', daysActive: 5, targetUnits: 40 },
        };

        await db.update(projects).set({
            name,
            label: label || null,
            isFavorite: isFavorite,
            lastModified: new Date(),
            data: dbData
        }).where(eq(projects.id, id));

        return c.json({ success: true });
    })
    .delete("/:id", async (c) => {
        const session = await getSession(c);
        if (!session) return c.json({ error: "Unauthorized" }, 401);

        const id = c.req.param("id");

        const existingProject = await db.query.projects.findFirst({
            where: (p, { eq }) => eq(p.id, id)
        });
        if (!existingProject) return c.json({ error: "Not found" }, 404);

        const business = await db.query.businesses.findFirst({
            where: (b, { eq, and }) => and(eq(b.id, existingProject.businessId), eq(b.userId, session.id))
        });
        if (!business) return c.json({ error: "Access denied" }, 403);

        await db.delete(projects).where(eq(projects.id, id));
        return c.json({ success: true });
    });

export { app as projectRoutes };
