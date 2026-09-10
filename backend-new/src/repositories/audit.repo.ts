import { query } from '../config/database';

export interface AuditLogEntry {
  user_id?: string;
  role?: string;
  institution_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  request_id?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
}

export class AuditRepository {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      // Sanitize metadata to never log passwords or secrets
      const cleanMeta = { ...entry.metadata };
      delete cleanMeta.password;
      delete cleanMeta.password_hash;
      delete cleanMeta.token;
      delete cleanMeta.refreshToken;
      delete cleanMeta.authorization;

      await query(
        `INSERT INTO audit_logs (
          user_id, role, institution_id, action, resource_type,
          resource_id, request_id, ip_address, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
          entry.user_id || null,
          entry.role || null,
          entry.institution_id || null,
          entry.action,
          entry.resource_type,
          entry.resource_id || null,
          entry.request_id || null,
          entry.ip_address || null,
          JSON.stringify(cleanMeta),
        ]
      );
    } catch (err: any) {
      console.error('[Audit Logger Error]', err.message);
    }
  }

  async getRecentLogs(limit: number = 50) {
    try {
      const res = await query(
        `SELECT a.*, u.name as user_name, u.email as user_email
         FROM audit_logs a
         LEFT JOIN users u ON a.user_id = u.id
         ORDER BY a.timestamp DESC
         LIMIT $1;`,
        [limit]
      );
      return res.rows;
    } catch (err: any) {
      console.error('[Audit Log Retrieval Error]', err.message);
      return [];
    }
  }
}

export const auditRepo = new AuditRepository();
