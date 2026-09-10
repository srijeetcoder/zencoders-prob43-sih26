import { query, withTransaction } from '../config/database';
import { DatabaseError } from '../utils/errors';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password_hash: string;
  role: string;
  institution_id?: string;
  district_id?: string;
  department_id?: string;
  is_active: boolean;
  refresh_token?: string;
  reset_otp?: string;
  reset_otp_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export class AuthRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    try {
      const res = await query<UserRecord>(
        `SELECT * FROM users WHERE email = $1 LIMIT 1;`,
        [email.toLowerCase().trim()]
      );
      return res.rows[0] || null;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch user by email: ${err.message}`);
    }
  }

  async findById(id: string): Promise<UserRecord | null> {
    try {
      const res = await query<UserRecord>(
        `SELECT id, name, email, phone, role, institution_id, district_id, department_id, is_active, created_at, updated_at
         FROM users WHERE id = $1 LIMIT 1;`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch user by id: ${err.message}`);
    }
  }

  async createUser(data: {
    name: string;
    email: string;
    phone?: string;
    password_hash: string;
    role: string;
    institution_id?: string;
    district_id?: string;
    department_id?: string;
  }): Promise<UserRecord> {
    return withTransaction(async (client) => {
      // 1. Insert user
      const res = await client.query<UserRecord>(
        `INSERT INTO users (name, email, phone, password_hash, role, institution_id, district_id, department_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, name, email, phone, role, institution_id, district_id, department_id, is_active, created_at;`,
        [
          data.name,
          data.email.toLowerCase().trim(),
          data.phone || null,
          data.password_hash,
          data.role,
          data.institution_id || null,
          data.district_id || null,
          data.department_id || null,
        ]
      );
      const user = res.rows[0];

      // 2. Link user_roles if role exists
      const roleLookup = await client.query<{ id: string }>(
        `SELECT id FROM roles WHERE name = $1 LIMIT 1;`,
        [data.role]
      );
      if (roleLookup.rows[0]) {
        await client.query(
          `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
          [user.id, roleLookup.rows[0].id]
        );
      }

      return user;
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    try {
      await query(
        `UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2;`,
        [refreshToken, userId]
      );
    } catch (err: any) {
      throw new DatabaseError(`Failed to update refresh token: ${err.message}`);
    }
  }

  async setResetOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
    try {
      await query(
        `UPDATE users SET reset_otp = $1, reset_otp_expires_at = $2, updated_at = NOW()
         WHERE email = $3;`,
        [otp, expiresAt.toISOString(), email.toLowerCase().trim()]
      );
    } catch (err: any) {
      throw new DatabaseError(`Failed to set reset OTP: ${err.message}`);
    }
  }

  async resetPassword(email: string, newPasswordHash: string): Promise<void> {
    try {
      await query(
        `UPDATE users
         SET password_hash = $1, reset_otp = NULL, reset_otp_expires_at = NULL, updated_at = NOW()
         WHERE email = $2;`,
        [newPasswordHash, email.toLowerCase().trim()]
      );
    } catch (err: any) {
      throw new DatabaseError(`Failed to reset password: ${err.message}`);
    }
  }
}

export const authRepo = new AuthRepository();
