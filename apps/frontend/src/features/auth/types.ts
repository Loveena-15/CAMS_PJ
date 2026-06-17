import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  department: z.string().min(2, 'Department is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
});

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
