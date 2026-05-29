import type { TursoDb as D1Database } from "./turso";
import type {
  Service,
  PortfolioItem,
  Testimonial,
  BlogPost,
  ContactSubmission,
  ProjectInquiry,
  AdminUser,
} from "@/types/db";

export type { D1Database };

// ── Services ─────────────────────────────────────────────────────────────────

export async function getActiveServices(db: D1Database): Promise<Service[]> {
  const { results } = await db
    .prepare("SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC")
    .all<Service>();
  return results ?? [];
}

export async function getServiceBySlug(db: D1Database, slug: string): Promise<Service | null> {
  return db.prepare("SELECT * FROM services WHERE slug = ?").bind(slug).first<Service>();
}

export async function getAllServices(db: D1Database): Promise<Service[]> {
  const { results } = await db
    .prepare("SELECT * FROM services ORDER BY sort_order ASC")
    .all<Service>();
  return results ?? [];
}

export async function updateService(db: D1Database, id: number, data: Partial<Service>) {
  const fields = Object.keys(data)
    .filter((k) => k !== "id" && k !== "created_at")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.keys(data)
    .filter((k) => k !== "id" && k !== "created_at")
    .map((k) => (data as Record<string, unknown>)[k]);
  return db
    .prepare(`UPDATE services SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export async function getPublishedPortfolio(
  db: D1Database,
  opts: { category?: string; featured?: boolean; page?: number; pageSize?: number } = {}
): Promise<{ items: PortfolioItem[]; total: number }> {
  const { category, featured, page = 1, pageSize = 12 } = opts;
  const conditions: string[] = ["is_published = 1"];
  const bindings: unknown[] = [];
  if (category) { conditions.push("category = ?"); bindings.push(category); }
  if (featured !== undefined) { conditions.push("featured = ?"); bindings.push(featured ? 1 : 0); }
  const where = conditions.join(" AND ");
  const offset = (page - 1) * pageSize;

  const countResult = await db
    .prepare(`SELECT COUNT(*) as total FROM portfolio_items WHERE ${where}`)
    .bind(...bindings)
    .first<{ total: number }>();

  const { results } = await db
    .prepare(`SELECT * FROM portfolio_items WHERE ${where} ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?`)
    .bind(...bindings, pageSize, offset)
    .all<PortfolioItem>();

  return { items: results ?? [], total: countResult?.total ?? 0 };
}

export async function getPortfolioBySlug(db: D1Database, slug: string): Promise<PortfolioItem | null> {
  return db
    .prepare("SELECT * FROM portfolio_items WHERE slug = ? AND is_published = 1")
    .bind(slug)
    .first<PortfolioItem>();
}

export async function getAllPortfolioItems(db: D1Database): Promise<PortfolioItem[]> {
  const { results } = await db
    .prepare("SELECT * FROM portfolio_items ORDER BY sort_order ASC, created_at DESC")
    .all<PortfolioItem>();
  return results ?? [];
}

export async function createPortfolioItem(db: D1Database, data: Omit<PortfolioItem, "id" | "created_at" | "updated_at">) {
  return db
    .prepare(
      `INSERT INTO portfolio_items (slug,title,client,category,tags,summary,description,cover_url,gallery_urls,live_url,github_url,year,featured,is_published,sort_order)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      data.slug, data.title, data.client, data.category, data.tags,
      data.summary, data.description, data.cover_url, data.gallery_urls,
      data.live_url ?? null, data.github_url ?? null, data.year ?? null,
      data.featured, data.is_published, data.sort_order
    )
    .run();
}

