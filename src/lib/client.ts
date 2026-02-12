import { hc } from "hono/client";
import type { AppType } from "@server/index";

// Institutional RPC Client Factory (Zenith v1.0)
export const client = hc<AppType>('/');
export const api = client.api;
