
import { type Context } from "hono";
import { env } from "../../lib/koda-zenith";

export const GET = (c: Context) => {
    return c.json({
        ok: true,
        runtime: env.runtime,
        framework: "Koda FS-Router v1",
        msg: "This route was loaded via file system!"
    });
};
