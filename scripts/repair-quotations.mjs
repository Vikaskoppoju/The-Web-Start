import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) throw new Error("TURSO_DATABASE_URL is not set");

const db = createClient({ url, authToken });

function rowsToObjects(result) {
  const columns = result.columns ?? [];
  return (result.rows ?? []).map((row) => {
    const obj = {};
    for (let i = 0; i < columns.length; i += 1) {
      obj[columns[i]] = row[i];
    }
    return obj;
  });
}

async function getQuotes() {
  const result = await db.execute({
    sql: `SELECT id, quote_no, subtotal, discount_amount, tax_percent, tax_amount, total FROM quotations ORDER BY id`,
  });
  return rowsToObjects(result);
}

async function getItemCount(quotationId) {
  const result = await db.execute({
    sql: `SELECT id FROM quotation_items WHERE quotation_id = ?`,
    args: [quotationId],
  });
  return (result.rows ?? []).length;
}

async function insertPlaceholderItem(quote, sortOrder) {
  const amount = Number(quote.subtotal ?? quote.total ?? 0) || Number(quote.total ?? 0);
  const description = `Original quotation line items were not available when this quote was created. Totals are preserved.`;
  await db.execute({
    sql: `INSERT INTO quotation_items
      (quotation_id, sort_order, service, description, quantity, unit, unit_price, discount_percent, tax_percent, amount)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
    args: [
      quote.id,
      sortOrder,
      "Restored quote item",
      description,
      1,
      "project",
      amount,
      0,
      Number(quote.tax_percent ?? 0),
      amount,
    ],
  });
}

async function run() {
  console.log("Scanning quotations for missing line items...");
  const quotes = await getQuotes();
  const missing = [];

  for (const quote of quotes) {
    const count = await getItemCount(quote.id);
    if (count === 0) {
      missing.push({ ...quote, itemCount: count });
    }
  }

  console.log(`Found ${missing.length} quotation(s) with no line items.`);
  if (!missing.length) {
    process.exit(0);
  }

  missing.forEach((quote) => {
    console.log(`- ${quote.quote_no} (#${quote.id}) subtotal=${quote.subtotal} total=${quote.total}`);
  });

  const fix = process.argv.includes("--fix") || process.argv.includes("--repair");
  if (!fix) {
    console.log("\nRun this script again with `--fix` or `--repair` to insert placeholder items for these quotations.");
    process.exit(0);
  }

  console.log("\nInserting placeholder items for missing quotations...");
  for (const quote of missing) {
    await insertPlaceholderItem(quote, 0);
    console.log(`Repaired quotation ${quote.quote_no} (#${quote.id}).`);
  }

  console.log("\nDone. Preview and PDF should now show a placeholder line item for repaired quotations.");
}

run().catch((error) => {
  console.error("Repair script failed:", error);
  process.exit(1);
});
