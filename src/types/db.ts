export interface Service {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon_name: string;
  cover_url: string | null;
  features: string;       // JSON string — parse to string[]
  process: string;        // JSON string — parse to ProcessStep[]
  meta_title: string | null;
  meta_desc: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  desc: string;
}

export interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  client: string;
  category: string;
  tags: string;           // JSON string — parse to string[]
  summary: string;
  description: string;
  cover_url: string;
  gallery_urls: string;   // JSON string — parse to string[]
  live_url: string | null;
  github_url: string | null;
  year: number | null;
  featured: number;
  is_published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string;
  company: string | null;
  avatar_url: string | null;
  content: string;
  rating: number;
  service_tag: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  tags: string;           // JSON string — parse to string[]
  author: string;
  mdx_content: string;
  reading_time: number | null;
  is_published: number;
  published_at: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  ip_address: string | null;
  created_at: string;
}

export interface ProjectInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_needed: string;
  budget_range: string | null;
  timeline: string | null;
  project_details: string;
  reference_urls: string | null;
  how_found: string | null;
  status: "new" | "contacted" | "proposal" | "won" | "lost";
  admin_notes: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}
