import { calculateProjectFeasibility } from '../src/services/simulator.service';
import { SimulatorCalculateInput } from '../src/schemas/simulator.schema';

describe('Simulator Engine - Deterministic Mathematical & Financial Unit Tests', () => {
  test('should calculate accurate costs for a standard mining surveillance project', () => {
    const input: SimulatorCalculateInput = {
      budgetINR: 2500000,
      timelineMonths: 6,
      hardwareList: [
        {
          name: 'Thermal Subsurface Probe',
          quantity: 20,
          unitCostINR: 25000,
          maintenanceAnnualRate: 0.1, // 10% annual
        },
        {
          name: 'LoRaWAN Gateway Node',
          quantity: 5,
          unitCostINR: 30000,
          maintenanceAnnualRate: 0.05, // 5% annual
        },
      ],
      personnelList: [
        {
          role: 'Lead Mining Geologist',
          headcount: 1,
          monthlyRateINR: 60000,
        },
        {
          role: 'Embedded IoT Technician',
          headcount: 2,
          monthlyRateINR: 35000,
        },
      ],
      fieldSitesCount: 2,
      terrainComplexityFactor: 1.3, // Mining zone complexity
      contingencyRate: 0.1, // 10%
    };

    const result = calculateProjectFeasibility(input);

    expect(result.success).toBe(true);

    // Hardware Base Cost: (20 * 25000) + (5 * 30000) = 500000 + 150000 = 650000
    expect(result.costBreakdown.hardwareBaseCostINR).toBe(650000);

    // Hardware Maintenance:
    // Probe: 500000 * 0.10 * (6 / 12) = 25000
    // Gateway: 150000 * 0.05 * (6 / 12) = 3750
    // Total Maintenance: 28750
    expect(result.costBreakdown.hardwareMaintenanceCostINR).toBe(28750);
    expect(result.costBreakdown.totalHardwareCostINR).toBe(678750);

    // Personnel Cost:
    // Lead: 1 * 60000 * 6 = 360000
    // Tech: 2 * 35000 * 6 = 420000
    // Total Personnel: 780000
    expect(result.costBreakdown.totalPersonnelCostINR).toBe(780000);

    // Field Logistics:
    // 2 sites * 6 months * 18000 * 1.3 = 280800
    expect(result.costBreakdown.fieldLogisticsCostINR).toBe(280800);

    // Subtotal: 678750 + 780000 + 280800 = 1739550
    // Contingency: 1739550 * 0.10 = 173955
    // Total: 1739550 + 173955 = 1913505
    expect(result.costBreakdown.totalEstimatedProjectCostINR).toBe(1913505);

    // Budget Variance: 2500000 - 1913505 = 586495 (Surplus)
    expect(result.costBreakdown.budgetVarianceINR).toBe(586495);

    // Budget Utilization: (1913505 / 2500000) * 100 = 76.54%
    expect(result.costBreakdown.budgetUtilizationPercent).toBeCloseTo(76.54, 1);

    // Feasibility Score should be high (> 80)
    expect(result.feasibilityScore).toBeGreaterThanOrEqual(80);
    expect(result.feasibilityStatus).toBe('HIGHLY_FEASIBLE');
  });

  test('should detect Critical Budget Deficit when costs significantly exceed allocation', () => {
    const input: SimulatorCalculateInput = {
      budgetINR: 500000, // Deficit budget
      timelineMonths: 12,
      hardwareList: [
        {
          name: 'Electrocoagulation Reactor 1000 LPH',
          quantity: 4,
          unitCostINR: 150000,
          maintenanceAnnualRate: 0.1,
        },
      ],
      personnelList: [
        {
          role: 'Chemical Process Specialist',
          headcount: 2,
          monthlyRateINR: 50000,
        },
      ],
      fieldSitesCount: 3,
      terrainComplexityFactor: 1.5,
      contingencyRate: 0.1,
    };

    const result = calculateProjectFeasibility(input);

    expect(result.costBreakdown.budgetVarianceINR).toBeLessThan(0);
    expect(result.costBreakdown.budgetUtilizationPercent).toBeGreaterThan(150);
    expect(result.feasibilityStatus).toBe('CRITICAL_BUDGET_DEFICIT');
    expect(result.feasibilityScore).toBeLessThan(50);
  });

  test('should detect Timeline Compression Risk when timeline is unrealistically short', () => {
    const input: SimulatorCalculateInput = {
      budgetINR: 10000000, // High budget
      timelineMonths: 1, // Only 1 month for 10 field sites and 50 hardware items
      hardwareList: [
        {
          name: 'Water Quality Telemetry Station',
          quantity: 50,
          unitCostINR: 20000,
          maintenanceAnnualRate: 0.05,
        },
      ],
      personnelList: [
        {
          role: 'Field Engineer',
          headcount: 5,
          monthlyRateINR: 40000,
        },
      ],
      fieldSitesCount: 10,
      terrainComplexityFactor: 1.2,
      contingencyRate: 0.1,
    };

    const result = calculateProjectFeasibility(input);

    expect(result.feasibilityStatus).toBe('TIMELINE_COMPRESSION_RISK');
    expect(result.metrics.recommendedMinimumTimelineMonths).toBeGreaterThanOrEqual(5);
  });

  test('should be 100% deterministic: identical calls yield identical results', () => {
    const input: SimulatorCalculateInput = {
      budgetINR: 1200000,
      timelineMonths: 4,
      hardwareList: [
        { name: 'Sensor Pod', quantity: 10, unitCostINR: 15000, maintenanceAnnualRate: 0.08 },
      ],
      personnelList: [
        { role: 'Field Lead', headcount: 1, monthlyRateINR: 45000 },
      ],
      fieldSitesCount: 2,
      terrainComplexityFactor: 1.2,
      contingencyRate: 0.1,
    };

    const runA = calculateProjectFeasibility(input);
    const runB = calculateProjectFeasibility(input);

    expect(runA).toEqual(runB);
  });
});
