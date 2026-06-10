"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Eye, Edit2, Trash2, FileText, Send,
  CheckCircle, XCircle, Clock, Download, ChevronDown,
  ChevronUp, X, Save, Printer, ArrowRight, Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { Quotation, QuotationWithItems, CreateQuotationItem, QuotationStatus } from "@/types/quotation";

// ── helpers ────────────────────────────────────────────────────────────────────
const fmt = (n: number | null | undefined, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: currency ?? "INR", minimumFractionDigits: 0 }).format(n ?? 0);

const today = () => new Date().toISOString().split("T")[0];
const inDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString().split("T")[0];

const UNIT_OPTIONS = ["project", "hour", "day", "month", "unit"];

const emptyItem = (): CreateQuotationItem => ({
  service: "", description: "", quantity: 1, unit: "project",
  unit_price: 0, discount_percent: 0, tax_percent: 0, amount: 0,
});

function calcAmount(item: CreateQuotationItem) {
  const gross = item.quantity * item.unit_price;
  const afterDiscount = gross * (1 - (item.discount_percent ?? 0) / 100);
  const withTax = afterDiscount * (1 + (item.tax_percent ?? 0) / 100);
  return Math.round(withTax * 100) / 100;
}

function calcTotals(items: CreateQuotationItem[], discountType: string, discountValue: number, taxPercent: number) {
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const discountAmount = discountType === "percent" ? subtotal * (discountValue / 100) : discountValue;
  const taxable = subtotal - discountAmount;
  const taxAmount = taxable * (taxPercent / 100);
  return { subtotal, discountAmount, taxAmount, total: taxable + taxAmount };
}

