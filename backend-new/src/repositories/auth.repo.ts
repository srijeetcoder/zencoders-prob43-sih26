import { query, withTransaction } from '../config/database';
import { DatabaseError } from '../utils/errors';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  government_id?: string;
  password_hash: string;
  role: string;
  institution_id?: string;
  district_id?: string;
  district_name?: string;
  department_id?: string;
  department_name?: string;
  is_active: boolean;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
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
        `SELECT u.*, d.name AS district_name, dept.name AS department_name
         FROM users u
         LEFT JOIN districts d ON u.district_id = d.id
         LEFT JOIN departments dept ON u.department_id = dept.id
         WHERE u.email = $1 LIMIT 1;`,
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
        `SELECT u.id, u.name, u.email, u.phone, u.government_id, u.role, u.institution_id, 
                u.district_id, d.name AS district_name, u.department_id, dept.name AS department_name, 
                u.is_active, u.is_email_verified, u.is_phone_verified, u.created_at, u.updated_at
         FROM users u
         LEFT JOIN districts d ON u.district_id = d.id
         LEFT JOIN departments dept ON u.department_id = dept.id
         WHERE u.id = $1 LIMIT 1;`,
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
    government_id?: string;
    password_hash: string;
    role: string;
    institution_id?: string;
    district_id?: string;
    department_id?: string;
    is_email_verified?: boolean;
    is_phone_verified?: boolean;
  }): Promise<UserRecord> {
    return withTransaction(async (client) => {
      // 1. Insert user
      const res = await client.query<UserRecord>(
        `INSERT INTO users (
           name, email, phone, government_id, password_hash, role, 
           institution_id, district_id, department_id, is_email_verified, is_phone_verified
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, name, email, phone, government_id, role, institution_id, district_id, department_id, is_active, is_email_verified, is_phone_verified, created_at;`,
        [
          data.name,
          data.email.toLowerCase().trim(),
          data.phone || null,
          data.government_id || null,
          data.password_hash,
          data.role,
          data.institution_id || null,
          data.district_id || null,
          data.department_id || null,
          data.is_email_verified ?? false,
          data.is_phone_verified ?? false,
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

  async updateProfile(userId: string, data: { name?: string; district_id?: string }): Promise<UserRecord> {
    try {
      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (data.name) {
        updates.push(`name = $${paramIndex++}`);
        params.push(data.name);
      }
      if (data.district_id) {
        updates.push(`district_id = $${paramIndex++}`);
        params.push(data.district_id);
      }

      if (updates.length === 0) {
        const user = await this.findById(userId);
        if (!user) throw new DatabaseError('User not found');
        return user;
      }

      updates.push(`updated_at = NOW()`);
      params.push(userId);

      const res = await query<UserRecord>(
        `UPDATE users
         SET ${updates.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING id, name, email, phone, government_id, role, institution_id, district_id, department_id, is_active, updated_at;`,
        params
      );

      return res.rows[0];
    } catch (err: any) {
      throw new DatabaseError(`Failed to update profile: ${err.message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    return withTransaction(async (client) => {
      // 1. Delete associated notifications, tokens, etc.
      await client.query(`DELETE FROM notifications WHERE user_id = $1;`, [userId]);
      await client.query(`DELETE FROM user_roles WHERE user_id = $1;`, [userId]);
      // 2. Delete user
      await client.query(`DELETE FROM users WHERE id = $1;`, [userId]);
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
