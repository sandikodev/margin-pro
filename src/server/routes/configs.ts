
import { Hono } from "hono";
import { db } from "../db/index";
import { systemSettings, platforms, translations } from "../db/schema";

export const configsRoutes = new Hono()
    .get("/settings", async (c) => {
        // Public settings endpoint
        const settings = await db.select().from(systemSettings);
        return c.json(Object.fromEntries(settings.map(s => [s.key, s.value])));
    })
    .get("/", async (c) => {
        const [settings, allPlatforms, allTranslations] = await Promise.all([
            db.select().from(systemSettings),
            db.select().from(platforms),
            db.select().from(translations)
        ]);
        return c.json({
            settings: Object.fromEntries(settings.map(s => [s.key, s.value])),
            platforms: allPlatforms,
            translations: Object.fromEntries(allTranslations.map(t => [t.key, { umkm: t.umkmLabel, pro: t.proLabel }]))
        });
    });
