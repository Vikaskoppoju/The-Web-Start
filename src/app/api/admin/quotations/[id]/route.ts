import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getQuotationById, updateQuotation, updateQuotationStatus, deleteQuotation } from "@/lib/db-quotations";
import { z } from "zod";

const statusSchema = z.object({ status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]) });

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const q = await getQuotationById(getDB(), Number(id));
    if (!q) return err("Not found", 404);
    return ok(q);
  } catch { return err("Failed", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Status-only update
    const statusParsed = statusSchema.safeParse(body);
    if (statusParsed.success && Object.keys(body).length === 1) {
      await updateQuotationStatus(getDB(), Number(id), statusParsed.data.status);
      return ok({ message: "Status updated" });
    }

    // Full update
    if (!body.client_name || !body.items?.length) return err("Missing required fields", 400);
    await updateQuotation(getDB(), Number(id), body);
    return ok({ message: "Quotation updated" });
  } catch { return err("Failed to update", 500); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteQuotation(getDB(), Number(id));
    return ok({ message: "Deleted" });
  } catch { return err("Failed to delete", 500); }
}
