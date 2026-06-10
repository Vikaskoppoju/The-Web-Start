-- Quotations (Proposals / Estimates)
CREATE TABLE IF NOT EXISTS quotations (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_no             TEXT    NOT NULL UNIQUE,
  client_id            INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  -- Snapshot of client info at time of quote
  client_name          TEXT    NOT NULL,
  client_email         TEXT,
  client_phone         TEXT,
  client_company       TEXT,
  client_address       TEXT,
  -- Quote meta
  title                TEXT    NOT NULL DEFAULT 'Quotation',
  status               TEXT    NOT NULL DEFAULT 'draft',   -- draft|sent|accepted|rejected|expired
  valid_until          TEXT,
  currency             TEXT    NOT NULL DEFAULT 'INR',
  -- Financials
  subtotal             REAL    NOT NULL DEFAULT 0,
  discount_type        TEXT    NOT NULL DEFAULT 'percent', -- percent|fixed
  discount_value       REAL    NOT NULL DEFAULT 0,
  discount_amount      REAL    NOT NULL DEFAULT 0,
  tax_percent          REAL    NOT NULL DEFAULT 18,
  tax_amount           REAL    NOT NULL DEFAULT 0,
  total                REAL    NOT NULL DEFAULT 0,
  -- Content
  terms                TEXT,
  notes                TEXT,
  -- Lifecycle timestamps
  sent_at              TEXT,
  accepted_at          TEXT,
  rejected_at          TEXT,
  converted_invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  created_at           TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Line items for each quotation
CREATE TABLE IF NOT EXISTS quotation_items (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  quotation_id     INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  service          TEXT    NOT NULL,
  description      TEXT,           -- bullet-point details, newline-separated
  quantity         REAL    NOT NULL DEFAULT 1,
  unit             TEXT    NOT NULL DEFAULT 'project', -- project|hour|day|month|unit
  unit_price       REAL    NOT NULL DEFAULT 0,
  discount_percent REAL    NOT NULL DEFAULT 0,
  tax_percent      REAL    NOT NULL DEFAULT 0,
  amount           REAL    NOT NULL DEFAULT 0,          -- (qty * unit_price) * (1 - disc/100)
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);
