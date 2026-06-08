import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { createContactSubmission } from "@/lib/db";
import { sendContactNotification } from "@/lib/resend";
import type { ContactFormData } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactFormData;

    if (!body.name || !body.email || !body.subject || !body.message) {
      return err("Missing required fields", 400);
    }

    const db = getDB();
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;

    await createContactSubmission(db, {
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      subject: body.subject,
      message: body.message,
      ip_address: ip,
    });

    // Fire email notification — don't fail the request if email fails
    try { await sendContactNotification(body); } catch { /* email optional */ }

    return ok({ message: "Message sent successfully" });
  } catch {
    return err("Failed to send message", 500);
  }
}
