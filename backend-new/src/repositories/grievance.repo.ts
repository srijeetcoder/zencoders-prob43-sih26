import { query, withTransaction, formatVector } from '../config/database';
import { DatabaseError, NotFoundError } from '../utils/errors';

export interface GrievanceRecord {
  id: string;
  ticket_id: string;
  citizen_id?: string;
  anonymous_session_id?: string;
  raw_text: string;
  normalized_text: string;
  language: string;
  district_id?: string;
  district: string;
  block?: string;
  latitude?: number;
  longitude?: number;
  department_id?: string;
  domain: string;
  sub_domain?: string;
  severity: string;
  priority: string;
  classification_confidence: number;
  status: string;
  is_simulation: boolean;
  claimed_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGrievanceInput {
  citizen_id?: string;
  anonymous_session_id?: string;
  raw_text: string;
  normalized_text: string;
  language?: string;
  district: string;
  block?: string;
  latitude?: number;
  longitude?: number;
  domain: string;
  sub_domain?: string;
  severity?: string;
  priority?: string;
  classification_confidence?: number;
  embedding?: number[];
  is_simulation?: boolean;
}

export interface GrievanceFilterOptions {
  page?: number;
  limit?: number;
  district?: string;
  domain?: string;
  status?: string;
  priority?: string;
  citizen_id?: string;
  search?: string;
  is_simulation?: boolean;
}

export class GrievanceRepository {
  /**
   * Generates a concurrency-safe unique ticket number format JS-2026-XXXX
   */
  async generateNextTicketId(): Promise<string> {
    const res = await query<{ nextval: string }>(`SELECT nextval('grievance_ticket_seq') AS nextval;`);
    const val = res.rows[0]?.nextval || '1001';
    return `JS-2026-${val.padStart(4, '0')}`;
  }

  async createGrievance(data: CreateGrievanceInput): Promise<GrievanceRecord> {
    return withTransaction(async (client) => {
      // 1. Concurrency-safe ticket sequence
      const seqRes = await client.query<{ nextval: string }>(`SELECT nextval('grievance_ticket_seq') AS nextval;`);
      const ticketId = `JS-2026-${(seqRes.rows[0]?.nextval || '1001').padStart(4, '0')}`;

      // 2. Lookup district_id if district provided
      let districtId: string | null = null;
      if (data.district) {
        const dRes = await client.query<{ id: string }>(
          `SELECT id FROM districts WHERE name ILIKE $1 LIMIT 1;`,
          [data.district.trim()]
        );
        if (dRes.rows[0]) districtId = dRes.rows[0].id;
      }

      // 3. Insert grievance
      const insertSql = `
        INSERT INTO grievances (
          ticket_id, citizen_id, anonymous_session_id, raw_text, normalized_text,
          language, district_id, district, block, latitude, longitude,
          domain, sub_domain, severity, priority, classification_confidence,
          status, embedding, is_simulation
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          'OPEN', ${data.embedding ? '$17::vector' : 'NULL'}, $18
        )
        RETURNING *;
      `;

      const params: any[] = [
        ticketId,
        data.citizen_id || null,
        data.anonymous_session_id || null,
        data.raw_text,
        data.normalized_text,
        data.language || 'English',
        districtId,
        data.district,
        data.block || null,
        data.latitude || null,
        data.longitude || null,
        data.domain,
        data.sub_domain || null,
        data.severity || 'MEDIUM',
        data.priority || 'STANDARD',
        data.classification_confidence || 0.85,
      ];

      if (data.embedding) {
        params.push(formatVector(data.embedding));
      }
      params.push(data.is_simulation || false);

      const res = await client.query<GrievanceRecord>(insertSql, params);
      const grievance = res.rows[0];

      // 4. Record initial grievance event in the state machine
      await client.query(
        `INSERT INTO grievance_events (grievance_id, from_status, to_status, actor_id, actor_role, note)
         VALUES ($1, NULL, 'OPEN', $2, 'CITIZEN', 'Grievance submitted and indexed in societal intelligence ledger');`,
        [grievance.id, data.citizen_id || null]
      );

      return grievance;
    });
  }

  async findByTicketId(ticketId: string): Promise<GrievanceRecord | null> {
    try {
      const res = await query<GrievanceRecord>(
        `SELECT * FROM grievances WHERE ticket_id = $1 LIMIT 1;`,
        [ticketId.toUpperCase().trim()]
      );
      return res.rows[0] || null;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch grievance by ticket ID: ${err.message}`);
    }
  }

  async findById(id: string): Promise<GrievanceRecord | null> {
    try {
      const res = await query<GrievanceRecord>(
        `SELECT * FROM grievances WHERE id = $1 LIMIT 1;`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch grievance: ${err.message}`);
    }
  }

