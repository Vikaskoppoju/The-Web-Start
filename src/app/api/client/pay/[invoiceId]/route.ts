import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getInvoiceById } from "@/lib/db-dashboard";
import { getRazorpay } from "@/lib/razorpay-server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
  try {
    const { invoiceId } = await params;
    const clientId = Number(req.headers.get("x-client-id"));
    const db       = getDB();

    const invoice = await getInvoiceById(db, Number(invoiceId));
    if (!invoice)                          return err("Invoice not found", 404);
    if (invoice.client_id !== clientId)    return err("Forbidden", 403);

    const balance = invoice.total - invoice.amount_paid;
    if (balance <= 0)                      return err("Invoice is already fully paid", 400);
    if (["paid", "cancelled"].includes(invoice.status)) return err("Invoice cannot be paid", 400);

    const rz    = getRazorpay();
    const order = await rz.orders.create({
      amount:   Math.round(balance * 100), // paise
      currency: invoice.currency ?? "INR",
      receipt:  `inv_${invoice.id}_${Date.now()}`,
      notes:    { invoice_no: invoice.invoice_no, client_id: String(clientId) },
    });

    // Track the order
    await db.prepare(`
      INSERT INTO razorpay_orders (razorpay_order_id, invoice_id, client_id, amount, currency)
      VALUES (?, ?, ?, ?, ?)
    `).bind(order.id, invoice.id, clientId, balance, invoice.currency ?? "INR").run();

    return ok({
      orderId:    order.id,
      amount:     order.amount,
      currency:   order.currency,
      keyId:      process.env.RAZORPAY_KEY_ID,
      invoiceNo:  invoice.invoice_no,
    });
  } catch (e) {
    console.error("Razorpay order error:", e);
    return err("Failed to create payment order", 500);
  }
}
