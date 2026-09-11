import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum([
    'CITIZEN',
    'GOVERNMENT',
    'INSTITUTION',
    'SUPER_ADMIN',
    'STATE_ADMIN',
    'DISTRICT_ADMIN',
    'DEPARTMENT_OFFICER',
    'WAR_ROOM_ANALYST',
    'INSTITUTION_ADMIN',
    'RESEARCHER',
    'LAB_MEMBER',
  ]).default('CITIZEN'),
  government_id: z.string().optional(),
  district: z.string().optional(),
  district_id: z.string().uuid().optional(),
  institution_id: z.string().uuid().optional(),
  department_id: z.string().uuid().optional(),
  department: z.string().optional(),
  organization: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email or ID is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().optional(),
});

export const GoogleOAuthSchema = z.object({
  token: z.string().min(1, 'OAuth token or credential is required'),
  role: z.string().default('CITIZEN'),
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export const SendOtpSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  type: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'LOGIN_VERIFY']).default('REGISTRATION'),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  otp: z.string().min(6, 'OTP must be a 6-digit code').max(6, 'OTP must be a 6-digit code'),
  type: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'LOGIN_VERIFY']).default('REGISTRATION'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(6, 'OTP is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  district: z.string().optional(),
  location: z.string().optional(),
  district_id: z.string().uuid().optional(),
});

export const DeleteAccountSchema = z.object({
  confirmation: z.literal('DELETE_MY_ACCOUNT', {
    errorMap: () => ({ message: 'Please provide exact confirmation text "DELETE_MY_ACCOUNT"' }),
  }),
});
