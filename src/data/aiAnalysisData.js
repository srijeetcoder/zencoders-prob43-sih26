export const problemData = {
  id: "JS-2026-1043",
  title: "AI Analysis Report",
  problemTitle: "Water Logging in Ward 12",
  location: "Ward 12, Kolkata, West Bengal",
  category: "Urban Infrastructure",
  severity: "High",
  submittedDate: "12 Mar 2026, 10:24 AM",
  analyzedDate: "12 Mar 2026, 11:05 AM",
  description:
    "Frequent water logging in Ward 12 during the monsoon season, causing traffic disruption, property damage, and public health risks. The issue is primarily due to inadequate drainage capacity, blockages, and low-lying terrain.",
  analysisComplete: true,
};

export const keyInsights = [
  {
    id: 1,
    title: "High Rainfall Correlation",
    description: "Area receives 22% more rainfall than city average during monsoon.",
    icon: "cloud-rain",
    color: "blue",
  },
  {
    id: 2,
    title: "Drainage Capacity Gap",
    description: "Existing drainage system can handle only ~60% of peak load.",
    icon: "cloud-lightning",
    color: "purple",
  },
  {
    id: 3,
    title: "High Population Density",
    description: "~12,000+ residents affected during peak months.",
    icon: "users",
    color: "blue",
  },
  {
    id: 4,
    title: "Recurring Issue",
    description: "Similar complaints in the last 3 years indicate a systemic problem.",
    icon: "alert-triangle",
    color: "orange",
  },
];

export const rainfallData = [
  { month: "Jan", rainfall: 15, incidents: 2 },
  { month: "Feb", rainfall: 25, incidents: 3 },
  { month: "Mar", rainfall: 35, incidents: 5 },
  { month: "Apr", rainfall: 50, incidents: 8 },
  { month: "May", rainfall: 130, incidents: 15 },
  { month: "Jun", rainfall: 290, incidents: 28 },
  { month: "Jul", rainfall: 340, incidents: 35 },
  { month: "Aug", rainfall: 330, incidents: 32 },
  { month: "Sep", rainfall: 260, incidents: 25 },
  { month: "Oct", rainfall: 110, incidents: 12 },
  { month: "Nov", rainfall: 30, incidents: 4 },
  { month: "Dec", rainfall: 10, incidents: 1 },
];

export const rootCauses = [
  {
    id: 1,
    title: "Inadequate Drainage Capacity",
    description:
      "Existing drains are undersized for current population and rainfall levels.",
    severity: "Major Factor",
  },
  {
    id: 2,
    title: "Blocked Storm Water Drains",
    description:
      "Presence of solid waste and lack of regular maintenance.",
    severity: "Significant",
  },
  {
    id: 3,
    title: "Low Ground Elevation",
    description:
      "Ward 12 is a low-lying area, making it more prone to water accumulation.",
    severity: "Significant",
  },
];

export const impactData = {
  peopleAffected: "~12,000+",
  peopleLabel: "People Affected",
  avgDisruption: "3 - 5 days",
  disruptionLabel: "Average Disruption",
  economicLoss: "₹2.5 - 4 Cr",
  lossLabel: "Estimated Annual Economic Loss",
  healthRisk: "High",
  healthLabel: "Public Health Risk",
};

export const locationData = {
  center: [22.5726, 88.3639],
  zoom: 14,
  reportedLocation: { lat: 22.5726, lng: 88.3639, label: "Ward 12" },
  affectedArea: { lat: 22.5736, lng: 88.3649, label: "Affected Area (AI)" },
};

export const tabs = [
  { id: "overview", label: "Overview" },
  { id: "detailed", label: "Detailed Analysis" },
  { id: "similar", label: "Similar Problems" },
  { id: "solutions", label: "Possible Solutions" },
  { id: "partners", label: "Recommended Partners" },
  { id: "impact", label: "Impact Estimate" },
  { id: "discussion", label: "Discussion (3)" },
];

export const sidebarNav = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "submissions", label: "Citizen Submissions", icon: "file-text" },
  { id: "ai-analysis", label: "AI Analysis", icon: "brain", active: true },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "universities", label: "Universities & Partners", icon: "building-2" },
  { id: "analytics", label: "Analytics & Reports", icon: "bar-chart-3" },
  { id: "resource", label: "Resource Centre", icon: "book-open" },
  { id: "notifications", label: "Notifications", icon: "bell", badge: 3 },
  { id: "settings", label: "Settings", icon: "settings" },
];
