import { NextRequest } from "next/server";
import { getDB, ok, err, getClientId } from "@/lib/api-helpers";
import { getInvoiceById, getInvoiceItems, getInvoicePayments, updateInvoiceStatus } from "@/lib/db-dashboard";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();
    const invoice = await getInvoiceById(db, Number(id));
    if (!invoice || invoice.client_id !== getClientId(request)) return err("Not found", 404);
    // Mark as viewed
    if (invoice.status === "sent") {
      await updateInvoiceStatus(db, Number(id), "viewed");
    }
    const items = await getInvoiceItems(db, Number(id));
    const payments = await getInvoicePayments(db, Number(id));
    return ok({ ...invoice, items, payments });
  } catch { return err("Failed", 500); }
}
