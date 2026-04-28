import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long."),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

// ── AI ────────────────────────────────────────────────────────────────────────

export const analyzeJdSchema = z.object({
  jobDescription: z
    .string()
    .min(20, "Job description must be at least 20 characters.")
    .max(20000, "Job description is too long."),
  resumeText: z.string().max(20000, "Resume text is too long.").optional(),
});

export const rewriteBulletSchema = z.object({
  bullet: z
    .string()
    .min(5, "Bullet text must be at least 5 characters.")
    .max(1000, "Bullet text is too long."),
  keywords: z
    .array(z.string().max(100))
    .max(20, "Too many keywords.")
    .optional()
    .default([]),
  role: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
});

export const coverLetterSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(200, "Name is too long."),
  jobDescription: z
    .string()
    .min(20, "Job description must be at least 20 characters.")
    .max(20000, "Job description is too long."),
  title: z.string().max(200).optional(),
  experience: z.string().max(5000).optional(),
  skills: z.string().max(1000).optional(),
  companyName: z.string().max(200).optional(),
});

// ── Payments ──────────────────────────────────────────────────────────────────

export const razorpayOrderSchema = z.object({
  email: z.string().email("Please provide a valid email.").optional(),
});

export const razorpayVerifySchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required."),
  razorpay_payment_id: z.string().min(1, "Payment ID is required."),
  razorpay_signature: z.string().min(1, "Signature is required."),
});

