import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { createMilestone, toggleMilestone, deleteMilestone } from "@/lib/db-dashboard";
import { z } from "zod";


const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  due_date: z.string().optional(),
  sort_order: z.number().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Handle toggle
    if (body._action === "toggle") {
      await toggleMilestone(getDB(), Number(body.milestone_id), body.completed);
      return ok({ message: "Updated" });
    }
    if (body._action === "delete") {
      await deleteMilestone(getDB(), Number(body.milestone_id));
      return ok({ message: "Deleted" });
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    await createMilestone(getDB(), { project_id: Number(id), ...parsed.data });
    return ok({ message: "Milestone created" }, 201);
  } catch { return err("Failed", 500); }
}
