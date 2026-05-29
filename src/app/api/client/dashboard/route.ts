import { NextRequest } from "next/server";
import { getDB, ok, err, getClientId } from "@/lib/api-helpers";
import { getClientStats, getClientProjects, getAllInvoices, getNotifications } from "@/lib/db-dashboard";


export async function GET(request: NextRequest) {
  try {
    const clientId = getClientId(request);
    const db = getDB();
    const [stats, projects, invoices, notifications] = await Promise.all([
      getClientStats(db, clientId),
      getClientProjects(db, clientId),
      getAllInvoices(db, { clientId }),
      getNotifications(db, request.headers.get("x-client-email") ?? "", false),
    ]);
    return ok({ stats, projects: projects.slice(0, 5), invoices: invoices.slice(0, 5), notifications: notifications.slice(0, 10) });
  } catch { return err("Failed", 500); }
}
