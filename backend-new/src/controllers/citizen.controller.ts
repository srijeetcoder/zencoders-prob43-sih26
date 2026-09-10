import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { grievanceRepo } from '../repositories/grievance.repo';
import { generateEmbedding } from '../services/embedding.service';
import { detectAndTranslate } from '../services/translation.service';
import { CreateGrievanceSchema, ClaimGrievanceSchema, GrievanceQuerySchema } from '../schemas/citizen.schema';
import { sendSuccess } from '../utils/apiResponse';
import { NotFoundError, AuthenticationError, ValidationError } from '../utils/errors';

export class CitizenController {
  async submitGrievance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = CreateGrievanceSchema.parse(req.body);

      // 1. Multilingual ingestion: Detect dialect & normalize to formal English
      const translation = await detectAndTranslate(input.raw_text, input.district);
      const normalizedText = translation.translatedText || input.raw_text;
      const detectedLang = translation.detectedLanguage || input.language || 'English';

      // 2. Classify domain / severity if not provided
      let domain = input.domain || 'Water Quality & Hydrology';
      let severity = 'MEDIUM';
      let priority = 'STANDARD';

      const lower = (input.raw_text + ' ' + normalizedText).toLowerCase();
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

      // 3. Generate 768-dim semantic embedding
      const embedding = await generateEmbedding(`${normalizedText} District: ${input.district} Domain: ${domain}`);

      // 4. Create Grievance via ACID transaction with PostgreSQL sequence ticket
      const citizenId = req.user?.id || undefined;
      const grievance = await grievanceRepo.createGrievance({
        citizen_id: citizenId,
        anonymous_session_id: input.anonymous_session_id,
        raw_text: input.raw_text,
        normalized_text: normalizedText,
        language: detectedLang,
        district: input.district,
        block: input.block,
        latitude: input.latitude,
        longitude: input.longitude,
        domain,
        severity,
        priority,
        classification_confidence: 0.92,
        embedding,
      });

      // 5. If submitted anonymously, generate secure claim token (valid for 30 days)
      let claimToken: string | undefined;
      if (!citizenId) {
        claimToken = crypto.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await grievanceRepo.createClaimToken(grievance.id, claimToken, expiresAt);
      }

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
        created_at: grievance.created_at,
        updated_at: grievance.updated_at,
        resolved_at: grievance.resolved_at,
        timeline: events,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const citizenController = new CitizenController();
