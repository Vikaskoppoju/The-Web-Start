"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, XCircle, Loader2, CreditCard, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { InvoiceWithClient, InvoiceItem, Payment } from "@/types/dashboard";

// ── Payment status banner ──────────────────────────────────────────────────────
function PaymentBanner() {
  const params = useSearchParams();
  const status = params.get("payment");
  if (!status) return null;

  if (status === "success") return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mb-6">
      <CheckCircle className="w-5 h-5 flex-shrink-0" />
      <div>
        <div className="font-semibold text-sm">Payment Successful</div>
        <div className="text-xs text-emerald-400/80 mt-0.5">Your payment has been recorded. Invoice status has been updated.</div>
      </div>
    </div>
  );

  if (status === "failed") return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 mb-6">
      <XCircle className="w-5 h-5 flex-shrink-0" />
      <div>
        <div className="font-semibold text-sm">Payment Failed</div>
        <div className="text-xs text-red-400/80 mt-0.5">Your payment was not completed. Please try again.</div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 mb-6">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <div className="font-semibold text-sm">Payment status unknown. Please check back shortly.</div>
    </div>
  );
}

// ── Razorpay loader ────────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
    const s  = document.createElement("script");
    s.src    = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ── Pay Now button ─────────────────────────────────────────────────────────────
function PayNowButton({
  invoiceId, invoiceNo, balance, currency, clientEmail,
  onSuccess,
}: {
  invoiceId: string; invoiceNo: string; balance: number; currency: string;
  clientEmail?: string; onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  if (balance <= 0) return null;

  const handlePay = async () => {
    setLoading(true); setError("");
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { setError("Could not load payment gateway. Check your connection."); return; }

      const res  = await fetch(`/api/client/pay/${invoiceId}`, { method: "POST" });
      const data = await res.json();
      if (!data.success) { setError(data.error ?? "Failed to create order"); return; }

      const { orderId, amount, currency: cur, keyId, invoiceNo: invNo } = data.data;

      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency:    cur,
        order_id:    orderId,
        name:        "The Web Start",
        description: `Invoice ${invNo ?? invoiceNo}`,
        image:       "/icon.svg",
        prefill:     { email: clientEmail ?? "" },
        theme:       { color: "#7c3aed" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes  = await fetch("/api/payments/razorpay/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ ...response, invoiceId: Number(invoiceId) }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess();
          } else {
            setError(verifyData.error ?? "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", (resp: { error: { description: string } }) => {
        setError(resp.error?.description ?? "Payment failed");
        setLoading(false);
      });

      rzp.open();
    } catch { setError("Something went wrong. Try again."); setLoading(false); }
  };

  return (
    <div className="space-y-2">
      <button onClick={handlePay} disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm text-white transition-all disabled:opacity-60"
        style={{ background: loading ? "#4b2d8f" : "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening payment…</>
          : <><CreditCard className="w-4 h-4" /> Pay {currency} {balance.toLocaleString()}</>}
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
function InvoiceDetailContent() {
  const params    = useParams();
  const invoiceId = typeof params?.id === "string" ? params.id : undefined;
  const [invoice, setInvoice]  = useState<(InvoiceWithClient & { items: InvoiceItem[]; payments: Payment[] }) | null>(null);
  const [loading, setLoading]  = useState(true);

  const [paid, setPaid] = useState(false);

  const load = useCallback(async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const res     = await fetch(`/api/client/invoices/${invoiceId}`);
      const payload = await res.json();
      if (payload.success) setInvoice(payload.data);
    } finally { setLoading(false); }
  }, [invoiceId]);

  useEffect(() => { load(); }, [load]);

  const balance = invoice ? invoice.total - invoice.amount_paid : 0;
  const canPay  = invoice && !["paid", "cancelled", "draft"].includes(invoice.status) && balance > 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Invoice details</h1>
          <p className="text-gray-500 text-sm">Review items, payment status and payment history.</p>
        </div>
        <Link href="/dashboard/invoices"
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
          ← Back to invoices
        </Link>
      </div>

      <Suspense fallback={null}><PaymentBanner /></Suspense>

      <div className="glass rounded-3xl border border-white/10 p-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading invoice details…</div>
        ) : !invoice ? (
          <div className="py-20 text-center text-gray-400">Invoice not found.</div>
        ) : (
          <div className="space-y-8">
            {/* Header row */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-purple-300">{invoice.invoice_no}</span>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="text-gray-400 text-sm">{invoice.project_title ?? "General invoice"}</div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ["Issue date",  new Date(invoice.issue_date).toLocaleDateString()],
                    ["Due date",    new Date(invoice.due_date).toLocaleDateString()],
                    ["Balance",     `${invoice.currency} ${balance.toLocaleString()}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl bg-slate-950/70 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</div>
                      <div className="mt-2 font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>
                {/* Pay Now */}
                {canPay && invoiceId && !paid && (
                  <PayNowButton
                    invoiceId={invoiceId}
                    invoiceNo={invoice.invoice_no}
                    balance={balance}
                    currency={invoice.currency}
                    onSuccess={() => { setPaid(true); load(); }}
                  />
                )}
                {paid && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" /> Payment successful!
                  </div>
                )}
              </div>

              {/* Totals card */}
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <div className="text-sm text-gray-400">Total invoice</div>
                <div className="mt-2 text-3xl font-bold text-white">
                  {invoice.currency} {invoice.total.toLocaleString()}
                </div>
                <div className="mt-4 grid gap-2 text-sm text-gray-400">
                  {[
                    ["Subtotal", invoice.subtotal],
                    ["Tax",      invoice.tax_amount],
                    ["Discount", invoice.discount],
                  ].map(([label, value], i, arr) => (
                    <div key={String(label)}
                      className={`flex items-center justify-between pb-2 ${i < arr.length - 1 ? "border-b border-white/10" : ""}`}>
                      <span>{label}</span>
                      <span>{invoice.currency} {Number(value).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {invoice.amount_paid > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-sm text-emerald-400">
                    <span>Amount paid</span>
                    <span>{invoice.currency} {invoice.amount_paid.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Line items */}
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
                        <td className="px-4 py-4 text-right text-gray-300">
                          {invoice.currency} {item.unit_price.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-white">
                          {invoice.currency} {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment history */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Payment history</h2>
                  <p className="text-sm text-gray-400">Payments recorded against this invoice.</p>
                </div>
                <div className="text-sm text-gray-400">
                  {invoice.payments.length} payment{invoice.payments.length === 1 ? "" : "s"}
                </div>
              </div>
              {invoice.payments.length ? (
                <div className="space-y-4">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white capitalize">
                            {payment.method === "razorpay" ? "Razorpay" : payment.method.replace(/_/g, " ")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Status</div>
                          <div className="text-sm font-semibold text-white capitalize">{payment.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 uppercase tracking-wider">Amount</div>
                          <div className="text-lg font-semibold text-emerald-300">
                            {payment.currency} {payment.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {payment.reference_no && (
                        <div className="mt-3 text-xs text-gray-500">Ref: {payment.reference_no}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-6 text-center text-sm text-gray-400">
                  No payments recorded yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardInvoiceDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400 text-center">Loading…</div>}>
      <InvoiceDetailContent />
    </Suspense>
  );
}
