import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum([
    'CITIZEN',
    'SUPER_ADMIN',
    'STATE_ADMIN',
    'DISTRICT_ADMIN',
    'DEPARTMENT_OFFICER',
    'WAR_ROOM_ANALYST',
    'INSTITUTION_ADMIN',
    'RESEARCHER',
    'LAB_MEMBER',
  ]).default('CITIZEN'),
  institution_id: z.string().uuid().optional(),
  district_id: z.string().uuid().optional(),
  department_id: z.string().uuid().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(4, 'OTP must be at least 4 digits'),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(4, 'OTP is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
