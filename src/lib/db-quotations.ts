import type { TursoDb as D1Database } from "./turso";
import type { Quotation, QuotationWithItems, QuotationItem, CreateQuotationPayload } from "@/types/quotation";

// ── Helpers ────────────────────────────────────────────────────────────────────

function nextQuoteNo(db: D1Database): Promise<string> {
  return db
    .prepare("SELECT quote_no FROM quotations ORDER BY id DESC LIMIT 1")
    .first<{ quote_no: string }>()
    .then((row) => {
      if (!row) return "QT-001";
      const num = parseInt(row.quote_no.replace("QT-", ""), 10);
      return `QT-${String(num + 1).padStart(3, "0")}`;
    });
}

function calcTotals(items: CreateQuotationPayload["items"], discountType: string, discountValue: number, taxPercent: number) {
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const discountAmount = discountType === "percent"
    ? subtotal * (discountValue / 100)
    : discountValue;
  const taxable = subtotal - discountAmount;
  const taxAmount = taxable * (taxPercent / 100);
  const total = taxable + taxAmount;
  return { subtotal, discountAmount, taxAmount, total };
}

// ── CRUD ───────────────────────────────────────────────────────────────────────

export async function getAllQuotations(db: D1Database): Promise<Quotation[]> {
  const { results } = await db
    .prepare("SELECT * FROM quotations ORDER BY created_at DESC")
    .all<Quotation>();
  return results ?? [];
}

export async function getQuotationItems(db: D1Database, quotationId: number): Promise<QuotationItem[]> {
  const { results } = await db
    .prepare("SELECT * FROM quotation_items WHERE quotation_id=? ORDER BY sort_order")
    .bind(quotationId).all<QuotationItem>();
  const items = results ?? [];
  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    discount_percent: Number(item.discount_percent),
    tax_percent: Number(item.tax_percent),
    amount: Number(item.amount),
  }));
}

export async function getQuotationById(db: D1Database, id: number): Promise<QuotationWithItems | null> {
  const quote = await db.prepare("SELECT * FROM quotations WHERE id=?").bind(id).first<Quotation>();
  if (!quote) return null;
  const items = await getQuotationItems(db, id);
  return { ...quote, items };
}

export async function createQuotation(db: D1Database, data: CreateQuotationPayload) {
  const quoteNo = await nextQuoteNo(db);
  const dt = data.discount_type ?? "percent";
  const dv = data.discount_value ?? 0;
  const tp = data.tax_percent ?? 18;
  const { subtotal, discountAmount, taxAmount, total } = calcTotals(data.items, dt, dv, tp);

  const result = await db.prepare(`
    INSERT INTO quotations
      (quote_no,client_id,client_name,client_email,client_phone,client_company,client_address,
       title,valid_until,currency,subtotal,discount_type,discount_value,discount_amount,
       tax_percent,tax_amount,total,terms,notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    quoteNo, data.client_id ?? null, data.client_name,
    data.client_email ?? null, data.client_phone ?? null,
    data.client_company ?? null, data.client_address ?? null,
    data.title ?? "Quotation", data.valid_until ?? null, data.currency ?? "INR",
    subtotal, dt, dv, discountAmount, tp, taxAmount, total,
    data.terms ?? null, data.notes ?? null,
  ).run();

  const id = Number((result as unknown as { meta: { lastInsertRowid: number } }).meta.lastInsertRowid);

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    await db.prepare(`
      INSERT INTO quotation_items
        (quotation_id,sort_order,service,description,quantity,unit,unit_price,discount_percent,tax_percent,amount)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `).bind(id, i, item.service, item.description ?? null, item.quantity, item.unit,
      item.unit_price, item.discount_percent, item.tax_percent, item.amount).run();
  }

  return { id, quoteNo };
}

export async function updateQuotationStatus(db: D1Database, id: number, status: string) {
  const tsField: Record<string, string> = {
    sent: "sent_at=datetime('now'),",
    accepted: "accepted_at=datetime('now'),",
    rejected: "rejected_at=datetime('now'),",
  };
  const extra = tsField[status] ?? "";
  return db.prepare(
    `UPDATE quotations SET status=?,${extra}updated_at=datetime('now') WHERE id=?`
  ).bind(status, id).run();
}

export async function updateQuotation(db: D1Database, id: number, data: CreateQuotationPayload) {
  const dt = data.discount_type ?? "percent";
  const dv = data.discount_value ?? 0;
  const tp = data.tax_percent ?? 18;
  const { subtotal, discountAmount, taxAmount, total } = calcTotals(data.items, dt, dv, tp);

  await db.prepare(`
    UPDATE quotations SET
      client_id=?,client_name=?,client_email=?,client_phone=?,client_company=?,client_address=?,
      title=?,valid_until=?,currency=?,subtotal=?,discount_type=?,discount_value=?,discount_amount=?,
      tax_percent=?,tax_amount=?,total=?,terms=?,notes=?,updated_at=datetime('now')
    WHERE id=?
  `).bind(
    data.client_id ?? null, data.client_name,
    data.client_email ?? null, data.client_phone ?? null,
    data.client_company ?? null, data.client_address ?? null,
    data.title ?? "Quotation", data.valid_until ?? null, data.currency ?? "INR",
    subtotal, dt, dv, discountAmount, tp, taxAmount, total,
    data.terms ?? null, data.notes ?? null, id,
  ).run();

  await db.prepare("DELETE FROM quotation_items WHERE quotation_id=?").bind(id).run();
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    await db.prepare(`
      INSERT INTO quotation_items
        (quotation_id,sort_order,service,description,quantity,unit,unit_price,discount_percent,tax_percent,amount)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `).bind(id, i, item.service, item.description ?? null, item.quantity, item.unit,
      item.unit_price, item.discount_percent, item.tax_percent, item.amount).run();
  }
}

export async function deleteQuotation(db: D1Database, id: number) {
  return db.prepare("DELETE FROM quotations WHERE id=?").bind(id).run();
}

export async function markConvertedToInvoice(db: D1Database, quotationId: number, invoiceId: number) {
  return db.prepare(
    "UPDATE quotations SET converted_invoice_id=?,status='accepted',updated_at=datetime('now') WHERE id=?"
  ).bind(invoiceId, quotationId).run();
}
