import { z } from 'zod';
export const signupSchema=z.object({email:z.string().email().max(254),password:z.string().min(10).max(128),name:z.string().trim().min(1).max(120)});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(1).max(128)});
export const tokenSchema=z.object({token:z.string().min(32)});
export const resetRequestSchema=z.object({email:z.string().email()});
export const resetPasswordSchema=z.object({token:z.string().min(32),password:z.string().min(10).max(128)});
export type SignupInput=z.infer<typeof signupSchema>; export type LoginInput=z.infer<typeof loginSchema>;
