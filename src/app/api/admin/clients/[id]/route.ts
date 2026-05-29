import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { getClientById, updateClient, deleteClient } from "@/lib/db-dashboard";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await getClientById(getDB(), Number(id));
    if (!client) return err("Not found", 404);
    return ok(client);
  } catch { return err("Failed", 500); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateClient(getDB(), Number(id), body);
    return ok({ message: "Updated" });
  } catch { return err("Failed", 500); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteClient(getDB(), Number(id));
    return ok({ message: "Deleted" });
  } catch { return err("Failed", 500); }
}
