
import { Context, Next } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// Mock Session for now (replace with efficient JWT/Session later)
export const requireAuth = async (c: Context, next: Next) => {
    // In a real app, verify JWT or Cookie
    const authHeader = c.req.header("Authorization");
    // For demo/prototype, we might trust a header or skip
    // BUT since we are building "The System", let's be strict-ish.

    // TEMPORARY: If we are in DEMO mode / dev, we might mock.
    // Let's assume the client sends a dummy "Authorization: Bearer <USER_ID>" for now

    if (!authHeader) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // ... verification logic ...
    await next();
};

export const requireRole = (allowedRoles: string[]) => async (c: Context, next: Next) => {
    // 1. Get User ID from Context (set by requireAuth)
    // For this prototype, let's assume we fetch user here based on header 'x-user-id' 
    // strictly for ease of development without full JWT plumbing yet.

    const userId = c.req.header("x-user-id");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) return c.json({ error: "User not found" }, 404);

    if (!allowedRoles.includes(user.role || 'user')) {
        return c.json({ error: "Forbidden: Insufficient Role" }, 403);
    }

    c.set('user', user); // Pass user to next handler
    await next();
};

export const requirePermission = (permission: string) => async (c: Context, next: Next) => {
    const user = c.get('user'); // Assumes requireRole (or auth) ran first

    // Super Admin bypass
    if (user?.role === 'super_admin') {
        await next();
        return;
    }

    const permissions = user?.permissions || [];
    if (!permissions.includes(permission)) {
        return c.json({ error: `Forbidden: Missing permission '${permission}'` }, 403);
    }

    await next();
};
