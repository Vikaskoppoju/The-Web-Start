-- Razorpay order tracking
CREATE TABLE IF NOT EXISTS razorpay_orders (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  razorpay_order_id   TEXT NOT NULL UNIQUE,
  invoice_id          INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  client_id           INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount              REAL NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'INR',
  status              TEXT NOT NULL DEFAULT 'created', -- created|paid|failed
  razorpay_payment_id TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rz_order_invoice ON razorpay_orders(invoice_id);
