import { query, withTransaction } from '../config/database';
import { DatabaseError, NotFoundError } from '../utils/errors';

export class GovernmentRepository {
  /**
   * Generates high-level state overview metrics purely via SQL aggregations
   */
  async getOverviewMetrics(districtFilter?: string) {
    try {
      const params: any[] = [];
      let whereDistrict = 'WHERE is_simulation = false';
      if (districtFilter && districtFilter !== 'All') {
        params.push(districtFilter);
        whereDistrict += ` AND district ILIKE $1`;
      }

      const countsRes = await query(`
        SELECT
          COUNT(*) AS total_grievances,
          COUNT(*) FILTER (WHERE status = 'OPEN') AS open_grievances,
          COUNT(*) FILTER (WHERE status = 'IN_PROGRESS' OR status = 'DISPATCHED' OR status = 'ASSIGNED') AS in_progress_grievances,
          COUNT(*) FILTER (WHERE status = 'RESOLVED' OR status = 'VERIFIED') AS resolved_grievances,
          COUNT(*) FILTER (WHERE priority = 'HIGH' OR priority = 'CRITICAL' OR severity = 'HIGH' OR severity = 'CRITICAL') AS high_priority_count,
          COALESCE(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400) FILTER (WHERE resolved_at IS NOT NULL), 3.2)::numeric(10,1) AS avg_resolution_days
        FROM grievances
        ${whereDistrict};
      `, params);

      const sectorRes = await query(`
        SELECT
          domain AS name,
          COUNT(*) AS count,
          COUNT(*) FILTER (WHERE status = 'RESOLVED' OR status = 'VERIFIED') AS resolved,
          COUNT(*) FILTER (WHERE priority = 'HIGH' OR priority = 'CRITICAL') AS critical
        FROM grievances
        ${whereDistrict}
        GROUP BY domain
        ORDER BY count DESC;
      `, params);

      const recentRes = await query(`
        SELECT id, ticket_id, raw_text, normalized_text, district, domain, severity, priority, status, created_at
        FROM grievances
        ${whereDistrict}
        ORDER BY created_at DESC
        LIMIT 10;
      `, params);

      const escalationCount = await query(`
        SELECT COUNT(*) AS count FROM escalations WHERE status = 'PENDING';
      `);

      return {
        metrics: {
          total: parseInt(countsRes.rows[0]?.total_grievances || '0', 10),
          open: parseInt(countsRes.rows[0]?.open_grievances || '0', 10),
          inProgress: parseInt(countsRes.rows[0]?.in_progress_grievances || '0', 10),
          resolved: parseInt(countsRes.rows[0]?.resolved_grievances || '0', 10),
          highPriority: parseInt(countsRes.rows[0]?.high_priority_count || '0', 10),
          escalations: parseInt(escalationCount.rows[0]?.count || '0', 10),
          avgResolutionDays: parseFloat(countsRes.rows[0]?.avg_resolution_days || '3.2'),
        },
        sectors: sectorRes.rows.map((row) => ({
          name: row.name,
          count: parseInt(row.count, 10),
          resolved: parseInt(row.resolved, 10),
          critical: parseInt(row.critical, 10),
        })),
        recentGrievances: recentRes.rows,
      };
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch government overview: ${err.message}`);
    }
  }

  /**
   * Computes district-wise grievance aggregates & hazard scores backed by DB coordinates
   */
  async getDistrictsHazardData() {
    try {
      const res = await query(`
        SELECT
          d.id,
          d.name AS district,
          d.latitude,
          d.longitude,
          d.population,
          COUNT(g.id) AS total_grievances,
          COUNT(g.id) FILTER (WHERE g.status = 'OPEN' OR g.status = 'DISPATCHED') AS active_grievances,
          COUNT(g.id) FILTER (WHERE g.severity = 'HIGH' OR g.severity = 'CRITICAL') AS high_severity_count,
          COUNT(e.id) AS escalation_count,
          -- Deterministic Hazard Score calculation (0 to 100)
          LEAST(100, GREATEST(10, ROUND(
            (COUNT(g.id) FILTER (WHERE g.status = 'OPEN') * 3.5) +
            (COUNT(g.id) FILTER (WHERE g.severity = 'HIGH' OR g.severity = 'CRITICAL') * 8.0) +
            (COUNT(e.id) * 12.0) +
            (CASE WHEN COUNT(g.id) > 20 THEN 15 ELSE 5 END)
          )))::int AS hazard_score
        FROM districts d
        LEFT JOIN grievances g ON (g.district ILIKE d.name OR g.district_id = d.id) AND g.is_simulation = false
        LEFT JOIN escalations e ON e.grievance_id = g.id AND e.status = 'PENDING'
        GROUP BY d.id, d.name, d.latitude, d.longitude, d.population
        ORDER BY hazard_score DESC, total_grievances DESC;
      `);

      return res.rows.map((row) => ({
        id: row.id,
        district: row.district,
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude),
        population: row.population,
        totalGrievances: parseInt(row.total_grievances, 10),
        activeGrievances: parseInt(row.active_grievances, 10),
        highSeverityCount: parseInt(row.high_severity_count, 10),
        escalations: parseInt(row.escalation_count, 10),
        hazardScore: parseInt(row.hazard_score, 10),
        riskLevel: row.hazard_score >= 75 ? 'CRITICAL' : row.hazard_score >= 50 ? 'HIGH' : row.hazard_score >= 25 ? 'MODERATE' : 'LOW',
      }));
    } catch (err: any) {
      throw new DatabaseError(`Failed to calculate district hazard map data: ${err.message}`);
    }
  }

  async getAllDepartments() {
    try {
      const res = await query(`
        SELECT d.id, d.name, d.code, d.description,
               COUNT(g.id) AS active_tickets
        FROM departments d
        LEFT JOIN grievances g ON g.department_id = d.id AND g.status IN ('OPEN', 'ASSIGNED', 'DISPATCHED', 'IN_PROGRESS')
        GROUP BY d.id, d.name, d.code, d.description
        ORDER BY active_tickets DESC;
      `);
      return res.rows;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch departments: ${err.message}`);
    }
  }

  async createDispatch(data: {
    grievance_id: string;
    department_id?: string;
    assigned_officer_id?: string;
    priority?: string;
    instructions: string;
    dispatched_by: string;
  }) {
    return withTransaction(async (client) => {
      // 1. Verify grievance exists
      const gRes = await client.query(`SELECT * FROM grievances WHERE id = $1 FOR UPDATE;`, [data.grievance_id]);
      if (!gRes.rows[0]) throw new NotFoundError('Grievance not found');

      // 2. Insert dispatch order
      const dispatchRes = await client.query(
        `INSERT INTO dispatch_orders (
          grievance_id, assigned_department_id, assigned_officer_id,
          priority, instructions, status, dispatched_by
        ) VALUES ($1, $2, $3, $4, $5, 'DISPATCHED', $6)
        RETURNING *;`,
        [
          data.grievance_id,
          data.department_id || null,
          data.assigned_officer_id || null,
          data.priority || 'HIGH',
          data.instructions,
          data.dispatched_by,
        ]
      );

      // 3. Update grievance status to DISPATCHED
      await client.query(
        `UPDATE grievances
         SET status = 'DISPATCHED', department_id = COALESCE($1, department_id), updated_at = NOW()
         WHERE id = $2;`,
        [data.department_id || null, data.grievance_id]
      );

      // 4. Log event
      await client.query(
        `INSERT INTO grievance_events (grievance_id, from_status, to_status, actor_id, actor_role, note)
         VALUES ($1, $2, 'DISPATCHED', $3, 'GOVERNMENT', $4);`,
        [data.grievance_id, gRes.rows[0].status, data.dispatched_by, `Dispatch task issued: ${data.instructions}`]
      );

      return dispatchRes.rows[0];
    });
  }

  async createEscalation(data: {
    grievance_id: string;
    reason: string;
    level?: number;
    escalated_to?: string;
  }) {
    return withTransaction(async (client) => {
      const res = await client.query(
        `INSERT INTO escalations (grievance_id, reason, level, status, escalated_to)
         VALUES ($1, $2, $3, 'PENDING', $4)
         RETURNING *;`,
        [data.grievance_id, data.reason, data.level || 1, data.escalated_to || null]
      );

      await client.query(
        `UPDATE grievances SET priority = 'CRITICAL', updated_at = NOW() WHERE id = $1;`,
        [data.grievance_id]
      );

      await client.query(
        `INSERT INTO grievance_events (grievance_id, from_status, to_status, actor_role, note)
         VALUES ($1, 'OPEN', 'OPEN', 'GOVERNMENT', $2);`,
        [data.grievance_id, `Escalation Level ${data.level || 1}: ${data.reason}`]
      );

      return res.rows[0];
    });
  }

  async getEscalations() {
    try {
      const res = await query(`
        SELECT e.id, e.level, e.reason, e.status, e.created_at,
               g.ticket_id, g.district, g.domain, g.raw_text, g.severity, g.status as grievance_status
        FROM escalations e
        JOIN grievances g ON e.grievance_id = g.id
        ORDER BY e.created_at DESC;
      `);
      return res.rows;
    } catch (err: any) {
      throw new DatabaseError(`Failed to fetch escalations: ${err.message}`);
    }
  }
}

export const governmentRepo = new GovernmentRepository();
