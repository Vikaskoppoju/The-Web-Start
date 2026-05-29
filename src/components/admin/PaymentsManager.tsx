"use client";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import type { PaymentWithDetails } from "@/types/dashboard";

export function PaymentsManager() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments").then(r => r.json())
      .then(d => { if (d.success) setPayments(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);

  const columns = [
    { key: "invoice_no", header: "Invoice", render: (p: PaymentWithDetails) => <span className="text-purple-400 font-mono text-sm">{p.invoice_no}</span> },
    { key: "client_name", header: "Client", sortable: true, render: (p: PaymentWithDetails) => <span className="text-white text-sm">{p.client_name}</span> },
    { key: "amount", header: "Amount", sortable: true, render: (p: PaymentWithDetails) => <span className="text-emerald-400 font-semibold text-sm">{p.currency} {p.amount.toLocaleString()}</span> },
    { key: "method", header: "Method", render: (p: PaymentWithDetails) => <span className="text-gray-400 text-xs capitalize">{p.method.replace(/_/g," ")}</span> },
    { key: "reference_no", header: "Reference", render: (p: PaymentWithDetails) => <span className="text-gray-500 text-xs font-mono">{p.reference_no ?? "—"}</span> },
    { key: "status", header: "Status", render: (p: PaymentWithDetails) => <StatusBadge status={p.status} /> },
    { key: "payment_date", header: "Date", sortable: true, render: (p: PaymentWithDetails) => <span className="text-gray-500 text-xs">{new Date(p.payment_date).toLocaleDateString()}</span> },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Payments</h1>
          <p className="text-gray-500 text-sm">Total collected: <span className="text-emerald-400 font-semibold">₹{totalRevenue.toLocaleString()}</span></p>
        </div>
        <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-400" />
          <span className="text-white text-sm font-semibold">{payments.length} transactions</span>
        </div>
      </div>
      <div className="glass rounded-2xl border border-white/[0.07] p-5">
        <DataTable data={payments} columns={columns}
          searchKeys={["client_name","invoice_no","reference_no"]} loading={loading} emptyMessage="No payments recorded yet." />
      </div>
    </div>
  );
}
