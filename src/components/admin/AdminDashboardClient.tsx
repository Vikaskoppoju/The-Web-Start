"use client";
import { useEffect, useState } from "react";
import { m } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, FolderKanban, IndianRupee, FileText,
  MessageSquare, AlertCircle, TrendingUp,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { StatusBadge } from "./StatusBadge";
import type { AdminStats } from "@/types/dashboard";

const PIE_COLORS = ["#7c3aed","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d24",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f1f0ff",
  fontSize: 12,
};

export function AdminDashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Active Clients" value={stats?.totalClients ?? 0}
          icon={<Users className="w-5 h-5" />} accentColor="#7c3aed" delay={0} />
        <StatCard title="Active Projects" value={stats?.activeProjects ?? 0}
          icon={<FolderKanban className="w-5 h-5" />} accentColor="#06b6d4" delay={0.05} />
        <StatCard title="Total Revenue"
          value={`₹${((stats?.totalRevenue ?? 0) / 1000).toFixed(0)}k`}
          icon={<IndianRupee className="w-5 h-5" />} accentColor="#10b981" delay={0.1} />
        <StatCard title="Pending Invoices" value={stats?.pendingInvoices ?? 0}
          icon={<FileText className="w-5 h-5" />} accentColor="#f59e0b" delay={0.15} />
        <StatCard title="New Submissions" value={stats?.newSubmissions ?? 0}
          icon={<MessageSquare className="w-5 h-5" />} accentColor="#8b5cf6" delay={0.2} />
        <StatCard title="Overdue" value={stats?.overdueInvoices ?? 0}
          icon={<AlertCircle className="w-5 h-5" />} accentColor="#ef4444" delay={0.25} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <m.div className="xl:col-span-2 glass rounded-2xl p-6 border border-white/[0.07]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-white text-sm">Revenue vs Invoiced (Last 6 months)</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats?.revenueByMonth ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`₹${(Number(v)).toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#gRev)" dot={false} />
              <Area type="monotone" dataKey="invoiced" name="Invoiced" stroke="#06b6d4" strokeWidth={2} fill="url(#gInv)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </m.div>

        {/* Projects by Status Pie */}
        <m.div className="glass rounded-2xl p-6 border border-white/[0.07]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-semibold text-white text-sm mb-6">Projects by Status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={stats?.projectsByStatus ?? []} dataKey="count" nameKey="status"
                cx="50%" cy="50%" outerRadius={75} innerRadius={45} paddingAngle={3}>
                {(stats?.projectsByStatus ?? []).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {(stats?.projectsByStatus ?? []).slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <StatusBadge status={item.status} />
                </div>
                <span className="text-gray-400 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </m.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Clients */}
        <m.div className="glass rounded-2xl p-6 border border-white/[0.07]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-semibold text-white text-sm mb-5">Top Clients by Revenue</h2>
          {(stats?.topClients ?? []).length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No payment data yet</p>
          ) : (
            <div className="space-y-4">
              {(stats?.topClients ?? []).map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                       style={{ background: `linear-gradient(135deg, ${PIE_COLORS[i]}, ${PIE_COLORS[(i+1)%PIE_COLORS.length]})` }}>
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{c.name}</div>
                    <div className="text-gray-600 text-xs truncate">{c.company ?? "Individual"}</div>
                  </div>
                  <div className="text-emerald-400 text-sm font-semibold flex-shrink-0">
                    ₹{c.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </m.div>

        {/* Monthly Bar */}
        <m.div className="glass rounded-2xl p-6 border border-white/[0.07]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h2 className="font-semibold text-white text-sm mb-5">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats?.revenueByMonth ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`₹${(Number(v)).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </m.div>
      </div>
    </div>
  );
}
