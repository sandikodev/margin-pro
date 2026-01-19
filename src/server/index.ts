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

// --- SEO & Auth Replacement Logic ---

// Middleware to inject SEO tags & Handle Auth Replacements
app.get("*", async (c, next) => {
    const url = new URL(c.req.url);

    // Skip API routes
    if (url.pathname.startsWith("/api")) {
        return next();
    }

    // Auth redirection logic
    const session = await getSession(c);
    const isProtectedPath = url.pathname.startsWith("/app") || url.pathname.startsWith("/system");

    if (isProtectedPath && !session) {
        return c.redirect("/auth");
    }

    if (url.pathname === "/auth" && session) {
        return c.redirect("/app");
    }

    if (url.pathname.startsWith("/system") && session?.role !== "admin" && session?.role !== "super_admin") {
        return c.redirect("/app");
    }

    // Default SEO tags
    const title = "Margin Pro - Intelligence Pricing System";
    const description = "Hitung profit margin, simulasi harga, dan atur keuangan bisnis kuliner & retail anda.";
    const image = "https://placehold.co/1200x630/4f46e5/white?text=Margin+Pro";

    let html = "";
    const isVercel = !!process.env.VERCEL;

    if (isVercel) {
        // Vercel (Edge or Serverless)
        // Fetch index.html from origin (Vercel static hosting)
        const baseUrl = new URL(c.req.url).origin;
        try {
            const res = await fetch(`${baseUrl}/index.html`);
            if (res.ok) {
                html = await res.text();
            } else {
                html = `<html><body><h1>Error loading app</h1><p>Vercel Status: ${res.status}</p><p>URL: ${baseUrl}/index.html</p><p>Reason: If this is a preview deployment, ensure "Deployment Protection" is disabled in Vercel settings so the Edge Function can fetch its own assets.</p></body></html>`;
            }
        } catch (e) {
            html = `<html><body><h1>Edge Fetch Error</h1><p>${String(e)}</p></body></html>`;
        }
    } else if (process.env.NODE_ENV === "production") {
        // Local Production (Bun)
        // @ts-ignore
        html = await Bun.file("./dist/index.html").text();
    } else {
        // Local Development (Bun)
        // @ts-ignore
        html = await Bun.file("index.html").text();

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

    // Inject SEO Tags
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`)
        .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
        .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`)
        .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${image}">`);

    return c.html(html);
});

export type AppType = typeof api;
export default app;
