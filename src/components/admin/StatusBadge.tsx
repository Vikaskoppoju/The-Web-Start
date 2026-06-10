import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; class: string }> = {
  // Project statuses
  inquiry:   { label: "Inquiry",   class: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
  proposal:  { label: "Proposal",  class: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  active:    { label: "Active",    class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  review:    { label: "Review",    class: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  completed: { label: "Completed", class: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  paused:    { label: "Paused",    class: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  cancelled: { label: "Cancelled", class: "bg-red-500/15 text-red-400 border-red-500/30" },
  // Invoice statuses
  draft:     { label: "Draft",     class: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
  sent:      { label: "Sent",      class: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  viewed:    { label: "Viewed",    class: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  partial:   { label: "Partial",   class: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  paid:      { label: "Paid",      class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  overdue:   { label: "Overdue",   class: "bg-red-500/15 text-red-400 border-red-500/30" },
  // Quotation statuses
  accepted:  { label: "Accepted",  class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  rejected:  { label: "Rejected",  class: "bg-red-500/15 text-red-400 border-red-500/30" },
  expired:   { label: "Expired",   class: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  // Payment
  pending:   { label: "Pending",   class: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  failed:    { label: "Failed",    class: "bg-red-500/15 text-red-400 border-red-500/30" },
  refunded:  { label: "Refunded",  class: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
  // Client / Submission
  new:       { label: "New",       class: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  read:      { label: "Read",      class: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  replied:   { label: "Replied",   class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  contacted: { label: "Contacted", class: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  won:       { label: "Won",       class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  lost:      { label: "Lost",      class: "bg-red-500/15 text-red-400 border-red-500/30" },
  suspended: { label: "Suspended", class: "bg-red-500/15 text-red-400 border-red-500/30" },
  inactive:  { label: "Inactive",  class: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const cfg = statusConfig[status] ?? { label: status, class: "bg-gray-500/15 text-gray-400 border-gray-500/30" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", cfg.class, className)}>
      {cfg.label}
    </span>
  );
}
