import { NextRequest } from "next/server";
import { getDB, ok, err, getClientId } from "@/lib/api-helpers";
import { getClientById, updateClient } from "@/lib/db-dashboard";
import { z } from "zod";


const schema = z.object({
  name:    z.string().min(2).max(100).optional(),
  phone:   z.string().max(20).optional(),
  company: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  city:    z.string().max(100).optional(),
  country: z.string().max(60).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const client = await getClientById(getDB(), getClientId(request));
    if (!client) return err("Not found", 404);
    return ok(client);
  } catch { return err("Failed", 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    await updateClient(getDB(), getClientId(request), parsed.data);
    return ok({ message: "Profile updated" });
  } catch { return err("Failed", 500); }
}
