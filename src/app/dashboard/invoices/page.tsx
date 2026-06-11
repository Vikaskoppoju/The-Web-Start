"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { InvoiceWithClient } from "@/types/dashboard";

export default function DashboardInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/client/invoices");
        const payload = await res.json();
        if (payload.success) {
          setInvoices(payload.data);
        }
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Invoices</h1>
          <p className="text-gray-500 text-sm">Track all invoices sent to your account and view payment details.</p>
        </div>
        <div className="text-right text-sm text-gray-400">{loading ? "Loading invoices..." : `${invoices.length} invoice${invoices.length === 1 ? "" : "s"}`}</div>
      </div>

      <div className="glass rounded-3xl border border-white/10 p-5">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading invoices…</div>
        ) : !invoices.length ? (
          <div className="py-20 text-center text-gray-400">No invoices found yet.</div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left">
              <thead className="bg-slate-950/40 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Invoice</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Paid</th>
                  <th className="px-4 py-4">Due</th>
                  <th className="px-4 py-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-mono text-sm text-white">{invoice.invoice_no}</div>
                      <div className="text-xs text-gray-500">{invoice.project_title ?? "General invoice"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-white">{invoice.currency} {invoice.total.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-emerald-300">{invoice.currency} {invoice.amount_paid.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-400">{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10">
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
