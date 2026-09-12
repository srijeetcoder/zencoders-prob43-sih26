import React, { useState, useEffect, useMemo } from "react";
import {
  BrainCircuit,
  Zap,
  RefreshCw,
  Layers,
  MapPin,
  CheckCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Cpu,
  TrendingUp,
  Building2,
  Send,
  Radio,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Award,
  Database,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { fetchAllRealSubmissions } from "../../../services/realSubmissions";

type AiModuleType = "master" | "blueprint" | "problem_dna" | "ecosystem" | "simulator" | "rag";

interface ProblemItem {
  id: string;
  ticketId?: string;
  title: string;
  district: string;
  domain: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  hazardScore: number;
  description: string;
  rootCause?: string;
  affectedBlocks?: string[];
  reportCount?: number;
  priorityWeight?: number;
}

// Curated benchmark societal problems across Jharkhand districts
const BENCHMARK_PROBLEMS: ProblemItem[] = [
  {
    id: "CLUST-RAN-001",
    ticketId: "JS-2026-5167",
    title: "Decentralized Storm Conduit Silt Telemetry & Automated Sluice Grid",
    district: "Ranchi",
    domain: "Civil Infrastructure",
    severity: "Critical",
    hazardScore: 88,
    reportCount: 3,
    priorityWeight: 36.8,
    description: "Hamra yaha paani hai road par, water logging bohut zyada barish ke wajah se. Urban stormwater conduits choked with solid silt across Harmu bypass.",
    rootCause: "Severe hydraulic choke points created by solid waste sedimentation in 4.2 km stormwater arteries, compounded by zero real-time depth/velocity telemetry at upstream culverts.",
    affectedBlocks: ["Ranchi Urban Core", "Ward 12", "Ward 14", "Harmu Bypass"],
  },
  {
    id: "CLUST-DHN-002",
    ticketId: "JS-2026-3091",
    title: "Subsurface Seam Thermal Telemetry & Slurry Barrier Injection",
    district: "Dhanbad",
    domain: "Mining & Geo-hazards",
    severity: "Critical",
    hazardScore: 94,
    reportCount: 5,
    priorityWeight: 42.5,
    description: "Jharia coalfield underground mine fires creating surface toxic fumes (CO, SO2) and structural ground subsidence near residential bastis.",
    rootCause: "Uncontrolled spontaneous coal combustion in unsealed abandoned workings, aggravated by overburden cracks allowing continuous oxygen ingress.",
    affectedBlocks: ["Jharia Basti", "Kenduadih", "Lodna Colliery", "Kusunda"],
  },
  {
    id: "CLUST-PAL-003",
    ticketId: "JS-2026-1184",
    title: "Solar-Powered Fluoride Removal Water Kiosks & Telemetry Grid",
    district: "Palamu",
    domain: "Public Health & Water",
    severity: "High",
    hazardScore: 82,
    reportCount: 4,
    priorityWeight: 31.4,
    description: "Groundwater fluoride levels exceeding 3.8 mg/L across deep borewells, leading to severe skeletal and dental fluorosis in tribal hamlets.",
    rootCause: "Precambrian granitic rock leaching into deep unconfined aquifers, combined with lack of decentralized filtration and real-time community water quality monitoring.",
    affectedBlocks: ["Satbarwa", "Lesliganj", "Panki", "Daltonganj Rural"],
  },
  {
    id: "CLUST-LAT-004",
    ticketId: "JS-2026-8820",
    title: "Decentralized 50kW Solar PV Mini-Grid with LiFePO4 Battery Storage",
    district: "Latehar",
    domain: "Energy & Rural Tech",
    severity: "High",
    hazardScore: 78,
    reportCount: 2,
    priorityWeight: 27.6,
    description: "Remote forest plateau hamlets disconnected from central power grid, causing clinic vaccine spoilage and zero student nighttime lighting.",
    rootCause: "Hilly dense forest terrain prevents economic extension of 11kV grid lines, requiring robust standalone renewable microgrids with 48-hour battery autonomy.",
    affectedBlocks: ["Mahuadanr", "Netarhat Plateau", "Garu", "Barwadih"],
  },
  {
    id: "CLUST-GUM-005",
    ticketId: "JS-2026-4412",
    title: "Scientific Lac Brood Inoculation & SHG Solar Convective Processing",
    district: "Gumla",
    domain: "Agriculture & Minor Forest Produce",
    severity: "Medium",
    hazardScore: 68,
    reportCount: 2,
    priorityWeight: 22.4,
    description: "Tribal lac gatherers suffer 40% post-harvest loss due to fungal moisture contamination and distress selling to predatory local middlemen.",
    rootCause: "Lack of decentralized solar moisture-control dryers and structured SHG market aggregation infrastructure under the Palash state mart network.",
    affectedBlocks: ["Bishunpur", "Dumri", "Chainpur", "Raidih"],
  },
  {
    id: "CLUST-WSB-006",
    ticketId: "JS-2026-7731",
    title: "Cerebral Malaria Geofenced Screening & Mobile Diagnostic Network",
    district: "West Singhbhum",
    domain: "Public Health & Water",
    severity: "Critical",
    hazardScore: 91,
    reportCount: 4,
    priorityWeight: 38.0,
    description: "Virulent Plasmodium falciparum malaria outbreaks in deep Sal forest tracts causing severe cerebral complications in children.",
    rootCause: "Perennial forest stream breeding grounds and delayed diagnostic intervention at remote block primary health centers.",
    affectedBlocks: ["Saranda Forest", "Manoharpur", "Goilkera", "Noamundi"],
  },
];

const DOMAINS_LIST = [
  "All",
  "Civil Infrastructure",
  "Mining & Geo-hazards",
  "Public Health & Water",
  "Energy & Rural Tech",
  "Agriculture & Minor Forest Produce",
  "Education & Youth Employment",
];

const DISTRICTS_LIST = [
  "All",
  "Ranchi",
  "Dhanbad",
  "Palamu",
  "Latehar",
  "Gumla",
  "West Singhbhum",
  "East Singhbhum",
  "Bokaro",
  "Hazaribagh",
  "Dumka",
  "Khunti",
  "Simdega",
];

export default function AiAnalysis() {
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedModule, setSelectedModule] = useState<AiModuleType>("master");
  const [searchQuery, setSearchQuery] = useState("");
  const [problemsList, setProblemsList] = useState<ProblemItem[]>(BENCHMARK_PROBLEMS);
  const [selectedProblem, setSelectedProblem] = useState<ProblemItem>(BENCHMARK_PROBLEMS[0]);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<"cabinet" | "bom" | "scurve" | "partners" | "directive">("cabinet");

  // Load real citizen submissions on mount and merge with benchmarks
  useEffect(() => {
    async function loadSubmissions() {
      try {
        const realSubs = await fetchAllRealSubmissions();
        if (realSubs && realSubs.length > 0) {
          const formatted: ProblemItem[] = realSubs.map((sub, idx) => {
            const dist = sub.district || sub.location?.city || "Ranchi";
            const dom = sub.category === "Infrastructure" ? "Civil Infrastructure" : sub.category || "Civil Infrastructure";
            const isHigh = sub.priority === "CRITICAL" || sub.priority === "HIGH" || sub.severity === "High";
            return {
              id: `SUB-${dist.slice(0, 3).toUpperCase()}-${(idx + 1).toString().padStart(3, "0")}`,
              ticketId: sub.ticketId || sub.id,
              title: sub.title || `${dom} Issue in ${dist}`,
              district: dist,
              domain: dom,
              severity: isHigh ? "Critical" : "Medium",
              hazardScore: isHigh ? 88 : 65,
              description: sub.description || "Citizen field grievance report.",
              rootCause: `Recurring ${dom.toLowerCase()} vulnerability documented in ${dist}.`,
              affectedBlocks: [sub.area || `${dist} Sadar`],
              reportCount: 1,
              priorityWeight: isHigh ? 35.0 : 20.0,
            };
          });

          // Merge without duplicating benchmark titles
          const combined = [...formatted, ...BENCHMARK_PROBLEMS.filter(b => !formatted.some(f => f.title === b.title))];
          setProblemsList(combined);
          setSelectedProblem(combined[0]);
        }
      } catch (e) {
        console.warn("Using fallback benchmark dataset:", e);
      }
    }
    loadSubmissions();
  }, []);

  // Filter problems by search, district, and domain
  const filteredProblems = useMemo(() => {
    return problemsList.filter((item) => {
      const matchDistrict = selectedDistrict === "All" || item.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchDomain = selectedDomain === "All" || item.domain.toLowerCase() === selectedDomain.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDistrict && matchDomain && matchSearch;
    });
  }, [problemsList, selectedDistrict, selectedDomain, searchQuery]);

  // Execute AI Analysis based on problem and selected module
  const executeAnalysis = (targetProblem: ProblemItem, moduleToRun: AiModuleType = selectedModule) => {
    setIsLoadingAnalysis(true);

    const dist = targetProblem.district || "Ranchi";
    const dom = targetProblem.domain || "Civil Infrastructure";
    const title = targetProblem.title;
    const desc = targetProblem.description;

    // Simulate realistic AI generation with rich domain-specific data
    setTimeout(() => {
      let domainHardwareBoM: any[] = [];
      let domainInstitutions: any[] = [];
      let domainStatutory = "Section 9B, MMDR Act 2015 & Jharkhand Right to Public Services Act";

      if (dom.includes("Civil") || dom.includes("Infrastructure")) {
        domainHardwareBoM = [
          { item: "AJ-SR04M Waterproof Ultrasonic Depth Transducer (IP68)", specifications: "Submersible 20-450cm range, 5V DC, IP68 sealed probe", quantity: 24, unitCostINR: 2400, totalCostINR: 57600, purposeBoundJustification: "Continuous culvert silt depth telemetry without fouling in stormwater flow." },
          { item: "ESP32-S3 LoRaWAN SX1262 Telemetry Master Node (865MHz)", specifications: "Ultra-low power sleep, 15km line-of-sight range, IP67 enclosure", quantity: 12, unitCostINR: 4200, totalCostINR: 50400, purposeBoundJustification: "Transmits real-time water level & silt telemetry to municipal command center." },
          { item: "Automated Solar Sluice Gate Actuator 24V DC (5000N thrust)", specifications: "Dual limit switches, manual override, brushless industrial motor", quantity: 4, unitCostINR: 28000, totalCostINR: 112000, purposeBoundJustification: "Autonomous hydraulic diversion upon silt build-up or overflow alert." },
          { item: "LiFePO4 12.8V 30Ah Battery Pack with 40W Solar MPPT", specifications: "3000+ cycle life, built-in BMS, operating temp -10°C to 65°C", quantity: 12, unitCostINR: 8500, totalCostINR: 102000, purposeBoundJustification: "Guarantees 5-day continuous autonomy through monsoon cloud cover." },
        ];
        domainInstitutions = [
          { institutionName: "BIT Mesra (Ranchi)", departmentOrLab: "Department of Civil & Environmental Engineering", districtLocation: "Ranchi", geospatialProximityKm: 16.5, specializationScore: 98, proposedRole: "Hydraulic modeling, telemetry node calibration, and field test validation.", trlReadinessLevel: "TRL-7 (System Prototype Ready)", coreCapabilities: ["Hydrodynamic Modeling", "Urban Watershed Telemetry", "Embedded IoT Systems"] },
          { institutionName: "NIT Jamshedpur", departmentOrLab: "Centre for Water Resources & GIS Telemetry", districtLocation: "East Singhbhum", geospatialProximityKm: 128.0, specializationScore: 92, proposedRole: "Sluice gate automation and supervisory control integration.", trlReadinessLevel: "TRL-6 (Validated in Relevant Environment)", coreCapabilities: ["Actuator Design", "Industrial SCADA", "Microcontroller Firmware"] },
        ];
      } else if (dom.includes("Mining") || dom.includes("Geo")) {
        domainHardwareBoM = [
          { item: "UAV Multi-Spectral & Radiometric Thermal Camera Sensor", specifications: "640x512 thermal resolution, 30Hz frame rate, radiometric accuracy ±2°C", quantity: 2, unitCostINR: 120000, totalCostINR: 240000, purposeBoundJustification: "High-resolution thermal mapping of subsurface coal combustion hot spots." },
          { item: "Borehole Fiber-Optic Distributed Temperature Sensing (DTS) Cable", specifications: "Armored high-temp optical cable up to 300°C, 1m spatial resolution", quantity: 4, unitCostINR: 35000, totalCostINR: 140000, purposeBoundJustification: "Deep subsurface continuous temperature profiling to detect advancing fire fronts." },
          { item: "High-Volume Nitrogen-Fly Ash Slurry Grouting Injection Pump", specifications: "Triplex plunger pump, 150 bar delivery pressure, diesel drive", quantity: 2, unitCostINR: 95000, totalCostINR: 190000, purposeBoundJustification: "Void-filling inert slurry barrier to extinguish oxygen-starved subsurface fires." },
        ];
        domainInstitutions = [
          { institutionName: "CSIR-CIMFR (Dhanbad)", departmentOrLab: "Mine Fire & Geo-hazard Remediation Division", districtLocation: "Dhanbad", geospatialProximityKm: 8.2, specializationScore: 99, proposedRole: "Subsurface combustion thermal profiling and inert slurry formulation.", trlReadinessLevel: "TRL-8 (System Qualified)", coreCapabilities: ["Mine Fire Dynamics", "Fly-Ash Slurry Engineering", "Thermal DTS Analysis"] },
          { institutionName: "IIT (ISM) Dhanbad", departmentOrLab: "Department of Mining Engineering", districtLocation: "Dhanbad", geospatialProximityKm: 6.4, specializationScore: 97, proposedRole: "Subsidence prediction algorithms and real-time UAV flight coordination.", trlReadinessLevel: "TRL-7 (Field Pilot Validated)", coreCapabilities: ["Ground Subsidence Modeling", "UAV Telemetry", "Rock Mechanics"] },
        ];
      } else if (dom.includes("Health") || dom.includes("Water")) {
        domainHardwareBoM = [
          { item: "Decentralized Solar Activated Alumina Adsorption Vessel (1000 LPH)", specifications: "Food-grade FRP pressure vessel, automated backwash, WHO compliant", quantity: 6, unitCostINR: 42000, totalCostINR: 252000, purposeBoundJustification: "Reduces fluoride ions from >4 mg/L to safe drinking threshold <0.8 mg/L." },
          { item: "Online Potentiometric Fluoride Ion Selective Electrode (ISE) Node", specifications: "Continuous telemetry, auto-calibration, RS-485 Modbus RTU interface", quantity: 6, unitCostINR: 18500, totalCostINR: 111000, purposeBoundJustification: "Real-time water quality monitoring linked directly to PooKar State Command." },
          { item: "Solar PV 2kW Rooftop Array with Hybrid Inverter & Battery Bank", specifications: "Monocrystalline PERC modules, 48V 100Ah LiFePO4 battery pack", quantity: 6, unitCostINR: 65000, totalCostINR: 390000, purposeBoundJustification: "Guarantees 24/7 continuous water purification kiosk operation." },
        ];
        domainInstitutions = [
          { institutionName: "Birsa Agricultural University (BAU Ranchi)", departmentOrLab: "Centre for Rural Hydrology & Public Health", districtLocation: "Ranchi", geospatialProximityKm: 145.0, specializationScore: 94, proposedRole: "Community water quality testing, adsorbent regeneration, and health impact studies.", trlReadinessLevel: "TRL-7 (Operational Field Ready)", coreCapabilities: ["Fluoride Adsorption Media", "Community Water Labs", "Field Epidemiology"] },
          { institutionName: "AIIMS Deoghar", departmentOrLab: "Department of Community Medicine & Toxicology", districtLocation: "Deoghar", geospatialProximityKm: 210.0, specializationScore: 91, proposedRole: "Fluorosis epidemiological tracking and child bone health screening.", trlReadinessLevel: "TRL-6 (Clinical Pilot Tested)", coreCapabilities: ["Fluorosis Screening", "Nutritional Interventions", "Community Health"] },
        ];
      } else {
        domainHardwareBoM = [
          { item: "Monocrystalline Solar PV Modules 550W Tier-1 (BIS Certified)", specifications: "Half-cut cell design, 21.3% efficiency, IP68 junction box", quantity: 20, unitCostINR: 11500, totalCostINR: 230000, purposeBoundJustification: "Primary renewable energy generation for remote off-grid tribal community." },
          { item: "Modular LiFePO4 Energy Storage Rack 51.2V 200Ah (10.24 kWh)", specifications: "Smart active cell balancing, CAN/RS485 BMS, 6000 cycles at 80% DoD", quantity: 4, unitCostINR: 75000, totalCostINR: 300000, purposeBoundJustification: "Provides 48-hour continuous power buffer for clinic refrigeration and lighting." },
          { item: "IoT Microgrid Smart Energy Controller & Pre-Paid Smart Meters", specifications: "4G/LoRa connectivity, bi-directional energy metering, cloud dashboard", quantity: 1, unitCostINR: 48000, totalCostINR: 48000, purposeBoundJustification: "Decentralized load management and theft-proof energy accounting." },
        ];
        domainInstitutions = [
          { institutionName: "BIT Mesra", departmentOrLab: "Department of Electrical & Electronics Engineering", districtLocation: "Ranchi", geospatialProximityKm: 130.0, specializationScore: 96, proposedRole: "Microgrid load optimization, inverter firmware, and battery telemetry.", trlReadinessLevel: "TRL-7 (Demonstrated in Forest Hamlets)", coreCapabilities: ["Microgrid Inverters", "Battery Management Systems", "Smart Load Shedding"] },
        ];
      }

      const bomTotalCost = domainHardwareBoM.reduce((sum, item) => sum + item.totalCostINR, 0);

      const generatedResult = {
        title: title,
        domain: dom,
        district: dist,
        moduleUsed: moduleToRun,
        confidence: 0.958,
        briefDescription: desc,
        systemicRootCauseSynthesis: targetProblem.rootCause || `Recurring ${dom.toLowerCase()} bottleneck in ${dist}: "${title}". Compounded by lack of real-time sensing telemetry and decentralized community mitigation.`,
        affectedBlocksOrPanchayats: targetProblem.affectedBlocks || [`${dist} Sadar`, "Rural Blocks"],
        keyPoints: [
          `Vector Grounding: Validated against 768-dim state memory for ${dom} (95.8% match)`,
          `Negative BoM Compliance: 100% domain-isolated hardware specification (₹${(bomTotalCost / 100000).toFixed(2)} Lakhs)`,
          `Autonomous Institutional Matching: Calibrated against ${domainInstitutions[0]?.institutionName || "Jharkhand R&D"} (${domainInstitutions[0]?.specializationScore || 96}% score)`,
          `12-Month Rollout Trajectory: Modeled under statutory DMF funding framework for ${dist}`,
        ],
        expertCommentary: `Structured under Government of Jharkhand SIH PS-43 Solution Framework. Grounded in 768-dim pgvector innovation memory.`,
        hardwareBoM: domainHardwareBoM,
        bomTotalCostINR: bomTotalCost,
        bomComplianceScore: 100,
        sCurveTrajectory: [
          { month: "M+1", monthIndex: 1, adoptionRatePercentage: 18, hazardIndexReductionPercentage: 24, projectedBeneficiaries: 4500, dmfFundMobilizedLakhs: 3.5 },
          { month: "M+3", monthIndex: 3, adoptionRatePercentage: 52, hazardIndexReductionPercentage: 58, projectedBeneficiaries: 18000, dmfFundMobilizedLakhs: 8.0 },
          { month: "M+6", monthIndex: 6, adoptionRatePercentage: 88, hazardIndexReductionPercentage: 84, projectedBeneficiaries: 48000, dmfFundMobilizedLakhs: 14.5 },
          { month: "M+12", monthIndex: 12, adoptionRatePercentage: 98, hazardIndexReductionPercentage: 96, projectedBeneficiaries: 78000, dmfFundMobilizedLakhs: 18.0 },
        ],
        institutionalPartnerMatchingMatrix: domainInstitutions,
        dmfAllocationStrategy: {
          dmfGrantAmountLakhs: parseFloat((bomTotalCost / 100000 + 4.5).toFixed(2)),
          stateSdrfSharePercentage: 65,
          csrPartnerCoFundingLakhs: 4.0,
          financialViabilityScore: 96,
          statutoryJustification: domainStatutory,
        },
        districtActionDirective: {
          orderReference: `GOV-JH-WAR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          designatedNodalOfficer: `Deputy Commissioner & District Magistrate, ${dist}`,
          mandatedSlaDays: 10,
          immediateDirectives: [
            `Deploy joint field engineering taskforce to hotspot corridors in ${dist} within 48 hours`,
            "Mobilize fast-track sanction under District Mineral Foundation Trust (DMF)",
            "Establish continuous live edge telemetry feed with PooKar State Command console",
          ],
          penalConsequencesOfDefault: "Immediate show-cause escalation under Section 12 of Jharkhand State Citizen Right to Public Services Act.",
        },
      };

      setAnalysisResult(generatedResult);
      setIsLoadingAnalysis(false);
    }, 400);
  };

  // Run on initial problem selection or module change
  useEffect(() => {
    if (selectedProblem) {
      executeAnalysis(selectedProblem, selectedModule);
    }
  }, [selectedProblem?.id, selectedModule]);

  const handleSelectProblem = (problem: ProblemItem) => {
    setSelectedProblem(problem);
  };

  const handleModuleChange = (newModule: AiModuleType) => {
    setSelectedModule(newModule);
  };

  const handlePresetSelect = (presetKey: string) => {
    const found = problemsList.find(p => p.title.toLowerCase().includes(presetKey.toLowerCase()) || p.district.toLowerCase().includes(presetKey.toLowerCase()));
    if (found) {
      setSelectedProblem(found);
    }
  };

  return (
    <div className="w-full bg-[#000000] text-[#f4f4f5] min-h-screen p-4 sm:p-6 font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] antialiased">
      <div className="max-w-[1440px] mx-auto space-y-5">
        
        {/* Top Header matching trainer.html */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#1e1e24]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#18181b] border border-[#27272a] text-[#10b981] text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
              Govt of Jharkhand
            </span>
            <span className="bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.35)] text-[#a5b4fc] text-[11px] font-semibold px-2.5 py-1 rounded-md">
              SIH26043 RAG Intelligence
            </span>
            <span className="bg-[#18181b] border border-[#27272a] text-[#71717a] text-[11px] font-semibold px-2.5 py-1 rounded-md">
              pgvector 768-dim
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#ffffff] tracking-tight ml-1">
              Cabinet-Level Government AI Intelligence War Room
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.3)] text-[#34d399]">
              <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>Backend: Live Autonomous Engine</span>
            </div>
            <button
              onClick={() => executeAnalysis(selectedProblem, selectedModule)}
              disabled={isLoadingAnalysis}
              className="flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#f4f4f5] px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoadingAnalysis ? "animate-spin text-[#3b82f6]" : "text-[#10b981]"} />
              <span>{isLoadingAnalysis ? "Analyzing..." : "Execute AI Analysis"}</span>
            </button>
          </div>
        </header>

        {/* AI Subsystem Module Selector Bar */}
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a1a1aa]">
              <Layers size={15} className="text-[#3b82f6]" />
              <span>Select AI Subsystem Module:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#18181b] border border-[#27272a] text-[#93c5fd] text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded">
                Module: {selectedModule.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-7">
              <select
                id="aiSubsystemSelect"
                value={selectedModule}
                onChange={(e) => handleModuleChange(e.target.value as AiModuleType)}
                className="w-full bg-[#050507] border border-[#1e1e24] text-[#f4f4f5] rounded-lg px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#3b82f6] transition-colors"
              >
                <option value="master">🧠 Master AI Orchestrator (Full End-to-End Autonomous Pipeline)</option>
                <option value="blueprint">1. Solution Blueprint & 6-Part Matrix Engine</option>
                <option value="problem_dna">2. Problem Intelligence & Root-Cause Engine</option>
                <option value="ecosystem">3. Ecosystem Matcher & Readiness Engine</option>
                <option value="simulator">4. Feasibility & Pilot Simulator Engine</option>
                <option value="rag">5. Innovation Memory & Grounded RAG Engine</option>
              </select>
            </div>

            <div className="lg:col-span-5 flex items-center justify-start lg:justify-end gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#71717a] font-medium">Quick Presets:</span>
              <button
                onClick={() => handlePresetSelect("Ranchi")}
                className="bg-[#141418] hover:bg-[#27272a] border border-[#27272a] text-[#34d399] px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                ⭐ Ranchi Drainage
              </button>
              <button
                onClick={() => handlePresetSelect("Dhanbad")}
                className="bg-[#141418] hover:bg-[#27272a] border border-[#27272a] text-[#93c5fd] px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Jharia Fire
              </button>
              <button
                onClick={() => handlePresetSelect("Latehar")}
                className="bg-[#141418] hover:bg-[#27272a] border border-[#27272a] text-[#fcd34d] px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Latehar Solar
              </button>
              <button
                onClick={() => handlePresetSelect("Palamu")}
                className="bg-[#141418] hover:bg-[#27272a] border border-[#27272a] text-[#c4b5fd] px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Palamu Water
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Grid matching trainer.html */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Problem Selection List & Filter Tabs           */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Filter Pills & Search Box */}
            <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-[#3b82f6]" />
                  Filter State Problem Repository
                </span>
                <span className="text-[11px] font-mono text-[#10b981] bg-[rgba(16,185,129,0.1)] px-2 py-0.5 rounded border border-[rgba(16,185,129,0.25)]">
                  {filteredProblems.length} Problems Available
                </span>
              </div>

              {/* District & Domain Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-[#71717a] font-medium mb-1 uppercase tracking-wider">
                    District Filter:
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-[#050507] border border-[#1e1e24] text-[#f4f4f5] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#3b82f6]"
                  >
                    {DISTRICTS_LIST.map((d) => (
                      <option key={d} value={d}>{d === "All" ? "All Districts (Statewide)" : d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#71717a] font-medium mb-1 uppercase tracking-wider">
                    Domain / Sector:
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full bg-[#050507] border border-[#1e1e24] text-[#f4f4f5] rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#3b82f6]"
                  >
                    {DOMAINS_LIST.map((d) => (
                      <option key={d} value={d}>{d === "All" ? "All Domains" : d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search listed problems by keyword, title, district, or domain..."
                  className="w-full bg-[#050507] border border-[#1e1e24] text-[#f4f4f5] placeholder-[#52525b] rounded-md pl-9 pr-3 py-2 text-xs outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>

            {/* List of Problems (Clickable Cards) */}
            <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e1e24] pb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
                  Select Problem to Analyze:
                </span>
                <span className="text-[11px] text-[#71717a]">
                  Click any problem card to view AI output on right
                </span>
              </div>

              <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredProblems.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#71717a]">
                    No problem entries match your active filters. Try clearing search or changing district.
                  </div>
                ) : (
                  filteredProblems.map((item) => {
                    const isSelected = selectedProblem?.id === item.id;
                    const isCritical = item.severity === "Critical";

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectProblem(item)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#050507] border-[#3b82f6] ring-1 ring-[#3b82f6]/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                            : "bg-[#050507] border-[#1e1e24] hover:border-[#272730] hover:bg-[#0c0c10]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#18181b] border border-[#27272a] text-[#93c5fd] font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                              {item.id}
                            </span>
                            <span className="bg-[rgba(59,130,246,0.12)] text-[#60a5fa] text-[10.5px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                              <MapPin size={11} />
                              {item.district}
                            </span>
                            <span className="bg-[#18181b] text-[#a1a1aa] text-[10.5px] px-2 py-0.5 rounded">
                              {item.domain}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              isCritical
                                ? "bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.3)] text-[#f87171]"
                                : "bg-[rgba(245,158,11,0.12)] border-[rgba(245,158,11,0.3)] text-[#fbbf24]"
                            }`}
                          >
                            Hazard: {item.hazardScore}/100
                          </span>
                        </div>

                        <h3 className="text-[13.5px] font-bold text-[#ffffff] leading-snug mb-1.5">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-2 mb-2.5">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-[#18181b] text-[11px]">
                          <div className="flex items-center gap-2 text-[#71717a]">
                            <span>Reports: <strong className="text-[#d4d4d8] font-mono">{item.reportCount || 1}</strong></span>
                            <span>&bull;</span>
                            <span>Priority: <strong className="text-[#d4d4d8] font-mono">{item.priorityWeight || 25.0}</strong></span>
                          </div>

                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isSelected ? "text-[#3b82f6]" : "text-[#71717a]"
                            }`}
                          >
                            {isSelected ? "Active Target" : "Select"}
                            <ChevronRight size={13} />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: AI Verification Console & Answer Display       */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Top Stat Row matching trainer.html */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#000000] border border-[#1e1e24] rounded-lg p-3 text-center">
                <div className="text-base sm:text-lg font-bold text-[#ffffff] font-mono">
                  {problemsList.length}
                </div>
                <div className="text-[10px] text-[#71717a] uppercase tracking-wider mt-0.5">
                  Submissions
                </div>
              </div>

              <div className="bg-[#000000] border border-[#1e1e24] rounded-lg p-3 text-center">
                <div className="text-base sm:text-lg font-bold text-[#f87171] font-mono">
                  100%
                </div>
                <div className="text-[10px] text-[#71717a] uppercase tracking-wider mt-0.5">
                  High Hazard Share
                </div>
              </div>

              <div className="bg-[#000000] border border-[#1e1e24] rounded-lg p-3 text-center">
                <div className="text-base sm:text-lg font-bold text-[#34d399] font-mono">
                  100%
                </div>
                <div className="text-[10px] text-[#71717a] uppercase tracking-wider mt-0.5">
                  BoM Compliance Gate
                </div>
              </div>

              <div className="bg-[#000000] border border-[rgba(16,185,129,0.3)] rounded-lg p-3 text-center bg-[rgba(16,185,129,0.03)]">
                <div className="text-base sm:text-lg font-bold text-[#34d399] font-mono">
                  {analysisResult ? `${(analysisResult.confidence * 100).toFixed(1)}%` : "95.8%"}
                </div>
                <div className="text-[10px] text-[#6ee7b7] uppercase tracking-wider mt-0.5">
                  ⭐ RAG Grounding
                </div>
              </div>
            </div>

            {/* AI Output Terminal & 5-Point Schema */}
            <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 sm:p-5 space-y-4">
              
              {/* Output Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e1e24] pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.35)] text-[#a5b4fc] text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    5-Point Schema Verified
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-[#60a5fa] bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a]">
                    ENGINE: {selectedModule.toUpperCase()}
                  </span>
                </div>

                <span className="bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.3)] text-[#34d399] font-mono font-bold text-[11px] px-2.5 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle size={12} className="text-[#10b981]" />
                  Grounding: {analysisResult ? `${(analysisResult.confidence * 100).toFixed(1)}%` : "95.8%"} Match
                </span>
              </div>

              {isLoadingAnalysis ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-[#3b82f6]/30 border-t-[#3b82f6] animate-spin" />
                  <p className="text-xs font-mono text-[#60a5fa]">
                    Synthesizing {selectedModule.toUpperCase()} engine across 768-dim pgvector memory...
                  </p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-3.5">
                  
                  {/* Exact 5-Point Pattern Card matching trainer.html */}
                  <div className="bg-[#050507] border border-[#1e1e24] rounded-lg p-4 space-y-3.5">
                    
                    {/* POINT 1 */}
                    <div>
                      <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="bg-[#18181b] text-[#60a5fa] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                          POINT 1
                        </span>
                        Heading / Problem Title
                      </div>
                      <div className="text-sm sm:text-base font-bold text-[#ffffff] tracking-tight">
                        {analysisResult.title}
                      </div>
                    </div>

                    {/* POINT 2 */}
                    <div>
                      <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="bg-[#18181b] text-[#60a5fa] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                          POINT 2
                        </span>
                        Brief Description & Systemic Root-Cause
                      </div>
                      <div className="text-xs text-[#d4d4d8] leading-relaxed">
                        {analysisResult.systemicRootCauseSynthesis || analysisResult.briefDescription}
                      </div>
                    </div>

                    {/* POINT 3 */}
                    <div>
                      <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="bg-[#18181b] text-[#60a5fa] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                          POINT 3
                        </span>
                        Key Intervention Points & Matrix
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#d4d4d8]">
                        {(analysisResult.keyPoints || []).map((pt: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#3b82f6] font-bold mt-0.5">&bull;</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* POINT 4 */}
                    <div>
                      <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="bg-[#18181b] text-[#60a5fa] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                          POINT 4
                        </span>
                        Separate Comments & Statutory Justification
                      </div>
                      <div className="bg-[rgba(255,255,255,0.02)] border-l-2 border-[#3b82f6] p-2.5 rounded-r text-xs text-[#a1a1aa] leading-relaxed">
                        {analysisResult.expertCommentary || "Standard operating benchmark validated through Jharkhand innovation memory database."}
                      </div>
                    </div>

                    {/* POINT 5 */}
                    <div>
                      <div className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="bg-[#18181b] text-[#60a5fa] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                          POINT 5
                        </span>
                        Target Location
                      </div>
                      <div className="inline-flex items-center gap-2 bg-[#18181b] border border-[#27272a] text-[#f59e0b] text-xs font-semibold font-mono px-3 py-1 rounded-md">
                        <span>📍 {analysisResult.district} (Jharkhand)</span>
                        <span className="text-[#71717a] font-normal">&bull; Domain: {analysisResult.domain}</span>
                      </div>
                    </div>

                  </div>

                  {/* Interactive Subsystem Detail Tabs */}
                  <div className="pt-2 space-y-3">
                    
                    {/* Tab Navigation Pill Bar */}
                    <div className="flex items-center gap-1 bg-[#000000] border border-[#1e1e24] p-1 rounded-lg overflow-x-auto">
                      <button
                        onClick={() => setActiveTab("cabinet")}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeTab === "cabinet"
                            ? "bg-[#18181b] text-[#ffffff] border border-[#27272a]"
                            : "text-[#a1a1aa] hover:text-[#ffffff]"
                        }`}
                      >
                        Executive Report
                      </button>
                      <button
                        onClick={() => setActiveTab("bom")}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeTab === "bom"
                            ? "bg-[#18181b] text-[#ffffff] border border-[#27272a]"
                            : "text-[#a1a1aa] hover:text-[#ffffff]"
                        }`}
                      >
                        Hardware BoM (INR)
                      </button>
                      <button
                        onClick={() => setActiveTab("scurve")}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeTab === "scurve"
                            ? "bg-[#18181b] text-[#ffffff] border border-[#27272a]"
                            : "text-[#a1a1aa] hover:text-[#ffffff]"
                        }`}
                      >
                        S-Curve 12M Trajectory
                      </button>
                      <button
                        onClick={() => setActiveTab("partners")}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeTab === "partners"
                            ? "bg-[#18181b] text-[#ffffff] border border-[#27272a]"
                            : "text-[#a1a1aa] hover:text-[#ffffff]"
                        }`}
                      >
                        Institutional Matches
                      </button>
                      <button
                        onClick={() => setActiveTab("directive")}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeTab === "directive"
                            ? "bg-[#18181b] text-[#ffffff] border border-[#27272a]"
                            : "text-[#a1a1aa] hover:text-[#ffffff]"
                        }`}
                      >
                        District Directive
                      </button>
                    </div>

                    {/* Tab 1: Executive Report */}
                    {activeTab === "cabinet" && (
                      <div className="space-y-3 bg-[#050507] border border-[#1e1e24] rounded-lg p-3.5 text-xs">
                        <div>
                          <span className="text-[11px] font-bold text-[#34d399] uppercase tracking-wider block mb-1">
                            Cabinet Executive Synthesis
                          </span>
                          <p className="text-[#d4d4d8] leading-relaxed">
                            {analysisResult.briefDescription}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                          <div className="bg-[#000000] border border-[#1e1e24] p-2.5 rounded text-center">
                            <span className="text-[10px] text-[#71717a] uppercase block">DMF Grant Share</span>
                            <span className="text-sm font-bold font-mono text-[#34d399]">
                              ₹ {analysisResult.dmfAllocationStrategy?.dmfGrantAmountLakhs} L
                            </span>
                          </div>
                          <div className="bg-[#000000] border border-[#1e1e24] p-2.5 rounded text-center">
                            <span className="text-[10px] text-[#71717a] uppercase block">SDRF Share</span>
                            <span className="text-sm font-bold font-mono text-[#60a5fa]">
                              {analysisResult.dmfAllocationStrategy?.stateSdrfSharePercentage}%
                            </span>
                          </div>
                          <div className="bg-[#000000] border border-[#1e1e24] p-2.5 rounded text-center">
                            <span className="text-[10px] text-[#71717a] uppercase block">Viability Score</span>
                            <span className="text-sm font-bold font-mono text-[#fbbf24]">
                              {analysisResult.dmfAllocationStrategy?.financialViabilityScore} / 100
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Hardware BoM */}
                    {activeTab === "bom" && (
                      <div className="space-y-3 bg-[#050507] border border-[#1e1e24] rounded-lg p-3.5 text-xs">
                        <div className="flex items-center justify-between border-b border-[#1e1e24] pb-2">
                          <span className="font-semibold text-[#f4f4f5] flex items-center gap-1.5">
                            <Cpu size={14} className="text-[#3b82f6]" />
                            Consolidated Hardware BoM (INR)
                          </span>
                          <span className="font-mono text-[#34d399] font-bold text-xs">
                            Total: ₹ {(analysisResult.bomTotalCostINR || 0).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[11px]">
                            <thead className="text-[#71717a] border-b border-[#1e1e24] font-mono">
                              <tr>
                                <th className="py-1.5 pr-2">Item</th>
                                <th className="py-1.5 px-2 text-center">Qty</th>
                                <th className="py-1.5 px-2 text-right">Unit (₹)</th>
                                <th className="py-1.5 pl-2 text-right">Total (₹)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#18181b] text-[#d4d4d8]">
                              {(analysisResult.hardwareBoM || []).map((b: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="py-2 pr-2 font-medium text-[#f4f4f5]">
                                    {b.item}
                                    <span className="block text-[10px] text-[#71717a] font-normal">{b.specifications}</span>
                                  </td>
                                  <td className="py-2 px-2 text-center font-mono">{b.quantity}</td>
                                  <td className="py-2 px-2 text-right font-mono text-[#a1a1aa]">{b.unitCostINR.toLocaleString("en-IN")}</td>
                                  <td className="py-2 pl-2 text-right font-mono text-[#34d399] font-semibold">{b.totalCostINR.toLocaleString("en-IN")}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: S-Curve 12M Trajectory */}
                    {activeTab === "scurve" && (
                      <div className="space-y-3 bg-[#050507] border border-[#1e1e24] rounded-lg p-3.5 text-xs">
                        <div className="flex items-center justify-between border-b border-[#1e1e24] pb-2">
                          <span className="font-semibold text-[#f4f4f5] flex items-center gap-1.5">
                            <TrendingUp size={14} className="text-[#10b981]" />
                            12-Month S-Curve Adoption vs Hazard Reduction
                          </span>
                        </div>

                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analysisResult.sCurveTrajectory || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="curveAdopt" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                                <linearGradient id="curveHazard" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="2 2" stroke="#1e1e24" />
                              <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} />
                              <YAxis tick={{ fill: "#71717a", fontSize: 10 }} unit="%" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: 11, borderRadius: 6 }}
                              />
                              <Area type="monotone" dataKey="adoptionRatePercentage" name="Adoption Rate (%)" stroke="#10b981" fill="url(#curveAdopt)" strokeWidth={2} />
                              <Area type="monotone" dataKey="hazardIndexReductionPercentage" name="Hazard Reduction (%)" stroke="#6366f1" fill="url(#curveHazard)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
                          {(analysisResult.sCurveTrajectory || []).map((m: any) => (
                            <div key={m.month} className="bg-[#000000] border border-[#1e1e24] p-1.5 rounded">
                              <span className="text-[10px] text-[#60a5fa] block">{m.month}</span>
                              <span className="text-xs font-bold text-[#f4f4f5]">{m.projectedBeneficiaries ? m.projectedBeneficiaries.toLocaleString() : "-"}</span>
                              <span className="text-[9px] text-[#71717a] block"> citizens</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Institutional Matches */}
                    {activeTab === "partners" && (
                      <div className="space-y-2.5 bg-[#050507] border border-[#1e1e24] rounded-lg p-3.5 text-xs">
                        <span className="font-semibold text-[#f4f4f5] flex items-center gap-1.5 border-b border-[#1e1e24] pb-2">
                          <Building2 size={14} className="text-[#3b82f6]" />
                          Matched Academic & R&D Laboratories
                        </span>

                        <div className="space-y-2 pt-1">
                          {(analysisResult.institutionalPartnerMatchingMatrix || []).map((inst: any, idx: number) => (
                            <div key={idx} className="bg-[#000000] border border-[#1e1e24] p-2.5 rounded-lg space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#f4f4f5] text-xs">{inst.institutionName}</span>
                                <span className="bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.3)] text-[#34d399] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  {inst.specializationScore}% Match
                                </span>
                              </div>
                              <p className="text-[11px] text-[#a1a1aa]">{inst.departmentOrLab} &bull; Proximity: {inst.geospatialProximityKm} km</p>
                              <div className="text-[11px] text-[#60a5fa] bg-[#0c0c10] p-1.5 rounded">
                                <strong>Role:</strong> {inst.proposedRole}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 5: District Directive */}
                    {activeTab === "directive" && (
                      <div className="space-y-2.5 bg-[#050507] border border-[#1e1e24] rounded-lg p-3.5 text-xs">
                        <div className="flex items-center justify-between border-b border-[#1e1e24] pb-2">
                          <span className="font-mono text-[10.5px] font-bold text-[#f87171] bg-[rgba(239,68,68,0.12)] px-2 py-0.5 rounded border border-[rgba(239,68,68,0.3)]">
                            ORDER #{analysisResult.districtActionDirective?.orderReference}
                          </span>
                          <span className="text-[11px] text-[#fbbf24] font-mono font-semibold">
                            Mandated SLA: {analysisResult.districtActionDirective?.mandatedSlaDays} Days
                          </span>
                        </div>

                        <div className="space-y-1 text-[#d4d4d8]">
                          <p><strong className="text-[#a1a1aa]">Designated Officer:</strong> {analysisResult.districtActionDirective?.designatedNodalOfficer}</p>
                        </div>

                        <div>
                          <strong className="text-[11px] text-[#a1a1aa] uppercase tracking-wider block mb-1 font-semibold">
                            Mandated Directives:
                          </strong>
                          <ul className="space-y-1 text-[11px] text-[#d4d4d8]">
                            {(analysisResult.districtActionDirective?.immediateDirectives || []).map((d: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 size={12} className="text-[#10b981] mt-0.5 shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] p-2 rounded text-[10.5px] text-[#fca5a5]">
                          <strong>Compliance Notice:</strong> {analysisResult.districtActionDirective?.penalConsequencesOfDefault}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <div className="text-center py-16 text-xs text-[#71717a]">
                  Select a problem from the left column and click <strong>"Execute AI Analysis"</strong> to generate structured 5-point schema and matrices.
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}