import { Request, Response, NextFunction } from 'express';
import { institutionRepo } from '../repositories/institution.repo';
import { grievanceRepo } from '../repositories/grievance.repo';
import { auditRepo } from '../repositories/audit.repo';
import { aiAnalysisService } from '../services/aiAnalysis.service';
import { bomGuard } from '../services/bomGuard.service';
import { DprWorkbenchUpdateSchema, BomCheckSchema, CalibrationRequestSchema } from '../schemas/institution.schema';
import { NotificationController } from './notification.controller';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticationError, AuthorizationError, NotFoundError } from '../utils/errors';
import { query } from '../config/database';

export class InstitutionController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Authentication required');

      let instId = req.user.institution_id;
      // If super admin and no institution_id, pick first one for preview
      if (!instId && req.user.role === 'SUPER_ADMIN') {
        const all = await institutionRepo.getAllInstitutions();
        instId = all[0]?.id;
      }

      if (!instId) {
        throw new NotFoundError('No institution associated with this profile.');
      }

      const inst = await institutionRepo.findById(instId);
      if (!inst) throw new NotFoundError('Institution record not found.');

      sendSuccess(res, inst);
    } catch (err) {
      next(err);
    }
  }

  async getDprAllocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Authentication required');

      let instId = req.user.institution_id;
      if (!instId && req.user.role === 'SUPER_ADMIN') {
        const all = await institutionRepo.getAllInstitutions();
        instId = all[0]?.id;
      }

      if (!instId) {
        sendSuccess(res, []);
        return;
      }

      const dprs = await institutionRepo.getDprAllocations(instId);
      sendSuccess(res, dprs);
    } catch (err) {
      next(err);
    }
  }

  async getDprById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dprId = req.params.id;
      const instId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.institution_id;

      const dpr = await institutionRepo.getDprById(dprId, instId);
      sendSuccess(res, dpr);
    } catch (err) {
      next(err);
    }
  }

  async saveWorkbench(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dprId = req.params.id;
      const data = DprWorkbenchUpdateSchema.parse(req.body);
      const instId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.institution_id;

      // Verify ownership
      const dpr = await institutionRepo.getDprById(dprId, instId);

      // Validate BoM if provided
      let bomValidated = false;
      let bomViolations: string[] = [];
      let sanitizedBom = data.bom_items || [];

      if (data.bom_items && data.bom_items.length > 0) {
        const bomCheck = bomGuard.validateBom(dpr.domain, data.bom_items);
        bomValidated = bomCheck.valid;
        bomViolations = bomCheck.violations;
        sanitizedBom = bomCheck.sanitizedBom;
      }

      const updated = await institutionRepo.saveWorkbenchSnapshot(dprId, {
        technical_summary: data.technical_summary,
        proposed_solution: data.proposed_solution,
        bom_items: sanitizedBom,
        bom_validated: bomValidated,
        bom_violations: bomViolations,
        status: data.status,
        userId: req.user?.id,
      });

      await auditRepo.log({
        user_id: req.user?.id,
        role: req.user?.role,
        institution_id: req.user?.institution_id,
        action: 'DPR_WORKBENCH_SAVED',
        resource_type: 'DPR',
        resource_id: dprId,
        ip_address: req.ip,
        metadata: { version: updated.version_number, bomValidated },
      });

      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  async analyzeDpr(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dprId = req.params.id;
      const instId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.institution_id;
      const dpr = await institutionRepo.getDprById(dprId, instId);

      const prompt = req.body.prompt || `${dpr.title}: ${dpr.description} in ${dpr.district}`;
      const result = await aiAnalysisService.executeAnalysis({
        entityType: 'DPR',
        entityId: dprId,
        domain: dpr.domain,
        prompt,
        userId: req.user?.id,
      });

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async checkBom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { domain, bom_items } = BomCheckSchema.parse(req.body);
      const validation = bomGuard.validateBom(domain, bom_items);
      sendSuccess(res, validation);
    } catch (err) {
      next(err);
    }
  }

  async calibrateDpr(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dprId = req.params.id;
      const instId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.institution_id;
      const dpr = await institutionRepo.getDprById(dprId, instId);

      const prompt = req.body.prompt || `${dpr.title} in ${dpr.district}`;
      const analysis = await aiAnalysisService.executeAnalysis({
        entityType: 'DPR',
        entityId: dprId,
        domain: dpr.domain,
        prompt,
        userId: req.user?.id,
      });

      const bomCheck = bomGuard.validateBom(dpr.domain, ((analysis.bom || analysis.hardwareBoM || []) as any));

      const metric = await institutionRepo.saveCalibrationMetric(dprId, {
        prediction_confidence: analysis.confidence,
        rag_relevance: 0.94,
        domain_consistency: bomCheck.valid ? 0.98 : 0.65,
        bom_compliance: bomCheck.complianceScore / 100,
        constraint_violations: bomCheck.violations,
        review_outcome: bomCheck.valid ? 'PASSED_DOMAIN_GUARD' : 'FLAGGED_BOM_VIOLATION',
      });

      sendSuccess(res, {
        analysis,
        calibration: metric,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSolutionMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const domainFilter = (req.query.domain as string) || undefined;
      let sql = `
        SELECT e.id, e.name, e.entity_type, e.district, e.domain, e.capabilities, e.contact_email,
               d.title as matched_project, d.allocated_budget
        FROM ecosystem_entities e
        LEFT JOIN dpr_allocations d ON (d.domain ILIKE e.domain OR d.district ILIKE e.district)
      `;
      const params: any[] = [];
      if (domainFilter && domainFilter !== 'All') {
        sql += ` WHERE e.domain ILIKE $1`;
        params.push(domainFilter);
      }
      sql += ` ORDER BY e.name ASC LIMIT 50;`;

      const resDb = await query(sql, params);
      sendSuccess(res, resDb.rows);
    } catch (err) {
      next(err);
    }
  }

  async getOpenProblems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const domain = req.query.domain as string;
      const district = req.query.district as string;

      const result = await grievanceRepo.findPaginated({
        page: 1,
        limit: 50,
        domain: domain && domain !== 'ALL' ? domain : undefined,
        district: district && district !== 'All' ? district : undefined,
      });

      const mapped = result.items.map((item) => ({
        id: item.id,
        ticketId: item.ticket_id,
        ticket_id: item.ticket_id,
        title: `${item.domain} in ${item.district}`,
        description: item.normalized_text || item.raw_text,
        domain: item.domain,
        district: item.district,
        urgency: item.priority === 'CRITICAL' ? 'CRITICAL' : item.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
        department: 'State Innovation & Redressal Desk',
        status: item.status,
        createdAt: item.created_at,
      }));

      sendSuccess(res, mapped);
    } catch (err) {
      next(err);
    }
  }

  async acceptProblem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { team_name, teamName, student_name, studentName, proposal } = req.body;
      const tName = team_name || teamName || (req.user?.name ? `Team ${req.user.name}` : 'Student Innovation Team');
      const sName = student_name || studentName || req.user?.name || 'Academic Innovator';

      // Find grievance
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const grievance = isUuid ? await grievanceRepo.findById(id) : await grievanceRepo.findByTicketId(id);
      if (!grievance) throw new NotFoundError(`Problem ${id} not found`);

      // Determine institution name
      let instName = 'Birsa Institute of Technology (BIT Mesra)';
      let instId = req.user?.institution_id;
      if (instId) {
        const inst = await institutionRepo.findById(instId);
        if (inst) instName = inst.name;
      }

      // Transition grievance status to LAB_MATCHED
      const updated = await grievanceRepo.updateStatus(
        grievance.id,
        'LAB_MATCHED',
        req.user?.id,
        req.user?.role || 'INSTITUTION',
        `Accepted by ${instName} (${tName}): ${proposal || 'Prototyping plan registered'}`
      );

      // Create DPR allocation if not existing
      try {
        await query(
          `INSERT INTO dpr_allocations (title, description, domain, district, institution_id, status, allocated_budget)
           VALUES ($1, $2, $3, $4, $5, 'MATCHED', 180000)
           ON CONFLICT DO NOTHING;`,
          [
            `${grievance.domain} Solution Prototype`,
            proposal || `Academic response to ${grievance.normalized_text.slice(0, 100)}`,
            grievance.domain,
            grievance.district,
            instId || '00000000-0000-0000-0000-000000000001'
          ]
        );
      } catch {}

      // Broadcast real-time event to Government and Citizen Track Progress
      NotificationController.broadcastRealtimeEvent('university_accepted', {
        id: updated.id,
        ticketId: updated.ticket_id,
        ticket_id: updated.ticket_id,
        institutionName: instName,
        teamName: tName,
        studentName: sName,
        status: 'LAB_MATCHED',
        proposal,
        updatedAt: new Date().toISOString(),
      });

      NotificationController.broadcastRealtimeEvent('problem_status_updated', {
        id: updated.id,
        ticketId: updated.ticket_id,
        ticket_id: updated.ticket_id,
        status: 'LAB_MATCHED',
        matchedTeam: `${instName} (${tName})`,
        progressPercent: 50,
        note: `Accepted by ${instName} (${tName})`,
        updatedAt: new Date().toISOString(),
      });

      // Notification to Government War Room
      await NotificationController.pushNotification({
        role: 'GOVERNMENT',
        title: `🤝 Challenge Accepted #${updated.ticket_id}`,
        message: `${instName} (${tName}) accepted challenge for ${updated.district} (${updated.domain}).`,
        type: 'match',
        link: `/gov/live-problems/${updated.ticket_id}`,
      });

      // Notification to Citizen
      if (updated.citizen_id) {
        await NotificationController.pushNotification({
          userId: updated.citizen_id,
          title: `Lab Matched for Grievance #${updated.ticket_id}`,
          message: `${instName} (${tName}) has accepted your problem for field engineering.`,
          type: 'status_update',
          link: `/trackprogress/${updated.ticket_id}`,
        });
      }

      sendSuccess(res, {
        message: `Challenge #${updated.ticket_id} accepted successfully. Synchronized across state ledger.`,
        grievance: updated,
        matchedTeam: `${instName} (${tName})`,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const institutionController = new InstitutionController();
