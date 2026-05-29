// Run: node scripts/migrate.mjs
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const db = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  console.log("Running migrations...");

  const sql1 = readFileSync("./migrations/001_init.sql", "utf8");
  await db.executeMultiple(sql1);
  console.log("✓ Migration 001_init.sql done");

  const sql2 = readFileSync("./migrations/002_dashboards.sql", "utf8");
  await db.executeMultiple(sql2);
  console.log("✓ Migration 002_dashboards.sql done");

  console.log("\nDone! Your database is ready.");
  process.exit(0);
}

run().catch(e => { console.error("Migration failed:", e.message); process.exit(1); });
