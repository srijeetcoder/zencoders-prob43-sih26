export type AcademicRole = "STUDENT" | "FACULTY" | "ADMIN";
export const AcademicRole = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  ADMIN: "ADMIN",
} as const;

export interface LiveProblem {
  id: string;
  ticketId: string;
  title: string;
  department: string;
  district: string;
  urgency: "CRITICAL" | "HIGH" | "MODERATE";
  description: string;
  affectedPopulation: string;
  estimatedBudget: string;
  deadline: string;
  status: "OPEN" | "ACCEPTED";
  acceptedByTeam?: string;
  acceptedByStudent?: string;
  domain: "Water & Sanitation" | "Renewable Energy" | "Mining & Geology" | "Infrastructure" | "Agriculture";
}
export const LiveProblem = {};

export interface TeamMember {
  name: string;
  rollNo: string;
  department: string;
  role: string;
}
export const TeamMember = {};

export interface TeamApplication {
  id: string;
  teamName: string;
  problemId: string;
  problemTitle: string;
  domain: string;
  leadStudent: {
    name: string;
    email: string;
    rollNo: string;
    phone: string;
  };
  members: TeamMember[];
  facultyMentor: string;
  facultyEmail: string;
  skills: string[];
  statementOfPurpose: string;
  status: "PENDING_FACULTY" | "APPROVED_FACULTY" | "APPROVED_ADMIN" | "REJECTED";
  facultyNotes?: string;
  adminNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}
export const TeamApplication = {};

export interface BoMItem {
  component: string;
  quantity: number;
  estimatedCost: number;
  purpose: string;
  vendorStandard: string;
}
export const BoMItem = {};

export interface ProblemSolutionPlan {
  id: string;
  teamId: string;
  teamName: string;
  problemId: string;
  problemTitle: string;
  planTitle: string;
  executiveSummary: string;
  hardwareBoM: BoMItem[];
  totalBudgetRequired: number;
  milestones: Array<{
    phase: string;
    duration: string;
    deliverables: string;
  }>;
  prototypeArchitecture: string;
  firmwareOrRepoUrl?: string;
  status: "DRAFT" | "SUBMITTED_FACULTY" | "FACULTY_ENDORSED" | "ADMIN_SANCTIONED" | "DISPATCHED_TO_GOV";
  facultyFeedback?: string;
  adminGrantSanction?: string;
  submittedAt: string;
  updatedAt?: string;
}
export const ProblemSolutionPlan = {};

export interface ResourceItem {
  id: string;
  title: string;
  category: "Technical Standards" | "BoM Catalog" | "Research Paper" | "State Guidelines" | "DPR Template";
  format: "PDF" | "DOCX" | "CSV" | "ZIP";
  fileSize: string;
  description: string;
  downloads: number;
  updatedDate: string;
  tags: string[];
}
export const ResourceItem = {};

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  category: "APPROVAL" | "SYSTEM" | "DEADLINE" | "GRANT";
  priority: "HIGH" | "MEDIUM" | "LOW";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
export const AlertNotification = {};
