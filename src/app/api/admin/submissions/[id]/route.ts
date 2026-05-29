import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { updateContactStatus, updateInquiry } from "@/lib/db";


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const body = await request.json() as { status?: string; admin_notes?: string };
    const db = getDB();

    if (type === "contact") {
      if (body.status) await updateContactStatus(db, Number(id), body.status);
    } else {
      await updateInquiry(db, Number(id), body);
    }
    return ok({ message: "Updated" });
  } catch { return err("Failed", 500); }
}
