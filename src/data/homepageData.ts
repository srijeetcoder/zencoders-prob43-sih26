export const navItems = [
  { icon: "layoutDashboard", label: "Dashboard", active: false },
  { icon: "fileText", label: "Citizen Submissions", active: false },
  { icon: "brain", label: "AI Analysis", active: false },
  { icon: "layers", label: "Solution & Team Matching", active: false },
  { icon: "folderOpen", label: "Projects", active: false },
  { icon: "graduationCap", label: "Universities & Partners", active: false },
  { icon: "star", label: "Success Stories", active: true },
  { icon: "barChart3", label: "Analytics & Reports", active: false },
  { icon: "bookOpen", label: "Resource Centre", active: false },
  { icon: "bell", label: "Notifications", active: false, badge: 3 },
  { icon: "settings", label: "Settings", active: false },
];

export const stats = [
  {
    value: "89",
    label: "Problems Resolved",
    growth: "+14% this quarter",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "users",
  },
  {
    value: "24",
    label: "Universities Contributed",
    growth: "Statewide Network",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "graduationCap",
  },
  {
    value: "38",
    label: "Industry & R&D Partners",
    growth: "CSR Consortium",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "building",
  },
  {
    value: "1.4 Lakh+",
    label: "Citizens Positively Impacted",
    growth: "Field Audited",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "heart",
  },
];

export const featuredStory = {
  tag: "Environment",
  location: "Morabadi Ward 12, Ranchi",
  title: "IoT-Driven Smart Sump & Siltation Telemetry",
  subtitle: "Community-driven drainage & flood prevention system",
  description:
    "Residents of Morabadi Ward 12 faced severe monsoon waterlogging over 3 feet deep. Through collaboration between Ranchi Municipal Corporation, BIT Mesra and industry innovators, solar-powered hydrostatic depth sensors linked to automated high-capacity sluice pumps were deployed, eliminating flood recurrence completely.",
  partners: [
    { name: "BIT Mesra", role: "Academic Partner", icon: "graduationCap" },
    { name: "Indo-German Water Tech", role: "Industry Partner", icon: "building" },
    { name: "Ranchi Municipal Corporation", role: "Government Partner", icon: "landmark" },
  ],
  impact: [
    { value: "14,500+", label: "People Benefited", icon: "users" },
    { value: "-93%", label: "Reduction in Waterlogging Hours", icon: "shield" },
    { value: "6 Weeks", label: "From Proposal to Deployment", icon: "clock" },
    { value: "₹ 14.8 L", label: "Total Project Cost", icon: "indianRupee" },
  ],
};

export const sectorData = [
  { sector: "Water & Urban Drainage", value: 34, color: "#3b82f6" },
  { sector: "Mining Safety & Env", value: 24, color: "#ea580c" },
  { sector: "Rural Healthcare", value: 18, color: "#16a34a" },
  { sector: "Clean Energy Microgrids", value: 14, color: "#eab308" },
  { sector: "Agriculture & Livelihood", value: 10, color: "#8b5cf6" },
];

export const mapMarkers = [
  { city: "Ranchi", lat: 23.3441, lng: 85.3096, projects: 85, label: "50+" },
  { city: "Dhanbad", lat: 23.7957, lng: 86.4304, projects: 62, label: "50+" },
  { city: "Jamshedpur", lat: 22.8046, lng: 86.2029, projects: 54, label: "50+" },
  { city: "Bokaro", lat: 23.6693, lng: 86.1511, projects: 38, label: "10-50" },
  { city: "Hazaribagh", lat: 23.9925, lng: 85.3637, projects: 29, label: "10-50" },
  { city: "Deoghar", lat: 24.4826, lng: 86.7001, projects: 22, label: "10-50" },
  { city: "Palamu", lat: 24.0416, lng: 84.0722, projects: 19, label: "10-50" },
  { city: "Dumka", lat: 24.2676, lng: 87.2494, projects: 16, label: "10-50" },
  { city: "Chaibasa", lat: 22.5516, lng: 85.8077, projects: 14, label: "10-50" },
  { city: "Ramgarh", lat: 23.6331, lng: 85.5139, projects: 18, label: "10-50" },
  { city: "Khunti", lat: 23.0734, lng: 85.2789, projects: 12, label: "10-50" },
];

export const keyHighlights = [
  { value: "1.4 Lakh+", label: "Lives Improved", icon: "users" },
  { value: "89", label: "Solutions Implemented", icon: "layers" },
  { value: "24", label: "Districts Reached", icon: "mapPin" },
  { value: "₹ 14.8 Cr", label: "Funding Mobilized", icon: "trendingUp" },
];

export const recentStories = [
  {
    tag: "Infrastructure",
    tagColor: "#3b82f6",
    tagBg: "#eff6ff",
    title: "Smart Sump & Urban Drainage Telemetry",
    description: "Automated ultrasonic depth sensors linked to high-capacity sluice pumps in Morabadi.",
    partner: "BIT Mesra & RMC",
  },
  {
    tag: "Clean Energy",
    tagColor: "#22c55e",
    tagBg: "#f0fdf4",
    title: "Decentralized Tribal Solar Micro-Grid",
    description: "45 kW community solar microgrid delivering 24/7 power and cold storage to Murhu block.",
    partner: "IIT (ISM) Dhanbad",
  },
  {
    tag: "Sanitation",
    tagColor: "#f43f5e",
    tagBg: "#fff1f2",
    title: "AI Organic Waste Conversion Hub",
    description: "Automated optical sorting conveyor and 5-tonne aerobic rapid composting unit.",
    partner: "NIT Jamshedpur",
  },
  {
    tag: "GIS & Drone",
    tagColor: "#eab308",
    tagBg: "#fefce8",
    title: "Autonomous LiDAR Drone Survey & Road Repair",
    description: "LiDAR drone surveying mapped subsurface voids, enabling rapid pavement stabilization.",
    partner: "Birsa Agricultural University",
  },
];
