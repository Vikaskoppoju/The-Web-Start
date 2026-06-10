export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";
export type DiscountType = "percent" | "fixed";

export interface QuotationItem {
  id: number;
  quotation_id: number;
  sort_order: number;
  service: string;
  description: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
  amount: number;
}

export interface Quotation {
  id: number;
  quote_no: string;
  client_id: number | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_company: string | null;
  client_address: string | null;
  title: string;
  status: QuotationStatus;
  valid_until: string | null;
  currency: string;
  subtotal: number;
  discount_type: DiscountType;
  discount_value: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total: number;
  terms: string | null;
  notes: string | null;
  sent_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  converted_invoice_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface QuotationWithItems extends Quotation {
  items: QuotationItem[];
}

export interface CreateQuotationItem {
  service: string;
  description?: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
  amount: number;
}

export interface CreateQuotationPayload {
  client_id?: number | null;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  client_company?: string | null;
  client_address?: string | null;
  title?: string;
  valid_until?: string | null;
  currency?: string;
  discount_type?: DiscountType;
  discount_value?: number;
  tax_percent?: number;
  terms?: string | null;
  notes?: string | null;
  items: CreateQuotationItem[];
}
