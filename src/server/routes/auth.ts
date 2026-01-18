
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const auth = new Hono()
    .post("/login", zValidator("json", z.object({
        email: z.string().email(),
        password: z.string()
    })), async (c) => {
        const { email } = c.req.valid("json");
        // TODO: Verify password hash
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return c.json({ error: "Invalid credentials" }, 401);

        // In real app: Sign JWT
        return c.json({ user: { id: user.id, name: user.name, email: user.email } });
    });
