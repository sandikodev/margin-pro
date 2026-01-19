import "./env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { configRoutes } from "./routes/configs";
import { adminRoutes } from "./routes/admin";
import { paymentRoutes } from "./routes/payment";
import { financeRoutes } from "./routes/finance";
import { marketplaceRoutes } from "./routes/marketplace";
import { getSession } from "./middleware/session";

import { securityHeaders, requestLogger, apiLimiter } from "./middleware/security";

const app = new Hono();

import { businessRoutes } from "./routes/businesses";

app.use("*", cors());
app.use("*", securityHeaders);
app.use("*", requestLogger);
app.use("/api/*", apiLimiter); // General API Rate Limit

// --- GLOBAL ERROR HANDLING ---
app.onError((err, c) => {
    console.error(`[Global Error] ${err.message}`, err);
    return c.json({ error: err.message || "Internal Server Error" }, 500);
});

app.notFound((c) => {
    return c.json({ error: "Endpoint not found" }, 404);
});

// --- RPC Routes ---
// We mount the sub-apps to form the API
export const api = app.basePath("/api")
    .get("/health", (c) => c.json({ status: "ok", runtime: "bun" }))
    .route("/auth", auth)
    .route("/businesses", businessRoutes)
    .route("/projects", projectRoutes)
    .route("/finance", financeRoutes)
    .route("/marketplace", marketplaceRoutes)
    .route("/configs", configRoutes)
    .route("/admin", adminRoutes)
    .route("/midtrans", paymentRoutes);

// --- SEO & Static File Serving ---

// Middleware to inject SEO tags & Handle Auth Replacements
app.use("*", async (c, next) => {
    const url = new URL(c.req.url);

    // Skip API routes (handled above)
    if (url.pathname.startsWith("/api")) {
        await next();
        return;
    }

    // --- NEW: Next.js-like Middleware Gatekeeper ---
    // Protected Routes: /app*, /system*
    if (url.pathname.startsWith("/app") || url.pathname.startsWith("/system")) {
        const session = await getSession(c);
        if (!session) {
            // Server-Side Redirect!
            return c.redirect("/auth");
        }

        // Additional: Protect /system for admins/super_admins only
        if (url.pathname.startsWith("/system") && session.role !== "super_admin") {
            return c.redirect("/app"); // Fallback to user app
        }
    }
    // -----------------------------------------------

    // Define default SEO tags
    const title = "Margin Pro - Intelligence Pricing SaaS";
    const description = "Hitung profit margin, simulasi harga, dan atur keuangan bisnis kuliner & retail anda.";
    const image = "https://placehold.co/1200x630/4f46e5/white?text=Margin+Pro"; // Placeholder

    let html = "";

    if (process.env.NODE_ENV === "production") {
        // In production, read from dist/index.html
        // implementation pending deployment setup
        try {
            html = await Bun.file("./dist/index.html").text();
        } catch {
            // Fallback for containerized envs if needed
            return c.text("Production build not found", 404);
        }
    } else {
        // In Dev, fetch from Vite Server
        try {
            const viteUrl = "http://localhost:5173" + url.pathname;
            const res = await fetch(viteUrl);
            if (!res.ok) return c.text("Vite dev server not running or page not found", 404);
            html = await res.text();
        } catch {
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
