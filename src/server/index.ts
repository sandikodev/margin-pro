import "./env";
import { Hono, type Context, type Next } from "hono";
import { koda, env } from "../lib/koda-zenith";
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

// Use enhanced setup based on environment
const app = env.isDev 
  ? koda.setup.development()
  : koda.setup.production({
      rateLimit: { windowMs: 60 * 1000, limit: 100 },
      csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.google.com", "https://*.gstatic.com", "https://app.midtrans.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        connectSrc: ["'self'", "https://*.googleapis.com", "https://*.turso.io", "https://app.midtrans.com", "https://api.midtrans.com", "https://api.sandbox.midtrans.com"],
      }
    });

app.use("*", cors());
app.use("*", requestLogger);

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
const apiApp = new Hono()
    .basePath("/api")
    .get("/health", (c: Context) => c.json({ status: "ok", runtime: env.runtime }))
    .route("/auth", authRoutes)
    .route("/businesses", businessesRoutes)
    .route("/projects", projectsRoutes)
    .route("/finance", financeRoutes)
    .route("/marketplace", marketplaceRoutes)
    .route("/configs", configsRoutes)
    .route("/admin", adminRoutes)
    .route("/midtrans", paymentsRoutes);

// --- DX & Monitoring Endpoints (Dev Only) ---
if (env.isDev) {
    apiApp.get("/dx/diagnostics", async (c) => {
        const { kodaDX } = await import("../lib/koda-zenith/dx");
        return c.json(kodaDX.getDiagnostics());
    });
    
    apiApp.get("/dx/history", async (c) => {
        const { kodaContext } = await import("../lib/koda-zenith/context");
        return c.json(kodaContext.getHistory());
    });
    
    apiApp.get("/dx/performance", async (c) => {
        const { kodaContext } = await import("../lib/koda-zenith/context");
        const metrics = kodaContext.getMetrics();
        return c.json(metrics);
    });
}

// Mount the API app to the main app root
app.route("/", apiApp);

// Export only the API part for RPC Client to infer types from
export const api = apiApp;

// --- SEO & Auth Replacement Logic ---
app.get("*", async (c: Context, next: Next) => {
    const acceptHeader = c.req.header("accept") || "";
    
    // Skip SSR for API routes and static assets
    if (c.req.url.includes("/api/") || 
        c.req.url.includes("/assets/") ||
        c.req.url.includes("/favicon.ico") ||
        c.req.url.includes("/robots.txt") ||
        c.req.url.includes("/manifest.json")) {
        await next();
        return;
    }

    // Only do SSR for HTML requests
    if (!acceptHeader.includes("text/html")) {
        await next();
        return;
    }

    try {
        // Get user session for SSR
        const session = await getSession(c);
        const user = session || null;

        // Read the built HTML file
        let html: string;
        
        try {
            // In Edge Runtime, we can't read files - use fallback HTML
            html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#4f46e5">
    <title>${title}</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${c.req.url}">
    <meta property="og:type" content="website">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">
    
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        html, body { margin: 0; padding: 0; width: 100%; }
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        #root { width: 100%; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">
    <div id="root"></div>
    <script type="module" src="/src/client/index.tsx"></script>
</body>
</html>`;
        } catch (error) {
            console.error('Failed to generate HTML:', error);
            return c.text('Internal Server Error', 500);
        }

        // SEO Meta Injection
        const url = new URL(c.req.url);
        const path = url.pathname;
        
        let title = "Margins Pro - Intelligence Pricing System untuk UMKM Kuliner";
        let description = "Platform SaaS profesional yang membangun pengusaha kuliner menghitung HPP, mensimulasikan profit margin, dan mencegah kerugian akibat salah penetapan harga.";
        let ogImage = "https://marginpro.vercel.app/og-image.png";

        // Dynamic meta based on route
        if (path.startsWith('/app/dashboard')) {
            title = "Dashboard - Margins Pro";
            description = "Monitor performa bisnis kuliner Anda dengan dashboard analytics yang komprehensif.";
        } else if (path.startsWith('/app/calculator')) {
            title = "Kalkulator HPP - Margins Pro";
            description = "Hitung Harga Pokok Penjualan (HPP) dengan akurat menggunakan kalkulator profesional kami.";
        } else if (path.startsWith('/app/finance')) {
            title = "Manajemen Keuangan - Margins Pro";
            description = "Kelola keuangan bisnis kuliner dengan fitur pencatatan yang terintegrasi.";
        }

        // Inject meta tags (already in template above)
        
        // Auth State Injection
        if (user) {
            const authScript = `
        <script>
            window.__INITIAL_AUTH_STATE__ = ${JSON.stringify({ user })};
        </script>`;
            html = html.replace('</head>', `${authScript}\n</head>`);
        }

        return c.html(html);
    } catch (error) {
        console.error('SSR Error:', error);
        // Fallback to static file
        await next();
    }
});

export default app;
