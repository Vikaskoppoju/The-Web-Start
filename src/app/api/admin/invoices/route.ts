import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAllInvoices, createInvoice } from "@/lib/db-dashboard";
import { createNotification } from "@/lib/db-dashboard";
import { z } from "zod";


const itemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().positive(),
  amount: z.number(),
});

const schema = z.object({
  client_id:  z.number().int().positive(),
  project_id: z.number().int().positive().optional(),
  due_date:   z.string(),
  tax_rate:   z.number().min(0).max(100).optional().default(18),
  discount:   z.number().min(0).optional().default(0),
  notes:      z.string().max(1000).optional(),
  terms:      z.string().max(1000).optional(),
  currency:   z.string().max(3).optional().default("INR"),
  items:      z.array(itemSchema).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const clientId = url.searchParams.get("client_id") ? Number(url.searchParams.get("client_id")) : undefined;
    const invoices = await getAllInvoices(getDB(), { status, clientId });
    return ok(invoices);
  } catch { return err("Failed", 500); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);

    const { items, tax_rate, discount, ...rest } = parsed.data;
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const taxAmount = (subtotal - discount) * (tax_rate / 100);
    const total = subtotal - discount + taxAmount;

    const db = getDB();
    const result = await createInvoice(db, { ...rest, tax_rate, discount, subtotal, tax_amount: taxAmount, total }, items);

    // Notify admin
    await createNotification(db, {
      recipient: "admin",
      type: "invoice_sent",
      title: "New Invoice Created",
      body: `Invoice ${result.invoiceNo} created for client.`,
      link: `/admin/invoices`,
    });

    return ok({ message: "Invoice created", invoiceNo: result.invoiceNo }, 201);
  } catch { return err("Failed to create invoice", 500); }
}
