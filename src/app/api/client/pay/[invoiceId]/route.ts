import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getInvoiceById } from "@/lib/db-dashboard";
import { initiatePayment, MERCHANT_ID } from "@/lib/phonepe";
import { randomBytes } from "crypto";

function getClientId(req: NextRequest) {
  return Number(req.headers.get("x-client-id"));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ invoiceId: string }> }) {
  try {
    const { invoiceId } = await params;
    const clientId = getClientId(req);
    const db = getDB();

    const invoice = await getInvoiceById(db, Number(invoiceId));
    if (!invoice) return err("Invoice not found", 404);
    if (invoice.client_id !== clientId) return err("Forbidden", 403);

    const balance = invoice.total - invoice.amount_paid;
    if (balance <= 0) return err("Invoice is already fully paid", 400);
    if (["paid", "cancelled"].includes(invoice.status)) return err("Invoice cannot be paid", 400);

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewebstart.in").replace(/\/$/, "");
    const merchantTransactionId = `TWS-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`;
    const amountPaise = Math.round(balance * 100);

    // Store pending transaction
    await db.prepare(`
      INSERT INTO phonepe_transactions (merchant_transaction_id, invoice_id, client_id, amount, currency)
      VALUES (?, ?, ?, ?, ?)
    `).bind(merchantTransactionId, invoice.id, clientId, balance, invoice.currency).run();

    const response = await initiatePayment({
      merchantTransactionId,
      merchantUserId: `CLIENT-${clientId}`,
      amountPaise,
      redirectUrl: `${siteUrl}/api/payments/phonepe/redirect?txid=${merchantTransactionId}`,
      callbackUrl: `${siteUrl}/api/payments/phonepe/callback`,
    });

    if (!response.success || !response.data?.instrumentResponse?.redirectInfo?.url) {
      await db.prepare("UPDATE phonepe_transactions SET status='failed' WHERE merchant_transaction_id=?")
        .bind(merchantTransactionId).run();
      return err(response.message ?? "Payment initiation failed", 502);
    }

    return ok({ redirectUrl: response.data.instrumentResponse.redirectInfo.url });
  } catch (e) {
    console.error("PhonePe initiate error:", e);
    return err("Failed to initiate payment", 500);
  }
}
