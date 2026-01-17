import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { users, businesses, projects } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// --- RPC Routes ---
const api = app.basePath("/api")
    .get("/health", (c) => c.json({ status: "ok", runtime: "bun" }))

    // Auth Example (Mock for now, replacing hooks later)
    .post("/auth/login", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string()
    })), async (c) => {
        const { email, password } = c.req.valid("json");
        // TODO: Verify password hash
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return c.json({ error: "Invalid credentials" }, 401);

        // In real app: Sign JWT
        return c.json({ user: { id: user.id, name: user.name, email: user.email } });
    })

    // Projects CRUD
    .get("/projects", async (c) => {
        // TODO: Filter by business/user
        const allProjects = await db.select().from(projects);
        return c.json(allProjects.map(p => ({
            ...p,
            ...p.data as any, // Flatten json data to match Project interface
            lastModified: p.lastModified.getTime() // Convert Date to timestamp number
        })));
    })
    .post("/projects", zValidator("json", z.object({
        name: z.string(),
        businessId: z.string().optional(),
        data: z.any()
    })), async (c) => {
        const body = c.req.valid("json");
        const id = Math.random().toString(36).substring(7); // Simple ID gen

        const newProject = {
            id,
            businessId: body.businessId || 'default', // Fallback
            name: body.name,
            data: body.data,
            lastModified: new Date(),
            isFavorite: false
        };

        await db.insert(projects).values(newProject);
        return c.json({ status: "created", id });
    })
    .put("/projects/:id", zValidator("json", z.object({
        name: z.string().optional(),
        data: z.any(),
        isFavorite: z.boolean().optional()
    })), async (c) => {
        const id = c.req.param("id");
        const body = c.req.valid("json");

        await db.update(projects).set({
            ...(body.name ? { name: body.name } : {}),
            ...(body.data ? { data: body.data } : {}),
            ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite } : {}),
            lastModified: new Date()
        }).where(eq(projects.id, id));

        return c.json({ status: "updated" });
    })
    .delete("/projects/:id", async (c) => {
        const id = c.req.param("id");
        await db.delete(projects).where(eq(projects.id, id));
        return c.json({ status: "deleted" });
    });

// --- SEO & Static File Serving ---

// Middleware to inject SEO tags
app.use("*", async (c, next) => {
    const url = new URL(c.req.url);

    // Skip API routes (handled above)
    if (url.pathname.startsWith("/api")) {
        await next();
        return;
    }

    // Define default SEO tags
    let title = "Margins Pro - Intelligence Pricing SaaS";
    let description = "Hitung profit margin, simulasi harga, dan atur keuangan bisnis kuliner & retail anda.";
    let image = "https://placehold.co/1200x630/4f46e5/white?text=Margins+Pro"; // Placeholder

    // Logic to determine dynamic tags based on URL path
    // Example: /project/:id -> Fetch project and set title
    // For now, we use defaults, but this structure allows expansion.

    let html = "";

    if (process.env.NODE_ENV === "production") {
        // In production, read from dist/index.html
        // implementation pending deployment setup
        html = await Bun.file("./dist/index.html").text();
    } else {
        // In Dev, fetch from Vite Server
        try {
            const viteUrl = "http://localhost:5173" + url.pathname;
            const res = await fetch(viteUrl);
            if (!res.ok) return c.text("Vite dev server not running or page not found", 404);
            html = await res.text();
        } catch (e) {
            return c.text("Failed to connect to Vite dev server", 500);
        }
    }


    // Inject Tags
    // Simple regex replacement for better performance than parsing DOM
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`)
        .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
        .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`)
        .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${image}">`);

    return c.html(html);
});

export type AppType = typeof api;
export default app;
