import { Request, Response, NextFunction } from 'express';
import { institutionRepo } from '../repositories/institution.repo';
import { auditRepo } from '../repositories/audit.repo';
import { aiAnalysisService } from '../services/aiAnalysis.service';
import { bomGuard } from '../services/bomGuard.service';
import { DprWorkbenchUpdateSchema, BomCheckSchema, CalibrationRequestSchema } from '../schemas/institution.schema';
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

      const bomCheck = bomGuard.validateBom(dpr.domain, analysis.bom);

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
}

export const institutionController = new InstitutionController();
