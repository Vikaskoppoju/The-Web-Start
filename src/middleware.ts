import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookieHeader, verifyJwt } from "@/lib/auth";
import { getClientTokenFromCookie, verifyClientJwt } from "@/lib/client-auth";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/api/client/:path*",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");
  const isApi = pathname.startsWith("/api/");

  // ── Admin routes ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = getTokenFromCookieHeader(cookieHeader);
    if (!token) return unauthorized(request, isApi, "/login");
    const payload = await verifyJwt(token);
    if (!payload) return unauthorized(request, isApi, "/login");
    const headers = new Headers(request.headers);
    headers.set("x-admin-id", String(payload.sub));
    return NextResponse.next({ request: { headers } });
  }

  // ── Client dashboard routes ─────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/client")) {
    const token = getClientTokenFromCookie(cookieHeader);
    if (!token) return unauthorized(request, isApi, "/portal/login");
    const payload = await verifyClientJwt(token);
    if (!payload) return unauthorized(request, isApi, "/portal/login");
    const headers = new Headers(request.headers);
    headers.set("x-client-id", String(payload.sub));
    headers.set("x-client-email", payload.email);
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

function unauthorized(request: NextRequest, isApi: boolean, loginPath: string) {
  if (isApi) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(loginPath, request.url);
  url.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}
