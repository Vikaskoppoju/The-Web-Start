export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Contact form payload
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Project inquiry payload
export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_needed: string;
  budget_range?: string;
  timeline?: string;
  project_details: string;
  reference_urls?: string[];
  how_found?: string;
}

// Auth
export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

// Upload
export interface UploadRequest {
  filename: string;
  contentType: string;
  folder: "portfolio" | "blog" | "testimonials" | "services" | "general";
}

export interface UploadResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}
