"use client";
import { useEffect, useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Plus, Printer, Send, Trash2, Eye, DollarSign, X } from "lucide-react";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import type { InvoiceWithClient, InvoiceItem } from "@/types/dashboard";

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi",           label: "UPI" },
  { value: "razorpay",      label: "Razorpay" },
  { value: "cash",          label: "Cash" },
  { value: "cheque",        label: "Cheque" },
];

interface LineItem { description: string; quantity: number; unit_price: number; amount: number }
const emptyLine = (): LineItem => ({ description: "", quantity: 1, unit_price: 0, amount: 0 });

export function InvoicesManager() {
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<(InvoiceWithClient & { items: InvoiceItem[] }) | null>(null);
  const [showPayment, setShowPayment] = useState<InvoiceWithClient | null>(null);
  const [deleting, setDeleting] = useState<InvoiceWithClient | null>(null);
  const [saving, setSaving] = useState(false);
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [form, setForm] = useState({ client_id: "", project_id: "", due_date: "", tax_rate: "18", discount: "0", notes: "", terms: "Payment due within 15 days of invoice date." });
  const [payForm, setPayForm] = useState({ amount: "", method: "bank_transfer", reference_no: "", payment_date: new Date().toISOString().split("T")[0] });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/invoices").then(r => r.json()),
      fetch("/api/admin/clients").then(r => r.json()),
    ]).then(([id, cd]) => {
      if (id.success) setInvoices(id.data);
      if (cd.success) setClients(cd.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const tax = (subtotal - Number(form.discount)) * (Number(form.tax_rate) / 100);
  const total = subtotal - Number(form.discount) + tax;

  const updateLine = (i: number, field: keyof LineItem, val: string) => {
    setLines(ls => ls.map((l, idx) => {
      if (idx !== i) return l;
      const updated = { ...l, [field]: field === "description" ? val : Number(val) };
      updated.amount = updated.quantity * updated.unit_price;
      return updated;
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, client_id: Number(form.client_id), project_id: form.project_id ? Number(form.project_id) : undefined,
        tax_rate: Number(form.tax_rate), discount: Number(form.discount), items: lines.filter(l => l.description) };
      const res = await fetch("/api/admin/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if ((await res.json()).success) { setShowForm(false); load(); }
    } finally { setSaving(false); }
  };

  const handleSend = async (inv: InvoiceWithClient) => {
    await fetch(`/api/admin/invoices/${inv.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "sent", send_email: true }) });
    load();
  };

  const handleView = async (inv: InvoiceWithClient) => {
    const res = await fetch(`/api/admin/invoices/${inv.id}`).then(r => r.json());
    if (res.success) setViewInvoice(res.data);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayment) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/invoices/${showPayment.id}/payment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payForm, amount: Number(payForm.amount) }) });
      setShowPayment(null); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/invoices/${deleting.id}`, { method: "DELETE" });
      setDeleting(null); load();
    } finally { setSaving(false); }
  };

  const clientOpts = [{ value: "", label: "Select client..." }, ...clients.map(c => ({ value: String(c.id), label: c.name }))];

  const columns = [
    { key: "invoice_no", header: "Invoice #", sortable: true, render: (i: InvoiceWithClient) => <span className="text-purple-400 font-mono text-sm">{i.invoice_no}</span> },
    { key: "client_name", header: "Client", sortable: true, render: (i: InvoiceWithClient) => (
      <div><div className="text-white text-sm">{i.client_name}</div><div className="text-gray-500 text-xs">{i.client_company ?? i.client_email}</div></div>
    )},
    { key: "total", header: "Amount", sortable: true, render: (i: InvoiceWithClient) => (
      <div>
        <div className="text-white text-sm font-semibold">{i.currency} {i.total.toLocaleString()}</div>
        {i.amount_paid > 0 && <div className="text-emerald-400 text-xs">Paid: {i.currency} {i.amount_paid.toLocaleString()}</div>}
      </div>
    )},
    { key: "status", header: "Status", render: (i: InvoiceWithClient) => <StatusBadge status={i.status} /> },
    { key: "due_date", header: "Due Date", render: (i: InvoiceWithClient) => <span className="text-gray-500 text-xs">{new Date(i.due_date).toLocaleDateString()}</span> },
    { key: "actions", header: "", render: (i: InvoiceWithClient) => (
      <div className="flex gap-1 justify-end">
        <button onClick={() => handleView(i)} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="View"><Eye className="w-3.5 h-3.5" /></button>
        {i.status === "draft" && <button onClick={() => handleSend(i)} className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" title="Send"><Send className="w-3.5 h-3.5" /></button>}
        {["sent","viewed","partial"].includes(i.status) && <button onClick={() => { setShowPayment(i); setPayForm(f => ({ ...f, amount: String(i.total - i.amount_paid) })); }} className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Record Payment"><DollarSign className="w-3.5 h-3.5" /></button>}
        <button onClick={() => setDeleting(i)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Invoices</h1>
          <p className="text-gray-500 text-sm">{invoices.length} invoices</p>
        </div>
        <Button onClick={() => { setLines([emptyLine()]); setShowForm(true); }} icon={<Plus className="w-4 h-4" />}>New Invoice</Button>
      </div>

      <div className="glass rounded-2xl border border-white/[0.07] p-5">
        <DataTable data={invoices} columns={columns}
          searchKeys={["invoice_no","client_name"]} loading={loading} />
      </div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <m.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <m.div className="glass-strong rounded-2xl p-7 w-full max-w-2xl border border-white/15 shadow-glass-lg my-8"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <h2 className="font-display font-bold text-white text-xl mb-6">Create Invoice</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Client" options={clientOpts} value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} required />
                    <Input label="Due Date" type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} required />
                  </div>

                  {/* Line Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Line Items</label>
                    <div className="space-y-2">
                      {lines.map((line, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                          <input className="col-span-5 glass rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 border border-white/10 focus:border-purple-500/50 focus:outline-none"
                            placeholder="Description" value={line.description} onChange={e => updateLine(i, "description", e.target.value)} required />
                          <input className="col-span-2 glass rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:border-purple-500/50 focus:outline-none" type="number" placeholder="Qty" value={line.quantity} onChange={e => updateLine(i, "quantity", e.target.value)} min="0.1" step="0.1" />
                          <input className="col-span-2 glass rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:border-purple-500/50 focus:outline-none" type="number" placeholder="Rate" value={line.unit_price || ""} onChange={e => updateLine(i, "unit_price", e.target.value)} min="0" />
                          <div className="col-span-2 text-right text-sm text-gray-400 font-mono">₹{line.amount.toLocaleString()}</div>
                          {lines.length > 1 && <button type="button" onClick={() => setLines(ls => ls.filter((_, idx) => idx !== i))} className="col-span-1 flex justify-center text-gray-600 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setLines(ls => [...ls, emptyLine()])} className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">+ Add line item</button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Tax Rate (%)" type="number" value={form.tax_rate} onChange={e => setForm(f => ({ ...f, tax_rate: e.target.value }))} min="0" max="100" />
                    <Input label="Discount (₹)" type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} min="0" />
                    <div className="glass rounded-xl p-4 border border-white/10">
                      <div className="text-gray-500 text-xs mb-1">Total</div>
                      <div className="font-display font-bold text-xl text-white">₹{total.toLocaleString()}</div>
                    </div>
                  </div>
                  <Textarea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1 justify-center border border-white/10">Cancel</Button>
                    <Button type="submit" loading={saving} className="flex-1 justify-center">Create Invoice</Button>
                  </div>
                </form>
              </m.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {viewInvoice && (
          <>
            <m.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewInvoice(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <m.div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                {/* Print-friendly invoice */}
                <div className="p-8 text-gray-900">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-black text-purple-700 mb-1">The Web Start</h1>
                      <p className="text-gray-500 text-sm">info@thewebstart.in · thewebstart.in</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">INVOICE</div>
                      <div className="text-purple-600 font-mono font-bold">{viewInvoice.invoice_no}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Bill To</div>
                      <div className="font-semibold text-gray-800">{viewInvoice.client_name}</div>
                      {viewInvoice.client_company && <div className="text-gray-600 text-sm">{viewInvoice.client_company}</div>}
                      <div className="text-gray-600 text-sm">{viewInvoice.client_email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600"><span className="font-medium">Issue Date:</span> {viewInvoice.issue_date}</div>
                      <div className="text-sm text-gray-600"><span className="font-medium">Due Date:</span> {viewInvoice.due_date}</div>
                      <div className="mt-2"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${viewInvoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{viewInvoice.status}</span></div>
                    </div>
                  </div>
                  <table className="w-full mb-6">
                    <thead><tr className="border-b-2 border-purple-100"><th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Description</th><th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase w-16">Qty</th><th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase w-24">Rate</th><th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase w-24">Amount</th></tr></thead>
                    <tbody>
                      {(viewInvoice.items ?? []).map((item, i) => (
                        <tr key={i} className="border-b border-gray-100"><td className="py-3 text-sm text-gray-700">{item.description}</td><td className="py-3 text-sm text-gray-600 text-right">{item.quantity}</td><td className="py-3 text-sm text-gray-600 text-right">₹{item.unit_price.toLocaleString()}</td><td className="py-3 text-sm font-medium text-gray-800 text-right">₹{item.amount.toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <div className="w-56 space-y-1">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>₹{viewInvoice.subtotal.toLocaleString()}</span></div>
                      {viewInvoice.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span>-₹{viewInvoice.discount.toLocaleString()}</span></div>}
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({viewInvoice.tax_rate}%)</span><span>₹{viewInvoice.tax_amount.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200"><span>Total</span><span className="text-purple-700">₹{viewInvoice.total.toLocaleString()}</span></div>
                      {viewInvoice.amount_paid > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Paid</span><span>₹{viewInvoice.amount_paid.toLocaleString()}</span></div>}
                    </div>
                  </div>
                  {viewInvoice.notes && <p className="mt-6 text-sm text-gray-500 border-t pt-4">{viewInvoice.notes}</p>}
                </div>
                <div className="flex gap-3 p-4 bg-gray-50 border-t">
                  <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors"><Printer className="w-4 h-4" />Print / Save PDF</button>
                  <button onClick={() => setViewInvoice(null)} className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">Close</button>
                </div>
              </m.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <>
            <m.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPayment(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <m.div className="glass-strong rounded-2xl p-7 w-full max-w-md border border-white/15 shadow-glass-lg"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <h2 className="font-display font-bold text-white text-lg mb-1">Record Payment</h2>
                <p className="text-gray-500 text-sm mb-6">{showPayment.invoice_no} · Balance: {showPayment.currency} {(showPayment.total - showPayment.amount_paid).toLocaleString()}</p>
                <form onSubmit={handlePayment} className="space-y-4">
                  <Input label="Amount" type="number" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} required min="1" />
                  <Select label="Payment Method" options={PAYMENT_METHODS} value={payForm.method} onChange={e => setPayForm(f => ({ ...f, method: e.target.value }))} />
                  <Input label="Reference / UTR No." value={payForm.reference_no} onChange={e => setPayForm(f => ({ ...f, reference_no: e.target.value }))} />
                  <Input label="Payment Date" type="date" value={payForm.payment_date} onChange={e => setPayForm(f => ({ ...f, payment_date: e.target.value }))} required />
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowPayment(null)} className="flex-1 justify-center border border-white/10">Cancel</Button>
                    <Button type="submit" loading={saving} className="flex-1 justify-center">Record Payment</Button>
                  </div>
                </form>
              </m.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleting} title="Delete Invoice" message={`Delete invoice ${deleting?.invoice_no}? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDeleting(null)} loading={saving} />
    </div>
  );
}
