import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getInvoiceById, getInvoiceItems, updateInvoiceStatus, deleteInvoice } from "@/lib/db-dashboard";
import { createNotification } from "@/lib/db-dashboard";
import { sendInvoiceEmail } from "@/lib/resend";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();
    const invoice = await getInvoiceById(db, Number(id));
    if (!invoice) return err("Not found", 404);
    const items = await getInvoiceItems(db, Number(id));
    return ok({ ...invoice, items });
  } catch { return err("Failed", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { status?: string; send_email?: boolean };
    const db = getDB();
    const invoice = await getInvoiceById(db, Number(id));
    if (!invoice) return err("Not found", 404);

    if (body.status) {
      const extra: { sent_at?: string; paid_at?: string } = {};
      if (body.status === "sent") extra.sent_at = new Date().toISOString();
      if (body.status === "paid")  extra.paid_at = new Date().toISOString();
      await updateInvoiceStatus(db, Number(id), body.status, extra);

      if (body.status === "sent" && body.send_email) {
        try {
          await sendInvoiceEmail(invoice);
          // Notify client
          await createNotification(db, {
            recipient: invoice.client_email,
            type: "invoice_sent",
            title: `Invoice ${invoice.invoice_no} Sent`,
            body: `Your invoice for ${invoice.currency} ${invoice.total.toLocaleString()} is ready.`,
            link: `/dashboard/invoices/${invoice.id}`,
            invoice_id: invoice.id,
          });
        } catch { /* email failure non-fatal */ }
      }
    }
    return ok({ message: "Updated" });
  } catch { return err("Failed", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteInvoice(getDB(), Number(id));
    return ok({ message: "Deleted" });
  } catch { return err("Failed", 500); }
}
