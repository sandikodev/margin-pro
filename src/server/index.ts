import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { configRoutes } from "./routes/configs";
import { adminRoutes } from "./routes/admin";
import { paymentRoutes } from "./routes/payment";

const app = new Hono();

app.use("*", cors());

// --- RPC Routes ---
// We mount the sub-apps to form the API
export const api = app.basePath("/api")
    .get("/health", (c) => c.json({ status: "ok", runtime: "bun" }))
    .route("/auth", auth)
    .route("/projects", projectRoutes)
    .route("/configs", configRoutes)
    .route("/admin", adminRoutes)
    .route("/midtrans", paymentRoutes);

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
    const title = "Margins Pro - Intelligence Pricing SaaS";
    const description = "Hitung profit margin, simulasi harga, dan atur keuangan bisnis kuliner & retail anda.";
    const image = "https://placehold.co/1200x630/4f46e5/white?text=Margins+Pro"; // Placeholder

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
