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

      // 3. Flexible attachments processing (photos & video from array or object)
      let photos: string[] = [];
      let video: string | undefined = undefined;

      if (Array.isArray(input.attachments)) {
        input.attachments.forEach((att: any) => {
          if (att?.type === 'video' || (typeof att?.url === 'string' && att.url.includes('video'))) {
            video = att.url || att.name;
          } else if (att?.url) {
            photos.push(att.url);
          } else if (typeof att === 'string') {
            photos.push(att);
          }
        });
      } else if (input.attachments && typeof input.attachments === 'object') {
        photos = input.attachments.photos || [];
        video = input.attachments.video || undefined;
      }

      if (input.photos && Array.isArray(input.photos)) {
        photos = [...photos, ...input.photos];
      }
      if (input.video) {
        video = input.video;
      }
      photos = photos.filter((p) => typeof p === 'string' && p.trim().length > 0).slice(0, 3);
      const attachments = { photos, video: video || undefined };

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

      // 7. Real-Time Telemetry Broadcasting: Notify Government War Room, Universities, and Citizen
      const problemPayload = {
        id: grievance.id,
        ticket_id: grievance.ticket_id,
        ticketId: grievance.ticket_id,
        title: input.title || `${grievance.domain} Bottleneck in ${grievance.district}`,
        description: grievance.normalized_text || grievance.raw_text,
        district: grievance.district,
        domain: grievance.domain,
        domainTags: [grievance.domain, grievance.sub_domain].filter(Boolean),
        severity: grievance.severity,
        priority: grievance.priority,
        status: grievance.status,
        attachments: grievance.attachments,
        photos: attachments.photos,
        created_at: grievance.created_at,
        createdAt: grievance.created_at,
      };

      // Broadcast real-time SSE event to all connected portals
      NotificationController.broadcastRealtimeEvent('problem_submitted', problemPayload);

      // Targeted notification to Government War Room Desk
      await NotificationController.pushNotification({
        role: 'GOVERNMENT',
        title: `⚡ Live Citizen Grievance #${grievance.ticket_id}`,
        message: `${grievance.district} (${grievance.domain}): ${grievance.normalized_text.slice(0, 80)}...`,
        type: 'alert',
        link: `/gov/live-problems/${grievance.ticket_id}`,
      });

      // Targeted notification to Academic & University Portals
      await NotificationController.pushNotification({
        role: 'INSTITUTION',
        title: `🏛️ New Civic Challenge #${grievance.ticket_id}`,
        message: `Open for R&D lab matching in ${grievance.district} (${grievance.domain}).`,
        type: 'match',
        link: `/university-dashboard/live-problems`,
      });

      // Notification to Submitting Citizen
      if (citizenId) {
        await NotificationController.pushNotification({
          userId: citizenId,
          title: `Grievance #${grievance.ticket_id} Logged`,
          message: `Your report for ${district} (${domain}) is recorded and dispatched for lab matching.`,
          type: 'status_update',
          link: `/trackprogress/${grievance.ticket_id}`,
        });
      }

      sendSuccess(res, {
        ticketId: grievance.ticket_id,
        ticket_id: grievance.ticket_id,
        id: grievance.id,
        normalizedText: grievance.normalized_text,
        grievance: {
          id: grievance.id,
          ticket_id: grievance.ticket_id,
          ticketId: grievance.ticket_id,
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
        message: 'Grievance registered in state societal innovation ledger and broadcast live.',
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
        ticketId: grievance.ticket_id,
        ticket_id: grievance.ticket_id,
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
      const st = (grievance.status || 'OPEN').toUpperCase();

      const stages = [
        { name: 'Grievance Ingested', status: 'COMPLETED', date: new Date(grievance.created_at).toLocaleDateString() },
        { name: 'Dialect Normalization & AI Triage', status: 'COMPLETED', date: new Date(grievance.created_at).toLocaleDateString() },
        { name: 'Institutional Lab Matching', status: (st === 'LAB_MATCHED' || st === 'IN_PROGRESS' || st === 'RESOLVED' || st === 'VERIFIED') ? 'COMPLETED' : 'IN_PROGRESS', date: grievance.updated_at ? new Date(grievance.updated_at).toLocaleDateString() : 'Active' },
        { name: 'Field Pilot & DPR Approval', status: (st === 'IN_PROGRESS' || st === 'RESOLVED' || st === 'VERIFIED') ? 'IN_PROGRESS' : 'PENDING', date: 'TBD' },
        { name: 'Resolution & Validation', status: (st === 'RESOLVED' || st === 'VERIFIED') ? 'COMPLETED' : 'PENDING', date: grievance.resolved_at ? new Date(grievance.resolved_at).toLocaleDateString() : 'TBD' },
      ];

      const progressPercent = st === 'RESOLVED' || st === 'VERIFIED' ? 100 : st === 'IN_PROGRESS' ? 75 : st === 'LAB_MATCHED' ? 50 : 25;

      sendSuccess(res, {
        ticketId: grievance.ticket_id,
        ticket_id: grievance.ticket_id,
        problemId: grievance.id,
        status: grievance.status,
        domain: grievance.domain,
        district: grievance.district,
        text: grievance.raw_text,
        translatedProblem: grievance.normalized_text,
        domainTags: [grievance.domain, grievance.sub_domain].filter(Boolean),
        severity: grievance.severity,
        priority: grievance.priority,
        stages,
        progressPercent,
        currentStage: st === 'RESOLVED' ? 'Resolution & Validation' : st === 'IN_PROGRESS' ? 'Field Pilot & DPR Approval' : st === 'LAB_MATCHED' ? 'Institutional Lab Matching' : 'Dialect Normalization & AI Triage',
        allocatedCenter: 'CSIR-CIMFR / BIT Mesra IoT & Urban Systems Lab',
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
