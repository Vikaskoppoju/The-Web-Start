import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-helpers";
import { getPaymentStatus } from "@/lib/phonepe";
import { recordPayment } from "@/lib/db-dashboard";

export async function GET(req: NextRequest) {
  const txid = req.nextUrl.searchParams.get("txid") ?? "";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewebstart.in").replace(/\/$/, "");

  try {
    const db = getDB();

    const pending = await db.prepare(
      "SELECT * FROM phonepe_transactions WHERE merchant_transaction_id=?"
    ).bind(txid).first<{
      invoice_id: number; client_id: number; amount: number; currency: string; status: string;
    }>();

    if (!pending) {
      return NextResponse.redirect(`${siteUrl}/dashboard/invoices?payment=error`);
    }

    const invoiceId = pending.invoice_id;

    // If callback already processed this, just redirect
    if (pending.status === "success") {
      return NextResponse.redirect(`${siteUrl}/dashboard/invoices/${invoiceId}?payment=success`);
    }
    if (pending.status === "failed") {
      return NextResponse.redirect(`${siteUrl}/dashboard/invoices/${invoiceId}?payment=failed`);
    }

    // Fallback: check status directly from PhonePe
    const status = await getPaymentStatus(txid);

    if (status.success && status.data?.state === "COMPLETED") {
      if (pending.status === "pending") {
        await recordPayment(db, {
          invoice_id: invoiceId,
          client_id: pending.client_id,
          amount: (status.data.amount ?? pending.amount * 100) / 100,
          method: "phonepe",
          reference_no: status.data.transactionId ?? txid,
          notes: `PhonePe · Txn: ${txid}`,
        });
        await db.prepare("UPDATE phonepe_transactions SET status='success',updated_at=datetime('now') WHERE merchant_transaction_id=?")
          .bind(txid).run();
      }
      return NextResponse.redirect(`${siteUrl}/dashboard/invoices/${invoiceId}?payment=success`);
    }

    await db.prepare("UPDATE phonepe_transactions SET status='failed',updated_at=datetime('now') WHERE merchant_transaction_id=?")
      .bind(txid).run();
    return NextResponse.redirect(`${siteUrl}/dashboard/invoices/${invoiceId}?payment=failed`);
  } catch (e) {
    console.error("PhonePe redirect error:", e);
    return NextResponse.redirect(`${siteUrl}/dashboard/invoices?payment=error`);
  }
}
