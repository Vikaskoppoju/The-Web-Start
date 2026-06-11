import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAllQuotations, createQuotation } from "@/lib/db-quotations";
import { z } from "zod";

const itemSchema = z.object({
  service:          z.string().min(1),
  description:      z.string().optional().nullable(),
  quantity:         z.number().positive(),
  unit:             z.string().default("project"),
  unit_price:       z.number().min(0),
  discount_percent: z.number().min(0).max(100).default(0),
  tax_percent:      z.number().min(0).max(100).default(0),
  amount:           z.number().min(0),
});

const schema = z.object({
  client_id:      z.number().int().positive().optional().nullable(),
  client_name:    z.string().min(1),
  client_email:   z.string().email().optional().nullable(),
  client_phone:   z.string().optional().nullable(),
  client_company: z.string().optional().nullable(),
  client_address: z.string().optional().nullable(),
  title:          z.string().default("Quotation"),
  valid_until:    z.string().optional().nullable(),
  currency:       z.string().max(3).default("INR"),
  discount_type:  z.enum(["percent", "fixed"]).default("percent"),
  discount_value: z.number().min(0).default(0),
  tax_percent:    z.number().min(0).max(100).default(18),
  terms:          z.string().optional().nullable(),
  notes:          z.string().optional().nullable(),
  items:          z.array(itemSchema).min(1),
});

export async function GET() {
  try {
    return ok(await getAllQuotations(getDB()));
  } catch { return err("Failed", 500); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    const result = await createQuotation(getDB(), parsed.data);
    return ok({ message: "Quotation created", id: result.id, quoteNo: result.quoteNo }, 201);
  } catch (error) {
    console.error("Quotation creation failed:", error);
    return err("Failed to create quotation", 500);
  }
}
