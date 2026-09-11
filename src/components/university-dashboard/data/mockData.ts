import type {
  LiveProblem,
  TeamApplication,
  ProblemSolutionPlan,
  ResourceItem,
  AlertNotification,
} from "../types";

export const INITIAL_LIVE_PROBLEMS: LiveProblem[] = [
  {
    id: "prob-001",
    ticketId: "JS-2026-5167",
    title: "Urban Drainage Choking & Stormwater Telemetry Redressal",
    department: "Urban Development & Housing Dept",
    district: "Ranchi",
    urgency: "CRITICAL",
    domain: "Infrastructure",
    description: "Severe acoustic backflow and silt clogging in Harmu stormwater conduit causing localized flooding in Ward 12 during intense monsoon spells. Requires IP68 ultrasonic level telemetry array and automated trash rack barriers.",
    affectedPopulation: "45,000+ Urban Residents",
    estimatedBudget: "₹ 1.80 Lakhs (DMF Sanctioned)",
    deadline: "21 Days",
    status: "OPEN",
  },
  {
    id: "prob-002",
    ticketId: "JS-2026-9041",
    title: "Subsurface Mine Fire Slurry & Telemetry Network",
    department: "Dept of Mines & Geology",
    district: "Dhanbad",
    urgency: "CRITICAL",
    domain: "Mining & Geology",
    description: "Subsurface coal seam combustion emitting toxic fumes and causing ground subsidence along Jharia Sector 4 perimeter. Requires infrared thermal sensing grid and automated slurry injection nodes.",
    affectedPopulation: "60,000+ Habitations",
    estimatedBudget: "₹ 3.50 Lakhs (DMF Sanctioned)",
    deadline: "14 Days",
    status: "OPEN",
  },
  {
    id: "prob-003",
    ticketId: "JS-2026-7821",
    title: "Solar-Assisted Fluoride EC Filtration Grid",
    department: "Drinking Water & Sanitation Dept",
    district: "Palamu",
    urgency: "HIGH",
    domain: "Water & Sanitation",
    description: "Groundwater fluoride contamination exceeding 4.8 mg/L across 14 drought-prone rural panchayats. Deploying decentralized electrochemical coagulation units powered by solar PV arrays.",
    affectedPopulation: "32,000+ Rural Citizens",
    estimatedBudget: "₹ 2.40 Lakhs (DMF Sanctioned)",
    deadline: "28 Days",
    status: "OPEN",
  },
  {
    id: "prob-004",
    ticketId: "JS-2026-4439",
    title: "Decentralized 50kW PV Microgrid with LiFePO4",
    department: "Energy & Rural Electrification",
    district: "Latehar",
    urgency: "HIGH",
    domain: "Renewable Energy",
    description: "Unstable grid connectivity affecting vaccine cold storage and tribal farmer agro-processing in Mahuadanr block. Installing containerized 50kW solar PV with 100kWh LiFePO4 battery energy storage.",
    affectedPopulation: "18,000+ Tribal Citizens",
    estimatedBudget: "₹ 4.20 Lakhs (DMF Sanctioned)",
    deadline: "30 Days",
    status: "OPEN",
  },
  {
    id: "prob-005",
    ticketId: "JS-2026-6204",
    title: "Rural Health Sub-Center Vaccine Cold-Chain Telemetry",
    department: "Health, Medical Education & Family Welfare",
    district: "Ramgarh",
    urgency: "HIGH",
    domain: "Infrastructure",
    description: "Phase-change material (PCM) passive cooling modules and BLE telemetry dataloggers to maintain 2°C–8°C cold chain for child immunization across remote sub-centers.",
    affectedPopulation: "25,000+ Beneficiaries",
    estimatedBudget: "₹ 1.50 Lakhs (DMF Sanctioned)",
    deadline: "25 Days",
    status: "OPEN",
  },
  {
    id: "prob-006",
    ticketId: "JS-2026-3190",
    title: "Smart Agro-Hydrological Soil Sensor & Extension Kiosk",
    department: "Agriculture, Animal Husbandry & Co-operative",
    district: "Dumka",
    urgency: "MODERATE",
    domain: "Agriculture",
    description: "LoRaWAN soil moisture and NPK telemetry kiosks enabling precision irrigation advisories for tribal smallholder paddy farmers across Santhal Pargana.",
    affectedPopulation: "15,000+ Farmers",
    estimatedBudget: "₹ 1.20 Lakhs (DMF Sanctioned)",
    deadline: "35 Days",
    status: "OPEN",
  },
];

