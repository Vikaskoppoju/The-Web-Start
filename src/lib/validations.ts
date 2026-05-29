import { z } from "zod";

export const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  phone:   z.string().max(20).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export const inquirySchema = z.object({
  name:            z.string().min(2).max(100),
  email:           z.string().email(),
  phone:           z.string().max(20).optional(),
  company:         z.string().max(100).optional(),
  service_needed:  z.enum(["full-stack-development","wordpress-development","ui-ux-design","seo","social-media-marketing","branding","multiple"]),
  budget_range:    z.enum(["<1k","1k-5k","5k-15k","15k-50k","50k+"]).optional(),
  timeline:        z.enum(["asap","1-month","1-3-months","3-6-months","flexible"]).optional(),
  project_details: z.string().min(20).max(10000),
  reference_urls:  z.array(z.string().url()).max(5).optional(),
  how_found:       z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const portfolioSchema = z.object({
  slug:         z.string().regex(/^[a-z0-9-]+$/),
  title:        z.string().min(2).max(200),
  client:       z.string().min(2).max(100),
  category:     z.enum(["full-stack","wordpress","ui-ux","branding","seo","social"]),
  tags:         z.array(z.string()).min(1).max(10),
  summary:      z.string().min(10).max(500),
  description:  z.string().min(20),
  cover_url:    z.string().url(),
  gallery_urls: z.array(z.string().url()).max(10).optional(),
  live_url:     z.string().url().optional().or(z.literal("")),
  github_url:   z.string().url().optional().or(z.literal("")),
  year:         z.number().min(2000).max(2100).optional(),
  featured:     z.boolean().optional(),
  is_published: z.boolean().optional(),
  sort_order:   z.number().optional(),
});

export const testimonialSchema = z.object({
  author_name: z.string().min(2).max(100),
  author_role: z.string().min(2).max(100),
  company:     z.string().max(100).optional(),
  avatar_url:  z.string().url().optional().or(z.literal("")),
  content:     z.string().min(20).max(1000),
  rating:      z.number().min(1).max(5).optional(),
  service_tag: z.string().max(100).optional(),
  is_active:   z.boolean().optional(),
  sort_order:  z.number().optional(),
});

export const blogPostSchema = z.object({
  slug:         z.string().regex(/^[a-z0-9-]+$/),
  title:        z.string().min(2).max(200),
  excerpt:      z.string().min(10).max(500),
  cover_url:    z.string().url().optional().or(z.literal("")),
  tags:         z.array(z.string()).max(10).optional(),
  author:       z.string().max(100).optional(),
  mdx_content:  z.string().min(10),
  is_published: z.boolean().optional(),
  published_at: z.string().optional(),
  meta_title:   z.string().max(70).optional(),
  meta_desc:    z.string().max(160).optional(),
});

export const uploadSchema = z.object({
  filename:    z.string().min(1).max(200),
  contentType: z.enum(["image/jpeg","image/png","image/webp","image/gif","image/svg+xml"]),
  folder:      z.enum(["portfolio","blog","testimonials","services","general"]),
});

export type ContactInput   = z.infer<typeof contactSchema>;
export type InquiryInput   = z.infer<typeof inquirySchema>;
export type LoginInput     = z.infer<typeof loginSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type BlogPostInput  = z.infer<typeof blogPostSchema>;
export type UploadInput    = z.infer<typeof uploadSchema>;
