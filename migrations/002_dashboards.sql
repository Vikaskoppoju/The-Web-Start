-- The Web Start — Migration 002: Dashboards & Features
-- Run: wrangler d1 execute thewebstart-db --file=./migrations/002_dashboards.sql

-- ─── CLIENTS (portal users) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  company       TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  address       TEXT,
  city          TEXT,
  country       TEXT    NOT NULL DEFAULT 'India',
  gstin         TEXT,
  status        TEXT    NOT NULL DEFAULT 'active',   -- 'active'|'inactive'|'suspended'
  notes         TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id       INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title           TEXT    NOT NULL,
  description     TEXT,
  service_type    TEXT    NOT NULL,   -- matches services.slug
  status          TEXT    NOT NULL DEFAULT 'inquiry',
  -- 'inquiry'|'proposal'|'active'|'review'|'completed'|'paused'|'cancelled'
  priority        TEXT    NOT NULL DEFAULT 'medium',  -- 'low'|'medium'|'high'|'urgent'
  start_date      TEXT,
  due_date        TEXT,
  completed_date  TEXT,
  budget          REAL,
  amount_paid     REAL    NOT NULL DEFAULT 0,
  progress        INTEGER NOT NULL DEFAULT 0,         -- 0–100
  live_url        TEXT,
  repo_url        TEXT,
  notes           TEXT,                               -- admin internal notes
  client_notes    TEXT,                               -- visible to client
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── PROJECT MILESTONES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS milestones (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  description TEXT,
  due_date    TEXT,
  completed   INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── PROJECT FILES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_files (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name         TEXT    NOT NULL,
  file_url     TEXT    NOT NULL,     -- R2 public URL
  file_key     TEXT    NOT NULL,     -- R2 object key for deletion
  file_size    INTEGER,              -- bytes
  mime_type    TEXT,
  uploaded_by  TEXT    NOT NULL DEFAULT 'admin',  -- 'admin' | 'client'
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── INVOICES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no    TEXT    NOT NULL UNIQUE,   -- e.g. TWS-2025-001
  client_id     INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  project_id    INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  status        TEXT    NOT NULL DEFAULT 'draft',
  -- 'draft'|'sent'|'viewed'|'partial'|'paid'|'overdue'|'cancelled'
  issue_date    TEXT    NOT NULL DEFAULT (date('now')),
  due_date      TEXT    NOT NULL,
  subtotal      REAL    NOT NULL DEFAULT 0,
  tax_rate      REAL    NOT NULL DEFAULT 18,    -- GST %
  tax_amount    REAL    NOT NULL DEFAULT 0,
  discount      REAL    NOT NULL DEFAULT 0,
  total         REAL    NOT NULL DEFAULT 0,
  amount_paid   REAL    NOT NULL DEFAULT 0,
  currency      TEXT    NOT NULL DEFAULT 'INR',
  notes         TEXT,
  terms         TEXT,
  sent_at       TEXT,
  viewed_at     TEXT,
  paid_at       TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── INVOICE ITEMS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id  INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT    NOT NULL,
  quantity    REAL    NOT NULL DEFAULT 1,
  unit_price  REAL    NOT NULL,
  amount      REAL    NOT NULL,     -- quantity * unit_price
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ─── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id      INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  client_id       INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount          REAL    NOT NULL,
  currency        TEXT    NOT NULL DEFAULT 'INR',
  method          TEXT    NOT NULL DEFAULT 'bank_transfer',
  -- 'bank_transfer'|'upi'|'razorpay'|'stripe'|'cash'|'cheque'
  reference_no    TEXT,                   -- transaction ID / UTR
  payment_date    TEXT    NOT NULL DEFAULT (date('now')),
  status          TEXT    NOT NULL DEFAULT 'completed',
  -- 'pending'|'completed'|'failed'|'refunded'
  notes           TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient   TEXT    NOT NULL,   -- 'admin' | client email
  type        TEXT    NOT NULL,
  -- 'project_update'|'invoice_sent'|'payment_received'|'message'|'file_uploaded'|'milestone'
  title       TEXT    NOT NULL,
  body        TEXT    NOT NULL,
  link        TEXT,               -- internal link to navigate to
  is_read     INTEGER NOT NULL DEFAULT 0,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  invoice_id  INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── CLIENT SESSIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_sessions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id   INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token_hash  TEXT    NOT NULL UNIQUE,  -- SHA-256 of the JWT for revocation
  expires_at  TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_client      ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status      ON projects(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client      ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status      ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_no          ON invoices(invoice_no);
CREATE INDEX IF NOT EXISTS idx_payments_invoice     ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_client      ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recip  ON notifications(recipient, is_read);
CREATE INDEX IF NOT EXISTS idx_milestones_project   ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_files_project        ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_clients_email        ON clients(email);