export const INITIAL_APPLICATIONS: TeamApplication[] = [
  {
    id: "team-001",
    teamName: "Team AquaTelemetry BIT",
    problemId: "prob-001",
    problemTitle: "Urban Drainage Choking & Stormwater Telemetry Redressal",
    domain: "Infrastructure",
    leadStudent: {
      name: "Aakash Verma",
      email: "aakash.v@bitmesra.ac.in",
      rollNo: "2022-EC-042",
      phone: "9876543210",
    },
    members: [
      { name: "Sneha Roy", rollNo: "2022-CS-108", department: "Computer Science", role: "Firmware & ML" },
      { name: "Rohit Murmu", rollNo: "2022-CE-031", department: "Civil Engineering", role: "Hydrology & BoM" },
    ],
    facultyMentor: "Dr. Anirban Mukherjee",
    facultyEmail: "anirban.m@bitmesra.ac.in",
    skills: ["IoT Telemetry", "Embedded C", "Hydrology Modeling", "FastAPI"],
    statementOfPurpose: "Our team proposes an array of IP68 solar-powered acoustic transducers with cellular telemetry sending real-time water levels and choke alerts to Ranchi Municipal Command.",
    status: "APPROVED_FACULTY",
    facultyNotes: "Strong technical design and robust hardware BoM within sanctioned DMF limits. Recommended for State DPR sanction.",
    submittedAt: "2026-09-08T10:30:00Z",
  },
];

export const INITIAL_PLANS: ProblemSolutionPlan[] = [
  {
    id: "plan-001",
    teamId: "team-001",
    teamName: "Team AquaTelemetry BIT",
    problemId: "prob-001",
    problemTitle: "Urban Drainage Choking & Stormwater Telemetry Redressal",
    planTitle: "IP68 Acoustic Telemetry Node & Automated Trash Barrier Grid",
    executiveSummary: "Deploying 12 autonomous solar-powered ultrasonic sensor nodes along Harmu conduit paired with motorized debris skimmers.",
    hardwareBoM: [
      { component: "IP68 Ultrasonic Water Level Transducer", quantity: 12, estimatedCost: 38400, purpose: "Culvert depth telemetry", vendorStandard: "BIS IS 1451 / IP68" },
      { component: "ESP32-S3 NB-IoT / 4G Cellular Telemetry Gateway", quantity: 12, estimatedCost: 28800, purpose: "Real-time state telemetry transmission", vendorStandard: "CE / RoHS Certified" },
      { component: "Monocrystalline Solar Panel (20W) & LiFePO4 Pack", quantity: 12, estimatedCost: 31200, purpose: "Self-sustaining power unit", vendorStandard: "BIS IS 16046" },
      { component: "Stainless Steel SS-316 Trash Barrier Grating", quantity: 6, estimatedCost: 45000, purpose: "Solid waste blockage prevention", vendorStandard: "AISI 316 Marine Grade" },
    ],
    totalBudgetRequired: 143400,
    milestones: [
      { phase: "Phase 1", duration: "Weeks 1-2", deliverables: "Sensor node calibration & telemetry firmware verification" },
      { phase: "Phase 2", duration: "Weeks 3-4", deliverables: "Culvert field deployment & Municipal Command link" },
    ],
    prototypeArchitecture: "Ultrasonic sensor -> ESP32 Gateway -> MQTT / HTTPS -> PooKar State AI War Room Dashboard",
    firmwareOrRepoUrl: "https://github.com/jharkhand-innovation/harmu-telemetry",
    status: "FACULTY_ENDORSED",
    facultyFeedback: "Thoroughly reviewed. Compliant with State Disaster Management specifications.",
    adminGrantSanction: "Approved under DMF Ranchi Ward 12 Allocation (₹ 1.50 L)",
    submittedAt: "2026-09-09T14:15:00Z",
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-001",
    title: "Detailed Project Report (DPR) Standard Template - Jharkhand Govt",
    category: "DPR Template",
    format: "DOCX",
    fileSize: "1.4 MB",
    description: "Official DPR submission template required by Planning & Development Department and DMF for funding release.",
    downloads: 142,
    updatedDate: "2026-09-01",
    tags: ["DPR", "DMF Grant", "Jharkhand Policy"],
  },
  {
    id: "res-002",
    title: "Indian Standards (IS 1451) for Civic IoT & Environmental Telemetry",
    category: "Technical Standards",
    format: "PDF",
    fileSize: "2.8 MB",
    description: "Mandatory compliance guidelines for electronic hardware deployed in municipal water bodies and harsh geological environments.",
    downloads: 98,
    updatedDate: "2026-08-25",
    tags: ["BIS", "IoT", "Standards"],
  },
  {
    id: "res-003",
    title: "Approved Component BoM & Unit Rate Schedule (Jharkhand SDRMF 2026)",
    category: "BoM Catalog",
    format: "PDF",
    fileSize: "3.1 MB",
    description: "Standardized unit pricing matrix for microcontrollers, sensors, solar panels, and LiFePO4 battery packs.",
    downloads: 215,
    updatedDate: "2026-08-30",
    tags: ["BoM", "Hardware", "Rates"],
  },
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: "alert-001",
    title: "New Critical Problem Ingested - Ranchi Harmu Drainage",
    message: "District Collectorate Ranchi has posted a critical civic grievance (#JS-2026-5167). Academic prototyping teams are invited to apply.",
    category: "SYSTEM",
    priority: "HIGH",
    timestamp: "10 mins ago",
    read: false,
    actionUrl: "/university-dashboard/live-problems",
  },
  {
    id: "alert-002",
    title: "Faculty Endorsement Milestone",
    message: "Team AquaTelemetry BIT plan has been endorsed by Dr. Anirban Mukherjee and routed to Administration for DMF sanction.",
    category: "APPROVAL",
    priority: "HIGH",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/university-dashboard/faculty-evaluation",
  },
];

