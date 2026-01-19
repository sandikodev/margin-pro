
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only_change_in_prod";

export type SessionUser = {
    id: string;
    role: string;
    permissions: string[];
};

export const getSession = async (c: Context): Promise<SessionUser | null> => {
    const token = getCookie(c, "auth_token");
    if (!token) return null;

    try {
        const payload = await verify(token, JWT_SECRET, "HS256");
        return payload as SessionUser;
    } catch {
        return null;
    }
};

export const sessionMiddleware = async (c: Context, next: Next) => {
    const user = await getSession(c);

    if (user) {
        c.set('user', user);
    }

    await next();
};

export const requireAuth = async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
};

export const requireRole = (allowedRoles: string[]) => async (c: Context, next: Next) => {
    const user = c.get('user') as SessionUser;

    if (!user) { // Should be caught by requireAuth, but safety first
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Super admin bypass
    if (user.role === 'super_admin') {
        await next();
        return;
    }

    if (!allowedRoles.includes(user.role)) {
        return c.json({ error: "Forbidden" }, 403);
    }

    await next();
};
