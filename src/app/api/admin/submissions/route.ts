import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getContactSubmissions, getProjectInquiries } from "@/lib/db";


export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status") ?? undefined;
    const db = getDB();

    if (type === "inquiry") {
      const items = await getProjectInquiries(db, status);
      return ok(items);
    }
    if (type === "contact") {
      const items = await getContactSubmissions(db, status);
      return ok(items);
    }
    // Both
    const [contacts, inquiries] = await Promise.all([
      getContactSubmissions(db, status),
      getProjectInquiries(db, status),
    ]);
    return ok({ contacts, inquiries });
  } catch { return err("Failed", 500); }
}
