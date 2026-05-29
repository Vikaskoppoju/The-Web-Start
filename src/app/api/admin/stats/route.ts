
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAdminStats } from "@/lib/db-dashboard";


export async function GET() {
  try {
    const db = getDB();
    const stats = await getAdminStats(db);
    return ok(stats);
  } catch {
    return err("Failed to fetch stats", 500);
  }
}
