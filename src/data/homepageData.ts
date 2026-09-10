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
    value: "--",
    label: "Problems Resolved",
    growth: "Active Sync",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "users",
  },
  {
    value: "--",
    label: "Universities Contributed",
    growth: "Active Network",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "graduationCap",
  },
  {
    value: "--",
    label: "Industry Partners",
    growth: "CSR Consortium",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "building",
  },
  {
    value: "--",
    label: "People Positively Impacted",
    growth: "Field Audited",
    color: "#1a5c5a",
    bgColor: "#e6f7f5",
    icon: "heart",
  },
];

export const featuredStory = {
  tag: "Environment",
  location: "Purulia, West Bengal",
  title: "Clean Water for a Healthier Purulia",
  subtitle: "Community-driven water purification system",
  description:
    "Residents of Purulia faced severe water contamination during monsoon season. Through collaboration between the local administration, IIT Kharagpur and an industry partner, a low-cost, solar-powered water purification system was deployed, providing clean drinking water to surrounding hamlets.",
  partners: [
    { name: "IIT Kharagpur", role: "Academic Partner", icon: "graduationCap" },
    { name: "JalTech Solutions", role: "Industry Partner", icon: "building" },
    { name: "Purulia District Administration", role: "Government Partner", icon: "landmark" },
  ],
  impact: [
    { value: "--", label: "People Benefited", icon: "users" },
    { value: "--", label: "Reduction in Waterborne Diseases", icon: "shield" },
    { value: "--", label: "From Proposal to Deployment", icon: "clock" },
    { value: "--", label: "Total Project Cost", icon: "indianRupee" },
  ],
};

export const sectorData = [
  { sector: "Infrastructure", value: 28, color: "#3b82f6" },
  { sector: "Environment", value: 22, color: "#22c55e" },
  { sector: "Healthcare", value: 15, color: "#f43f5e" },
  { sector: "Education", value: 12, color: "#eab308" },
  { sector: "Agriculture", value: 10, color: "#14b8a6" },
  { sector: "Others", value: 13, color: "#9ca3af" },
];

export const mapMarkers = [
  { city: "Mumbai", lat: 19.076, lng: 72.8777, projects: 65, label: "50+" },
  { city: "Delhi", lat: 28.6139, lng: 77.209, projects: 82, label: "50+" },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639, projects: 55, label: "50+" },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, projects: 42, label: "10-50" },
  { city: "Bangalore", lat: 12.9716, lng: 77.5946, projects: 48, label: "10-50" },
  { city: "Hyderabad", lat: 17.385, lng: 78.4867, projects: 38, label: "10-50" },
  { city: "Pune", lat: 18.5204, lng: 73.8567, projects: 30, label: "10-50" },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714, projects: 25, label: "10-50" },
  { city: "Jaipur", lat: 26.9124, lng: 75.7873, projects: 20, label: "10-50" },
  { city: "Lucknow", lat: 26.8467, lng: 80.9462, projects: 18, label: "10-50" },
  { city: "Bhopal", lat: 23.2599, lng: 77.4126, projects: 12, label: "10-50" },
  { city: "Patna", lat: 25.6093, lng: 85.1376, projects: 8, label: "1-10" },
  { city: "Guwahati", lat: 26.1445, lng: 91.7362, projects: 5, label: "1-10" },
  { city: "Bhubaneswar", lat: 20.2961, lng: 85.8245, projects: 7, label: "1-10" },
  { city: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, projects: 10, label: "1-10" },
  { city: "Indore", lat: 22.7196, lng: 75.8577, projects: 6, label: "1-10" },
  { city: "Nagpur", lat: 21.1458, lng: 79.0882, projects: 9, label: "1-10" },
  { city: "Chandigarh", lat: 30.7333, lng: 76.7794, projects: 14, label: "10-50" },
];

export const keyHighlights = [
  { value: "--", label: "Lives Improved", icon: "users" },
  { value: "--", label: "Solutions Implemented", icon: "layers" },
  { value: "--", label: "Districts Reached", icon: "mapPin" },
  { value: "--", label: "Average Cost Savings", icon: "trendingUp" },
];

export const recentStories = [
  {
    tag: "Infrastructure",
    tagColor: "#3b82f6",
    tagBg: "#eff6ff",
    title: "Smart Street Lighting in Jadavpur",
    description: "Reduced energy consumption by 40% using IoT-based adaptive lighting.",
    partner: "Jadavpur University",
  },
  {
    tag: "Agriculture",
    tagColor: "#22c55e",
    tagBg: "#f0fdf4",
    title: "AI-based Crop Disease Detection",
    description: "Early detection helped farmers increase yield by 30%.",
    partner: "MAKAUT",
  },
  {
    tag: "Healthcare",
    tagColor: "#f43f5e",
    tagBg: "#fff1f2",
    title: "Community Health Kiosk",
    description: "Telemedicine kiosks improved healthcare access in rural areas.",
    partner: "Tata Projects",
  },
  {
    tag: "Education",
    tagColor: "#eab308",
    tagBg: "#fefce8",
    title: "Smart Classrooms for Government Schools",
    description: "Digital infrastructure enabled quality education for 50+ schools.",
    partner: "IIT Kharagpur",
  },
];
