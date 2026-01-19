import { hc } from "hono/client";
import type { AppType } from '../../server';

// In development, Vite proxies /api to the backend.
// In production, the backend serves the frontend, so the origin is same.
export const client = hc<AppType>('/');

// Casting to any to allow deep RPC calls without hitting TS inference limits
export const api = client.api as any;
