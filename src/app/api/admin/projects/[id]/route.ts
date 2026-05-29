import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getProjectById, updateProject, deleteProject, getProjectMilestones, getProjectFiles } from "@/lib/db-dashboard";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDB();
    const project = await getProjectById(db, Number(id));
    if (!project) return err("Not found", 404);
    const [milestones, files] = await Promise.all([
      getProjectMilestones(db, Number(id)),
      getProjectFiles(db, Number(id)),
    ]);
    return ok({ ...project, milestones, files });
  } catch { return err("Failed", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateProject(getDB(), Number(id), body);
    return ok({ message: "Updated" });
  } catch { return err("Failed", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteProject(getDB(), Number(id));
    return ok({ message: "Deleted" });
  } catch { return err("Failed", 500); }
}
