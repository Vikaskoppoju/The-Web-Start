import { NextRequest } from "next/server";
import { getDB, ok, err, getClientId } from "@/lib/api-helpers";
import { getProjectById, getProjectMilestones, getProjectFiles } from "@/lib/db-dashboard";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();
    const project = await getProjectById(db, Number(id));
    if (!project || project.client_id !== getClientId(request)) return err("Not found", 404);
    const [milestones, files] = await Promise.all([
      getProjectMilestones(db, Number(id)),
      getProjectFiles(db, Number(id)),
    ]);
    return ok({ ...project, milestones, files });
  } catch { return err("Failed", 500); }
}
