import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { verifyPaymentSignature } from "@/lib/razorpay-server";
import { recordPayment } from "@/lib/db-dashboard";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
    } = await req.json() as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      invoiceId: number;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return err("Missing payment fields", 400);
    }

    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return err("Invalid payment signature", 400);
    }

    const db = getDB();

    const order = await db.prepare(
      "SELECT * FROM razorpay_orders WHERE razorpay_order_id=?"
    ).bind(razorpay_order_id).first<{
      invoice_id: number; client_id: number; amount: number; currency: string; status: string;
    }>();

    if (!order)                   return err("Order not found", 404);
    if (order.status === "paid")  return ok({ message: "Already recorded" });

    await recordPayment(db, {
      invoice_id:   order.invoice_id,
      client_id:    order.client_id,
      amount:       order.amount,
      method:       "razorpay",
      reference_no: razorpay_payment_id,
      notes:        `Razorpay · Order: ${razorpay_order_id}`,
    });

    await db.prepare(`
      UPDATE razorpay_orders
      SET status='paid', razorpay_payment_id=?, updated_at=datetime('now')
      WHERE razorpay_order_id=?
    `).bind(razorpay_payment_id, razorpay_order_id).run();

    return ok({ message: "Payment recorded" });
  } catch (e) {
    console.error("Razorpay verify error:", e);
    return err("Payment verification failed", 500);
  }
}
