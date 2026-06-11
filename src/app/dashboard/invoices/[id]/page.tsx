"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { InvoiceWithClient, InvoiceItem, Payment } from "@/types/dashboard";

export default function DashboardInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = typeof params?.id === "string" ? params.id : undefined;
  const [invoice, setInvoice] = useState<(InvoiceWithClient & { items: InvoiceItem[]; payments: Payment[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;
    const loadInvoice = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/client/invoices/${invoiceId}`);
        const payload = await res.json();
        if (payload.success) {
          setInvoice(payload.data);
        }
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [invoiceId]);

  const balance = invoice ? invoice.total - invoice.amount_paid : 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Invoice details</h1>
          <p className="text-gray-500 text-sm">Review invoice items, payment status, and payment history.</p>
        </div>
        <Link href="/dashboard/invoices" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
          Back to invoices
        </Link>
      </div>

      <div className="glass rounded-3xl border border-white/10 p-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading invoice details…</div>
        ) : !invoice ? (
          <div className="py-20 text-center text-gray-400">Invoice not found.</div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-purple-300">{invoice.invoice_no}</span>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="text-gray-400 text-sm">{invoice.project_title ?? "General invoice"}</div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-950/70 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Issue date</div>
                    <div className="mt-2 font-semibold text-white">{new Date(invoice.issue_date).toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Due date</div>
                    <div className="mt-2 font-semibold text-white">{new Date(invoice.due_date).toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Balance</div>
                    <div className="mt-2 font-semibold text-white">{invoice.currency} {balance.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <div className="text-sm text-gray-400">Total invoice</div>
                <div className="mt-2 text-3xl font-bold text-white">{invoice.currency} {invoice.total.toLocaleString()}</div>
                <div className="mt-4 grid gap-2 text-sm text-gray-400">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Subtotal</span>
                    <span>{invoice.currency} {invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Tax</span>
                    <span>{invoice.currency} {invoice.tax_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span>{invoice.currency} {invoice.discount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Invoice items</h2>
                  <p className="text-sm text-gray-400">Detailed breakdown of billed work.</p>
                </div>
                <div className="text-sm text-gray-400">{invoice.items.length} line item{invoice.items.length === 1 ? "" : "s"}</div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <table className="min-w-full text-left text-sm text-gray-300">
                  <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.18em] text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Rate</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-t border-white/10">
                        <td className="px-4 py-4">{item.description}</td>
                        <td className="px-4 py-4 text-right text-gray-300">{item.quantity}</td>
                        <td className="px-4 py-4 text-right text-gray-300">{invoice.currency} {item.unit_price.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right font-semibold text-white">{invoice.currency} {item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Payment history</h2>
                  <p className="text-sm text-gray-400">Payments recorded against this invoice.</p>
                </div>
                <div className="text-sm text-gray-400">{invoice.payments.length} payment{invoice.payments.length === 1 ? "" : "s"}</div>
              </div>
              {invoice.payments.length ? (
                <div className="space-y-4">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white capitalize">{payment.method.replace(/_/g, " ")}</div>
                          <div className="text-xs text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Status</div>
                          <div className="text-sm font-semibold text-white capitalize">{payment.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Amount</div>
                          <div className="text-lg font-semibold text-emerald-300">{payment.currency} {payment.amount.toLocaleString()}</div>
                        </div>
                      </div>
                      {payment.reference_no && <div className="mt-3 text-sm text-gray-400">Reference: {payment.reference_no}</div>}
                      {payment.notes && <div className="mt-2 text-sm text-gray-400">Notes: {payment.notes}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-6 text-center text-sm text-gray-400">No payments have been recorded yet for this invoice.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
