
import { z } from "zod";

const envSchema = z.object({
    // Database
    TURSO_DATABASE_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string().min(1),

    // App Secrets
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),

    // AI
    GEMINI_API_KEY: z.string().optional(),

    // Payments
    MIDTRANS_SERVER_KEY: z.string().optional(),

    // Environment
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(8000),
});

// Process and validate
const processEnv = {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    const errorMsg = "❌ Invalid environment variables: " + JSON.stringify(parsed.error.format(), null, 4);
    console.error(errorMsg);
    if (!process.env.VERCEL) {
        process.exit(1);
    } else {
        throw new Error(errorMsg);
    }
}

export const env = parsed.data;
