
import { Hono, type Context, type Next } from "hono";
import { cors } from "hono/cors";
import { koda, env } from "../lib/koda-zenith";
import { registerEntries, type KodaServerEntry, type ZenClientEntry, serverUtils } from "../lib/koda-zenith/entries";

// API routes
import { authRoutes } from "./routes/auth";
import { businessesRoutes } from "./routes/businesses";
import { projectsRoutes } from "./routes/projects";
import { configsRoutes } from "./routes/configs";
import { adminRoutes } from "./routes/admin";
import { paymentsRoutes } from "./routes/payment";
import { financeRoutes } from "./routes/finance";
import { marketplaceRoutes } from "./routes/marketplace";
import { collaborationRoutes } from "./routes/collaboration";

// Database & Middleware
import { db } from "./db/index";
import { users, businesses as businessesTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./middleware/session";
import { requestLogger } from "./middleware/security";

// SSR Dependencies REMOVED for Edge Compatibility
// Pure Shell Rendering Strategy

// --- INLINED SERVER ENTRY For Edge Compatibility ---
const serverEntry: KodaServerEntry = {
    async middleware(request: Request): Promise<Request | Response> {
        const url = new URL(request.url);
        if (url.pathname.includes('admin') && !isAuthenticated(request)) {
            return new Response('Unauthorized', { status: 401 });
        }
        if (url.pathname.startsWith('/old-path')) {
            const newUrl = new URL(request.url);
            newUrl.pathname = url.pathname.replace('/old-path', '/new-path');
            return Response.redirect(newUrl.toString(), 301);
        }
        return request;
    },

    // Critical CSS not needed for Shell Rendering
    extractCriticalCSS(html: string) { return { usedClasses: [], criticalCSS: '' }; },

    async render(request: Request) {
        // Shell Rendering: We serve the empty shell and let client hydrate
        // This is incredibly fast on Edge and 100% compatible
        return { html: '', context: null, criticalCSS: '' };
    },

    async loader(request: Request) {
        const url = new URL(request.url);
        return {
            timestamp: Date.now(),
            path: url.pathname,
            userAgent: request.headers.get('user-agent'),
        };
    }
};

function isAuthenticated(request: Request): boolean {
    const cookie = request.headers.get('cookie');
    return cookie?.includes('auth-token') || false;
}

// --- DUMMY CLIENT ENTRY (Server doesn't need browser logic) ---
const clientEntry: Partial<ZenClientEntry> = {
    init: () => console.log('Client entry placeholder on server'),
};

// Register framework entries
registerEntries({
    server: serverEntry,
    client: clientEntry as any
});

// Setup App with Koda Zenith Intelligence
const app = env.isDev
    ? koda.setup.development()
    : koda.setup.production({
        rateLimit: { windowMs: 60 * 1000, limit: 120 },
        csp: {
            defaultSrc: ["'self'", "https://*.transparenttextures.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.google.com", "https://*.gstatic.com", "https://app.midtrans.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.transparenttextures.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:", "https://*.transparenttextures.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            connectSrc: ["'self'", "https://*.googleapis.com", "https://*.turso.io", "https://app.midtrans.com", "https://api.midtrans.com", "https://api.sandbox.midtrans.com", "ws://localhost:*", "http://localhost:*"],
        }

    });

app.use("*", cors({
    origin: ["http://localhost:5173", "https://marginpro.vercel.app", "https://margins-pro-legacy-check.vercel.app"],
    credentials: true,
}));
app.use("*", requestLogger);

import { createFileSystemRouter } from "../lib/koda-zenith/fs-router";

// --- API Sub-App ---
const apiApp = new Hono();

// Koda Zenith v2 - File System Routing
// Automatically scans ./routes/**/*.ts (Server Routes) and mounts them
const fsRoutes = import.meta.glob('./routes/**/*.ts', { eager: true });
const fileSystemRouter = createFileSystemRouter(fsRoutes, '/'); // Base path relative to API

// Route Chaining for Type Inference (Critical for Hono RPC)
// Static routes first to ensure types are preserved
const routes = apiApp
    .route("/auth", authRoutes) // Critical: Auth Routes Manual Mount
    .route("/businesses", businessesRoutes)
    .route("/projects", projectsRoutes)
    .route("/finance", financeRoutes)
    .route("/marketplace", marketplaceRoutes)
    .route("/configs", configsRoutes)
    .route("/admin", adminRoutes)
    .route("/payment", paymentsRoutes)
    .route("/collaboration", collaborationRoutes)
    .route("/", fileSystemRouter); // Dynamic routes last


// Mount API
app.route("/api", apiApp);

// Export for RPC Client
export const api = routes;
export type AppType = typeof routes;


// --- SEO & SMART SSR ---
app.get("*", async (c: Context, next: Next) => {
    const url = new URL(c.req.url);
    const accept = c.req.header("accept") || "";

    // Optimization: Skip SSR for assets/API
    if (url.pathname.startsWith("/api") ||
        url.pathname.startsWith("/assets") ||
        url.pathname.match(/\.(ico|png|jpg|svg|css|js|json)$/)) {
        return next();
    }

    if (!accept.includes("text/html")) {
        return next();
    }

    try {
        const session = await getSession(c);

        // Intelligent Redirection Logic
        const isProtected = url.pathname.startsWith("/app") || url.pathname.startsWith("/system");
        if (isProtected && !session) return c.redirect("/auth");
        if (url.pathname === "/auth" && session) return c.redirect("/app/dashboard");

        // Metadata Intelligence
        let title = "Margins Pro - Intelligence Pricing System";
        let description = "Solusi HPP dan kalkulasi profit cerdas untuk UMKM.";

        if (url.pathname.includes("/blog")) {
            title = "Blog Intelligence - Margins Pro";
        } else if (url.pathname.includes("/app/dashboard")) {
            title = "Dashboard - Margins Pro";
        }

        // Fetch Base HTML (Edge Portable)
        let html = "";
        const isDev = env.isDev;

        if (env.runtime === 'edge') {
            const baseUrl = new URL(c.req.url).origin;
            const res = await fetch(`${baseUrl}/index.html`);
            html = res.ok ? await res.text() : "<html><body>Loading...</body></html>";
        } else {
            // Local fallback (Bun)
            try {
                const path = isDev ? "index.html" : "./dist/index.html";
                // @ts-ignore - Bun global
                html = await Bun.file(path).text();
            } catch {
                html = "<html><body>Local build not found. Run build first.</body></html>";
            }
        }

        // Development Preamble
        if (isDev) {
            html = html.replace("<head>", `
            <head>
                <script type="module">
                    import { injectIntoGlobalHook } from "/@react-refresh"
                    injectIntoGlobalHook(window)
                    window.$RefreshReg$ = () => {}
                    window.$RefreshSig$ = () => (type) => type
                    window.__vite_plugin_react_preamble_installed__ = true
                </script>
                <script type="module" src="/@vite/client"></script>`);
        }

        // SEO Injection
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
            .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`);

        // Hydration Data
        const hydrationData: Record<string, any> = {};
        if (session) {
            const user = await db.query.users.findFirst({
                where: eq(users.id, session.id),
                columns: { id: true, name: true, role: true, permissions: true }
            });
            if (user) {
                hydrationData['["auth","me"]'] = { user };
                html = html.replace('</head>', `<script>window.__INITIAL_SESSION__ = ${JSON.stringify(user)};</script></head>`);
            }
        }

        const hydrationScript = `<script id="__QUERY_HYDRATION_DATA__" type="application/json">${JSON.stringify(hydrationData)}</script>`;
        return c.html(html.replace("</body>", `${hydrationScript}\n</body>`));

    } catch (e) {
        console.error("Critical SSR Error:", e);
        return c.html("<html><body><h1>Critical System Error</h1><p>Please try again later.</p></body></html>", 500);
    }
});

export default app;
