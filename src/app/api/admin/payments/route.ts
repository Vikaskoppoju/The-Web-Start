
import { getDB, ok, err } from "@/lib/api-helpers";
import { getAllPayments } from "@/lib/db-dashboard";


export async function GET() {
  try {
    const payments = await getAllPayments(getDB());
    return ok(payments);
  } catch { return err("Failed", 500); }
}
