import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getInvoiceById, recordPayment, createNotification } from "@/lib/db-dashboard";
import { z } from "zod";


const schema = z.object({
  amount:       z.number().positive(),
  method:       z.string().min(1),
  reference_no: z.string().max(100).optional(),
  payment_date: z.string().optional(),
  notes:        z.string().max(500).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);

    const db = getDB();
    const invoice = await getInvoiceById(db, Number(id));
    if (!invoice) return err("Invoice not found", 404);

    await recordPayment(db, { invoice_id: Number(id), client_id: invoice.client_id, ...parsed.data });

    // Notify client
    await createNotification(db, {
      recipient: invoice.client_email,
      type: "payment_received",
      title: "Payment Recorded",
      body: `Payment of ${invoice.currency} ${parsed.data.amount.toLocaleString()} received for ${invoice.invoice_no}.`,
      link: `/dashboard/invoices/${invoice.id}`,
      invoice_id: invoice.id,
    });

    return ok({ message: "Payment recorded" }, 201);
  } catch { return err("Failed to record payment", 500); }
}
