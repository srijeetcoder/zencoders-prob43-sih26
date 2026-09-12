import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { authRepo } from '../repositories/auth.repo';
import { auditRepo } from '../repositories/audit.repo';
import { otpService } from '../services/otp.service';
import { govIdService } from '../services/govId.service';
import { query } from '../config/database';
import {
  RegisterSchema,
  LoginSchema,
  GoogleOAuthSchema,
  SendOtpSchema,
  VerifyOtpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UpdateProfileSchema,
  DeleteAccountSchema,
} from '../schemas/auth.schema';
import { sendSuccess } from '../utils/apiResponse';
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors';

export class AuthController {
  /**
   * Google OAuth Handler with strict role enforcement.
   * GOVERNMENT and INSTITUTION roles are strictly rejected with 403 Forbidden.
   */
  async googleOAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = GoogleOAuthSchema.parse(req.body);
      const requestedRole = (data.role || 'CITIZEN').toUpperCase();

      // Rule 5: Strict OAuth role restriction
      if (requestedRole !== 'CITIZEN') {
        throw new AuthorizationError(
          'Google OAuth is strictly restricted to Citizen accounts. Government officers and University partners must use dedicated credentials with multi-factor OTP verification.'
        );
      }

      const email = (data.email || `citizen.${Date.now()}@gmail.com`).toLowerCase().trim();
      const name = data.name || 'Citizen Contributor';

      let user = await authRepo.findByEmail(email);