  async getEvents(grievanceId: string): Promise<any[]> {
    try {
      const res = await query(
        `SELECT e.id, e.from_status, e.to_status, e.note, e.actor_role, e.created_at, u.name as actor_name
         FROM grievance_events e
         LEFT JOIN users u ON e.actor_id = u.id
         WHERE e.grievance_id = $1
         ORDER BY e.created_at ASC;`,
        [grievanceId]
      );
      return res.rows;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch grievance timeline events: ${err.message}`);
    }
  }

  async findPaginated(options: GrievanceFilterOptions): Promise<{ items: GrievanceRecord[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const offset = (page - 1) * limit;

    const whereClauses: string[] = ['is_simulation = $1'];
    const params: any[] = [options.is_simulation || false];
    let paramIndex = 2;

    if (options.citizen_id) {
      whereClauses.push(`citizen_id = $${paramIndex++}`);
      params.push(options.citizen_id);
    }
    if (options.district && options.district !== 'All') {
      whereClauses.push(`district ILIKE $${paramIndex++}`);
      params.push(`%${options.district}%`);
    }
    if (options.domain && options.domain !== 'All') {
      whereClauses.push(`domain ILIKE $${paramIndex++}`);
      params.push(`%${options.domain}%`);
    }
    if (options.status && options.status !== 'All') {
      whereClauses.push(`status = $${paramIndex++}`);
      params.push(options.status);
    }
    if (options.priority && options.priority !== 'All') {
      whereClauses.push(`priority = $${paramIndex++}`);
      params.push(options.priority);
    }
    if (options.search) {
      whereClauses.push(`(ticket_id ILIKE $${paramIndex} OR raw_text ILIKE $${paramIndex} OR normalized_text ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    try {
      const countRes = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM grievances ${whereSql};`,
        params
      );
      const total = parseInt(countRes.rows[0]?.count || '0', 10);

      const dataRes = await query<GrievanceRecord>(
        `SELECT id, ticket_id, citizen_id, raw_text, normalized_text, language, district, block,
                domain, sub_domain, severity, priority, status, created_at, updated_at, resolved_at
         FROM grievances
         ${whereSql}
         ORDER BY created_at DESC
         LIMIT $${paramIndex++} OFFSET $${paramIndex++};`,
        [...params, limit, offset]
      );

      return {
        items: dataRes.rows,
        total,
        page,
        limit,
      };
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch paginated grievances: ${err.message}`);
    }
  }

  async updateStatus(
    id: string,
    newStatus: string,
    actorId?: string,
    actorRole: string = 'GOVERNMENT',
    note?: string
  ): Promise<GrievanceRecord> {
    return withTransaction(async (client) => {
      const existing = await client.query<GrievanceRecord>(
        `SELECT * FROM grievances WHERE id = $1 FOR UPDATE;`,
        [id]
      );
      if (!existing.rows[0]) throw new NotFoundError('Grievance not found');

      const current = existing.rows[0];
      const resolvedAt = newStatus === 'RESOLVED' || newStatus === 'VERIFIED' ? 'NOW()' : 'NULL';

      const updateRes = await client.query<GrievanceRecord>(
        `UPDATE grievances
         SET status = $1, updated_at = NOW(), resolved_at = ${resolvedAt === 'NOW()' ? 'NOW()' : 'resolved_at'}
         WHERE id = $2
         RETURNING *;`,
        [newStatus, id]
      );

      await client.query(
        `INSERT INTO grievance_events (grievance_id, from_status, to_status, actor_id, actor_role, note)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [id, current.status, newStatus, actorId || null, actorRole, note || `Status transitioned to ${newStatus}`]
      );

      return updateRes.rows[0];
    });
  }

  async createClaimToken(grievanceId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      await query(
        `INSERT INTO grievance_claims (grievance_id, claim_token, expires_at)
         VALUES ($1, $2, $3);`,
        [grievanceId, token, expiresAt.toISOString()]
      );
    } catch (err: any) {
      throw new DatabaseError(`Failed to create grievance claim token: ${err.message}`);
    }
  }

  async claimGrievance(claimToken: string, citizenId: string): Promise<GrievanceRecord> {
    return withTransaction(async (client) => {
      const claimRes = await client.query<{ id: string; grievance_id: string; expires_at: string; claimed_at: string }>(
        `SELECT * FROM grievance_claims WHERE claim_token = $1 FOR UPDATE;`,
        [claimToken]
      );
      if (!claimRes.rows[0]) throw new NotFoundError('Invalid or expired claim token');
      const claim = claimRes.rows[0];

      if (claim.claimed_at) throw new DatabaseError('This grievance has already been claimed');
      if (new Date(claim.expires_at) < new Date()) throw new DatabaseError('Claim token has expired');

      // Update claim
      await client.query(
        `UPDATE grievance_claims SET claimed_by = $1, claimed_at = NOW() WHERE id = $2;`,
        [citizenId, claim.id]
      );

      // Link grievance to citizen
      const updateGrievance = await client.query<GrievanceRecord>(
        `UPDATE grievances
         SET citizen_id = $1, claimed_at = NOW(), updated_at = NOW()
         WHERE id = $2
         RETURNING *;`,
        [citizenId, claim.grievance_id]
      );

      await client.query(
        `INSERT INTO grievance_events (grievance_id, from_status, to_status, actor_id, actor_role, note)
         VALUES ($1, 'OPEN', 'OPEN', $2, 'CITIZEN', 'Anonymous ticket claimed and associated with citizen account.');`,
        [claim.grievance_id, citizenId]
      );

      return updateGrievance.rows[0];
    });
  }
}

export const grievanceRepo = new GrievanceRepository();