// ── Print Preview ──────────────────────────────────────────────────────────────
function PrintPreview({ quote }: { quote: QuotationWithItems }) {
  const { subtotal, discountAmount, taxAmount, total } = calcTotals(
    quote.items, quote.discount_type, quote.discount_value, quote.tax_percent
  );

  const handlePrint = () => {
    const el = document.getElementById("quote-print-area");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>${quote.quote_no}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:system-ui,sans-serif;font-size:12px;color:#1a1a2e;background:#fff;}
        ${el.getAttribute("data-print-style") ?? ""}
      </style>
    </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Print Preview</h3>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Printable area */}
      <div id="quote-print-area"
        data-print-style={`
          .print-page{padding:32px;max-width:860px;margin:auto;}
          table{width:100%;border-collapse:collapse;}
          th{background:#f0f0f7;padding:8px 10px;text-align:left;font-size:11px;color:#444;border-bottom:2px solid #e0e0f0;}
          td{padding:8px 10px;border-bottom:1px solid #f0f0f0;vertical-align:top;}
          .amount-cell{text-align:right;font-weight:600;}
          .totals td{border:none;padding:4px 10px;}
          .grand-total td{background:#1a1a2e;color:#fff;border-radius:4px;padding:10px;}
        `}
        className="bg-white rounded-xl overflow-hidden text-gray-900 text-sm print-page">
        {/* Header */}
        <div className="p-8 pb-6"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-white mb-1">THE WEB START</div>
              <div className="text-purple-300 text-xs">thewebstart.in · info@thewebstart.in</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{quote.quote_no}</div>
              <div className="text-xs text-cyan-300 uppercase tracking-wider">{quote.title}</div>
              <div className="mt-2 text-xs text-gray-300">
                {quote.valid_until && <div>Valid until: {quote.valid_until}</div>}
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: quote.status === "accepted" ? "#10b981" : quote.status === "rejected" ? "#ef4444" : "#7c3aed", color: "#fff" }}>
                    {quote.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="px-8 py-5 grid grid-cols-2 gap-8 border-b border-gray-100">
          <div>
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">From</div>
            <div className="font-semibold text-gray-900">The Web Start</div>
            <div className="text-gray-600 text-xs mt-1">info@thewebstart.in</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Prepared For</div>
            <div className="font-semibold text-gray-900">{quote.client_name}</div>
            {quote.client_company && <div className="text-gray-700 text-xs">{quote.client_company}</div>}
            {quote.client_email && <div className="text-gray-500 text-xs">{quote.client_email}</div>}
            {quote.client_phone && <div className="text-gray-500 text-xs">{quote.client_phone}</div>}
            {quote.client_address && <div className="text-gray-500 text-xs mt-1">{quote.client_address}</div>}
          </div>
        </div>

        {/* Items table */}
        <div className="px-8 py-5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide rounded-l-lg w-6">#</th>
                <th className="text-left py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">Service / Description</th>
                <th className="text-right py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">Qty</th>
                <th className="text-right py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">Unit Price</th>
                <th className="text-right py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">Disc%</th>
                <th className="text-right py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">GST%</th>
                <th className="text-right py-2.5 px-3 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide rounded-r-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, i) => (
                <tr key={item.id ?? i} className={cn(i % 2 === 1 && "bg-gray-50/50")}>
                  <td className="py-3 px-3 text-gray-400 text-xs align-top">{i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-gray-900 text-sm">{item.service}</div>
                    {item.description && (
                      <ul className="mt-1 space-y-0.5">
                        {item.description.split("\n").filter(Boolean).map((d, di) => (
                          <li key={di} className="text-gray-500 text-xs flex gap-1.5">
                            <span className="text-purple-400 mt-0.5">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700 text-xs align-top">{item.quantity} <span className="text-gray-400">{item.unit}</span></td>
                  <td className="py-3 px-3 text-right text-gray-700 text-xs align-top">{fmt(item.unit_price, quote.currency)}</td>
                  <td className="py-3 px-3 text-right text-gray-500 text-xs align-top">{item.discount_percent > 0 ? `${item.discount_percent}%` : "—"}</td>
                  <td className="py-3 px-3 text-right text-gray-500 text-xs align-top">{item.tax_percent > 0 ? `${item.tax_percent}%` : "—"}</td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-900 text-sm align-top">{fmt(item.amount, quote.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-8 pb-6 flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100">
              <span>Subtotal</span><span className="font-medium">{fmt(subtotal, quote.currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 py-1 border-b border-gray-100">
                <span>Discount {quote.discount_type === "percent" ? `(${quote.discount_value}%)` : "(fixed)"}</span>
                <span>- {fmt(discountAmount, quote.currency)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100">
                <span>GST ({quote.tax_percent}%)</span><span>{fmt(taxAmount, quote.currency)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 px-4 rounded-xl mt-1"
              style={{ background: "linear-gradient(135deg,#7c3aed20,#06b6d420)", border: "1px solid #7c3aed30" }}>
              <span className="font-bold text-gray-900 text-base">Total</span>
              <span className="font-bold text-purple-700 text-xl">{fmt(total, quote.currency)}</span>
            </div>
          </div>
        </div>

        {/* Terms / Notes */}
        {(quote.terms || quote.notes) && (
          <div className="px-8 pb-8 grid grid-cols-2 gap-6">
            {quote.terms && (
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Terms & Conditions</div>
                <div className="text-xs text-gray-600 whitespace-pre-line">{quote.terms}</div>
              </div>
            )}
            {quote.notes && (
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Additional Notes</div>
                <div className="text-xs text-gray-600 whitespace-pre-line">{quote.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>Generated by The Web Start — thewebstart.in</span>
          <span>Thank you for your business!</span>
        </div>
      </div>
    </div>
  );
}

// ── Item Row ───────────────────────────────────────────────────────────────────
function ItemRow({
  item, index, onChange, onRemove, canRemove,
}: {
  item: CreateQuotationItem;
  index: number;
  onChange: (index: number, item: CreateQuotationItem) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const update = (patch: Partial<CreateQuotationItem>) => {
    const next = { ...item, ...patch };
    next.amount = calcAmount(next);
    onChange(index, next);
  };

  return (
    <div className="bg-[#0d0d2b] border border-white/[0.08] rounded-xl p-4 space-y-3 relative">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">#{index + 1}</span>
        {canRemove && (
          <button onClick={() => onRemove(index)}
            className="text-red-500/60 hover:text-red-400 p-1 rounded transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Service name */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Service Name *</label>
        <input value={item.service} onChange={e => update({ service: e.target.value })}
          placeholder="e.g. Website Design & Development"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Description (one bullet per line)</label>
        <textarea value={item.description ?? ""} onChange={e => update({ description: e.target.value })}
          rows={3} placeholder={"Responsive 5-page website\nSEO optimisation\nContact form integration"}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none" />
      </div>

      {/* Qty / Unit / Unit Price / Disc / Tax / Amount */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Qty</label>
          <input type="number" min={0.01} step={0.01} value={item.quantity}
            onChange={e => update({ quantity: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Unit</label>
          <select value={item.unit} onChange={e => update({ unit: e.target.value })}
            className="w-full bg-[#0a0a1f] border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors">
            {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Unit Price (₹)</label>
          <input type="number" min={0} step={1} value={item.unit_price}
            onChange={e => update({ unit_price: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Disc %</label>
          <input type="number" min={0} max={100} step={0.5} value={item.discount_percent}
            onChange={e => update({ discount_percent: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">GST %</label>
          <input type="number" min={0} max={100} step={1} value={item.tax_percent}
            onChange={e => update({ tax_percent: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Amount</label>
          <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-purple-300 font-semibold">
            {fmt(item.amount)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form ───────────────────────────────────────────────────────────────────────
interface FormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  client_address: string;
  title: string;
  valid_until: string;
  currency: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  tax_percent: number;
  terms: string;
  notes: string;
  items: CreateQuotationItem[];
}

const defaultForm = (): FormData => ({
  client_name: "", client_email: "", client_phone: "", client_company: "", client_address: "",
  title: "Quotation", valid_until: inDays(30), currency: "INR",
  discount_type: "percent", discount_value: 0, tax_percent: 18,
  terms: "1. 50% advance payment required to start the project.\n2. Balance payment due on project completion.\n3. Quotation valid for 30 days from the date of issue.\n4. Any additional requirements will be quoted separately.",
  notes: "",
  items: [emptyItem()],
});

function toForm(q: QuotationWithItems): FormData {
  return {
    client_name: q.client_name, client_email: q.client_email ?? "",
    client_phone: q.client_phone ?? "", client_company: q.client_company ?? "",
    client_address: q.client_address ?? "", title: q.title, valid_until: q.valid_until ?? "",
    currency: q.currency, discount_type: q.discount_type, discount_value: q.discount_value,
    tax_percent: q.tax_percent, terms: q.terms ?? "", notes: q.notes ?? "",
    items: q.items.map(i => ({ ...i, description: i.description ?? "" })),
  };
}

function QuotationForm({
  initial, onSave, onCancel, saving,
}: {
  initial?: QuotationWithItems;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial ? toForm(initial) : defaultForm());
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const updateItem = useCallback((i: number, item: CreateQuotationItem) => {
    setForm(prev => {
      const items = [...prev.items];
      items[i] = item;
      return { ...prev, items };
    });
  }, []);

  const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, emptyItem()] }));
  const removeItem = (i: number) => setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const { subtotal, discountAmount, taxAmount, total } = calcTotals(
    form.items, form.discount_type, form.discount_value, form.tax_percent
  );

  return (
    <div className="space-y-6">
      {/* Client & Meta */}
      <div className="glass rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" /> Client & Quotation Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            ["client_name", "Client Name *", "text", "e.g. Acme Corp"],
            ["client_company", "Company", "text", "Company name"],
            ["client_email", "Email", "email", "client@example.com"],
            ["client_phone", "Phone", "tel", "+91 98765 43210"],
            ["client_address", "Address", "text", "City, State"],
            ["title", "Quotation Title", "text", "e.g. Website Development Proposal"],
          ] as const).map(([key, label, type, placeholder]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input type={type} value={form[key] as string}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Valid Until</label>
            <input type="date" value={form.valid_until} onChange={e => set("valid_until", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Currency</label>
            <select value={form.currency} onChange={e => set("currency", e.target.value)}
              className="w-full bg-[#0a0a1f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors">
              {["INR", "USD", "EUR", "GBP", "AED"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="glass rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Line Items
          </h3>
          <button onClick={addItem}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Service
          </button>
        </div>
        <div className="space-y-3">
          {form.items.map((item, i) => (
            <ItemRow key={i} item={item} index={i} onChange={updateItem}
              onRemove={removeItem} canRemove={form.items.length > 1} />
          ))}
        </div>
      </div>

      {/* Totals & discounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-white font-semibold mb-4">Discount & Tax</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Overall Discount Type</label>
                <select value={form.discount_type} onChange={e => set("discount_type", e.target.value as "percent" | "fixed")}
                  className="w-full bg-[#0a0a1f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors">
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="w-28">
                <label className="text-xs text-gray-500 block mb-1">Value</label>
                <input type="number" min={0} value={form.discount_value}
                  onChange={e => set("discount_value", Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">GST / Tax %</label>
              <input type="number" min={0} max={100} value={form.tax_percent}
                onChange={e => set("tax_percent", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
            </div>
          </div>
        </div>

        {/* Live summary */}
        <div className="glass rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-white font-semibold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400 py-1 border-b border-white/5">
              <span>Subtotal</span><span className="text-white">{fmt(subtotal, form.currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 py-1 border-b border-white/5">
                <span>Discount</span><span>- {fmt(discountAmount, form.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-400 py-1 border-b border-white/5">
              <span>GST ({form.tax_percent}%)</span><span className="text-white">{fmt(taxAmount, form.currency)}</span>
            </div>
            <div className="flex justify-between py-3 px-3 rounded-xl mt-2"
              style={{ background: "linear-gradient(135deg,#7c3aed15,#06b6d415)", border: "1px solid #7c3aed30" }}>
              <span className="font-bold text-white text-base">Total</span>
              <span className="font-bold text-purple-300 text-xl">{fmt(total, form.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-white font-semibold mb-3 text-sm">Terms & Conditions</h3>
          <textarea rows={6} value={form.terms} onChange={e => set("terms", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none" />
        </div>
        <div className="glass rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-white font-semibold mb-3 text-sm">Additional Notes</h3>
          <textarea rows={6} value={form.notes} onChange={e => set("notes", e.target.value)}
            placeholder="Any special notes or instructions for the client..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">
          Cancel
        </button>
        <button onClick={() => onSave(form)} disabled={saving || !form.client_name || form.items.every(i => !i.service)}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save Quotation</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main Manager ───────────────────────────────────────────────────────────────
type View = "list" | "create" | "edit" | "preview";

export function QuotationsManager() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<QuotationWithItems | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quotations");
      const data = await res.json();
      setQuotations(data.data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id: number) => {
    const res = await fetch(`/api/admin/quotations/${id}`);
    const data = await res.json();
    return data.data as QuotationWithItems;
  };

  const handleCreate = async (form: FormData) => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/quotations", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
      await load();
      setView("list");
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleEdit = async (form: FormData) => {
    if (!selected) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/quotations/${selected.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
      await load();
      setView("list");
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleStatus = async (id: number, status: QuotationStatus) => {
    await fetch(`/api/admin/quotations/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this quotation? This cannot be undone.")) return;
    await fetch(`/api/admin/quotations/${id}`, { method: "DELETE" });
    await load();
  };

  const handleConvert = async (id: number) => {
    if (!confirm("Convert to invoice? This will create a new invoice from this quotation.")) return;
    const res = await fetch(`/api/admin/quotations/${id}/convert`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Failed"); return; }
    alert(`Invoice ${data.data?.invoiceNo} created!`);
    await load();
  };

  const filtered = quotations.filter(q => {
    if (statusFilter !== "all" && q.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return q.quote_no.toLowerCase().includes(s) || q.client_name.toLowerCase().includes(s) || (q.client_company ?? "").toLowerCase().includes(s);
    }
    return true;
  });

  if (view === "create") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-white">New Quotation</h2>
        </div>
        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
        <QuotationForm onSave={handleCreate} onCancel={() => setView("list")} saving={saving} />
      </div>
    );
  }

  if (view === "edit" && selected) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-white">Edit {selected.quote_no}</h2>
        </div>
        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
        <QuotationForm initial={selected} onSave={handleEdit} onCancel={() => setView("list")} saving={saving} />
      </div>
    );
  }

  if (view === "preview" && selected) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-white">{selected.quote_no} Preview</h2>
          <StatusBadge status={selected.status} />
        </div>
        <PrintPreview quote={selected} />
      </div>
    );
  }

  // ── List ──
  const totalsByStatus = quotations.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: "Total", count: quotations.length, value: quotations.reduce((s, q) => s + (q.total ?? 0), 0), color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20" },
    { label: "Draft", count: totalsByStatus.draft ?? 0, value: null, color: "from-gray-500/20 to-gray-600/10", border: "border-gray-500/20" },
    { label: "Sent", count: totalsByStatus.sent ?? 0, value: null, color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/20" },
    { label: "Accepted", count: totalsByStatus.accepted ?? 0, value: quotations.filter(q => q.status === "accepted").reduce((s, q) => s + q.total, 0), color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={cn("glass rounded-2xl p-5 bg-gradient-to-br border", s.color, s.border)}>
            <div className="text-2xl font-bold text-white">{s.count}</div>
            <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
            {s.value !== null && <div className="text-xs text-gray-500 mt-1">{fmt(s.value)}</div>}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotations..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors w-56" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0a0a1f] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors">
            <option value="all">All Statuses</option>
            {["draft", "sent", "accepted", "rejected", "expired"].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setView("create")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold text-sm rounded-xl transition-all whitespace-nowrap">
          <Plus className="w-4 h-4" /> New Quotation
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{search || statusFilter !== "all" ? "No quotations match your filter" : "No quotations yet. Create your first one."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Quote No", "Client", "Date", "Valid Until", "Amount", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q.id} className={cn("border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors", i % 2 === 0 ? "" : "bg-white/[0.01]")}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-purple-300">{q.quote_no}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white font-medium">{q.client_name}</div>
                      {q.client_company && <div className="text-xs text-gray-500">{q.client_company}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{q.created_at?.split("T")[0]}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{q.valid_until ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white text-sm">{fmt(q.total, q.currency)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={async () => { const d = await loadDetail(q.id); setSelected(d); setView("preview"); }}
                          title="Preview" className="p-1.5 text-gray-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/10">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={async () => { const d = await loadDetail(q.id); setSelected(d); setView("edit"); }}
                          title="Edit" className="p-1.5 text-gray-500 hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-500/10">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {q.status === "draft" && (
                          <button onClick={() => handleStatus(q.id, "sent")}
                            title="Mark as Sent" className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {q.status === "sent" && (
                          <>
                            <button onClick={() => handleStatus(q.id, "accepted")}
                              title="Mark Accepted" className="p-1.5 text-gray-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-500/10">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatus(q.id, "rejected")}
                              title="Mark Rejected" className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {q.status === "accepted" && !q.converted_invoice_id && (
                          <button onClick={() => handleConvert(q.id)}
                            title="Convert to Invoice" className="p-1.5 text-gray-500 hover:text-yellow-400 transition-colors rounded-lg hover:bg-yellow-500/10">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(q.id)}
                          title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
