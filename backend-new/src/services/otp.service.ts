import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { ValidationError } from '../utils/errors';

export type OtpTargetType = 'EMAIL' | 'MOBILE';
export type OtpPurpose = 'REGISTRATION' | 'PASSWORD_RESET' | 'LOGIN_VERIFY';

export interface OtpVerificationRecord {
  id: string;
  target: string;
  target_type: OtpTargetType;
  otp_hash: string;
  otp_purpose: string;
  attempts: number;
  max_attempts: number;
  is_verified: boolean;
  expires_at: string;
  verified_at?: string;
  created_at: string;
}

export class OtpService {
  /**
   * Generates a cryptographically secure 6-digit numeric OTP.
   */
  generateSecure6DigitOtp(): string {
    const min = 100000;
    const max = 999999;
    return crypto.randomInt(min, max + 1).toString();
  }

  /**
   * Sends (generates, hashes, stores) an OTP for a given email or phone.
   */
  async createAndStoreOtp(params: {
    target: string;
    targetType: OtpTargetType;
    purpose?: OtpPurpose;
    expiryMinutes?: number;
  }): Promise<{ otp: string; expiresInSeconds: number; debugOtp?: string }> {
    const target = params.target.toLowerCase().trim();
    const purpose = params.purpose || 'REGISTRATION';
    const expiryMinutes = params.expiryMinutes || 10;
    const expiresInSeconds = expiryMinutes * 60;

    // 1. Resend cooldown check: Prevent requests within 30 seconds
    try {
      const recent = await query<OtpVerificationRecord>(
        `SELECT id, created_at FROM otp_verifications 
         WHERE target = $1 AND target_type = $2 AND otp_purpose = $3 AND is_verified = false
         ORDER BY created_at DESC LIMIT 1;`,
        [target, params.targetType, purpose]
      );

      if (recent.rows[0]) {
        const timeSinceCreated = Date.now() - new Date(recent.rows[0].created_at).getTime();
        if (timeSinceCreated < 30 * 1000) {
          const waitSecs = Math.ceil((30 * 1000 - timeSinceCreated) / 1000);
          throw new ValidationError(`Please wait ${waitSecs} seconds before requesting a new OTP.`);
        }
      }

      // 2. Invalidate older unverified OTPs for this target
      await query(
        `DELETE FROM otp_verifications 
         WHERE target = $1 AND target_type = $2 AND otp_purpose = $3 AND is_verified = false;`,
        [target, params.targetType, purpose]
      );
    } catch (err: any) {
      if (err instanceof ValidationError) throw err;
      // Continue if table is fresh
    }

    // 3. Generate raw OTP and hash
    const rawOtp = this.generateSecure6DigitOtp();
    const otpHash = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    // 4. Store in database
    try {
      await query(
        `INSERT INTO otp_verifications (target, target_type, otp_hash, otp_purpose, expires_at)
         VALUES ($1, $2, $3, $4, $5);`,
        [target, params.targetType, otpHash, purpose, expiresAt.toISOString()]
      );
    } catch (err: any) {
      console.warn('[OtpService] Database storage notice:', err.message);
    }

    // Dispatch logs and real SMTP mailer
    console.log(`[🔐 SECURE 6-DIGIT OTP ISSUED] Target: ${target} (${params.targetType}) | Purpose: ${purpose}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`  👉 DEV OTP CODE: ${rawOtp}`);
    }

    if (params.targetType === 'EMAIL') {
      await this.sendEmailDispatch(target, rawOtp);
    }

    return {
      otp: rawOtp,
      expiresInSeconds,
      debugOtp: process.env.NODE_ENV !== 'production' ? rawOtp : undefined,
    };
  }

  /**
   * Dispatches 6-digit verification code to user email via Gmail SMTP
   */
  async sendEmailDispatch(to: string, otp: string): Promise<void> {
    const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');

    if (gmailUser && gmailPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // TLS
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"PooKar Ledger" <${gmailUser}>`,
          to,
          subject: `${otp} is your PooKar Verification Code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047d48; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">
                  National Problem Governance Ledger
                </span>
                <h2 style="color: #0f172a; margin-top: 12px; margin-bottom: 4px;">Verify Your Identity</h2>
                <p style="color: #64748b; font-size: 13px; margin: 0;">Enter this 6-digit code in the registration window.</p>
              </div>

              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin: 18px 0;">
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #10245e; font-family: monospace;">
                  ${otp}
                </div>
                <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 6px;">Valid for 10 minutes &bull; Do not disclose</span>
              </div>

              <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
                Government of Jharkhand &bull; Societal Innovation Intelligence Engine
              </div>
            </div>
          `,
        });
        console.log(`✉️ [EMAIL SENT] Verification code successfully sent to ${to}`);
      } catch (err: any) {
        console.error('❌ [EMAIL ERROR] Failed to send email via Gmail SMTP:', err.message);
      }
    } else {
      console.log(`ℹ️ [NOTICE] GMAIL_USER and GMAIL_APP_PASSWORD not configured on server. Check Render environment variables.`);
    }
  }

  /**
   * Validates an entered OTP against database record.
   */
  async verifyOtp(params: {
    target: string;
    targetType: OtpTargetType;
    otp: string;
    purpose?: OtpPurpose;
  }): Promise<{ success: boolean; message: string }> {
    const target = params.target.toLowerCase().trim();
    const purpose = params.purpose || 'REGISTRATION';
    const rawOtp = params.otp.trim();

    if (!rawOtp || rawOtp.length !== 6 || !/^\d{6}$/.test(rawOtp)) {
      throw new ValidationError('OTP must be a valid 6-digit numeric code.');
    }

    // Fetch latest active OTP record
    const res = await query<OtpVerificationRecord>(
      `SELECT * FROM otp_verifications 
       WHERE target = $1 AND target_type = $2 AND otp_purpose = $3
       ORDER BY created_at DESC LIMIT 1;`,
      [target, params.targetType, purpose]
    );

    const record = res.rows[0];
    if (!record) {
      throw new ValidationError('No active OTP found. Please request a new verification code.');
    }

    // Check expiration
    if (new Date(record.expires_at).getTime() < Date.now()) {
      throw new ValidationError('OTP code has expired. Please request a fresh code.');
    }

    // Check maximum attempts limit
    if (record.attempts >= record.max_attempts) {
      throw new ValidationError('Maximum OTP verification attempts exceeded. Please request a new code.');
    }

    // Validate hash
    const isMatch = await bcrypt.compare(rawOtp, record.otp_hash);

    if (!isMatch) {
      // Increment attempt counter
      await query(
        `UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1;`,
        [record.id]
      );
      const remaining = record.max_attempts - (record.attempts + 1);
      throw new ValidationError(`Invalid OTP code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Please request a new code.'}`);
    }

    // Mark as verified
    await query(
      `UPDATE otp_verifications 
       SET is_verified = true, verified_at = NOW() 
       WHERE id = $1;`,
      [record.id]
    );

    return {
      success: true,
      message: `${params.targetType === 'EMAIL' ? 'Email' : 'Mobile number'} verified successfully.`,
    };
  }

  /**
   * Verifies if a given target has a valid verified OTP session within the last N minutes.
   */
  async isTargetVerified(
    target: string,
    targetType: OtpTargetType,
    purpose: OtpPurpose = 'REGISTRATION',
    maxAgeMinutes: number = 30
  ): Promise<boolean> {
    const cleanTarget = target.toLowerCase().trim();
    const cutoff = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

    const res = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM otp_verifications
       WHERE target = $1 AND target_type = $2 AND otp_purpose = $3 AND is_verified = true AND verified_at >= $4;`,
      [cleanTarget, targetType, purpose, cutoff.toISOString()]
    );

    return parseInt(res.rows[0]?.count || '0', 10) > 0;
  }
}

export const otpService = new OtpService();
