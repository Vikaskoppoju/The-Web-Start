import { NextRequest } from "next/server";
import { getDB, ok, err, getClientId } from "@/lib/api-helpers";
import { getAllInvoices } from "@/lib/db-dashboard";


export async function GET(request: NextRequest) {
  try {
    const invoices = await getAllInvoices(getDB(), { clientId: getClientId(request) });
    return ok(invoices);
  } catch { return err("Failed", 500); }
}
