import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { matchEcosystemWithReadiness } from '../services/ecosystemMatcher.service';

/**
 * Retrieves institutional ecosystem matches and readiness evaluation for a problem ID
 * Endpoint: GET /api/ecosystem/match/:problemId
 */
export async function getEcosystemMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { problemId } = req.params;

    let problemText = 'Subsurface mining fire and groundwater contamination in Jharkhand';
    let district = 'Dhanbad';
    let domainTags: string[] = ['Mining Engineering', 'Water Quality'];
    let disciplines: string[] = ['Geo-thermal', 'Hydrology'];

    try {
      const result = await query(
        `SELECT id, text, district, domain_tags, disciplines, translated_problem 
         FROM problems 
         WHERE id = $1`,
        [problemId]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0];
        problemText = row.translated_problem || row.text;
        district = row.district;
        domainTags = row.domain_tags || [];
        disciplines = row.disciplines || [];
      }
    } catch (dbErr: any) {
      console.warn(`[EcosystemController] Problem lookup fallback: ${dbErr.message}`);
    }

    const combinedTags = [...domainTags, ...disciplines];
    const readinessResult = await matchEcosystemWithReadiness(
      problemText,
      combinedTags,
      district,
      { limit: 5 }
    );

    res.status(200).json({
      success: true,
      data: {
        problemId,
        district,
        domainTags: combinedTags,
        projectReadinessPercentage: readinessResult.projectReadinessPercentage,
        requirementsChecklist: readinessResult.requirementsChecklist,
        missingCapabilities: readinessResult.missingCapabilities,
        topMatches: readinessResult.topMatches,
      },
    });
  } catch (error) {
    next(error);
  }
}
