import { type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAllClients, createClient } from "@/lib/db-dashboard";
import { z } from "zod";


const createSchema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  password: z.string().min(8),
  company:  z.string().max(100).optional(),
  phone:    z.string().max(20).optional(),
  country:  z.string().max(60).optional(),
  address:  z.string().max(200).optional(),
  city:     z.string().max(100).optional(),
  gstin:    z.string().max(20).optional(),
});

export async function GET() {
  try {
    const clients = await getAllClients(getDB());
    return ok(clients);
  } catch { return err("Failed", 500); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    const hash = await bcrypt.hash(parsed.data.password, 12);
    await createClient(getDB(), { ...parsed.data, password_hash: hash });
    return ok({ message: "Client created" }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    if (msg.includes("UNIQUE")) return err("Email already exists", 409);
    return err("Failed to create client", 500);
  }
}
