import { hc } from "hono/client";
import type { AppType } from '@server/index';

// In development, Vite proxies /api to the backend.
// In production, the backend serves the frontend, so the origin is same.
const client = hc<AppType>('/');

export const api = client.api;
