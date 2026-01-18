import { db } from "./index";
import { platforms, systemSettings, translations } from "./schema";
import { PLATFORM_DATA, TERMINOLOGY } from "../../shared/constants";

export async function seedConfigs() {
    console.log("🌱 Seeding configurations...");

    // 1. Seed Platforms
    for (const [id, config] of Object.entries(PLATFORM_DATA)) {
        await db.insert(platforms).values({
            id: id,
            name: id.replace(/_/g, ' '),
            defaultCommission: config.defaultCommission,
            defaultFixedFee: config.defaultFixedFee,
            withdrawalFee: config.withdrawalFee,
            color: config.color,
            officialTermsUrl: config.officialTermsUrl,
            category: config.category,
        }).onConflictDoUpdate({
            target: platforms.id,
            set: {
                defaultCommission: config.defaultCommission,
                defaultFixedFee: config.defaultFixedFee,
                withdrawalFee: config.withdrawalFee,
                color: config.color,
                officialTermsUrl: config.officialTermsUrl,
                category: config.category,
            }
        });
    }

    // 2. Seed System Settings (Tax)
    await db.insert(systemSettings).values({
        key: "TAX_RATE",
        value: "0.11",
        description: "Default PPN rate (11%)",
    }).onConflictDoUpdate({
        target: systemSettings.key,
        set: { value: "0.11" }
    });

    // 3. Seed Translations
    for (const [key, labels] of Object.entries(TERMINOLOGY)) {
        const typedLabels = labels as { umkm: string; pro: string };
        await db.insert(translations).values({
            key: key,
            umkmLabel: typedLabels.umkm,
            proLabel: typedLabels.pro,
        }).onConflictDoUpdate({
            target: translations.key,
            set: {
                umkmLabel: typedLabels.umkm,
                proLabel: typedLabels.pro,
            }
        });
    }

    console.log("✅ Seeding complete!");
}

seedConfigs().catch(error => {
    console.error(error);
    process.exit(1);
}).then(() => {
    process.exit(0);
});
