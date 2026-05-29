import { NextRequest } from "next/server";
import { getDB, ok, err, getClientId } from "@/lib/api-helpers";
import { getClientProjects } from "@/lib/db-dashboard";


export async function GET(request: NextRequest) {
  try {
    const projects = await getClientProjects(getDB(), getClientId(request));
    return ok(projects);
  } catch { return err("Failed", 500); }
}
