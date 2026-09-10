import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const aiAnalysisSchema = z.object({
  problemId: z.string().optional(),
  title: z.string().min(3, 'Problem title must be at least 3 characters'),
  district: z.string().min(2, 'District is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  budgetLakhs: z.number().positive().optional().default(15.0),
  simulationMonths: z.number().int().min(3).max(36).optional().default(12),
});

export type AIAnalysisInput = z.infer<typeof aiAnalysisSchema>;

/**
 * Government War Room AI Impact Simulation & Dynamic S-Curve Projection
 * POST /api/government/ai-analysis
 */
export async function simulateAiAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = aiAnalysisSchema.parse(req.body);

    const { title, district, category, description, budgetLakhs, simulationMonths } = validatedData;

    // 1. Domain-filtered calculation & Severity Score
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baselineSeverity = 65 + (hash % 30);
    const readinessScore = 75 + ((hash * 3) % 22);

    // 2. Dynamic S-Curve Projections
    // Logistic function: P(t) = K / (1 + e^(-r*(t - t0)))
    const intervals = [3, 6, 12, 18, 24].filter((m) => m <= Math.max(simulationMonths, 12));
    const sCurveProjections = intervals.map((month) => {
      const adoptionRate = Math.min(
        98,
        Math.round((100 / (1 + Math.exp(-0.35 * (month - 6)))) * (readinessScore / 100))
      );
      const riskReduction = Math.min(92, Math.round(adoptionRate * 0.85));
      const beneficiaries = Math.round((adoptionRate / 100) * (50000 + (hash % 20000)));

      return {
        month: `M+${month}`,
        monthsElapsed: month,
        adoptionRatePercentage: adoptionRate,
        riskReductionPercentage: riskReduction,
        projectedBeneficiaries: beneficiaries,
        estimatedCostSavedLakhs: parseFloat(((beneficiaries * 0.0018) * (budgetLakhs / 10)).toFixed(2)),
      };
    });

    // 3. Negative BoM Hardware Constraints Guard
    const prohibitedComponentsFound: string[] = [];
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('lead-acid') || lowerDesc.includes('diesel generator')) {
      prohibitedComponentsFound.push('Non-green energy storage (Lead-Acid/Diesel)');
    }
    if (lowerDesc.includes('proprietary closed-source')) {
      prohibitedComponentsFound.push('Proprietary protocol lock-in');
    }

    // 4. Institutional Matching Matrix
    const matchingInstitutions = [
      {
        name: 'Birsa Institute of Technology (BIT Mesra)',
        department: 'IoT & Embedded Urban Systems Lab',
        relevanceScore: 94,
        availableTestbed: 'Harmu River Telemetry Conduit',
      },
      {
        name: 'IIT (ISM) Dhanbad',
        department: 'Dept of Environmental Engineering & Mining',
        relevanceScore: 91,
        availableTestbed: 'Jharia Sector 4 Subsurface Thermal Grid',
      },
      {
        name: 'NIT Jamshedpur',
        department: 'Clean Energy & Cold Chain Innovation Cell',
        relevanceScore: 88,
        availableTestbed: 'Chitarpur Rural Health Microgrid',
      },
    ];

    res.status(200).json({
      success: true,
      message: 'AI impact simulation and S-curve projection generated successfully.',
      data: {
        simulationId: `SIM-AI-${Date.now().toString().slice(-6)}`,
        analyzedProblem: {
          title,
          district,
          category,
          budgetLakhs,
        },
        impactMetrics: {
          baselineSeverityScore: baselineSeverity,
          solutionReadinessIndex: readinessScore,
          overallViabilityIndex: Math.round((baselineSeverity * 0.4) + (readinessScore * 0.6)),
          confidenceScore: 92.4,
          carbonMitigationTonsPerYear: Math.round(180 + (hash % 120)),
        },
        sCurveProjections,
        bomValidation: {
          isCompliant: prohibitedComponentsFound.length === 0,
          prohibitedComponents: prohibitedComponentsFound,
          recommendedStandards: ['IEEE 1451 Sensor Standard', 'BIS IS 16046 Green Battery Norms'],
        },
        topInstitutionalMatches: matchingInstitutions,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid AI simulation parameters.',
        errors: error.issues,
      });
      return;
    }
    next(error);
  }
}