export async function updatePortfolioItem(db: D1Database, id: number, data: Partial<PortfolioItem>) {
  const allowed = ["slug","title","client","category","tags","summary","description","cover_url","gallery_urls","live_url","github_url","year","featured","is_published","sort_order"];
  const keys = Object.keys(data).filter((k) => allowed.includes(k));
  const fields = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => (data as Record<string, unknown>)[k]);
  return db
    .prepare(`UPDATE portfolio_items SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deletePortfolioItem(db: D1Database, id: number) {
  return db.prepare("DELETE FROM portfolio_items WHERE id = ?").bind(id).run();
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function getActiveTestimonials(db: D1Database): Promise<Testimonial[]> {
  const { results } = await db
    .prepare("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC")
    .all<Testimonial>();
  return results ?? [];
}

export async function getAllTestimonials(db: D1Database): Promise<Testimonial[]> {
  const { results } = await db
    .prepare("SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC")
    .all<Testimonial>();
  return results ?? [];
}

export async function createTestimonial(db: D1Database, data: Omit<Testimonial, "id" | "created_at">) {
  return db
    .prepare("INSERT INTO testimonials (author_name,author_role,company,avatar_url,content,rating,service_tag,is_active,sort_order) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(data.author_name, data.author_role, data.company ?? null, data.avatar_url ?? null, data.content, data.rating, data.service_tag ?? null, data.is_active, data.sort_order)
    .run();
}

export async function updateTestimonial(db: D1Database, id: number, data: Partial<Testimonial>) {
  const allowed = ["author_name","author_role","company","avatar_url","content","rating","service_tag","is_active","sort_order"];
  const keys = Object.keys(data).filter((k) => allowed.includes(k));
  const fields = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => (data as Record<string, unknown>)[k]);
  return db
    .prepare(`UPDATE testimonials SET ${fields} WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteTestimonial(db: D1Database, id: number) {
  return db.prepare("DELETE FROM testimonials WHERE id = ?").bind(id).run();
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

export async function getPublishedBlogPosts(db: D1Database, opts: { page?: number; pageSize?: number } = {}): Promise<{ items: BlogPost[]; total: number }> {
  const { page = 1, pageSize = 9 } = opts;
  const offset = (page - 1) * pageSize;
  const countResult = await db
    .prepare("SELECT COUNT(*) as total FROM blog_posts WHERE is_published = 1")
    .first<{ total: number }>();
  const { results } = await db
    .prepare("SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT ? OFFSET ?")
    .bind(pageSize, offset)
    .all<BlogPost>();
  return { items: results ?? [], total: countResult?.total ?? 0 };
}

export async function getBlogPostBySlug(db: D1Database, slug: string): Promise<BlogPost | null> {
  return db
    .prepare("SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1")
    .bind(slug)
    .first<BlogPost>();
}

export async function getAllBlogPosts(db: D1Database): Promise<BlogPost[]> {
  const { results } = await db
    .prepare("SELECT * FROM blog_posts ORDER BY created_at DESC")
    .all<BlogPost>();
  return results ?? [];
}

export async function createBlogPost(db: D1Database, data: Omit<BlogPost, "id" | "created_at" | "updated_at">) {
  return db
    .prepare("INSERT INTO blog_posts (slug,title,excerpt,cover_url,tags,author,mdx_content,reading_time,is_published,published_at,meta_title,meta_desc) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(data.slug, data.title, data.excerpt, data.cover_url ?? null, data.tags, data.author, data.mdx_content, data.reading_time ?? null, data.is_published, data.published_at ?? null, data.meta_title ?? null, data.meta_desc ?? null)
    .run();
}

export async function updateBlogPost(db: D1Database, id: number, data: Partial<BlogPost>) {
  const allowed = ["slug","title","excerpt","cover_url","tags","author","mdx_content","reading_time","is_published","published_at","meta_title","meta_desc"];
  const keys = Object.keys(data).filter((k) => allowed.includes(k));
  const fields = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => (data as Record<string, unknown>)[k]);
  return db
    .prepare(`UPDATE blog_posts SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteBlogPost(db: D1Database, id: number) {
  return db.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
}

// ── Contact Submissions ───────────────────────────────────────────────────────

export async function createContactSubmission(db: D1Database, data: Omit<ContactSubmission, "id" | "created_at" | "status">) {
  return db
    .prepare("INSERT INTO contact_submissions (name,email,phone,subject,message,ip_address) VALUES (?,?,?,?,?,?)")
    .bind(data.name, data.email, data.phone ?? null, data.subject, data.message, data.ip_address ?? null)
    .run();
}

export async function getContactSubmissions(db: D1Database, status?: string): Promise<ContactSubmission[]> {
  const query = status
    ? "SELECT * FROM contact_submissions WHERE status = ? ORDER BY created_at DESC"
    : "SELECT * FROM contact_submissions ORDER BY created_at DESC";
  const stmt = status ? db.prepare(query).bind(status) : db.prepare(query);
  const { results } = await stmt.all<ContactSubmission>();
  return results ?? [];
}

export async function updateContactStatus(db: D1Database, id: number, status: string) {
  return db.prepare("UPDATE contact_submissions SET status = ? WHERE id = ?").bind(status, id).run();
}

// ── Project Inquiries ─────────────────────────────────────────────────────────

export async function createProjectInquiry(db: D1Database, data: Omit<ProjectInquiry, "id" | "created_at" | "updated_at" | "status" | "admin_notes">) {
  return db
    .prepare("INSERT INTO project_inquiries (name,email,phone,company,service_needed,budget_range,timeline,project_details,reference_urls,how_found,ip_address) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
    .bind(data.name, data.email, data.phone ?? null, data.company ?? null, data.service_needed, data.budget_range ?? null, data.timeline ?? null, data.project_details, data.reference_urls ?? null, data.how_found ?? null, data.ip_address ?? null)
    .run();
}

export async function getProjectInquiries(db: D1Database, status?: string): Promise<ProjectInquiry[]> {
  const query = status
    ? "SELECT * FROM project_inquiries WHERE status = ? ORDER BY created_at DESC"
    : "SELECT * FROM project_inquiries ORDER BY created_at DESC";
  const stmt = status ? db.prepare(query).bind(status) : db.prepare(query);
  const { results } = await stmt.all<ProjectInquiry>();
  return results ?? [];
}

export async function updateInquiry(db: D1Database, id: number, data: { status?: string; admin_notes?: string }) {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status); }
  if (data.admin_notes !== undefined) { fields.push("admin_notes = ?"); values.push(data.admin_notes); }
  if (fields.length === 0) return;
  return db
    .prepare(`UPDATE project_inquiries SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

// ── Admin Users ───────────────────────────────────────────────────────────────

export async function getAdminByEmail(db: D1Database, email: string): Promise<AdminUser | null> {
  return db.prepare("SELECT * FROM admin_users WHERE email = ?").bind(email).first<AdminUser>();
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export async function getDashboardStats(db: D1Database) {
  const [portfolio, testimonials, contacts, inquiries] = await db.batch([
    db.prepare("SELECT COUNT(*) as count FROM portfolio_items"),
    db.prepare("SELECT COUNT(*) as count FROM testimonials WHERE is_active = 1"),
    db.prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'"),
    db.prepare("SELECT COUNT(*) as count FROM project_inquiries WHERE status = 'new'"),
  ]);
  return {
    portfolio:   (portfolio.results?.[0] as { count: number })?.count ?? 0,
    testimonials:(testimonials.results?.[0] as { count: number })?.count ?? 0,
    newContacts: (contacts.results?.[0] as { count: number })?.count ?? 0,
    newInquiries:(inquiries.results?.[0] as { count: number })?.count ?? 0,
  };
}
