import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAdminByEmail } from "@/lib/db";
import { signJwt, buildAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return err("Invalid input", 400);

    const db = getDB();
    const admin = await getAdminByEmail(db, parsed.data.email);
    if (!admin) return err("Invalid email or password", 401);

    const valid = await bcrypt.compare(parsed.data.password, admin.password_hash);
    if (!valid) return err("Invalid email or password", 401);

    const token = await signJwt({ sub: admin.id, email: admin.email });
    const response = ok({ email: admin.email });
    response.headers.set("Set-Cookie", buildAuthCookie(token));
    return response;
  } catch {
    return err("Server error", 500);
  }
}
