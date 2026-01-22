import "./env";
import { Hono, type Context, type Next } from "hono";
import { koda } from "@framework";
import { cors } from "hono/cors";
import { BusinessProfile, BusinessType } from "@shared/types";
import { authRoutes } from "./routes/auth";
import { businessesRoutes } from "./routes/businesses";
import { projectsRoutes } from "./routes/projects";
import { configsRoutes } from "./routes/configs";
import { adminRoutes } from "./routes/admin";
import { paymentsRoutes } from "./routes/payment";
import { financeRoutes } from "./routes/finance";
import { marketplaceRoutes } from "./routes/marketplace";
import { db } from "./db/index";
import { users, businesses as businessesTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./middleware/session";

import { requestLogger } from "./middleware/security";

const app = koda();

app.use("*", cors());
app.use("*", requestLogger);

// Koda Security Posture (HSTS, CSP, Rate Limiting)
app.use("/api/*", ...koda.security({
    rateLimit: { windowMs: 60 * 1000, limit: 100 },
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.google.com", "https://*.gstatic.com", "https://app.midtrans.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: ["'self'", "https://*.googleapis.com", "https://*.turso.io", "https://app.midtrans.com", "https://api.midtrans.com", "https://api.sandbox.midtrans.com"],
    }
}));

// --- GLOBAL ERROR HANDLING ---
app.onError((err: Error, c: Context) => {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error(`[Global Error] ${message}`, err);
    return c.json({ error: message }, 500);
});

app.notFound((c: Context) => {
    return c.json({ error: "Endpoint not found" }, 404);
});

// --- RPC Routes ---
// The .basePath() method creates a new Hono instance with the prefix
const apiApp = new Hono()
    .basePath("/api")
    .get("/health", (c: Context) => c.json({ status: "ok", runtime: "bun" }))
    .route("/auth", authRoutes)
    .route("/businesses", businessesRoutes)
    .route("/projects", projectsRoutes)
    .route("/finance", financeRoutes)
    .route("/marketplace", marketplaceRoutes)
    .route("/configs", configsRoutes)
    .route("/admin", adminRoutes)
    .route("/midtrans", paymentsRoutes);

// Mount the API app to the main app root
app.route("/", apiApp);

// Export only the API part for RPC Client to infer types from
export const api = apiApp;

// --- SEO & Auth Replacement Logic ---

// Middleware to inject SEO tags & Handle Auth Replacements
app.get("*", async (c: Context, next: Next) => {
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

    // Deployment-Agnostic Asset Fetching logic
    if (koda.env.runtime === 'edge') {
        const baseUrl = new URL(c.req.url).origin;
        try {
            const res = await fetch(`${baseUrl}/index.html`);
            if (res.ok) {
                html = await res.text();
            } else {
                html = `<html><body><h1>Error loading app</h1><p>Edge runtime fetch error: ${res.status}</p></body></html>`;
            }
        } catch (e) {
            html = `<html><body><h1>Edge Fetch Error</h1><p>${String(e)}</p></body></html>`;
        }
    } else {
        // Bun/Node Local modes
        const targetFile = koda.env.isDev ? "index.html" : "./dist/index.html";
        const bun = (globalThis as unknown as { Bun?: { file: (p: string) => { text: () => Promise<string> } } }).Bun;
        html = bun ? await bun.file(targetFile).text() : "";

        if (koda.env.isDev) {
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
    }

    // Inject SEO Tags
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`)
        .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
        .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`)
        .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${image}">`);

    // --- SSR HYDRATION DATA ---
    const hydrationData: Record<string, unknown> = {};

    if (session) {
        // Prefetch basic user info
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.id),
            columns: { id: true, name: true, email: true, role: true, permissions: true }
        });
        if (user) {
            hydrationData['["auth","me"]'] = { user };

            // Prefetch businesses
            const userBusinesses = await db.select().from(businessesTable).where(eq(businessesTable.userId, session.id));
            hydrationData['["businesses","list"]'] = userBusinesses.map((b): BusinessProfile => ({
                id: b.id,
                name: b.name,
                type: b.type as BusinessType,
                initialCapital: b.initialCapital || 0,
                currentAssetValue: b.currentAssetValue || 0,
                cashOnHand: b.cashOnHand || 0,
                themeColor: b.themeColor || undefined,
                avatarUrl: b.avatarUrl || undefined,
                establishedDate: b.data?.establishedDate || 0,
                ...(b.data || {})
            }));
        }
    }

    // Inject Hydration Script
    const hydrationScript = `<script id="__QUERY_HYDRATION_DATA__" type="application/json">${JSON.stringify(hydrationData)}</script>`;
    html = html.replace("</body>", `${hydrationScript}\n</body>`);

    return c.html(html);
});

export type AppType = typeof apiApp;
export default app;
