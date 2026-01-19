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
// The .basePath() method creates a new Hono instance with the prefix
const apiApp = new Hono()
    .basePath("/api")
    .get("/health", (c) => c.json({ status: "ok", runtime: "bun" }))
    .route("/auth", auth)
    .route("/businesses", businessRoutes)
    .route("/projects", projectRoutes)
    .route("/finance", financeRoutes)
    .route("/marketplace", marketplaceRoutes)
    .route("/configs", configRoutes)
    .route("/admin", adminRoutes)
    .route("/midtrans", paymentRoutes);

// Mount the API app to the main app root
app.route("/", apiApp);

// Export only the API part for RPC Client to infer types from
export const api = apiApp;

// --- Static File Serving & SEO ---

// Serve static assets from public/assets in production
// Skip on Vercel as Vercel handles static assets via vercel.json rewrites more efficiently
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    const { serveStatic } = await import("@hono/node-server/serve-static");
    app.use("/assets/*", serveStatic({ root: "./dist" }));
    app.use("*", serveStatic({ root: "./public" }));
}

// Middleware to inject SEO tags & Handle Auth Replacements
app.get("*", async (c, next) => {
    const url = new URL(c.req.url);

    // Skip API routes
    if (url.pathname.startsWith("/api")) {
        return next();
    }

    // Protected Routes Gatekeeper
    if (url.pathname.startsWith("/app") || url.pathname.startsWith("/system")) {
        const session = await getSession(c);
        if (!session) {
            return c.redirect("/auth");
        }
        if (url.pathname.startsWith("/system") && session.role !== "admin" && session.role !== "super_admin") {
            return c.redirect("/app");
        }
    }

    // Default SEO tags
    const title = "Margin Pro - Intelligence Pricing System";
    const description = "Hitung profit margin, simulasi harga, dan atur keuangan bisnis kuliner & retail anda.";
    const image = "https://placehold.co/1200x630/4f46e5/white?text=Margin+Pro";

    let html = "";

    if (process.env.NODE_ENV === "production") {
        try {
            // Priority 1: Check if we are running from dist/server/ (bundled)
            // In a bundle, ./index.html usually refers to the root relative to the CWD
            html = await Bun.file("./dist/index.html").text();
        } catch {
            try {
                // If running in Node-like enviroment (Vercel)
                const fs = await import("fs/promises");
                const path = await import("path");
                // Attempt to resolve based on common Vercel/Node structures
                const indexPath = path.resolve(process.cwd(), "dist/index.html");
                html = await fs.readFile(indexPath, "utf-8");
            } catch {
                return c.text("Production build index.html not found", 404);
            }
        }
    } else {
        // In Dev mode, we must inject Vite's client and React Refresh preamble
        // because Hono is serving the raw index.html bypassing Vite's transformIndexHtml
        try {
            html = await Bun.file("index.html").text();
        } catch {
            const fs = await import("fs/promises");
            html = await fs.readFile("index.html", "utf-8");
        }

        // Inject Vite Client & React Preamble
        html = html.replace(
            "<head>",
            `<head>
    <script type="module">
      import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="/@vite/client"></script>`
        );
    }

    // Inject Tags
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`)
        .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
        .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`)
        .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${image}">`);

    return c.html(html);
});

export type AppType = typeof api;
export default app;
