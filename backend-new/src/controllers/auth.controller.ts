import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { authRepo } from '../repositories/auth.repo';
import { auditRepo } from '../repositories/audit.repo';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, VerifyOtpSchema, ResetPasswordSchema } from '../schemas/auth.schema';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticationError, ConflictError, NotFoundError, ValidationError } from '../utils/errors';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = RegisterSchema.parse(req.body);
      const existing = await authRepo.findByEmail(data.email);
      if (existing) {
        throw new ConflictError('A user with this email address already exists.');
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await authRepo.createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password_hash: passwordHash,
        role: data.role,
        institution_id: data.institution_id,
        district_id: data.district_id,
        department_id: data.department_id,
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: (env.JWT_EXPIRES_IN || '7d') as any }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        env.JWT_SECRET,
        { expiresIn: '30d' as any }
      );

      await authRepo.updateRefreshToken(user.id, refreshToken);

      await auditRepo.log({
        user_id: user.id,
        role: user.role,
        action: 'USER_REGISTERED',
        resource_type: 'USER',
        resource_id: user.id,
        ip_address: req.ip,
      });

      sendSuccess(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          institution_id: user.institution_id,
          district_id: user.district_id,
        },
        token,
        refreshToken,
      }, 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = LoginSchema.parse(req.body);
      const user = await authRepo.findByEmail(data.email);
      if (!user) {
        throw new AuthenticationError('Invalid email or password credentials');
      }

      const isMatch = await bcrypt.compare(data.password, user.password_hash);
      if (!isMatch) {
        throw new AuthenticationError('Invalid email or password credentials');
      }

      if (!user.is_active) {
        throw new AuthenticationError('Account is disabled. Contact system administrator.');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: (env.JWT_EXPIRES_IN || '7d') as any }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        env.JWT_SECRET,
        { expiresIn: '30d' as any }
      );

      await authRepo.updateRefreshToken(user.id, refreshToken);

      await auditRepo.log({
        user_id: user.id,
        role: user.role,
        action: 'USER_LOGGED_IN',
        resource_type: 'USER',
        resource_id: user.id,
        ip_address: req.ip,
      });

      sendSuccess(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          institution_id: user.institution_id,
          district_id: user.district_id,
        },
        token,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AuthenticationError('Refresh token required');
      }

      const payload = jwt.verify(refreshToken, env.JWT_SECRET) as { userId: string };
      const user = await authRepo.findById(payload.userId);
      if (!user || !user.is_active) {
        throw new AuthenticationError('User not found or inactive');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: (env.JWT_EXPIRES_IN || '7d') as any }
      );

      sendSuccess(res, { token });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await authRepo.updateRefreshToken(req.user.id, null);
      }
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Unauthenticated');
      const user = await authRepo.findById(req.user.id);
      if (!user) throw new NotFoundError('User profile not found');

      sendSuccess(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          institution_id: user.institution_id,
          district_id: user.district_id,
          department_id: user.department_id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      const user = await authRepo.findByEmail(email);
      if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await authRepo.setResetOtp(email, otp, expiresAt);
        // In production, send email/SMS; for dev return message
        console.log(`[Password Reset OTP for ${email}]: ${otp}`);
      }
      sendSuccess(res, { message: 'If that email is registered, a password reset OTP has been sent.' });
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = VerifyOtpSchema.parse(req.body);
      const user = await authRepo.findByEmail(email);
      if (!user || user.reset_otp !== otp || !user.reset_otp_expires_at || new Date(user.reset_otp_expires_at) < new Date()) {
        throw new ValidationError('Invalid or expired OTP');
      }
      sendSuccess(res, { message: 'OTP verified successfully' });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp, newPassword } = ResetPasswordSchema.parse(req.body);
      const user = await authRepo.findByEmail(email);
      if (!user || user.reset_otp !== otp || !user.reset_otp_expires_at || new Date(user.reset_otp_expires_at) < new Date()) {
        throw new ValidationError('Invalid or expired OTP');
      }

      const hash = await bcrypt.hash(newPassword, 10);
      await authRepo.resetPassword(email, hash);

      sendSuccess(res, { message: 'Password reset successfully. Please log in with your new password.' });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
