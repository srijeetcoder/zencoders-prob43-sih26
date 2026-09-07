import {
  SimulatorCalculateInput,
  SimulatorCalculateResponse,
} from '../schemas/simulator.schema';

/**
 * Purely Mathematical, AI-Free Cost and Feasibility Simulator Engine
 * 
 * Guarantees:
 * 1. 100% Deterministic (same inputs always produce exact same output).
 * 2. Zero AI/LLM dependency (no OpenAI or external API calls).
 * 3. High numerical precision with comprehensive financial and terrain metrics.
 */
export function calculateProjectFeasibility(
  input: SimulatorCalculateInput
): SimulatorCalculateResponse {
  const {
    budgetINR,
    timelineMonths,
    hardwareList,
    personnelList,
    fieldSitesCount,
    terrainComplexityFactor,
    contingencyRate,
  } = input;

  // 1. Calculate Hardware Costs
  let hardwareBaseCostINR = 0;
  let hardwareMaintenanceCostINR = 0;
  let totalHardwareQuantity = 0;

  for (const item of hardwareList) {
    const itemBase = item.quantity * item.unitCostINR;
    hardwareBaseCostINR += itemBase;
    totalHardwareQuantity += item.quantity;

    // Annual maintenance prorated over the project timeline
    const itemMaintenance = itemBase * item.maintenanceAnnualRate * (timelineMonths / 12);
    hardwareMaintenanceCostINR += itemMaintenance;
  }

  const totalHardwareCostINR = hardwareBaseCostINR + hardwareMaintenanceCostINR;

  // 2. Calculate Personnel Costs
  let totalPersonnelCostINR = 0;
  let totalPersonnelHeadcount = 0;

  for (const person of personnelList) {
    const effectiveDuration = person.durationMonths
      ? Math.min(timelineMonths, person.durationMonths)
      : timelineMonths;
    const personCost = person.headcount * person.monthlyRateINR * effectiveDuration;
    totalPersonnelCostINR += personCost;
    totalPersonnelHeadcount += person.headcount;
  }

  // 3. Calculate Operational & Field Logistics Costs
  // Base field logistics = ₹18,000 per site/month multiplied by Jharkhand terrain complexity factor
  const BASE_LOGISTICS_PER_SITE_MONTH_INR = 18000;
  const fieldLogisticsCostINR =
    fieldSitesCount * timelineMonths * BASE_LOGISTICS_PER_SITE_MONTH_INR * terrainComplexityFactor;

  // 4. Subtotal & Contingency Buffer
  const directSubtotalINR = totalHardwareCostINR + totalPersonnelCostINR + fieldLogisticsCostINR;
  const contingencyBufferINR = directSubtotalINR * contingencyRate;
  const totalEstimatedProjectCostINR = Math.round(directSubtotalINR + contingencyBufferINR);

  // 5. Budget Variance & Utilization
  const budgetVarianceINR = Math.round(budgetINR - totalEstimatedProjectCostINR);
  const budgetUtilizationPercent =
    budgetINR > 0 ? Math.round((totalEstimatedProjectCostINR / budgetINR) * 10000) / 100 : 999;

  // 6. Feasibility Score Calculation (0 - 100)
  // Part A: Budget Viability (Max 45 points)
  let budgetScore = 45;
  if (budgetUtilizationPercent > 100) {
    // Deficit penalty: -2.5 points per 1% overrun
    const overrun = budgetUtilizationPercent - 100;
    budgetScore = Math.max(0, 45 - overrun * 2.5);
  } else if (budgetUtilizationPercent < 50) {
    // Under-utilization (excessive idle capital) penalty
    budgetScore = 38;
  } else {
    // Ideal utilization between 65% and 95%
    budgetScore = 45;
  }

  // Part B: Timeline Realism (Max 30 points)
  // Recommended min timeline based on field deployment scale
  const recommendedMinimumTimelineMonths = Math.max(
    2,
    Math.ceil(fieldSitesCount * 0.4 + totalHardwareQuantity * 0.05 + 1.5)
  );

  let timelineScore = 30;
  if (timelineMonths < recommendedMinimumTimelineMonths) {
    const compressionRatio = timelineMonths / recommendedMinimumTimelineMonths;
    timelineScore = Math.round(30 * compressionRatio * 0.7);
  }

  // Part C: Terrain & Operational Risk Resilience (Max 25 points)
  let terrainScore = 25;
  const terrainOverhead = terrainComplexityFactor - 1.0;
  terrainScore = Math.max(5, Math.round(25 - terrainOverhead * 15));

  const feasibilityScore = Math.min(
    100,
    Math.max(0, Math.round(budgetScore + timelineScore + terrainScore))
  );

  // 7. Feasibility Status Determination
  let feasibilityStatus: SimulatorCalculateResponse['feasibilityStatus'];
  if (budgetVarianceINR < 0 && budgetUtilizationPercent > 125) {
    feasibilityStatus = 'CRITICAL_BUDGET_DEFICIT';
  } else if (timelineMonths < recommendedMinimumTimelineMonths) {
    feasibilityStatus = 'TIMELINE_COMPRESSION_RISK';
  } else if (feasibilityScore >= 80) {
    feasibilityStatus = 'HIGHLY_FEASIBLE';
  } else if (feasibilityScore >= 60) {
    feasibilityStatus = 'FEASIBLE_WITH_MARGINAL_RISK';
  } else {
    feasibilityStatus = 'SEVERE_OVERRUN_RISK';
  }

  // 8. Derived Metrics
  const monthlyBurnRateINR =
    timelineMonths > 0 ? Math.round(totalEstimatedProjectCostINR / timelineMonths) : 0;
  const costPerFieldSiteINR =
    fieldSitesCount > 0 ? Math.round(totalEstimatedProjectCostINR / fieldSitesCount) : 0;
  const hardwareToPersonnelRatio =
    totalPersonnelCostINR > 0
      ? Math.round((totalHardwareCostINR / totalPersonnelCostINR) * 100) / 100
      : totalHardwareCostINR > 0
      ? 99
      : 0;

  // 9. Advisory Notes
  const advisoryNotes: string[] = [];
  if (budgetVarianceINR < 0) {
    advisoryNotes.push(
      `Budget Deficit of ₹${Math.abs(budgetVarianceINR).toLocaleString('en-IN')}: Requires allocation adjustment or phase-wise procurement.`
    );
  } else {
    advisoryNotes.push(
      `Healthy fiscal buffer of ₹${budgetVarianceINR.toLocaleString('en-IN')} remaining for unplanned field contingencies.`
    );
  }

  if (timelineMonths < recommendedMinimumTimelineMonths) {
    advisoryNotes.push(
      `Project timeline of ${timelineMonths} month(s) is tight for ${fieldSitesCount} field site(s). Recommended timeline is ${recommendedMinimumTimelineMonths} months.`
    );
  }

  if (terrainComplexityFactor >= 1.5) {
    advisoryNotes.push(
      `High terrain factor (${terrainComplexityFactor}) applied: Recommended to deploy redundant battery power and tamper-proof ground anchors.`
    );
  }

  return {
    success: true,
    costBreakdown: {
      hardwareBaseCostINR: Math.round(hardwareBaseCostINR),
      hardwareMaintenanceCostINR: Math.round(hardwareMaintenanceCostINR),
      totalHardwareCostINR: Math.round(totalHardwareCostINR),
      totalPersonnelCostINR: Math.round(totalPersonnelCostINR),
      fieldLogisticsCostINR: Math.round(fieldLogisticsCostINR),
      contingencyBufferINR: Math.round(contingencyBufferINR),
      totalEstimatedProjectCostINR,
      budgetVarianceINR,
      budgetUtilizationPercent,
    },
    feasibilityScore,
    feasibilityStatus,
    metrics: {
      monthlyBurnRateINR,
      costPerFieldSiteINR,
      hardwareToPersonnelRatio,
      recommendedMinimumBudgetINR: Math.round(totalEstimatedProjectCostINR * 1.05),
      recommendedMinimumTimelineMonths,
    },
    mathematicalFormulasUsed: {
      hardwareCostFormula: 'Base_HW_Cost + (Base_HW_Cost * Annual_Maint_Rate * (Timeline_Months / 12))',
      personnelCostFormula: 'SUM(Headcount_i * Monthly_Rate_i * Duration_i)',
      fieldLogisticsFormula: 'Sites * Timeline_Months * 18000_INR * Terrain_Complexity_Factor',
      contingencyFormula: '(HW_Cost + Personnel_Cost + Field_Logistics) * Contingency_Rate',
      feasibilityScoreFormula: 'Budget_Score(45) + Timeline_Realism_Score(30) + Terrain_Resilience_Score(25)',
    },
    advisoryNotes,
  };
}
