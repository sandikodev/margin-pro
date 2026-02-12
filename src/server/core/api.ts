import { Hono } from "hono";
import { authRoutes } from "../routes/auth";
import { businessesRoutes } from "../routes/businesses";
import { projectsRoutes } from "../routes/projects";
import { configsRoutes } from "../routes/configs";
import { adminRoutes } from "../routes/admin";
import { paymentsRoutes } from "../routes/payment";
import { financeRoutes } from "../routes/finance";
import { marketplaceRoutes } from "../routes/marketplace";

/**
 * 🛰️ Zenith API Registry
 * Dedicated file for RPC route definitions to break circular dependencies.
 */
export const apiApp = new Hono()
    .basePath("/api")
    .get("/health", (c) => c.json({ status: "ok", runtime: "bun" }))
    .route("/auth", authRoutes)
    .route("/businesses", businessesRoutes)
    .route("/projects", projectsRoutes)
    .route("/finance", financeRoutes)
    .route("/marketplace", marketplaceRoutes)
    .route("/configs", configsRoutes)
    .route("/admin", adminRoutes)
    .route("/midtrans", paymentsRoutes);

export type AppType = typeof apiApp;