// LocalStorage Persistence Helpers
export const getStoredProblems = (): LiveProblem[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_problems");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem("pookar_univ_problems", JSON.stringify(INITIAL_LIVE_PROBLEMS));
    return INITIAL_LIVE_PROBLEMS;
  } catch {
    return INITIAL_LIVE_PROBLEMS;
  }
};

export const saveProblems = (problems: LiveProblem[]) => {
  try {
    localStorage.setItem("pookar_univ_problems", JSON.stringify(problems));
  } catch (e) {
    console.error("Failed to persist problems", e);
  }
};

export const getStoredApplications = (): TeamApplication[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_teams");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem("pookar_univ_teams", JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

export const saveApplications = (teams: TeamApplication[]) => {
  try {
    localStorage.setItem("pookar_univ_teams", JSON.stringify(teams));
  } catch (e) {
    console.error("Failed to persist team applications", e);
  }
};

export const getStoredPlans = (): ProblemSolutionPlan[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_plans");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem("pookar_univ_plans", JSON.stringify(INITIAL_PLANS));
    return INITIAL_PLANS;
  } catch {
    return INITIAL_PLANS;
  }
};

export const savePlans = (plans: ProblemSolutionPlan[]) => {
  try {
    localStorage.setItem("pookar_univ_plans", JSON.stringify(plans));
  } catch (e) {
    console.error("Failed to persist solution plans", e);
  }
};

export const getStoredResources = (): ResourceItem[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_resources");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem("pookar_univ_resources", JSON.stringify(INITIAL_RESOURCES));
    return INITIAL_RESOURCES;
  } catch {
    return INITIAL_RESOURCES;
  }
};

export const saveResources = (resources: ResourceItem[]) => {
  try {
    localStorage.setItem("pookar_univ_resources", JSON.stringify(resources));
  } catch (e) {
    console.error("Failed to persist resources", e);
  }
};

export const getStoredAlerts = (): AlertNotification[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_alerts");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem("pookar_univ_alerts", JSON.stringify(INITIAL_ALERTS));
    return INITIAL_ALERTS;
  } catch {
    return INITIAL_ALERTS;
  }
};

export const saveAlerts = (alerts: AlertNotification[]) => {
  try {
    localStorage.setItem("pookar_univ_alerts", JSON.stringify(alerts));
  } catch (e) {
    console.error("Failed to persist alerts", e);
  }
};

