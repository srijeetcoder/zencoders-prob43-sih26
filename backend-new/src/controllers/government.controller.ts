import { Request, Response, NextFunction } from 'express';
import { governmentRepo } from '../repositories/government.repo';
import { grievanceRepo } from '../repositories/grievance.repo';
import { auditRepo } from '../repositories/audit.repo';
import { aiAnalysisService } from '../services/aiAnalysis.service';
import { clusteringService } from '../services/clustering.service';
import { DispatchOrderSchema, EscalationSchema, UpdateStatusSchema, GovernmentAIAnalysisSchema } from '../schemas/government.schema';
import { GrievanceQuerySchema } from '../schemas/citizen.schema';
import { NotificationController } from './notification.controller';
import { sendSuccess } from '../utils/apiResponse';
import { NotFoundError, ValidationError } from '../utils/errors';

export class GovernmentController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const districtFilter = (req.query.district as string) || undefined;
      const data = await governmentRepo.getOverviewMetrics(districtFilter);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getDistrictsHazardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await governmentRepo.getDistrictsHazardData();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const depts = await governmentRepo.getAllDepartments();
      sendSuccess(res, depts);
    } catch (err) {
      next(err);
    }
  }

  async getGrievances(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = GrievanceQuerySchema.parse(req.query);
      const result = await grievanceRepo.findPaginated({
        page: query.page,
        limit: query.limit,
        district: query.district,
        domain: query.domain,
        status: query.status,
        priority: query.priority,
        search: query.search,
      });
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getClusters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const district = (req.query.district as string) || undefined;
      const domain = (req.query.domain as string) || undefined;
      const clusters = await clusteringService.clusterGrievances({ district, domain });
      sendSuccess(res, clusters);
    } catch (err) {
      next(err);
    }
  }

  async createDispatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = DispatchOrderSchema.parse(req.body);
      const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';

      const dispatch = await governmentRepo.createDispatch({
        grievance_id: data.grievance_id,
        department_id: data.department_id,
        assigned_officer_id: data.assigned_officer_id,
        priority: data.priority,
        instructions: data.instructions,
        dispatched_by: userId,
      });

      await auditRepo.log({
        user_id: userId,
        role: req.user?.role,
        action: 'DISPATCH_CREATED',
        resource_type: 'GRIEVANCE',
        resource_id: data.grievance_id,
        ip_address: req.ip,
        metadata: { dispatchId: dispatch.id, priority: data.priority },
      });

      sendSuccess(res, { message: 'Dispatch order created and task assigned.', dispatch }, 201);
    } catch (err) {
      next(err);
    }
  }

  async createEscalation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = EscalationSchema.parse(req.body);
      const escalation = await governmentRepo.createEscalation({
        grievance_id: data.grievance_id,
        reason: data.reason,
        level: data.level,
        escalated_to: data.escalated_to,
      });

      await auditRepo.log({
        user_id: req.user?.id,
        role: req.user?.role,
        action: 'GRIEVANCE_ESCALATED',
        resource_type: 'GRIEVANCE',
        resource_id: data.grievance_id,
        ip_address: req.ip,
        metadata: { escalationId: escalation.id, level: data.level },
      });

      sendSuccess(res, { message: 'Grievance escalated to higher authority.', escalation }, 201);
    } catch (err) {
      next(err);
    }
  }

  async getEscalations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const escalations = await governmentRepo.getEscalations();
      sendSuccess(res, escalations);
    } catch (err) {
      next(err);
    }
  }

  async updateGrievanceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { status, note } = UpdateStatusSchema.parse(req.body);
      const updated = await grievanceRepo.updateStatus(id, status, req.user?.id, req.user?.role || 'GOVERNMENT', note);

      await auditRepo.log({
        user_id: req.user?.id,
        role: req.user?.role,
        action: 'GRIEVANCE_STATUS_UPDATED',
        resource_type: 'GRIEVANCE',
        resource_id: id,
        ip_address: req.ip,
        metadata: { newStatus: status, note },
      });

      const progressPercent = status === 'RESOLVED' || status === 'VERIFIED' ? 100 : status === 'IN_PROGRESS' ? 75 : status === 'ASSIGNED' || status === 'DISPATCHED' ? 50 : 35;

      // Broadcast real-time SSE event so citizen tracking and university portals update instantly
      NotificationController.broadcastRealtimeEvent('problem_status_updated', {
        id: updated.id,
        ticketId: updated.ticket_id,
        ticket_id: updated.ticket_id,
        status: updated.status,
        note: note || `Status updated to ${status}`,
        actor: req.user?.name || 'Executive War Room Desk',
        progressPercent,
        updatedAt: updated.updated_at,
      });

      // Targeted notification to reporting citizen
      if (updated.citizen_id) {
        await NotificationController.pushNotification({
          userId: updated.citizen_id,
          title: `Grievance #${updated.ticket_id} Status: ${status}`,
          message: note || `Your report in ${updated.district} has been updated to ${status}.`,
          type: 'status_update',
          link: `/trackprogress/${updated.ticket_id}`,
        });
      }

      sendSuccess(res, {
        ...updated,
        ticketId: updated.ticket_id,
        progressPercent,
        message: `Grievance #${updated.ticket_id} status updated to ${status}.`,
      });
    } catch (err) {
      next(err);
    }
  }

  async assignUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { institution_id, institutionId, institution_name, institutionName, instructions } = req.body;
      const instName = institution_name || institutionName || 'Academic Research Partner';
      const instId = institution_id || institutionId;

      const updated = await grievanceRepo.updateStatus(
        id,
        'LAB_MATCHED',
        req.user?.id,
        req.user?.role || 'GOVERNMENT',
        `Matched with ${instName}. Directives: ${instructions || 'Conduct technical DPR and field prototyping'}`
      );

      // Broadcast to University portal and Citizen tracking
      NotificationController.broadcastRealtimeEvent('university_assigned', {
        id: updated.id,
        ticketId: updated.ticket_id,
        ticket_id: updated.ticket_id,
        institutionId: instId,
        institutionName: instName,
        status: 'LAB_MATCHED',
        instructions,
        updatedAt: new Date().toISOString(),
      });

      NotificationController.broadcastRealtimeEvent('problem_status_updated', {
        id: updated.id,
        ticketId: updated.ticket_id,
        ticket_id: updated.ticket_id,
        status: 'LAB_MATCHED',
        matchedTeam: instName,
        note: `Matched with ${instName}`,
        progressPercent: 50,
        updatedAt: new Date().toISOString(),
      });

      sendSuccess(res, {
        message: `Grievance #${updated.ticket_id} matched and dispatched to ${instName}.`,
        grievance: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async triggerAIAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const domain = data.domain || data.category || 'Civil Infrastructure';
      const prompt = data.prompt || data.description || data.title || 'Systemic issue analysis';
      const district = data.district || 'Ranchi';
      const apiKey = (req.headers['x-gemini-api-key'] as string) || data.apiKey || undefined;

      const result = await aiAnalysisService.executeAnalysis({
        entityType: data.entity_type || 'CLUSTER',
        entityId: data.entity_id || data.clusterId,
        clusterId: data.clusterId,
        domain,
        district,
        prompt,
        module: data.module || 'master',
        apiKey,
        userId: req.user?.id,
      });

      await auditRepo.log({
        user_id: req.user?.id,
        role: req.user?.role,
        action: 'AI_ANALYSIS_EXECUTED',
        resource_type: data.entity_type || 'CLUSTER',
        resource_id: data.entity_id || data.clusterId,
        ip_address: req.ip,
        metadata: { domain, confidence: result.confidence },
      });

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export const governmentController = new GovernmentController();
