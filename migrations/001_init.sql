-- The Web Start — D1 Database Schema
-- Run: wrangler d1 execute thewebstart-db --file=./migrations/001_init.sql

-- ─── SERVICES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  title       TEXT    NOT NULL,
  tagline     TEXT    NOT NULL,
  description TEXT    NOT NULL,
  icon_name   TEXT    NOT NULL,
  cover_url   TEXT,
  features    TEXT    NOT NULL DEFAULT '[]',
  process     TEXT    NOT NULL DEFAULT '[]',
  meta_title  TEXT,
  meta_desc   TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── PORTFOLIO ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  client        TEXT    NOT NULL,
  category      TEXT    NOT NULL,
  tags          TEXT    NOT NULL DEFAULT '[]',
  summary       TEXT    NOT NULL,
  description   TEXT    NOT NULL,
  cover_url     TEXT    NOT NULL,
  gallery_urls  TEXT    NOT NULL DEFAULT '[]',
  live_url      TEXT,
  github_url    TEXT,
  year          INTEGER,
  featured      INTEGER NOT NULL DEFAULT 0,
  is_published  INTEGER NOT NULL DEFAULT 1,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── TESTIMONIALS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  author_name TEXT    NOT NULL,
  author_role TEXT    NOT NULL,
  company     TEXT,
  avatar_url  TEXT,
  content     TEXT    NOT NULL,
  rating      INTEGER NOT NULL DEFAULT 5,
  service_tag TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── BLOG POSTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  excerpt       TEXT    NOT NULL,
  cover_url     TEXT,
  tags          TEXT    NOT NULL DEFAULT '[]',
  author        TEXT    NOT NULL DEFAULT 'The Web Start',
  mdx_content   TEXT    NOT NULL,
  reading_time  INTEGER,
  is_published  INTEGER NOT NULL DEFAULT 0,
  published_at  TEXT,
  meta_title    TEXT,
  meta_desc     TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── CONTACT SUBMISSIONS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT,
  subject     TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'new',
  ip_address  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── PROJECT INQUIRIES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_inquiries (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT    NOT NULL,
  email            TEXT    NOT NULL,
  phone            TEXT,
  company          TEXT,
  service_needed   TEXT    NOT NULL,
  budget_range     TEXT,
  timeline         TEXT,
  project_details  TEXT    NOT NULL,
  reference_urls   TEXT    DEFAULT '[]',
  how_found        TEXT,
  status           TEXT    NOT NULL DEFAULT 'new',
  admin_notes      TEXT,
  ip_address       TEXT,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── ADMIN USERS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured  ON portfolio_items(featured);
CREATE INDEX IF NOT EXISTS idx_blog_published      ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_slug           ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_contact_status      ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_inquiry_status      ON project_inquiries(status);

-- ─── SEED SERVICES ──────────────────────────────────────────────────────────
INSERT OR IGNORE INTO services (slug, title, tagline, description, icon_name, features, process, sort_order) VALUES
('full-stack-development', 'Full-Stack Development', 'End-to-end web applications built to scale', 'We design, build, and deploy high-performance web applications using modern technologies like Next.js, React, Node.js, and cloud-native infrastructure.', 'Code2', '["Custom web application development","RESTful & GraphQL APIs","Database design & optimization","Cloud deployment (Cloudflare, Vercel, AWS)","Performance optimization","Third-party integrations"]', '[{"step":1,"title":"Discovery","desc":"We understand your goals, users, and technical requirements."},{"step":2,"title":"Architecture","desc":"We design the system architecture and technology stack."},{"step":3,"title":"Development","desc":"Agile sprints with regular demos and feedback loops."},{"step":4,"title":"Testing","desc":"End-to-end testing, security audits, and performance tuning."},{"step":5,"title":"Launch","desc":"Deployment, monitoring setup, and knowledge transfer."}]', 1),
('wordpress-development', 'WordPress Development', 'Powerful WordPress solutions for every business', 'From custom themes to complex plugins and WooCommerce stores, we deliver WordPress solutions that are fast, secure, and easy to manage.', 'Globe', '["Custom theme development","Plugin development & customization","WooCommerce stores","Performance & speed optimization","Security hardening","Migration & maintenance"]', '[{"step":1,"title":"Planning","desc":"Site map, wireframes, and content strategy."},{"step":2,"title":"Design","desc":"Custom design aligned with your brand."},{"step":3,"title":"Development","desc":"Clean, maintainable WordPress code."},{"step":4,"title":"Content","desc":"Content migration and SEO setup."},{"step":5,"title":"Launch","desc":"Testing, staging, and go-live."}]', 2),
('ui-ux-design', 'UI/UX Design', 'Interfaces that users love and businesses trust', 'We create intuitive, beautiful digital experiences through research-driven design, prototyping, and iterative user testing.', 'Palette', '["User research & persona creation","Wireframing & prototyping","High-fidelity UI design","Design systems & component libraries","Usability testing","Figma handoff & developer collaboration"]', '[{"step":1,"title":"Research","desc":"User interviews, competitor analysis, and heuristic evaluation."},{"step":2,"title":"Strategy","desc":"Information architecture and user journey mapping."},{"step":3,"title":"Wireframes","desc":"Low-fidelity wireframes for rapid iteration."},{"step":4,"title":"Visual Design","desc":"High-fidelity mockups with your brand identity."},{"step":5,"title":"Handoff","desc":"Annotated Figma files and design system documentation."}]', 3),
('seo', 'SEO', 'Rank higher. Get found. Grow organically.', 'Our data-driven SEO strategies combine technical optimization, content strategy, and link building to drive sustainable organic growth.', 'TrendingUp', '["Technical SEO audits","Keyword research & strategy","On-page optimization","Content strategy & creation","Link building","Monthly reporting & analytics"]', '[{"step":1,"title":"Audit","desc":"Comprehensive technical and content audit."},{"step":2,"title":"Strategy","desc":"Keyword mapping and competitive gap analysis."},{"step":3,"title":"Optimization","desc":"On-page and technical fixes implementation."},{"step":4,"title":"Content","desc":"Content creation and optimization."},{"step":5,"title":"Monitor","desc":"Ongoing tracking, reporting, and iteration."}]', 4),
('social-media-marketing', 'Social Media Marketing', 'Build your brand. Engage your audience. Drive results.', 'We manage and grow your social media presence across all major platforms with strategic content, community management, and paid campaigns.', 'Share2', '["Social media strategy","Content creation & scheduling","Community management","Paid social campaigns (Meta, LinkedIn)","Influencer outreach","Monthly analytics reports"]', '[{"step":1,"title":"Audit","desc":"Review of existing presence and competitor benchmarking."},{"step":2,"title":"Strategy","desc":"Platform selection, content pillars, and posting cadence."},{"step":3,"title":"Content","desc":"Design and copywriting for all posts."},{"step":4,"title":"Publish","desc":"Scheduling, posting, and community engagement."},{"step":5,"title":"Report","desc":"Monthly performance reviews and strategy refinement."}]', 5),
('branding', 'Branding', 'Your identity, crafted to stand out and last', 'From brand strategy to visual identity, we create cohesive brand systems that communicate your values and resonate with your audience.', 'Sparkles', '["Brand strategy & positioning","Logo design & brand mark","Color palette & typography","Brand guidelines document","Stationery & collateral design","Brand voice & messaging"]', '[{"step":1,"title":"Discovery","desc":"Brand workshop to understand vision, values, and audience."},{"step":2,"title":"Research","desc":"Competitor analysis and market positioning."},{"step":3,"title":"Concepts","desc":"Multiple creative directions presented for feedback."},{"step":4,"title":"Refinement","desc":"Iterative refinement of chosen direction."},{"step":5,"title":"Delivery","desc":"Complete brand guidelines and asset package."}]', 6);
