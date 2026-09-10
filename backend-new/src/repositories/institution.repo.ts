import { query, withTransaction } from '../config/database';
import { DatabaseError, NotFoundError, AuthorizationError } from '../utils/errors';

export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  type: string;
  district: string;
  state: string;
  contact_email: string;
  capabilities: string[];
  created_at: string;
}

export class InstitutionRepository {
  async findById(id: string): Promise<InstitutionRecord | null> {
    try {
      const res = await query<InstitutionRecord>(
        `SELECT * FROM institutions WHERE id = $1 LIMIT 1;`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch institution: ${err.message}`);
    }
  }

  async getAllInstitutions(): Promise<InstitutionRecord[]> {
    try {
      const res = await query<InstitutionRecord>(
        `SELECT * FROM institutions ORDER BY name ASC;`
      );
      return res.rows;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch institutions: ${err.message}`);
    }
  }

  async getDprAllocations(institutionId: string) {
    try {
      const res = await query(`
        SELECT d.*, i.name as institution_name
        FROM dpr_allocations d
        JOIN institutions i ON d.institution_id = i.id
        WHERE d.institution_id = $1
        ORDER BY d.created_at DESC;
      `, [institutionId]);
      return res.rows;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch DPR allocations: ${err.message}`);
    }
  }

  async getDprById(dprId: string, institutionId?: string) {
    try {
      const res = await query(`
        SELECT d.*, i.name as institution_name,
               w.id as workbench_id, w.version_number, w.technical_summary,
               w.proposed_solution, w.bom_items, w.bom_validated, w.bom_violations,
               w.calibration_score, w.status as workbench_status
        FROM dpr_allocations d
        JOIN institutions i ON d.institution_id = i.id
        LEFT JOIN dpr_workbenches w ON w.dpr_id = d.id
        WHERE d.id = $1
        ORDER BY w.version_number DESC
        LIMIT 1;
      `, [dprId]);

      if (!res.rows[0]) throw new NotFoundError('DPR not found');

      // Enforce Institution Scope: Institution A cannot access Institution B resources
      if (institutionId && res.rows[0].institution_id !== institutionId) {
        throw new AuthorizationError('Access forbidden: This DPR belongs to a different academic institution');
      }

      return res.rows[0];
    } catch (err: any) {
      if (err instanceof AuthorizationError || err instanceof NotFoundError) throw err;
      throw new DatabaseError(`Failed to fetch DPR details: ${err.message}`);
    }
  }

  async saveWorkbenchSnapshot(dprId: string, data: {
    technical_summary?: string;
    proposed_solution?: string;
    bom_items?: any[];
    bom_validated?: boolean;
    bom_violations?: string[];
    calibration_score?: number;
    status?: string;
    userId?: string;
  }) {
    return withTransaction(async (client) => {
      // 1. Get current version count
      const verRes = await client.query<{ max_ver: number }>(
        `SELECT COALESCE(MAX(version_number), 0) + 1 AS max_ver FROM dpr_workbenches WHERE dpr_id = $1;`,
        [dprId]
      );
      const nextVersion = verRes.rows[0].max_ver;

      // 2. Insert new workbench version
      const insertRes = await client.query(
        `INSERT INTO dpr_workbenches (
          dpr_id, version_number, technical_summary, proposed_solution,
          bom_items, bom_validated, bom_violations, calibration_score,
          status, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;`,
        [
          dprId,
          nextVersion,
          data.technical_summary || '',
          data.proposed_solution || '',
          JSON.stringify(data.bom_items || []),
          data.bom_validated || false,
          data.bom_violations || [],
          data.calibration_score || 0,
          data.status || 'DRAFT',
          data.userId || null,
        ]
      );

      // 3. Create permanent version snapshot
      await client.query(
        `INSERT INTO dpr_versions (dpr_id, version, snapshot, changed_by)
         VALUES ($1, $2, $3, $4);`,
        [dprId, nextVersion, JSON.stringify(insertRes.rows[0]), data.userId || null]
      );

      return insertRes.rows[0];
    });
  }

  async saveCalibrationMetric(dprId: string, data: {
    prediction_confidence: number;
    rag_relevance: number;
    domain_consistency: number;
    bom_compliance: number;
    constraint_violations: string[];
    review_outcome: string;
    model_version?: string;
  }) {
    try {
      const res = await query(
        `INSERT INTO calibration_metrics (
          dpr_id, prediction_confidence, rag_relevance, domain_consistency,
          bom_compliance, constraint_violations, review_outcome, model_version
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`,
        [
          dprId,
          data.prediction_confidence,
          data.rag_relevance,
          data.domain_consistency,
          data.bom_compliance,
          data.constraint_violations,
          data.review_outcome,
          data.model_version || 'gemini-1.5-flash',
        ]
      );
      return res.rows[0];
    } catch (err: any) {
      throw new DatabaseError(`Failed to save calibration metric: ${err.message}`);
    }
  }

  async getCalibrationMetrics(dprId: string) {
    try {
      const res = await query(
        `SELECT * FROM calibration_metrics WHERE dpr_id = $1 ORDER BY created_at DESC;`,
        [dprId]
      );
      return res.rows;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch calibration metrics: ${err.message}`);
    }
  }
}

export const institutionRepo = new InstitutionRepository();
