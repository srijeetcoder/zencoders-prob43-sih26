import { BomConstraintError } from '../utils/errors';

export interface BoMItem {
  item: string;
  quantity?: number;
  unitCost?: number;
  totalCost?: number;
  justification?: string;
  category?: string;
}

export interface BoMValidationResult {
  valid: boolean;
  sanitizedBom: BoMItem[];
  violations: string[];
  complianceScore: number;
}

// Prohibited item regex patterns per domain
const PROHIBITED_DOMAIN_PATTERNS: Record<string, { patterns: RegExp[]; explanation: string }[]> = {
  education: [
    {
      patterns: [/flow\s*meter/i, /canal\s*sensor/i, /water\s*level\s*sensor/i, /piezoresistive/i, /irrigation\s*telemetry/i, /water\s*pressure/i, /ultrasonic\s*clamp/i],
      explanation: 'Hydrology and canal flow sensors are strictly prohibited in Education projects.',
    },
    {
      patterns: [/blast\s*sensor/i, /mining\s*borehole/i, /seismic\s*geophone/i],
      explanation: 'Mining geology hardware is prohibited in Education projects.',
    },
  ],
  water: [
    {
      patterns: [/smartboard/i, /chalkboard/i, /school\s*bench/i, /classroom\s*desk/i, /pediatric\s*dialyzer/i],
      explanation: 'Classroom furniture and clinical medical apparatus are prohibited in Water/Hydrology projects.',
    },
  ],
  health: [
    {
      patterns: [/tractor\s*harvester/i, /irrigation\s*canal\s*sluice/i, /mine\s*excavator/i],
      explanation: 'Heavy agricultural machinery and mining excavators are prohibited in Healthcare infrastructure.',
    },
  ],
  agriculture: [
    {
      patterns: [/smartboard/i, /hospital\s*ventilator/i, /coal\s*dragline/i],
      explanation: 'Classroom smartboards and heavy mining draglines are prohibited in Agricultural DPRs.',
    },
  ],
};

export class BomGuardService {
  /**
   * Deterministically validates and sanitizes a Bill of Materials list against the given domain rules
   */
  validateBom(domain: string, bomItems: BoMItem[]): BoMValidationResult {
    const normalizedDomain = (domain || '').toLowerCase().trim();
    const violations: string[] = [];
    const sanitizedBom: BoMItem[] = [];

    // Find rules matching domain
    let matchedRuleKey = '';
    for (const key of Object.keys(PROHIBITED_DOMAIN_PATTERNS)) {
      if (normalizedDomain.includes(key)) {
        matchedRuleKey = key;
        break;
      }
    }

    const rules = matchedRuleKey ? PROHIBITED_DOMAIN_PATTERNS[matchedRuleKey] : [];

    for (const item of bomItems) {
      let isProhibited = false;
      const itemName = item.item || '';

      for (const rule of rules) {
        for (const pattern of rule.patterns) {
          if (pattern.test(itemName) || (item.justification && pattern.test(item.justification))) {
            isProhibited = true;
            violations.push(`Violation in [${itemName}]: ${rule.explanation}`);
            break;
          }
        }
        if (isProhibited) break;
      }

      if (!isProhibited) {
        sanitizedBom.push(item);
      }
    }

    const valid = violations.length === 0;
    const totalCount = bomItems.length || 1;
    const complianceScore = Math.max(0, Math.round(((totalCount - violations.length) / totalCount) * 100));

    return {
      valid,
      sanitizedBom,
      violations,
      complianceScore,
    };
  }

  /**
   * Enforces that the BoM strictly complies, otherwise throws BomConstraintError
   */
  enforceBomCompliance(domain: string, bomItems: BoMItem[]): BoMItem[] {
    const result = this.validateBom(domain, bomItems);
    if (!result.valid) {
      throw new BomConstraintError(
        `Hardware Bill-of-Materials failed domain constraint verification for domain [${domain}]`,
        { violations: result.violations }
      );
    }
    return result.sanitizedBom;
  }
}

export const bomGuard = new BomGuardService();
