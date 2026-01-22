import { koda } from "@koda/core";

const app = koda();

app.get("/api/health", (c) => c.json({ status: "zenith", message: "Koda Engine Operational" }));

console.log("🚀 Zenith Synthesis active on http://localhost:3000");

export default {
  port: 3000,
  fetch: app.fetch,
};
