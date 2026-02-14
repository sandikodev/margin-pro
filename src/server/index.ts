import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/serve-static";
import type { Context, Next } from "hono";

// Import API routes
import { authRoutes } from "./routes/auth";
import { projectsRoutes } from "./routes/projects";
import { paymentsRoutes } from "./routes/payment";
import { configsRoutes } from "./routes/configs";
import { marketplaceRoutes } from "./routes/marketplace";
import { financeRoutes } from "./routes/finance";
import { getSession } from "./middleware/session";

// Create the main app
const app = new Hono();

// Create API app
const apiApp = new Hono();

// Middleware
app.use("*", cors({
    origin: ["http://localhost:5173", "https://marginpro.vercel.app"],
    credentials: true,
}));

app.use("*", logger());

// Serve static files in development
if (process.env.NODE_ENV !== "production") {
    // Remove static file serving for Edge Runtime compatibility
}

// API Routes
apiApp.route("/auth", authRoutes);
apiApp.route("/projects", projectsRoutes);
apiApp.route("/payment", paymentsRoutes);
apiApp.route("/configs", configsRoutes);
apiApp.route("/marketplace", marketplaceRoutes);
apiApp.route("/finance", financeRoutes);

// Health check
apiApp.get("/health", (c) => {
    return c.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        runtime: "edge"
    });
});

// Development routes
if (process.env.NODE_ENV === "development") {
    apiApp.get("/dx/context", async (c) => {
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
app.route("/api", apiApp);

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

        // Meta injection for SEO
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

        // Edge-compatible HTML template
        const html = `<!DOCTYPE html>
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

        // Inject user session if available
        const finalHtml = user 
            ? html.replace('</head>', `<script>window.__INITIAL_SESSION__ = ${JSON.stringify(user)};</script></head>`)
            : html;

        return c.html(finalHtml);

    } catch (error) {
        console.error("SSR Error:", error);
        
        // Fallback HTML on error
        const fallbackHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Margins Pro</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/client/index.tsx"></script>
</body>
</html>`;
        
        return c.html(fallbackHtml);
    }
});

export default app;
