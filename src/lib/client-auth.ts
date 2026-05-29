import { SignJWT, jwtVerify } from "jose";

const CLIENT_COOKIE = "tws_client_token";
const EXPIRY = "30d";

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error("ADMIN_JWT_SECRET missing");
  return new TextEncoder().encode(s + "_client");
}

export interface ClientJwtPayload {
  sub: number;          // client id
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export async function signClientJwt(payload: Omit<ClientJwtPayload, "iat"|"exp">): Promise<string> {
  return new SignJWT({ sub: String(payload.sub), email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

export async function verifyClientJwt(token: string): Promise<ClientJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: Number(payload.sub),
      email: payload.email as string,
      name: payload.name as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}

export function getClientTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CLIENT_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function buildClientAuthCookie(token: string): string {
  return `${CLIENT_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`;
}

export function buildClientClearCookie(): string {
  return `${CLIENT_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export { CLIENT_COOKIE };
