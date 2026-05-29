import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAllProjects, createProject } from "@/lib/db-dashboard";
import { z } from "zod";


const schema = z.object({
  client_id:    z.number().int().positive(),
  title:        z.string().min(2).max(200),
  description:  z.string().max(2000).optional(),
  service_type: z.string().min(1),
  status:       z.string().optional(),
  priority:     z.string().optional(),
  start_date:   z.string().optional(),
  due_date:     z.string().optional(),
  budget:       z.number().positive().optional(),
  notes:        z.string().max(5000).optional(),
  client_notes: z.string().max(5000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const all = await getAllProjects(getDB());
    const filtered = status ? all.filter(p => p.status === status) : all;
    return ok(filtered);
  } catch { return err("Failed", 500); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    await createProject(getDB(), parsed.data);
    return ok({ message: "Project created" }, 201);
  } catch { return err("Failed to create project", 500); }
}
