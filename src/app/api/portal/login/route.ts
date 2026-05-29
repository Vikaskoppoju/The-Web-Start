import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getClientByEmail } from "@/lib/db-dashboard";
import { signClientJwt, buildClientAuthCookie } from "@/lib/client-auth";
import { loginSchema } from "@/lib/validations";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return err("Invalid input", 400);

    const db = getDB();
    const client = await getClientByEmail(db, parsed.data.email);
    if (!client) return err("Invalid email or password", 401);
    if (client.status !== "active") return err("Account is not active. Contact support.", 403);

    const valid = await bcrypt.compare(parsed.data.password, client.password_hash);
    if (!valid) return err("Invalid email or password", 401);

    const token = await signClientJwt({ sub: client.id, email: client.email, name: client.name });
    const response = ok({ name: client.name, email: client.email });
    response.headers.set("Set-Cookie", buildClientAuthCookie(token));
    return response;
  } catch { return err("Server error", 500); }
}
