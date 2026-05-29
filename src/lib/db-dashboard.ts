import type { TursoDb as D1Database } from "./turso";
import type {
  Client, ClientPublic, Project, ProjectWithClient, Milestone,
  ProjectFile, InvoiceItem, InvoiceWithClient,
  PaymentWithDetails, Notification, AdminStats, ClientStats,
} from "@/types/dashboard";

// ── Clients ────────────────────────────────────────────────────────────────────

export async function getAllClients(db: D1Database): Promise<ClientPublic[]> {
  const { results } = await db
    .prepare("SELECT id,name,email,company,phone,avatar_url,address,city,country,gstin,status,notes,created_at,updated_at FROM clients ORDER BY created_at DESC")
    .all<ClientPublic>();
  return results ?? [];
}

export async function getClientById(db: D1Database, id: number): Promise<ClientPublic | null> {
  return db
    .prepare("SELECT id,name,email,company,phone,avatar_url,address,city,country,gstin,status,notes,created_at,updated_at FROM clients WHERE id=?")
    .bind(id).first<ClientPublic>();
}

export async function getClientByEmail(db: D1Database, email: string): Promise<Client | null> {
  return db.prepare("SELECT * FROM clients WHERE email=?").bind(email).first<Client>();
}

export async function createClient(db: D1Database, data: {
  name: string; email: string; password_hash: string;
  company?: string; phone?: string; country?: string; address?: string; city?: string; gstin?: string;
}) {
  return db.prepare(
    "INSERT INTO clients (name,email,password_hash,company,phone,country,address,city,gstin) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(data.name, data.email, data.password_hash, data.company ?? null, data.phone ?? null,
    data.country ?? "India", data.address ?? null, data.city ?? null, data.gstin ?? null).run();
}

export async function updateClient(db: D1Database, id: number, data: Partial<Omit<Client, "id"|"created_at"|"password_hash">>) {
  const allowed = ["name","email","company","phone","avatar_url","address","city","country","gstin","status","notes"];
  const keys = Object.keys(data).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const fields = keys.map(k => `${k}=?`).join(",");
  const values = keys.map(k => (data as Record<string, unknown>)[k]);
  return db.prepare(`UPDATE clients SET ${fields},updated_at=datetime('now') WHERE id=?`).bind(...values, id).run();
}

export async function deleteClient(db: D1Database, id: number) {
  return db.prepare("DELETE FROM clients WHERE id=?").bind(id).run();
}

// ── Projects ───────────────────────────────────────────────────────────────────

export async function getAllProjects(db: D1Database): Promise<ProjectWithClient[]> {
  const { results } = await db.prepare(`
    SELECT p.*, c.name as client_name, c.email as client_email, c.company as client_company
    FROM projects p JOIN clients c ON p.client_id=c.id
    ORDER BY p.created_at DESC
  `).all<ProjectWithClient>();
  return results ?? [];
}

export async function getProjectById(db: D1Database, id: number): Promise<ProjectWithClient | null> {
  return db.prepare(`
    SELECT p.*, c.name as client_name, c.email as client_email, c.company as client_company
    FROM projects p JOIN clients c ON p.client_id=c.id WHERE p.id=?
  `).bind(id).first<ProjectWithClient>();
}

export async function getClientProjects(db: D1Database, clientId: number): Promise<Project[]> {
  const { results } = await db
    .prepare("SELECT * FROM projects WHERE client_id=? ORDER BY created_at DESC")
    .bind(clientId).all<Project>();
  return results ?? [];
}

