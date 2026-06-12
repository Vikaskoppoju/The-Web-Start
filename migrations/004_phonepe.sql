-- PhonePe transaction tracking
CREATE TABLE IF NOT EXISTS phonepe_transactions (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_transaction_id TEXT NOT NULL UNIQUE,
  invoice_id             INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  client_id              INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount                 REAL NOT NULL,
  currency               TEXT NOT NULL DEFAULT 'INR',
  status                 TEXT NOT NULL DEFAULT 'pending', -- pending|success|failed
  phonepe_response       TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_phonepe_txn_invoice ON phonepe_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_phonepe_txn_status  ON phonepe_transactions(status);
