"use client";
import { useEffect, useState } from "react";
import { Mail, Briefcase } from "lucide-react";
import { DataTable } from "./DataTable";
import type { ContactSubmission, ProjectInquiry } from "@/types/db";

type Tab = "contact" | "inquiry";

const contactStatusOpts = ["new","read","replied"];
const inquiryStatusOpts = ["new","contacted","proposal","won","lost"];

export function SubmissionsManager() {
  const [tab, setTab] = useState<Tab>("contact");
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/submissions").then(r => r.json())
      .then(d => { if (d.success) { setContacts(d.data.contacts); setInquiries(d.data.inquiries); } })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: number, status: string, type: Tab) => {
    await fetch(`/api/admin/submissions/${id}?type=${type}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const contactCols = [
    { key: "name", header: "Name", sortable: true, render: (c: ContactSubmission) => <div><div className="text-white text-sm">{c.name}</div><div className="text-gray-500 text-xs">{c.email}</div></div> },
    { key: "subject", header: "Subject", render: (c: ContactSubmission) => <span className="text-gray-300 text-sm truncate max-w-xs block">{c.subject}</span> },
    { key: "message", header: "Message", render: (c: ContactSubmission) => <span className="text-gray-500 text-xs line-clamp-2 max-w-sm">{c.message}</span> },
    { key: "status", header: "Status", render: (c: ContactSubmission) => (
      <select className="glass rounded-lg px-2 py-1 text-xs text-gray-300 border border-white/10 bg-transparent cursor-pointer"
        value={c.status} onChange={e => updateStatus(c.id, e.target.value, "contact")}>
        {contactStatusOpts.map(s => <option key={s} value={s} className="bg-[#08081a]">{s}</option>)}
      </select>
    )},
    { key: "created_at", header: "Date", render: (c: ContactSubmission) => <span className="text-gray-600 text-xs">{new Date(c.created_at).toLocaleDateString()}</span> },
  ];

  const inquiryCols = [
    { key: "name", header: "Client", sortable: true, render: (i: ProjectInquiry) => <div><div className="text-white text-sm">{i.name}</div><div className="text-gray-500 text-xs">{i.email}</div></div> },
    { key: "service_needed", header: "Service", render: (i: ProjectInquiry) => <span className="text-gray-300 text-sm">{i.service_needed.replace(/-/g," ")}</span> },
    { key: "budget_range", header: "Budget", render: (i: ProjectInquiry) => <span className="text-gray-400 text-xs">{i.budget_range ?? "—"}</span> },
    { key: "timeline", header: "Timeline", render: (i: ProjectInquiry) => <span className="text-gray-400 text-xs">{i.timeline ?? "—"}</span> },
    { key: "status", header: "Status", render: (i: ProjectInquiry) => (
      <select className="glass rounded-lg px-2 py-1 text-xs text-gray-300 border border-white/10 bg-transparent cursor-pointer"
        value={i.status} onChange={e => updateStatus(i.id, e.target.value, "inquiry")}>
        {inquiryStatusOpts.map(s => <option key={s} value={s} className="bg-[#08081a]">{s}</option>)}
      </select>
    )},
    { key: "created_at", header: "Date", render: (i: ProjectInquiry) => <span className="text-gray-600 text-xs">{new Date(i.created_at).toLocaleDateString()}</span> },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Submissions</h1>
        <p className="text-gray-500 text-sm">{contacts.filter(c => c.status === "new").length} new contacts · {inquiries.filter(i => i.status === "new").length} new inquiries</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 w-fit mb-6">
        {([["contact", Mail, "Contacts", contacts.length], ["inquiry", Briefcase, "Inquiries", inquiries.length]] as [Tab, typeof Mail, string, number][]).map(([t, Icon, label, count]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={tab === t ? { background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "white" } : { color: "#6b7280" }}>
            <Icon className="w-4 h-4" />{label}
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10">{count}</span>
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/[0.07] p-5">
        {tab === "contact" ? (
          <DataTable data={contacts} columns={contactCols}
            searchKeys={["name","email","subject"]} loading={loading} emptyMessage="No contact submissions yet." />
        ) : (
          <DataTable data={inquiries} columns={inquiryCols}
            searchKeys={["name","email","service_needed"]} loading={loading} emptyMessage="No project inquiries yet." />
        )}
      </div>
    </div>
  );
}
