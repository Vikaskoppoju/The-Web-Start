// ── Client Portal User ────────────────────────────────────────────────────────
export interface Client {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  country: string;
  gstin: string | null;
  status: "active" | "inactive" | "suspended";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ClientPublic = Omit<Client, "password_hash">;

// ── Project ────────────────────────────────────────────────────────────────────
export type ProjectStatus =
  | "inquiry" | "proposal" | "active" | "review" | "completed" | "paused" | "cancelled";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface Project {
  id: number;
  client_id: number;
  title: string;
  description: string | null;
  service_type: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  budget: number | null;
  amount_paid: number;
  progress: number;
  live_url: string | null;
  repo_url: string | null;
  notes: string | null;
  client_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithClient extends Project {
  client_name: string;
  client_email: string;
  client_company: string | null;
}

// ── Milestone ─────────────────────────────────────────────────────────────────
export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: number;
  sort_order: number;
  created_at: string;
}

// ── Project File ───────────────────────────────────────────────────────────────
export interface ProjectFile {
  id: number;
  project_id: number;
  name: string;
  file_url: string;
  file_key: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  created_at: string;
}

// ── Invoice ────────────────────────────────────────────────────────────────────
export type InvoiceStatus =
  | "draft" | "sent" | "viewed" | "partial" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: number;
  invoice_no: string;
  client_id: number;
  project_id: number | null;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  amount_paid: number;
  currency: string;
  notes: string | null;
  terms: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
}

export interface InvoiceWithClient extends Invoice {
  client_name: string;
  client_email: string;
  client_company: string | null;
  project_title: string | null;
  items?: InvoiceItem[];
}

// ── Payment ────────────────────────────────────────────────────────────────────
export type PaymentMethod =
  | "bank_transfer" | "upi" | "razorpay" | "stripe" | "cash" | "cheque";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: number;
  invoice_id: number;
  client_id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference_no: string | null;
  payment_date: string;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
}

export interface PaymentWithDetails extends Payment {
  invoice_no: string;
  client_name: string;
}

// ── Notification ──────────────────────────────────────────────────────────────
export type NotificationType =
  | "project_update" | "invoice_sent" | "payment_received"
  | "message" | "file_uploaded" | "milestone";

export interface Notification {
  id: number;
  recipient: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  is_read: number;
  project_id: number | null;
  invoice_id: number | null;
  created_at: string;
}

// ── Dashboard Stats ────────────────────────────────────────────────────────────
export interface AdminStats {
  totalClients: number;
  activeProjects: number;
  totalRevenue: number;
  pendingInvoices: number;
  newSubmissions: number;
  overdueInvoices: number;
  projectsByStatus: { status: string; count: number }[];
  revenueByMonth: { month: string; revenue: number; invoiced: number }[];
  topClients: { name: string; company: string | null; revenue: number }[];
}

export interface ClientStats {
  activeProjects: number;
  completedProjects: number;
  unpaidInvoices: number;
  totalPaid: number;
  unreadNotifications: number;
}
