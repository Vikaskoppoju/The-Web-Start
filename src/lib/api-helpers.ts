import { NextResponse } from "next/server";
import { getDb, type TursoDb } from "./turso";

// Returns a Turso DB client (works on Vercel, local, anywhere)
export function getDB(): TursoDb {
  return getDb();
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function getHeader(request: Request, name: string): string | null {
  return (request as unknown as { headers: { get(n: string): string | null } }).headers.get(name);
}

export function getAdminId(request: Request): number {
  return Number(getHeader(request, "x-admin-id") ?? "0");
}

export function getClientId(request: Request): number {
  return Number(getHeader(request, "x-client-id") ?? "0");
}

export function getClientEmail(request: Request): string {
  return getHeader(request, "x-client-email") ?? "";
}
