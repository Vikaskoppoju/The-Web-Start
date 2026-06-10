import { Resend } from "resend";
import type { ContactFormData, InquiryFormData } from "@/types/api";
import type { InvoiceWithClient } from "@/types/dashboard";
import type { QuotationWithItems } from "@/types/quotation";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const from = process.env.RESEND_FROM_EMAIL ?? "noreply@thewebstart.in";
const to   = process.env.RESEND_TO_EMAIL   ?? "info@thewebstart.in";

export async function sendContactNotification(data: ContactFormData) {
  const resend = getResend();
  await resend.emails.send({
    from,
    to,
    subject: `[Contact] ${data.subject} — from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table>
        <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
        ${data.phone ? `<tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ""}
        <tr><td><strong>Subject:</strong></td><td>${data.subject}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${data.message}</p>
    `,
  });
}

export async function sendInvoiceEmail(invoice: InvoiceWithClient) {
  const resend = getResend();
  await resend.emails.send({
    from,
    to: invoice.client_email,
    subject: `Invoice ${invoice.invoice_no} from The Web Start`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#7c3aed">The Web Start</h1>
        <h2>Invoice ${invoice.invoice_no}</h2>
        <p>Dear ${invoice.client_name},</p>
        <p>Please find your invoice details below:</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td><strong>Invoice No:</strong></td><td>${invoice.invoice_no}</td></tr>
          <tr><td><strong>Issue Date:</strong></td><td>${invoice.issue_date}</td></tr>
          <tr><td><strong>Due Date:</strong></td><td>${invoice.due_date}</td></tr>
          <tr><td><strong>Amount:</strong></td><td><strong>${invoice.currency} ${invoice.total.toLocaleString()}</strong></td></tr>
        </table>
        ${invoice.notes ? `<p>${invoice.notes}</p>` : ""}
        <p>To view your full invoice and payment details, please log in to your client portal.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/login" style="background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">
          View Invoice
        </a>
        <p style="color:#666;font-size:12px;margin-top:24px">The Web Start · info@thewebstart.in</p>
      </div>
    `,
  });
}

export async function sendQuotationEmail(quote: QuotationWithItems) {
  if (!quote.client_email) {
    throw new Error("Quotation client email is not set");
  }

  const resend = getResend();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://thewebstart.in";

  await resend.emails.send({
    from,
    to: quote.client_email,
    subject: `Quotation ${quote.quote_no} from The Web Start`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#7c3aed">The Web Start</h1>
        <h2>Quotation ${quote.quote_no}</h2>
        <p>Dear ${quote.client_name},</p>
        <p>Please review your quotation for ${quote.currency} ${quote.total.toLocaleString()}.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td><strong>Quote No:</strong></td><td>${quote.quote_no}</td></tr>
          <tr><td><strong>Valid Until:</strong></td><td>${quote.valid_until ?? "N/A"}</td></tr>
          <tr><td><strong>Total:</strong></td><td><strong>${quote.currency} ${quote.total.toLocaleString()}</strong></td></tr>
        </table>
        ${quote.notes ? `<p>${quote.notes}</p>` : ""}
        <p>Please log in to your client portal to review and accept the quotation.</p>
        <a href="${siteUrl}/portal/login" style="background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">
          View Quotation
        </a>
        <p style="color:#666;font-size:12px;margin-top:24px">The Web Start · ${from}</p>
      </div>
    `,
  });
}

export async function sendInquiryNotification(data: InquiryFormData) {
  const resend = getResend();
  await resend.emails.send({
    from,
    to,
    subject: `[Inquiry] ${data.service_needed} — from ${data.name}`,
    html: `
      <h2>New Project Inquiry</h2>
      <table>
        <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
        ${data.phone ? `<tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ""}
        ${data.company ? `<tr><td><strong>Company:</strong></td><td>${data.company}</td></tr>` : ""}
        <tr><td><strong>Service:</strong></td><td>${data.service_needed}</td></tr>
        ${data.budget_range ? `<tr><td><strong>Budget:</strong></td><td>${data.budget_range}</td></tr>` : ""}
        ${data.timeline ? `<tr><td><strong>Timeline:</strong></td><td>${data.timeline}</td></tr>` : ""}
        ${data.how_found ? `<tr><td><strong>Found via:</strong></td><td>${data.how_found}</td></tr>` : ""}
      </table>
      <h3>Project Details</h3>
      <p style="white-space:pre-wrap">${data.project_details}</p>
      ${data.reference_urls?.length ? `<h3>Reference URLs</h3><ul>${data.reference_urls.map((u) => `<li><a href="${u}">${u}</a></li>`).join("")}</ul>` : ""}
    `,
  });
}
