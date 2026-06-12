import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getClientByEmail, createClient } from "@/lib/db-dashboard";
import { signClientJwt } from "@/lib/client-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone:    z.string().optional(),
  company:  z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);

    const { name, email, password, phone, company } = parsed.data;
    const db = getDB();

    const existing = await getClientByEmail(db, email);
    if (existing) return err("An account with this email already exists", 409);

    const password_hash = await bcrypt.hash(password, 12);
    await createClient(db, { name, email, password_hash, phone, company });

    const client = await getClientByEmail(db, email);
    if (!client) return err("Registration failed", 500);

    // Auto sign-in after registration
    const token = await signClientJwt({ sub: client.id, email: client.email, name: client.name });
    const jar = await cookies();
    jar.set("tws_client_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return ok({ message: "Account created", name: client.name }, 201);
  } catch (e) {
    console.error("Register error:", e);
    return err("Registration failed", 500);
  }
}
