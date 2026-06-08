import { NextRequest } from "next/server";
import { getDB, ok, err } from "@/lib/api-helpers";
import { createProjectInquiry } from "@/lib/db";
import { sendInquiryNotification } from "@/lib/resend";
import type { InquiryFormData } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as InquiryFormData;

    if (!body.name || !body.email || !body.service_needed || !body.project_details) {
      return err("Missing required fields", 400);
    }

    const db = getDB();
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;

    await createProjectInquiry(db, {
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      company: body.company ?? null,
      service_needed: body.service_needed,
      budget_range: body.budget_range ?? null,
      timeline: body.timeline ?? null,
      project_details: body.project_details,
      reference_urls: body.reference_urls ? JSON.stringify(body.reference_urls) : null,
      how_found: body.how_found ?? null,
      ip_address: ip,
    });

    // Fire email notification — don't fail the request if email fails
    try { await sendInquiryNotification(body); } catch { /* email optional */ }

    return ok({ message: "Inquiry submitted successfully" });
  } catch {
    return err("Failed to submit inquiry", 500);
  }
}
