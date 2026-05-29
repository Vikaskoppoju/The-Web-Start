import { NextRequest } from "next/server";
import { getDB, ok, err, getClientEmail } from "@/lib/api-helpers";
import { getNotifications, markNotificationsRead } from "@/lib/db-dashboard";


export async function GET(request: NextRequest) {
  try {
    const notifs = await getNotifications(getDB(), getClientEmail(request));
    return ok(notifs);
  } catch { return err("Failed", 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as { ids?: number[] };
    await markNotificationsRead(getDB(), getClientEmail(request), body.ids);
    return ok({ message: "Marked read" });
  } catch { return err("Failed", 500); }
}