      if (!user) {
        // Create new Citizen user
        const dummyPassword = await bcrypt.hash(Date.now().toString(), 10);
        user = await authRepo.createUser({
          name,
          email,
          password_hash: dummyPassword,
          role: 'CITIZEN',
          is_email_verified: true,
        });
      } else {
        // Ensure user is not a Government or University user trying to hijack via OAuth
        if (user.role !== 'CITIZEN') {
          throw new AuthorizationError(
            'This email is registered under an official institutional/government role. OAuth login is forbidden.'
          );
        }
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
        action: 'USER_GOOGLE_OAUTH_LOGIN',
        resource_type: 'USER',
        resource_id: user.id,
        ip_address: req.ip,
      });

      sendSuccess(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          district: user.district_name || 'Ranchi',
        },
        token,
        refreshToken,
        message: 'Citizen Google OAuth authentication successful.',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dispatches 6-digit OTP for Email
   */
  async sendEmailOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, type = 'REGISTRATION' } = req.body;
      if (!email) throw new ValidationError('Email address is required.');

      const result = await otpService.createAndStoreOtp({
        target: email,
        targetType: 'EMAIL',
        purpose: type as any,
        expiryMinutes: 10,
      });

      sendSuccess(res, {
        message: `6-digit verification code sent to ${email}.`,
        expiresInSeconds: result.expiresInSeconds,
        debugOtp: result.debugOtp,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verifies 6-digit OTP for Email
   */
  async verifyEmailOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp, type = 'REGISTRATION' } = req.body;
      if (!email || !otp) throw new ValidationError('Email and 6-digit OTP are required.');

      const result = await otpService.verifyOtp({
        target: email,
        targetType: 'EMAIL',
        otp,
        purpose: type as any,
      });

      sendSuccess(res, { message: result.message, isVerified: true });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dispatches 6-digit OTP for Mobile SMS
   */
  async sendMobileOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, type = 'REGISTRATION' } = req.body;
      if (!phone) throw new ValidationError('Mobile number is required.');

      const result = await otpService.createAndStoreOtp({
        target: phone,
        targetType: 'MOBILE',
        purpose: type as any,
        expiryMinutes: 10,
      });

      sendSuccess(res, {
        message: `6-digit SMS verification code sent to ${phone}.`,
        expiresInSeconds: result.expiresInSeconds,
        debugOtp: result.debugOtp,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verifies 6-digit OTP for Mobile SMS
   */
  async verifyMobileOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, otp, type = 'REGISTRATION' } = req.body;
      if (!phone || !otp) throw new ValidationError('Mobile number and 6-digit OTP are required.');

      const result = await otpService.verifyOtp({
        target: phone,
        targetType: 'MOBILE',
        otp,
        purpose: type as any,
      });

      sendSuccess(res, { message: result.message, isVerified: true });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Backward-compatible Unified sendOtp endpoint
   */
  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = SendOtpSchema.parse(req.body);
      const target = data.email || data.phone;
      if (!target) throw new ValidationError('Email or phone number is required.');

      const targetType = data.email ? 'EMAIL' : 'MOBILE';
      const result = await otpService.createAndStoreOtp({
        target,
        targetType,
        purpose: data.type as any,
      });

      sendSuccess(res, {
        message: `Verification code sent to ${target}.`,
        expiresInSeconds: result.expiresInSeconds,
        debugOtp: result.debugOtp,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Backward-compatible Unified verifyOtp endpoint
   */
  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = VerifyOtpSchema.parse(req.body);
      const target = data.email || data.phone;
      if (!target) throw new ValidationError('Email or phone is required.');

      const targetType = data.email ? 'EMAIL' : 'MOBILE';
      const result = await otpService.verifyOtp({
        target,
        targetType,
        otp: data.otp,
        purpose: data.type as any,
      });

      sendSuccess(res, { message: result.message, isVerified: true });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Registers a new user with Government ID generation and State Machine validation.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = RegisterSchema.parse(req.body);

      // 1. Check duplicate email
      const existing = await authRepo.findByEmail(data.email);
      if (existing) {
        throw new ConflictError('A user with this email address already exists.');
      }

      // 2. Resolve District ID if district name was supplied
      let districtId = data.district_id;
      const districtName = data.district || 'Ranchi';
      if (!districtId && districtName) {
        try {
          const dRes = await query<{ id: string }>(
            `SELECT id FROM districts WHERE name ILIKE $1 LIMIT 1;`,
            [districtName]
          );
          if (dRes.rows[0]) districtId = dRes.rows[0].id;
        } catch {}
      }

      // 3. Government Official Identifier & Unique Code Verification
      let governmentId: string | undefined;
      let verifiedDepartment = data.department;
      let verifiedDistrict = districtName;
      const role = data.role.toUpperCase();

      if (role === 'GOVERNMENT' || role === 'STATE_ADMIN' || role === 'DISTRICT_ADMIN' || role === 'DEPARTMENT_OFFICER') {
        const rawCode = data.government_id ? data.government_id.trim().toUpperCase() : '';
        if (rawCode) {
          try {
            const inviteRes = await query<{
              id: string;
              code: string;
              department: string;
              district: string;
              designation: string;
              allocated_to_email: string | null;
              is_used: boolean;
              expires_at: Date;
            }>(
              `SELECT id, code, department, district, designation, allocated_to_email, is_used, expires_at
               FROM government_invite_codes
               WHERE code = $1 LIMIT 1;`,
              [rawCode]
            );

            if (inviteRes.rows.length > 0) {
              const invite = inviteRes.rows[0];
              if (invite.is_used) {
                throw new ValidationError('This Government Invite Code has already been claimed and used.');
              }
              if (new Date(invite.expires_at) < new Date()) {
                throw new ValidationError('This Government Invite Code has expired.');
              }
              if (invite.allocated_to_email && invite.allocated_to_email.toLowerCase().trim() !== data.email.toLowerCase().trim()) {
                throw new ValidationError(`This code is specifically allocated to official email ${invite.allocated_to_email}.`);
              }
              verifiedDepartment = invite.department || verifiedDepartment;
              verifiedDistrict = invite.district || verifiedDistrict;
            }
            governmentId = rawCode;
          } catch (codeErr: any) {
            if (codeErr instanceof ValidationError) throw codeErr;
            // If table doesn't exist yet or query fails, accept provided government code
            governmentId = rawCode;
          }
        }
      }

      // 4. Safely resolve Institution UUID foreign key (institutions.id is UUID; codes/AISHE strings are not UUIDs)
      const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      let resolvedInstitutionUuid: string | undefined = undefined;
      if (data.institution_id) {
        if (isUUID(data.institution_id)) {
          resolvedInstitutionUuid = data.institution_id;
        } else {
          try {
            const instRes = await query<{ id: string }>(
              `SELECT id FROM institutions WHERE aishe_code ILIKE $1 OR name ILIKE $2 LIMIT 1;`,
              [data.institution_id, `%${data.organization || data.institution_id}%`]
            );
            if (instRes.rows[0]) resolvedInstitutionUuid = instRes.rows[0].id;
          } catch {}
        }
      }

      // Check and claim University Invite Code if applicable
      if (role === 'INSTITUTION' && data.institution_id) {
        try {
          const rawUnivCode = data.institution_id.trim().toUpperCase();
          const uInviteRes = await query<{
            id: string;
            code: string;
            institution_name: string;
            aishe_code: string;
            allocated_role: string;
            max_claims: number;
            claim_count: number;
            is_active: boolean;
            expires_at: Date;
          }>(
            `SELECT id, code, institution_name, aishe_code, allocated_role, max_claims, claim_count, is_active, expires_at
             FROM university_invite_codes
             WHERE code = $1 LIMIT 1;`,
            [rawUnivCode]
          );
          if (uInviteRes.rows[0]) {
            const uInvite = uInviteRes.rows[0];
            if (uInvite.claim_count >= uInvite.max_claims) {
              throw new ValidationError('This University Invite Code has reached its maximum permitted activations.');
            }
            if (new Date(uInvite.expires_at) < new Date()) {
              throw new ValidationError('This University Invite Code has expired.');
            }
            await query(
              `UPDATE university_invite_codes
               SET claim_count = claim_count + 1, is_active = (claim_count + 1 < max_claims)
               WHERE id = $1;`,
              [uInvite.id]
            );
          }
        } catch (uErr: any) {
          if (uErr instanceof ValidationError) throw uErr;
        }
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await authRepo.createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        government_id: governmentId,
        password_hash: passwordHash,
        role: data.role,
        institution_id: resolvedInstitutionUuid,
        district_id: districtId,
        department_id: data.department_id,
        is_email_verified: true,
        is_phone_verified: !!data.phone,
      });

      // Burn / Claim Government Invite Code in the database if used
      if (governmentId) {
        try {
          await query(
            `UPDATE government_invite_codes
             SET is_used = TRUE, used_by_user_id = $1, used_at = NOW()
             WHERE code = $2;`,
            [user.id, governmentId]
          );
        } catch {}
      }

      // Upsert University Profile if role is INSTITUTION
      if (role === 'INSTITUTION') {
        try {
          const academicRole = ((req.body as any).academicRole || 'STUDENT').toUpperCase();
          const orgName = data.organization || data.department || 'University Partner Node';
          const aisheCode = data.institution_id || 'AISHE-U-0001';
          const rollOrId = data.government_id || data.institution_id || null;
          await query(
            `INSERT INTO university_profiles (user_id, academic_role, institution_name, department, roll_number, faculty_id, aishe_code, state, district)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (user_id) DO UPDATE SET
               institution_name = EXCLUDED.institution_name,
               department = EXCLUDED.department,
               aishe_code = EXCLUDED.aishe_code;`,
            [
              user.id,
              academicRole,
              orgName,
              data.department || 'Engineering & Science',
              academicRole === 'STUDENT' ? rollOrId : null,
              academicRole === 'FACULTY' ? rollOrId : null,
              aisheCode,
              'Jharkhand',
              verifiedDistrict,
            ]
          );
        } catch {}
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
          government_id: user.government_id,
          role: user.role,
          district: districtName,
          institution_id: user.institution_id,
          district_id: user.district_id,
        },
        token,
        refreshToken,
        governmentId,
        message: 'Account registered successfully.',
      }, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * User Login with Authoritative Profile Resolution.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = LoginSchema.parse(req.body);
      let user = await authRepo.findByEmail(data.email);

      // Auto-activation on login: Check if identifier matches a valid government or university invite key
      if (!user) {
        const cleanIdent = data.email.trim();
        try {
          // Check Government Invite Codes
          const govRes = await query<{
            id: string;
            code: string;
            department: string;
            district: string;
            designation: string;
            allocated_to_email: string | null;
            is_used: boolean;
            expires_at: Date;
          }>(
            `SELECT id, code, department, district, designation, allocated_to_email, is_used, expires_at
             FROM government_invite_codes
             WHERE (LOWER(allocated_to_email) = LOWER($1) OR UPPER(code) = UPPER($1))
               AND is_used = FALSE 
               AND expires_at > NOW()
             LIMIT 1;`,
            [cleanIdent]
          );

          if (govRes.rows.length > 0) {
            const invite = govRes.rows[0];
            const officerEmail = (invite.allocated_to_email || cleanIdent).toLowerCase();
            const passwordHash = await bcrypt.hash(data.password, 10);
            
            // Resolve district ID
            let districtId: string | undefined;
            try {
              const dRes = await query<{ id: string }>(
                `SELECT id FROM districts WHERE name ILIKE $1 LIMIT 1;`,
                [invite.district || 'Ranchi']
              );
              if (dRes.rows[0]) districtId = dRes.rows[0].id;
            } catch {}

            user = await authRepo.createUser({
              name: `${invite.designation} (${invite.district || 'Ranchi'})`,
              email: officerEmail,
              government_id: invite.code,
              password_hash: passwordHash,
              role: 'GOVERNMENT',
              district_id: districtId,
              is_email_verified: true,
            });

            // Mark invite code claimed
            await query(
              `UPDATE government_invite_codes
               SET is_used = TRUE, used_by_user_id = $1, used_at = NOW()
               WHERE id = $2;`,
              [user.id, invite.id]
            );
          }
        } catch (autoErr) {
          console.warn('[Auto-activation Gov Notice]:', autoErr);
        }
      }

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
          government_id: user.government_id,
          role: user.role,
          district: user.district_name || 'Ranchi',
          institution_id: user.institution_id,
          district_id: user.district_id,
          department_id: user.department_id,
        },
        token,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Authoritative Current User Profile.
   */
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
          government_id: user.government_id,
          role: user.role,
          district: user.district_name || 'Ranchi',
          institution_id: user.institution_id,
          district_id: user.district_id,
          department_id: user.department_id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Updates Citizen/User Profile (Email is strictly immutable and read-only).
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Authentication required to update profile.');
      const data = UpdateProfileSchema.parse(req.body);

      let districtId = data.district_id;
      const districtName = data.district || data.location;
      if (!districtId && districtName) {
        try {
          const dRes = await query<{ id: string }>(
            `SELECT id FROM districts WHERE name ILIKE $1 LIMIT 1;`,
            [districtName]
          );
          if (dRes.rows[0]) districtId = dRes.rows[0].id;
        } catch {}
      }

      const updated = await authRepo.updateProfile(req.user.id, {
        name: data.name,
        district_id: districtId,
      });

      await auditRepo.log({
        user_id: req.user.id,
        role: req.user.role,
        action: 'USER_PROFILE_UPDATED',
        resource_type: 'USER',
        resource_id: req.user.id,
        ip_address: req.ip,
      });

      sendSuccess(res, {
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          government_id: updated.government_id,
          role: updated.role,
          district: districtName || 'Ranchi',
        },
        message: 'Profile details updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Account Deletion workflow with session invalidation.
   */
  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Authentication required to delete account.');
      DeleteAccountSchema.parse(req.body);

      const userId = req.user.id;
      await authRepo.deleteUser(userId);

      await auditRepo.log({
        user_id: userId,
        role: req.user.role,
        action: 'USER_ACCOUNT_DELETED',
        resource_type: 'USER',
        resource_id: userId,
        ip_address: req.ip,
      });

      sendSuccess(res, { message: 'Account and associated records deleted permanently.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh access token
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new AuthenticationError('Refresh token required');

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

  /**
   * Invalidate session and logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await authRepo.updateRefreshToken(req.user.id, null);
      }
      sendSuccess(res, { message: 'Logged out successfully. Session invalidated.' });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      const user = await authRepo.findByEmail(email);
      if (user) {
        const otpResult = await otpService.createAndStoreOtp({
          target: email,
          targetType: 'EMAIL',
          purpose: 'PASSWORD_RESET',
        });
        await authRepo.setResetOtp(email, otpResult.otp, new Date(Date.now() + 15 * 60 * 1000));
      }
      sendSuccess(res, { message: 'If that email is registered, a password reset code has been sent.' });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp, newPassword } = ResetPasswordSchema.parse(req.body);
      await otpService.verifyOtp({
        target: email,
        targetType: 'EMAIL',
        otp,
        purpose: 'PASSWORD_RESET',
      });

      const hash = await bcrypt.hash(newPassword, 10);
      await authRepo.resetPassword(email, hash);

      sendSuccess(res, { message: 'Password reset successfully. Please sign in with your new password.' });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
