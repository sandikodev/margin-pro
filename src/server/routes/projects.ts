
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";

export const projectRoutes = new Hono()
    .get("/", async (c) => {
        // TODO: Filter by business/user
        const allProjects = await db.select().from(projects);
        return c.json(allProjects.map(p => ({
            ...p,
            ...(p.data as Record<string, unknown>),
            lastModified: p.lastModified.getTime()
        })));
    })
    .post("/", zValidator("json", z.object({
        name: z.string(),
        label: z.string().optional(),
        businessId: z.string().optional(),
        data: z.any()
    })), async (c) => {
        const body = c.req.valid("json");
        const id = Math.random().toString(36).substring(7);

        const newProject = {
            id,
            businessId: body.businessId || 'default',
            name: body.name,
            label: body.label,
            data: body.data,
            lastModified: new Date(),
            isFavorite: false
        };

        await db.insert(projects).values(newProject);
        return c.json({ status: "created", id });
    })
    .put("/:id", zValidator("json", z.object({
        name: z.string().optional(),
        label: z.string().optional(),
        data: z.any(),
        isFavorite: z.boolean().optional()
    })), async (c) => {
        const id = c.req.param("id");
        const body = c.req.valid("json");

        await db.update(projects).set({
            ...(body.name ? { name: body.name } : {}),
            ...(body.label ? { label: body.label } : {}),
            ...(body.data ? { data: body.data } : {}),
            ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite } : {}),
            lastModified: new Date()
        }).where(eq(projects.id, id));

        return c.json({ status: "updated" });
    })
    .delete("/:id", async (c) => {
        const id = c.req.param("id");
        await db.delete(projects).where(eq(projects.id, id));
        return c.json({ status: "deleted" });
    });
