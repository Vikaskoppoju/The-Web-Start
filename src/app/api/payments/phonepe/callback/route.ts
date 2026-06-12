import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-helpers";
import { verifyCallbackSignature } from "@/lib/phonepe";
import { recordPayment } from "@/lib/db-dashboard";

export async function POST(req: NextRequest) {
  try {
    const xVerify = req.headers.get("x-verify") ?? "";
    const body = await req.text();
    const parsed = JSON.parse(body) as { response?: string };

    if (!parsed.response) return NextResponse.json({ message: "Missing response" }, { status: 400 });

    // Verify signature
    if (!verifyCallbackSignature(parsed.response, xVerify)) {
      console.error("PhonePe callback: invalid signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const decoded = JSON.parse(Buffer.from(parsed.response, "base64").toString("utf8"));
    const { merchantTransactionId, transactionId, amount, code } = decoded?.data ?? decoded;
    const isSuccess = (decoded.code ?? code) === "PAYMENT_SUCCESS" || decoded.success === true;

    const db = getDB();

    // Find pending transaction
    const pending = await db.prepare(
      "SELECT * FROM phonepe_transactions WHERE merchant_transaction_id=?"
    ).bind(merchantTransactionId).first<{
      id: number; invoice_id: number; client_id: number; amount: number; currency: string; status: string;
    }>();

    if (!pending) {
      console.error("PhonePe callback: unknown transaction", merchantTransactionId);
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (pending.status !== "pending") {
      // Already processed (PhonePe can retry callbacks)
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    if (isSuccess) {
      const paidAmount = amount ? amount / 100 : pending.amount;

      await recordPayment(db, {
        invoice_id: pending.invoice_id,
        client_id: pending.client_id,
        amount: paidAmount,
        method: "phonepe",
        reference_no: transactionId ?? merchantTransactionId,
        notes: `PhonePe · Txn: ${merchantTransactionId}`,
      });

      await db.prepare(`
        UPDATE phonepe_transactions
        SET status='success', phonepe_response=?, updated_at=datetime('now')
        WHERE merchant_transaction_id=?
      `).bind(JSON.stringify(decoded), merchantTransactionId).run();
    } else {
      await db.prepare(`
        UPDATE phonepe_transactions
        SET status='failed', phonepe_response=?, updated_at=datetime('now')
        WHERE merchant_transaction_id=?
      `).bind(JSON.stringify(decoded), merchantTransactionId).run();
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (e) {
    console.error("PhonePe callback error:", e);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
