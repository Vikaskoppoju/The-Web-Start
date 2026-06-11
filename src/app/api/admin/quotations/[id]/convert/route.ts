import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getQuotationById, markConvertedToInvoice } from "@/lib/db-quotations";
import { createInvoice, getClientByEmail } from "@/lib/db-dashboard";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();
    const quote = await getQuotationById(db, Number(id));
    if (!quote) return err("Quotation not found", 404);
    if (quote.converted_invoice_id) return err("Already converted to an invoice", 400);

    let clientId = quote.client_id;
    if (!clientId && quote.client_email) {
      const existingClient = await getClientByEmail(db, quote.client_email);
      if (existingClient) {
        clientId = existingClient.id;
        await db.prepare("UPDATE quotations SET client_id=? WHERE id=?").bind(clientId, Number(id)).run();
      }
    }

    if (!clientId) return err("Quotation must be linked to an existing client to convert", 400);

    // Map quotation items → invoice items
    const items = quote.items.map((qi) => ({
      description: qi.description ? `${qi.service}\n${qi.description}` : qi.service,
      quantity: qi.quantity,
      unit_price: qi.unit_price,
      amount: qi.amount,
    }));

    const result = await createInvoice(db, {
      client_id: clientId,
      due_date: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
      currency: quote.currency,
      subtotal: quote.subtotal,
      tax_rate: quote.tax_percent,
      tax_amount: quote.tax_amount,
      discount: quote.discount_amount,
      total: quote.total,
      notes: quote.notes ?? undefined,
      terms: quote.terms ?? undefined,
    }, items);

    // Get the new invoice id via its invoice_no
    const newInv = await db.prepare("SELECT id FROM invoices WHERE invoice_no=?").bind(result.invoiceNo).first<{ id: number }>();
    if (!newInv) throw new Error("Invoice created but could not retrieve its id");

    await markConvertedToInvoice(db, Number(id), newInv.id);

    return ok({ message: "Converted to invoice", invoiceNo: result.invoiceNo });
  } catch (e) {
    return err((e as Error).message ?? "Failed to convert", 500);
  }
}
