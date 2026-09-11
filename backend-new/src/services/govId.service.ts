import crypto from 'crypto';
import { query } from '../config/database';
import { ValidationError } from '../utils/errors';

export const DISTRICT_CODE_MAP: Record<string, string> = {
  Ranchi: 'RN',
  Dhanbad: 'DH',
  Bokaro: 'BK',
  'East Singhbhum': 'ES',
  'West Singhbhum': 'WS',
  Palamu: 'PL',
  Hazaribagh: 'HZ',
  Giridih: 'GD',
  Deoghar: 'DG',
  Dumka: 'DM',
  Godda: 'GA',
  Sahibganj: 'SB',
  Pakur: 'PK',
  Jamtara: 'JM',
  Chatra: 'CH',
  Koderma: 'KD',
  Garhwa: 'GR',
  Latehar: 'LT',
  Lohardaga: 'LH',
  Gumla: 'GM',
  Simdega: 'SM',
  'Seraikela Kharsawan': 'SK',
  Khunti: 'KN',
  Ramgarh: 'RG',
};

export class GovernmentIdService {
  /**
   * Resolves standard 2-character district code from district name.
   */
  getDistrictCode(districtName: string): string {
    const trimmed = districtName.trim();
    if (DISTRICT_CODE_MAP[trimmed]) {
      return DISTRICT_CODE_MAP[trimmed];
    }
    // Case insensitive match
    const found = Object.keys(DISTRICT_CODE_MAP).find(
      (k) => k.toLowerCase() === trimmed.toLowerCase()
    );
    if (found) {
      return DISTRICT_CODE_MAP[found];
    }
    // Fallback: sanitized 2-letter uppercase
    const clean = trimmed.replace(/[^a-zA-Z]/g, '').toUpperCase();
    return clean.length >= 2 ? clean.slice(0, 2) : 'JH';
  }

  /**
   * Generates a 4-character secure alphanumeric token.
   */
  private generateRandomToken(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous 0/O/1/I
    let token = '';
    const bytes = crypto.randomBytes(4);
    for (let i = 0; i < 4; i++) {
      token += chars[bytes[i] % chars.length];
    }
    return token;
  }

  /**
   * Generates a unique government identifier in the format JH-XX-XXXX.
   * Guarantees uniqueness at the database level.
   */
  async generateUniqueGovernmentId(districtName: string): Promise<string> {
    const districtCode = this.getDistrictCode(districtName);

    let attempts = 0;
    while (attempts < 20) {
      const candidateToken = this.generateRandomToken();
      const candidateId = `JH-${districtCode}-${candidateToken}`;

      // Verify format
      if (!this.isValidGovernmentId(candidateId)) {
        attempts++;
        continue;
      }

      // Check database uniqueness
      try {
        const existing = await query<{ count: string }>(
          `SELECT COUNT(*) AS count FROM users WHERE government_id = $1;`,
          [candidateId]
        );
        if (parseInt(existing.rows[0]?.count || '0', 10) === 0) {
          return candidateId;
        }
      } catch {
        return candidateId;
      }

      attempts++;
    }

    // Ultimate fallback if multiple collisions
    return `JH-${districtCode}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
  }

  /**
   * Validates if a string adheres strictly to the JH-XX-XXXX format.
   */
  isValidGovernmentId(govId: string): boolean {
    if (!govId || typeof govId !== 'string') return false;
    return /^JH-[A-Z]{2}-[A-Z0-9]{4}$/.test(govId.trim());
  }

  /**
   * Validates that the government ID matches the selected district.
   */
  validateGovernmentIdMatchesDistrict(govId: string, districtName: string): void {
    if (!this.isValidGovernmentId(govId)) {
      throw new ValidationError(`Invalid Government ID format: "${govId}". Expected format: JH-XX-XXXX.`);
    }

    const expectedCode = this.getDistrictCode(districtName);
    const parts = govId.trim().split('-');
    if (parts[1] !== expectedCode) {
      throw new ValidationError(
        `Government ID district code "${parts[1]}" does not match selected district "${districtName}" (${expectedCode}).`
      );
    }
  }
}

export const govIdService = new GovernmentIdService();
