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
  id: "JS-2026-1043",
  title: "Solution & Team Matching",
  subtitle: "AI-powered recommendations to find the best solutions and partners for this problem.",
  location: "Water Logging in Ward 12, Kolkata, West Bengal",
  submittedDate: "12 Mar 2026",
  analyzedDate: "12 Mar 2026",
  updatedDate: "12 Mar 2026, 11:30 AM",
};

export const tabs = [
  { id: "recommended", label: "Recommended Solutions" },
  { id: "matched-teams", label: "Matched Teams" },
  { id: "comparison", label: "Comparison" },
  { id: "roadmap", label: "Implementation Roadmap" },
];

export const stats = [
  { id: 1, value: "12", label: "Potential Solutions", sub: "Identified by AI", icon: "lightbulb", color: "#f59e0b" },
  { id: 2, value: "8", label: "Matched Teams", sub: "from universities & industry", icon: "users", color: "#0891b2" },
  { id: 3, value: "3", label: "High Feasibility", sub: "solutions", icon: "target", color: "#ef4444" },
  { id: 4, value: "6 - 12 months", label: "Estimated Time", sub: "for top solutions", icon: "clock", color: "#164e63" },
];

export const filterOptions = {
  domains: [
    { id: "infrastructure", label: "Infrastructure", checked: true },
    { id: "iot-monitoring", label: "IoT & Monitoring", checked: false },
    { id: "nature-based", label: "Nature-based Solutions", checked: false },
    { id: "policy", label: "Policy & Management", checked: false },
    { id: "community", label: "Community Engagement", checked: false },
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
    title: "Smart Drainage & Permeable Pavement System",
    matchType: "High Match",
    matchPercent: 92,
    description: "Upgrade drainage system with smart sensors and permeable pavements to improve water flow and reduce surface run-off.",
    tags: ["Infrastructure", "IoT", "Urban Planning"],
    duration: "6 – 12 months",
    cost: "₹ 1.2 – 2 Cr",
    impact: "High Impact",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Real-time Water Level Monitoring",
    matchType: "High Match",
    matchPercent: 87,
    description: "Install IoT-based sensors to monitor water levels and provide early alerts to municipal authorities and citizens.",
    tags: ["IoT", "Early Warning", "Data Analytics"],
    duration: "3 – 6 months",
    cost: "₹ 50 Lakh – 1 Cr",
    impact: "High Impact",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Decentralized Rainwater Harvesting",
    matchType: "Medium Match",
    matchPercent: 78,
    description: "Implement rainwater harvesting systems in public spaces, schools and residential complexes to reduce surface run-off.",
    tags: ["Nature-based", "Sustainability", "Community Driven"],
    duration: "6 – 12 months",
    cost: "₹ 50 Lakh – 1.5 Cr",
    impact: "Moderate Impact",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Drainage Desilting & Maintenance Plan",
    matchType: "Medium Match",
    matchPercent: 74,
    description: "Regular desilting of existing drains with a monitored maintenance schedule to ensure smooth water flow.",
    tags: ["Operations", "Municipal Management", "Short-term Fix"],
    duration: "3 – 6 months",
    cost: "₹ 20 – 50 Lakh",
    impact: "Moderate Impact",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop",
  },
];

export const topTeam = {
  name: "IIT Kharagpur",
  department: "Dept. of Civil Engineering",
  matchPercent: 92,
  description: "Expertise in urban drainage systems, IoT monitoring and sustainable infrastructure. Previously worked on 5 similar projects.",
  stats: [
    { label: "Similar Projects", value: 5 },
    { label: "Faculty Experts", value: 8 },
    { label: "Ongoing Collaborations", value: 3 },
  ],
};

export const otherTeams = [
  { id: 1, name: "Jadavpur University", department: "Dept. of Environmental Science", matchPercent: 87 },
  { id: 2, name: "MAKAUT", department: "Dept. of IoT & Smart Systems", matchPercent: 80 },
  { id: 3, name: "Tata Projects (Industry Partner)", department: "Urban Infrastructure Solutions", matchPercent: 76 },
];
