/**
 * 📈 Margins Pro: Professional SaaS Application
 * Project Ownership: PT Koneksi Jaringan Indonesia
 * Engineering Team: Kopikonfig
 * Architecture: Powered by Koda Zenith (Refactored)
 */
import "./config/env";
import { koda } from "@framework";
import { getSession } from "./middleware/session";
import { requestLogger } from "./middleware/security";
import { renderStream } from "./core/ssr"; // 🏔️ Zenith SSR Engine
import { apiApp } from "./core/api"; // 🛰️ API Registry

const app = koda();

// 1. Foundation & Diagnostics
app.use("*", koda.cors());
app.use("*", requestLogger);

// 2. Koda Security Posture (Institutional Hardening)
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

// 3. API Bridge
app.route("/", apiApp);

// 4. Zenith Orchestration (The Synthesis)
// This single middleware handles Static Assets, SEO, Auth redirection, and SSR.
console.log("[DEBUG] Bun availability:", !!(globalThis as any).Bun);
app.use("*", koda.zenith({
    seo: {
        title: "Margin Pro - Intelligence Pricing System",
        description: "Hitung profit margin, simulasi harga, dan atur keuangan bisnis kuliner & retail anda.",
        baseUrl: "https://marginspro.com", // Fallback, will be overridden by request context
        defaultOGImage: "https://placehold.co/1200x630/4f46e5/white?text=Margin+Pro"
    },
    auth: {
        protectedPaths: ["/app", "/system"],
        redirectPath: "/auth",
        getSession
    },
    ssr: renderStream
}));

export type { AppType } from "./core/api";
export default koda.serve(app);