export async function createProject(db: D1Database, data: {
  client_id: number; title: string; description?: string; service_type: string;
  status?: string; priority?: string; start_date?: string; due_date?: string;
  budget?: number; notes?: string; client_notes?: string;
}) {
  return db.prepare(
    `INSERT INTO projects (client_id,title,description,service_type,status,priority,start_date,due_date,budget,notes,client_notes)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(data.client_id, data.title, data.description ?? null, data.service_type,
    data.status ?? "inquiry", data.priority ?? "medium", data.start_date ?? null,
    data.due_date ?? null, data.budget ?? null, data.notes ?? null, data.client_notes ?? null).run();
}

export async function updateProject(db: D1Database, id: number, data: Partial<Project>) {
  const allowed = ["title","description","service_type","status","priority","start_date","due_date",
    "completed_date","budget","amount_paid","progress","live_url","repo_url","notes","client_notes"];
  const keys = Object.keys(data).filter(k => allowed.includes(k));
  if (!keys.length) return;
  const fields = keys.map(k => `${k}=?`).join(",");
  const values = keys.map(k => (data as Record<string, unknown>)[k]);
  return db.prepare(`UPDATE projects SET ${fields},updated_at=datetime('now') WHERE id=?`).bind(...values, id).run();
}

export async function deleteProject(db: D1Database, id: number) {
  return db.prepare("DELETE FROM projects WHERE id=?").bind(id).run();
}

// ── Milestones ─────────────────────────────────────────────────────────────────

export async function getProjectMilestones(db: D1Database, projectId: number): Promise<Milestone[]> {
  const { results } = await db
    .prepare("SELECT * FROM milestones WHERE project_id=? ORDER BY sort_order ASC")
    .bind(projectId).all<Milestone>();
  return results ?? [];
}

export async function createMilestone(db: D1Database, data: { project_id: number; title: string; description?: string; due_date?: string; sort_order?: number }) {
  return db.prepare("INSERT INTO milestones (project_id,title,description,due_date,sort_order) VALUES (?,?,?,?,?)")
    .bind(data.project_id, data.title, data.description ?? null, data.due_date ?? null, data.sort_order ?? 0).run();
}

export async function toggleMilestone(db: D1Database, id: number, completed: boolean) {
  return db.prepare("UPDATE milestones SET completed=? WHERE id=?").bind(completed ? 1 : 0, id).run();
}

export async function deleteMilestone(db: D1Database, id: number) {
  return db.prepare("DELETE FROM milestones WHERE id=?").bind(id).run();
}

// ── Project Files ──────────────────────────────────────────────────────────────

export async function getProjectFiles(db: D1Database, projectId: number): Promise<ProjectFile[]> {
  const { results } = await db
    .prepare("SELECT * FROM project_files WHERE project_id=? ORDER BY created_at DESC")
    .bind(projectId).all<ProjectFile>();
  return results ?? [];
}

export async function addProjectFile(db: D1Database, data: {
  project_id: number; name: string; file_url: string; file_key: string;
  file_size?: number; mime_type?: string; uploaded_by?: string;
}) {
  return db.prepare("INSERT INTO project_files (project_id,name,file_url,file_key,file_size,mime_type,uploaded_by) VALUES (?,?,?,?,?,?,?)")
    .bind(data.project_id, data.name, data.file_url, data.file_key,
      data.file_size ?? null, data.mime_type ?? null, data.uploaded_by ?? "admin").run();
}

export async function deleteProjectFile(db: D1Database, id: number): Promise<ProjectFile | null> {
  const file = await db.prepare("SELECT * FROM project_files WHERE id=?").bind(id).first<ProjectFile>();
  if (file) await db.prepare("DELETE FROM project_files WHERE id=?").bind(id).run();
  return file;
}

// ── Invoices ───────────────────────────────────────────────────────────────────

export async function getAllInvoices(db: D1Database, opts: { status?: string; clientId?: number } = {}): Promise<InvoiceWithClient[]> {
  const conds: string[] = [];
  const binds: unknown[] = [];
  if (opts.status) { conds.push("i.status=?"); binds.push(opts.status); }
  if (opts.clientId) { conds.push("i.client_id=?"); binds.push(opts.clientId); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const { results } = await db.prepare(`
    SELECT i.*, c.name as client_name, c.email as client_email, c.company as client_company,
           p.title as project_title
    FROM invoices i JOIN clients c ON i.client_id=c.id
    LEFT JOIN projects p ON i.project_id=p.id
    ${where} ORDER BY i.created_at DESC
  `).bind(...binds).all<InvoiceWithClient>();
  return results ?? [];
}

export async function getInvoiceById(db: D1Database, id: number): Promise<InvoiceWithClient | null> {
  return db.prepare(`
    SELECT i.*, c.name as client_name, c.email as client_email, c.company as client_company,
           p.title as project_title
    FROM invoices i JOIN clients c ON i.client_id=c.id
    LEFT JOIN projects p ON i.project_id=p.id WHERE i.id=?
  `).bind(id).first<InvoiceWithClient>();
}

export async function getInvoiceItems(db: D1Database, invoiceId: number): Promise<InvoiceItem[]> {
  const { results } = await db
    .prepare("SELECT * FROM invoice_items WHERE invoice_id=? ORDER BY sort_order ASC")
    .bind(invoiceId).all<InvoiceItem>();
  return results ?? [];
}

export async function getNextInvoiceNo(db: D1Database): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db
    .prepare("SELECT COUNT(*) as cnt FROM invoices WHERE invoice_no LIKE ?")
    .bind(`TWS-${year}-%`).first<{ cnt: number }>();
  const seq = ((result?.cnt ?? 0) + 1).toString().padStart(3, "0");
  return `TWS-${year}-${seq}`;
}

export async function createInvoice(db: D1Database, data: {
  client_id: number; project_id?: number; due_date: string; subtotal: number;
  tax_rate: number; tax_amount: number; discount: number; total: number;
  notes?: string; terms?: string; currency?: string;
}, items: { description: string; quantity: number; unit_price: number; amount: number }[]) {
  const invoiceNo = await getNextInvoiceNo(db);
  const result = await db.prepare(
    `INSERT INTO invoices (invoice_no,client_id,project_id,due_date,subtotal,tax_rate,tax_amount,discount,total,notes,terms,currency)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(invoiceNo, data.client_id, data.project_id ?? null, data.due_date,
    data.subtotal, data.tax_rate, data.tax_amount, data.discount, data.total,
    data.notes ?? null, data.terms ?? null, data.currency ?? "INR").run();

  // Get the new invoice id
  const newInvoice = await db.prepare("SELECT id FROM invoices WHERE invoice_no=?").bind(invoiceNo).first<{ id: number }>();
  if (newInvoice && items.length) {
    await db.batch(items.map((item, i) =>
      db.prepare("INSERT INTO invoice_items (invoice_id,description,quantity,unit_price,amount,sort_order) VALUES (?,?,?,?,?,?)")
        .bind(newInvoice.id, item.description, item.quantity, item.unit_price, item.amount, i)
    ));
  }
  return { ...result, invoiceNo };
}

export async function updateInvoiceStatus(db: D1Database, id: number, status: string, extra: { sent_at?: string; paid_at?: string } = {}) {
  const fields: string[] = ["status=?", "updated_at=datetime('now')"];
  const values: unknown[] = [status];
  if (extra.sent_at) { fields.push("sent_at=?"); values.push(extra.sent_at); }
  if (extra.paid_at) { fields.push("paid_at=?"); values.push(extra.paid_at); }
  return db.prepare(`UPDATE invoices SET ${fields.join(",")} WHERE id=?`).bind(...values, id).run();
}

export async function updateInvoicePaid(db: D1Database, id: number, amountPaid: number) {
  return db.prepare("UPDATE invoices SET amount_paid=?,updated_at=datetime('now') WHERE id=?")
    .bind(amountPaid, id).run();
}

export async function deleteInvoice(db: D1Database, id: number) {
  return db.prepare("DELETE FROM invoices WHERE id=?").bind(id).run();
}

// ── Payments ───────────────────────────────────────────────────────────────────

export async function getAllPayments(db: D1Database): Promise<PaymentWithDetails[]> {
  const { results } = await db.prepare(`
    SELECT p.*, i.invoice_no, c.name as client_name
    FROM payments p JOIN invoices i ON p.invoice_id=i.id JOIN clients c ON p.client_id=c.id
    ORDER BY p.created_at DESC
  `).all<PaymentWithDetails>();
  return results ?? [];
}

export async function getClientPayments(db: D1Database, clientId: number): Promise<PaymentWithDetails[]> {
  const { results } = await db.prepare(`
    SELECT p.*, i.invoice_no, c.name as client_name
    FROM payments p JOIN invoices i ON p.invoice_id=i.id JOIN clients c ON p.client_id=c.id
    WHERE p.client_id=? ORDER BY p.created_at DESC
  `).bind(clientId).all<PaymentWithDetails>();
  return results ?? [];
}

export async function recordPayment(db: D1Database, data: {
  invoice_id: number; client_id: number; amount: number; method: string;
  reference_no?: string; payment_date?: string; notes?: string;
}) {
  const result = await db.prepare(
    "INSERT INTO payments (invoice_id,client_id,amount,method,reference_no,payment_date,notes) VALUES (?,?,?,?,?,?,?)"
  ).bind(data.invoice_id, data.client_id, data.amount, data.method,
    data.reference_no ?? null, data.payment_date ?? new Date().toISOString().split("T")[0],
    data.notes ?? null).run();

  // Update invoice amount_paid
  const invoice = await db.prepare("SELECT amount_paid, total FROM invoices WHERE id=?")
    .bind(data.invoice_id).first<{ amount_paid: number; total: number }>();
  if (invoice) {
    const newPaid = invoice.amount_paid + data.amount;
    const newStatus = newPaid >= invoice.total ? "paid" : newPaid > 0 ? "partial" : "sent";
    await db.prepare("UPDATE invoices SET amount_paid=?,status=?,paid_at=CASE WHEN ?='paid' THEN datetime('now') ELSE paid_at END,updated_at=datetime('now') WHERE id=?")
      .bind(newPaid, newStatus, newStatus, data.invoice_id).run();
  }
  return result;
}

// ── Notifications ──────────────────────────────────────────────────────────────

export async function getNotifications(db: D1Database, recipient: string, unreadOnly = false): Promise<Notification[]> {
  const where = unreadOnly ? "WHERE recipient=? AND is_read=0" : "WHERE recipient=?";
  const { results } = await db.prepare(
    `SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT 50`
  ).bind(recipient).all<Notification>();
  return results ?? [];
}

export async function createNotification(db: D1Database, data: {
  recipient: string; type: string; title: string; body: string;
  link?: string; project_id?: number; invoice_id?: number;
}) {
  return db.prepare(
    "INSERT INTO notifications (recipient,type,title,body,link,project_id,invoice_id) VALUES (?,?,?,?,?,?,?)"
  ).bind(data.recipient, data.type, data.title, data.body,
    data.link ?? null, data.project_id ?? null, data.invoice_id ?? null).run();
}

export async function markNotificationsRead(db: D1Database, recipient: string, ids?: number[]) {
  if (ids?.length) {
    await db.batch(ids.map(id =>
      db.prepare("UPDATE notifications SET is_read=1 WHERE id=? AND recipient=?").bind(id, recipient)
    ));
  } else {
    await db.prepare("UPDATE notifications SET is_read=1 WHERE recipient=?").bind(recipient).run();
  }
}

export async function getUnreadCount(db: D1Database, recipient: string): Promise<number> {
  const r = await db.prepare("SELECT COUNT(*) as cnt FROM notifications WHERE recipient=? AND is_read=0")
    .bind(recipient).first<{ cnt: number }>();
  return r?.cnt ?? 0;
}

// ── Admin Analytics ────────────────────────────────────────────────────────────

export async function getAdminStats(db: D1Database): Promise<AdminStats> {
  const [clients, activeProjects, revenue, pendingInv, submissions, overdueInv, byStatus] = await db.batch([
    db.prepare("SELECT COUNT(*) as cnt FROM clients WHERE status='active'"),
    db.prepare("SELECT COUNT(*) as cnt FROM projects WHERE status='active'"),
    db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='completed'"),
    db.prepare("SELECT COUNT(*) as cnt FROM invoices WHERE status IN ('sent','viewed','partial')"),
    db.prepare("SELECT COUNT(*) as cnt FROM (SELECT id FROM contact_submissions WHERE status='new' UNION ALL SELECT id FROM project_inquiries WHERE status='new')"),
    db.prepare("SELECT COUNT(*) as cnt FROM invoices WHERE status='overdue'"),
    db.prepare("SELECT status, COUNT(*) as count FROM projects GROUP BY status"),
  ]);

  const { results: revenueRows } = await db.prepare(`
    SELECT strftime('%Y-%m', payment_date) as month,
           COALESCE(SUM(CASE WHEN status='completed' THEN amount ELSE 0 END),0) as revenue
    FROM payments GROUP BY month ORDER BY month DESC LIMIT 12
  `).all<{ month: string; revenue: number }>();

  const { results: invoiceRows } = await db.prepare(`
    SELECT strftime('%Y-%m', issue_date) as month, COALESCE(SUM(total),0) as invoiced
    FROM invoices WHERE status != 'draft' GROUP BY month ORDER BY month DESC LIMIT 12
  `).all<{ month: string; invoiced: number }>();

  const { results: topClients } = await db.prepare(`
    SELECT c.name, c.company, COALESCE(SUM(p.amount),0) as revenue
    FROM clients c LEFT JOIN payments p ON p.client_id=c.id AND p.status='completed'
    GROUP BY c.id ORDER BY revenue DESC LIMIT 5
  `).all<{ name: string; company: string | null; revenue: number }>();

  // Merge revenue + invoiced by month
  const monthMap = new Map<string, { month: string; revenue: number; invoiced: number }>();
  for (const r of revenueRows ?? []) monthMap.set(r.month, { month: r.month, revenue: r.revenue, invoiced: 0 });
  for (const r of invoiceRows ?? []) {
    const existing = monthMap.get(r.month);
    if (existing) existing.invoiced = r.invoiced;
    else monthMap.set(r.month, { month: r.month, revenue: 0, invoiced: r.invoiced });
  }
  const revenueByMonth = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

  return {
    totalClients:    (clients.results?.[0] as { cnt: number })?.cnt ?? 0,
    activeProjects:  (activeProjects.results?.[0] as { cnt: number })?.cnt ?? 0,
    totalRevenue:    (revenue.results?.[0] as { total: number })?.total ?? 0,
    pendingInvoices: (pendingInv.results?.[0] as { cnt: number })?.cnt ?? 0,
    newSubmissions:  (submissions.results?.[0] as { cnt: number })?.cnt ?? 0,
    overdueInvoices: (overdueInv.results?.[0] as { cnt: number })?.cnt ?? 0,
    projectsByStatus:(byStatus.results as { status: string; count: number }[]) ?? [],
    revenueByMonth,
    topClients: topClients ?? [],
  };
}

export async function getClientStats(db: D1Database, clientId: number): Promise<ClientStats> {
  const [active, completed, unpaid, paid, notifs] = await db.batch([
    db.prepare("SELECT COUNT(*) as cnt FROM projects WHERE client_id=? AND status='active'").bind(clientId),
    db.prepare("SELECT COUNT(*) as cnt FROM projects WHERE client_id=? AND status='completed'").bind(clientId),
    db.prepare("SELECT COUNT(*) as cnt FROM invoices WHERE client_id=? AND status IN ('sent','viewed','partial','overdue')").bind(clientId),
    db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE client_id=? AND status='completed'").bind(clientId),
    db.prepare("SELECT COUNT(*) as cnt FROM notifications WHERE recipient=(SELECT email FROM clients WHERE id=?) AND is_read=0").bind(clientId),
  ]);
  return {
    activeProjects:     (active.results?.[0] as { cnt: number })?.cnt ?? 0,
    completedProjects:  (completed.results?.[0] as { cnt: number })?.cnt ?? 0,
    unpaidInvoices:     (unpaid.results?.[0] as { cnt: number })?.cnt ?? 0,
    totalPaid:          (paid.results?.[0] as { total: number })?.total ?? 0,
    unreadNotifications:(notifs.results?.[0] as { cnt: number })?.cnt ?? 0,
  };
}
