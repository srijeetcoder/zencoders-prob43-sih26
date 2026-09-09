export const projectInfo = {
  title: "Smart Drainage Monitoring System",
  status: "In Progress",
  location: "Ward 12, Kolkata, West Bengal",
  description:
    "Implement an IoT-based smart drainage monitoring system to detect waterlogging early, send real-time alerts, and help municipal authorities respond faster during monsoon.",
  tags: ["Urban Infrastructure", "IoT", "Flood Management", "Public Safety", "Smart Cities"],
};

export const projectHealth = {
  status: "On Track",
  message: "All key milestones are progressing as planned.",
  overallProgress: 65,
  milestonesCompleted: 3,
  totalMilestones: 5,
  expectedCompletion: "12 Mar 2026",
};

export const timeline = [
  { step: 1, label: "Project Approved", date: "12 Jan 2026", status: "completed" },
  { step: 2, label: "Team Onboarded", date: "28 Jan 2026", status: "completed" },
  { step: 3, label: "Prototype Development", date: "In Progress", status: "current" },
  { step: 4, label: "Field Testing", date: "Apr 2026", status: "upcoming" },
  { step: 5, label: "Final Deployment", date: "May 2026", status: "upcoming" },
];

export const keyDetails = [
  { icon: "hash", label: "Project ID", value: "#JS-2026-1043" },
  { icon: "mapPin", label: "Location", value: "Ward 12, Kolkata, WB" },
  { icon: "building", label: "Domain", value: "Urban Infrastructure" },
  { icon: "indianRupee", label: "Estimated Budget", value: "\u20B9 50 Lakh \u2013 1 Cr" },
  { icon: "users", label: "Implementing Partner", value: "IIT Kharagpur" },
  { icon: "activity", label: "Status", value: "In Progress" },
  { icon: "calendar", label: "Start Date", value: "12 Jan 2026" },
  { icon: "calendarCheck", label: "Expected Completion", value: "12 Mar 2026" },
];

export const team = {
  academia: {
    name: "IIT Kharagpur",
    subtitle: "Dept. of Civil Engineering",
    role: "Lead Partner",
    color: "blue",
  },
  industry: {
    name: "AquaSense Technologies",
    subtitle: "Smart Water Solutions",
    role: "Technology Partner",
    color: "teal",
  },
  government: {
    name: "Kolkata Municipal Corporation",
    subtitle: "Nodal Department",
    role: "Implementation",
    color: "green",
  },
};

export const recentActivities = [
  {
    id: 1,
    date: "Today",
    time: "10:24 AM",
    color: "green",
    icon: "upload",
    text: "Field data from Ward 12 uploaded",
    by: "by Team IIT Kharagpur",
  },
  {
    id: 2,
    date: "Yesterday",
    time: "4:15 PM",
    color: "orange",
    icon: "fileText",
    text: "Prototype design document shared",
    by: "by AquaSense Technologies.",
  },
  {
    id: 3,
    date: "10 Mar 2026",
    time: "11:30 AM",
    color: "blue",
    icon: "checkCircle",
    text: "Monthly progress meeting completed",
    by: "with KMC officials",
  },
  {
    id: 4,
    date: "8 Mar 2026",
    time: "2:10 PM",
    color: "purple",
    icon: "checkCircle",
    text: "Revised project plan approved",
    by: "by Ministry of Jal Shakti",
  },
];

export const tasks = [
  { id: 1, text: "Finalize technical architecture", date: "20 Jan", done: true },
  { id: 2, text: "Develop prototype sensors", date: "15 Feb", done: true },
  { id: 3, text: "Field installation (Phase 1)", date: "30 Mar", done: false },
  { id: 4, text: "Collect and analyze field data", date: "20 Apr", done: false },
  { id: 5, text: "Scale for full deployment", date: "12 Mar", done: false },
];

export const documents = [
  {
    id: 1,
    name: "Project Proposal.pdf",
    size: "2.4 MB",
    date: "12 Jan 2026",
    type: "pdf",
    color: "red",
  },
  {
    id: 2,
    name: "Technical Design Document.pdf",
    size: "3.1 MB",
    date: "28 Jan 2026",
    type: "pdf",
    color: "red",
  },
  {
    id: 3,
    name: "Field Survey Report.pdf",
    size: "1.8 MB",
    date: "10 Mar 2026",
    type: "pdf",
    color: "green",
  },
  {
    id: 4,
    name: "Budget Breakdown.xlsx",
    size: "950 KB",
    date: "10 Mar 2026",
    type: "xlsx",
    color: "green",
  },
];

export const suggestedPrompts = [
  "Summarize recent progress",
  "What are the key risks?",
  "Suggest next steps",
  "Draft an update for senior officials",
];

export const risks = [
  {
    id: 1,
    severity: "High",
    title: "Delay in sensor delivery",
    description: "Vendor facing supply chain issues.",
    color: "red",
  },
  {
    id: 2,
    severity: "Medium",
    title: "Permission for field installation",
    description: "Awaiting final approval from local authority.",
    color: "orange",
  },
  {
    id: 3,
    severity: "Low",
    title: "Data consistency issues",
    description: "Some sensors show irregular data.",
    color: "green",
  },
];

export const navItems = [
  { icon: "layoutDashboard", label: "Dashboard", active: false },
  { icon: "fileText", label: "Citizen Submissions", active: false },
  { icon: "brain", label: "AI Analysis", active: false },
  { icon: "layers", label: "Solution & Team Matching", active: false },
  { icon: "folderOpen", label: "Projects", active: true },
  { icon: "graduationCap", label: "Universities & Partners", active: false },
  { icon: "barChart3", label: "Analytics & Reports", active: false },
  { icon: "bookOpen", label: "Resource Centre", active: false },
  { icon: "bell", label: "Notifications", active: false, badge: 3 },
  { icon: "settings", label: "Settings", active: false },
];
