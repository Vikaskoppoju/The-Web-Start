// Run: node scripts/seed-admin.mjs
// Seeds the admin user. Change email/password before running.
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL    = "info@thewebstart.in";
const ADMIN_PASSWORD = "ChangeMe123!";   // ← change this

const db = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await db.execute({
  sql:  "INSERT OR IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)",
  args: [ADMIN_EMAIL, hash],
});

console.log(`✓ Admin seeded: ${ADMIN_EMAIL}`);
console.log(`  Password: ${ADMIN_PASSWORD}`);
console.log("\nChange your password after first login!");
process.exit(0);
