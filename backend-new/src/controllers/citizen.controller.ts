import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { grievanceRepo } from '../repositories/grievance.repo';
import { generateEmbedding } from '../services/embedding.service';
import { detectAndTranslate } from '../services/translation.service';
import { NotificationController } from './notification.controller';
import { CreateGrievanceSchema, ClaimGrievanceSchema, GrievanceQuerySchema } from '../schemas/citizen.schema';
import { sendSuccess } from '../utils/apiResponse';
import { NotFoundError, AuthenticationError, ValidationError } from '../utils/errors';

export class CitizenController {
  async submitGrievance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = CreateGrievanceSchema.parse(req.body);
      const rawText = input.raw_text || input.text || input.rawDescription || input.description || input.title || '';
      const district = input.district || 'Ranchi';

      // 1. Multilingual ingestion: Detect dialect & normalize to formal English
      const translation = await detectAndTranslate(rawText, district);
      const normalizedText = translation.translatedText || rawText;
      const detectedLang = translation.detectedLanguage || input.language || 'English';

      // 2. Classify domain / severity if not provided
      let domain = input.domain || 'Water Quality & Hydrology';
      let severity = 'MEDIUM';
      let priority = 'STANDARD';

      const lower = (rawText + ' ' + normalizedText).toLowerCase();
      if (lower.includes('water') || lower.includes('arsenic') || lower.includes('fluoride') || lower.includes('borewell') || lower.includes('drainage') || lower.includes('canal')) {
        domain = 'Water Quality & Hydrology';
        severity = 'HIGH';
        priority = 'HIGH';
      } else if (lower.includes('school') || lower.includes('teacher') || lower.includes('student') || lower.includes('education') || lower.includes('midday')) {
        domain = 'Education & Literacy';
      } else if (lower.includes('smoke') || lower.includes('mining') || lower.includes('coal') || lower.includes('pollution') || lower.includes('fire')) {
        domain = 'Mining & Geo-hazards';
        severity = 'CRITICAL';
        priority = 'CRITICAL';
      } else if (lower.includes('crop') || lower.includes('fertilizer') || lower.includes('drought') || lower.includes('lac') || lower.includes('farmer')) {
        domain = 'Agriculture & Minor Forest Produce';
      } else if (lower.includes('road') || lower.includes('bridge') || lower.includes('pothole') || lower.includes('highway')) {
        domain = 'Public Infrastructure & Roads';
      }

      // 3. Attachments processing (Max 3 photos, 1 video)
      const photos = (input.photos || input.attachments?.photos || []).slice(0, 3);
      const video = input.video || input.attachments?.video || undefined;
      const attachments = { photos, video };

      // 4. Generate 768-dim semantic embedding
      const embedding = await generateEmbedding(`${normalizedText} District: ${district} Domain: ${domain}`);

      // 5. Create Grievance via ACID transaction with PostgreSQL sequence ticket
      const citizenId = req.user?.id || undefined;
      const grievance = await grievanceRepo.createGrievance({
        citizen_id: citizenId,
        anonymous_session_id: input.anonymous_session_id,
        raw_text: rawText,
        normalized_text: normalizedText,
        language: detectedLang,
        district,
        block: input.block,
        latitude: input.latitude,
        longitude: input.longitude,
        domain,
        severity,
        priority,
        classification_confidence: 0.92,
        attachments,
        embedding,
      });

      // 6. If submitted anonymously, generate secure claim token (valid for 30 days)
      let claimToken: string | undefined;
      if (!citizenId) {
        claimToken = crypto.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await grievanceRepo.createClaimToken(grievance.id, claimToken, expiresAt);
      }

      // 7. Real-time Notification dispatch
      await NotificationController.pushNotification({
        userId: citizenId,
        title: `Grievance #${grievance.ticket_id} Logged`,
        message: `Your report for ${district} (${domain}) is recorded and dispatched for lab matching.`,
        type: 'status_update',
        link: `/trackprogress/${grievance.ticket_id}`,
      });

      sendSuccess(res, {
        grievance: {
          id: grievance.id,
          ticket_id: grievance.ticket_id,
          status: grievance.status,
          domain: grievance.domain,
          severity: grievance.severity,
          priority: grievance.priority,
          district: grievance.district,
          language: grievance.language,
          normalized_text: grievance.normalized_text,
          attachments: grievance.attachments,
          created_at: grievance.created_at,
        },
        claimToken,
        message: 'Grievance registered in state societal innovation ledger.',
      }, 201);
    } catch (err) {
      next(err);
    }
  }

  async getMyGrievances(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Authentication required');
      const query = GrievanceQuerySchema.parse(req.query);

      const result = await grievanceRepo.findPaginated({
        page: query.page,
        limit: query.limit,
        citizen_id: req.user.id,
        district: query.district,
        domain: query.domain,
        status: query.status,
      });

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getGrievanceByTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = req.params.ticketId;
      const grievance = await grievanceRepo.findByTicketId(ticketId);
      if (!grievance) throw new NotFoundError(`Grievance with ticket ID ${ticketId} not found`);

      const events = await grievanceRepo.getEvents(grievance.id);

      sendSuccess(res, {
        ...grievance,
        events,
      });
    } catch (err) {
      next(err);
    }
  }

  async claimGrievance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AuthenticationError('Authentication required to claim a ticket');
      const { claimToken } = ClaimGrievanceSchema.parse(req.body);

      const updated = await grievanceRepo.claimGrievance(claimToken, req.user.id);
      sendSuccess(res, {
        message: 'Grievance ticket linked to your citizen account.',
        grievance: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getGrievanceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = req.params.ticketId;
      const grievance = await grievanceRepo.findByTicketId(ticketId);
      if (!grievance) throw new NotFoundError(`Grievance with ticket ID ${ticketId} not found`);

      const events = await grievanceRepo.getEvents(grievance.id);

      sendSuccess(res, {
        ticket_id: grievance.ticket_id,
        status: grievance.status,
        domain: grievance.domain,
        district: grievance.district,
        attachments: grievance.attachments,
        created_at: grievance.created_at,
        updated_at: grievance.updated_at,
        resolved_at: grievance.resolved_at,
        timeline: events,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPublicFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const district = req.query.district as string;
      const result = await grievanceRepo.findPaginated({
        page: 1,
        limit: 50,
        district: district && district !== 'All' ? district : undefined,
      });

      const items = result.items.map((row) => ({
        id: row.id,
        ticketId: row.ticket_id,
        title: `${row.domain} in ${row.district}`,
        description: row.normalized_text,
        district: row.district,
        domainTags: [row.domain, row.sub_domain].filter(Boolean) as string[],
        priority: row.priority || 'STANDARD',
        status: row.status,
        createdAt: row.created_at,
      }));

      sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }
}

export const citizenController = new CitizenController();
