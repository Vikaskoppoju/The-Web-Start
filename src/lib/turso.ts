import { createClient, type Client, type ResultSet, type InValue } from "@libsql/client";

let _client: Client | null = null;

export function getTursoClient(): Client {
  if (_client) return _client;
  const url   = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  _client = createClient({ url, authToken: token });
  return _client;
}

// D1-compatible wrapper so existing query code works unchanged
export interface TursoDb {
  prepare(sql: string): TursoStmt;
  batch<T = unknown>(stmts: TursoStmt[]): Promise<{ results?: T[] }[]>;
  exec(sql: string): Promise<{ count: number; duration: number }>;
}

export interface TursoStmt {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bind(...args: any[]): TursoStmt;
  first<T = unknown>(col?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean; meta: unknown }>;
}

class Stmt implements TursoStmt {
  private _sql: string;
  private _args: InValue[] = [];
  private _db: Client;

  constructor(sql: string, db: Client) {
    this._sql = sql;
    this._db  = db;
  }

  bind(...args: InValue[]): TursoStmt {
    this._args = args;
    return this;
  }

  async first<T = unknown>(): Promise<T | null> {
    const rs: ResultSet = await this._db.execute({ sql: this._sql, args: this._args });
    if (!rs.rows.length) return null;
    const row = rs.rows[0];
    // Convert libsql Row → plain object
    const obj: Record<string, unknown> = {};
    rs.columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj as T;
  }

  async all<T = unknown>(): Promise<{ results?: T[] }> {
    const rs: ResultSet = await this._db.execute({ sql: this._sql, args: this._args });
    const results = rs.rows.map(row => {
      const obj: Record<string, unknown> = {};
      rs.columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
      return obj as T;
    });
    return { results };
  }

  async run(): Promise<{ success: boolean; meta: unknown }> {
    const rs = await this._db.execute({ sql: this._sql, args: this._args });
    return { success: true, meta: { rowsAffected: rs.rowsAffected, lastInsertRowid: rs.lastInsertRowid } };
  }
}

class TursoDbImpl implements TursoDb {
  constructor(private db: Client) {}

  prepare(sql: string): TursoStmt {
    return new Stmt(sql, this.db);
  }

  async batch<T = unknown>(stmts: TursoStmt[]): Promise<{ results?: T[] }[]> {
    // Execute sequentially — Turso batch needs InStatement[], convert
    const results: { results?: T[] }[] = [];
    for (const stmt of stmts) {
      results.push(await stmt.all<T>());
    }
    return results;
  }

  async exec(sql: string): Promise<{ count: number; duration: number }> {
    await this.db.executeMultiple(sql);
    return { count: 1, duration: 0 };
  }
}

export function getDb(): TursoDb {
  return new TursoDbImpl(getTursoClient());
}
