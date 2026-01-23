import { auth } from "@/lib/auth";
import { z } from "zod";

// Better Auth
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];

// Sign Up
export const signUpSchema = z
  .object({
    name: z.string().min(3).max(100),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Sign In
export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
