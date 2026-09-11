export const sidebarNav = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "submissions", label: "Citizen Submissions", icon: "file-text" },
  { id: "ai-analysis", label: "AI Analysis", icon: "brain" },
  { id: "solution-matching", label: "Solution & Team Matching", icon: "target", active: true },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "universities", label: "Universities & Partners", icon: "building-2" },
  { id: "analytics", label: "Analytics & Reports", icon: "bar-chart-3" },
  { id: "resource", label: "Resource Centre", icon: "book-open" },
  { id: "notifications", label: "Notifications", icon: "bell", badge: 3 },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const problemData = {
  id: "PK-2026-1043",
  title: "Solution & Team Matching",
  subtitle: "AI-powered recommendations connecting citizen challenges with verified research labs, universities, and enterprise innovators across Jharkhand.",
  location: "Harmu River Basin & Urban Conduits, Ranchi, Jharkhand",
  submittedDate: "10 Sep 2026",
  analyzedDate: "11 Sep 2026",
  updatedDate: "11 Sep 2026, 04:30 PM",
};

export const tabs = [
  { id: "recommended", label: "Recommended Solutions" },
  { id: "matched-teams", label: "Matched Teams" },
  { id: "comparison", label: "Comparison" },
  { id: "roadmap", label: "Implementation Roadmap" },
];

export const stats = [
  { id: 1, value: "14", label: "Potential Solutions", sub: "Identified by Gemini AI", icon: "lightbulb", color: "#f59e0b" },
  { id: 2, value: "9", label: "Matched Teams", sub: "from Jharkhand universities & R&D", icon: "users", color: "#0891b2" },
  { id: 3, value: "4", label: "High Feasibility", sub: "bankable DPR solutions", icon: "target", color: "#ef4444" },
  { id: 4, value: "3 – 6 months", label: "Estimated Time", sub: "for top field deployments", icon: "clock", color: "#164e63" },
];

export const filterOptions = {
  domains: [
    { id: "infrastructure", label: "Infrastructure", checked: true },
    { id: "iot-monitoring", label: "IoT & Telemetry", checked: false },
    { id: "nature-based", label: "Nature-based Solutions", checked: false },
    { id: "policy", label: "Policy & Operations", checked: false },
    { id: "community", label: "Community Driven", checked: false },
  ],
  feasibility: [
    { id: "high", label: "High", checked: true },
    { id: "medium", label: "Medium", checked: false },
    { id: "exploratory", label: "Exploratory", checked: false },
  ],
  cost: [
    { id: "any", label: "Any", checked: true },
    { id: "under-50l", label: "< ₹50 Lakh", checked: false },
    { id: "50l-2cr", label: "₹50 Lakh – ₹2 Cr", checked: false },
    { id: "above-2cr", label: "> ₹2 Cr", checked: false },
  ],
  time: [
    { id: "any", label: "Any", checked: true },
    { id: "under-6m", label: "< 6 months", checked: false },
    { id: "6-12m", label: "6 – 12 months", checked: false },
    { id: "above-1y", label: "> 1 year", checked: false },
  ],
};

export const solutions = [
  {
    id: 1,
    title: "Smart Drainage & Permeable Pavement Acoustic Telemetry",
    matchType: "High Match",
    matchPercent: 94,
    description: "Upgrade urban conduit drainage with IP68 ultrasonic silt sensors, non-invasive Doppler flow telemetry, and permeable pavements.",
    tags: ["Infrastructure", "IoT", "Urban Planning"],
    duration: "4 – 6 months",
    cost: "₹ 1.2 – 1.8 Cr",
    impact: "High Impact",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Real-time Silt Depth & Water Level Ultrasonic Monitoring",
    matchType: "High Match",
    matchPercent: 89,
    description: "Install solar LoRaWAN ultrasonic level sensors and early flash warning telemetry nodes for municipal war room dispatch.",
    tags: ["IoT", "Early Warning", "Data Analytics"],
    duration: "2 – 4 months",
    cost: "₹ 35 – 65 Lakh",
    impact: "High Impact",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Decentralized Bioswale & Rainwater Percolation Grid",
    matchType: "Medium Match",
    matchPercent: 78,
    description: "Deploy community bioswales and decentralized subsurface filtration sumps to catch runoff before entering choked arterial conduits.",
    tags: ["Nature-based", "Sustainability", "Community Driven"],
    duration: "6 – 9 months",
    cost: "₹ 45 – 90 Lakh",
    impact: "Moderate Impact",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Automated Trash Rack & Heavy Silt Dredging Plan",
    matchType: "Medium Match",
    matchPercent: 74,
    description: "Mechanical trash barriers at 8 key stormwater junctions paired with scheduled AI-guided hydraulic desilting rotations.",
    tags: ["Operations", "Municipal Management", "Short-term Fix"],
    duration: "1 – 3 months",
    cost: "₹ 20 – 45 Lakh",
    impact: "Moderate Impact",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
  },
];

export const topTeam = {
  name: "Birsa Institute of Technology (BIT Mesra)",
  department: "IoT Telemetry & Embedded Urban Systems Lab",
  matchPercent: 94,
  description: "Specialized in urban conduit telemetry, LoRaWAN mesh communication, and flood risk modeling. Previously executed 5 similar municipal projects in Jharkhand.",
  stats: [
    { label: "Similar Projects", value: 5 },
    { label: "Faculty Experts", value: 8 },
    { label: "Ongoing Pilots", value: 3 },
  ],
};

export const otherTeams = [
  { id: 1, name: "IIT (ISM) Dhanbad", department: "Dept. of Environmental Engineering & Hydrology", matchPercent: 91 },
  { id: 2, name: "NIT Jamshedpur", department: "Dept. of Civil & Smart Systems", matchPercent: 86 },
  { id: 3, name: "Tata Steel Urban Tech Cell", department: "Infrastructure Innovation Center", matchPercent: 82 },
];
