import { bomGuard, BoMItem } from '../src/services/bomGuard.service';
import { BomConstraintError } from '../src/utils/errors';

describe('Deterministic BoM Guard Tests (Rule 29 & Rule 30)', () => {
  it('should reject flow meters and canal sensors when domain is Education', () => {
    const educationBom: BoMItem[] = [
      { item: 'Interactive Smart Touchscreen (65")', quantity: 2, justification: 'Classroom teaching' },
      { item: 'Ultrasonic Clamp-on Flow Meter', quantity: 1, justification: 'Water pipe monitoring' },
      { item: 'Canal Sensor Telemetry Probe', quantity: 3, justification: 'Water level logging' },
    ];

    const result = bomGuard.validateBom('Education & Literacy', educationBom);

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBe(2);
    expect(result.sanitizedBom.length).toBe(1);
    expect(result.sanitizedBom[0].item).toContain('Interactive Smart Touchscreen');
  });

  it('should permit flow meters and hydrology sensors when domain is Water Quality & Hydrology', () => {
    const waterBom: BoMItem[] = [
      { item: 'Ultrasonic Clamp-on Flow Meter (DN100)', quantity: 4, justification: 'Conduit velocity measurement' },
      { item: 'Piezoresistive Pressure Transducer', quantity: 2, justification: 'Leak detection' },
    ];

    const result = bomGuard.validateBom('Water Quality & Hydrology', waterBom);

    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.sanitizedBom.length).toBe(2);
    expect(result.complianceScore).toBe(100);
  });

  it('should throw BomConstraintError on enforceBomCompliance when violation occurs', () => {
    const invalidBom: BoMItem[] = [
      { item: 'Water Level Sensor Probe', quantity: 1, justification: 'Reservoir monitoring' },
    ];

    expect(() => {
      bomGuard.enforceBomCompliance('Education', invalidBom);
    }).toThrow(BomConstraintError);
  });
});
