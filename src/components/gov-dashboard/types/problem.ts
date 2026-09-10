export type Category =
  | "Infrastructure"
  | "Healthcare"
  | "Environment"
  | "Education"
  | "Agriculture"
  | "Others";

export type Status =
  | "Under Analysis"
  | "Matching Teams"
  | "In Discussion"
  | "Solution Planned"
  | "In Progress"
  | "Resolved";

export type Severity = "Low" | "Medium" | "High";

export interface ProblemLocation {
  area: string;
  city: string;
  state: string;
  distanceKm?: number;
}

export interface ProblemSummary {
  id: string;
  title: string;
  category: Category;
  status: Status;
  severity: Severity;
  location: ProblemLocation;
  submittedAt: string;
  thumbnailUrl: string;
  upvotes: number;
  commentsCount: number;
}

export interface AiAnalysis {
  problemUnderstanding: string;
  peopleAffectedEstimate: string;
  keyIssues: string[];
}

export interface SolutionApproach {
  title: string;
  description: string;
  imageUrl: string;
}

export interface RecommendedTeam {
  name: string;
  department: string;
  logoUrl: string;
}

export interface DiscussionComment {
  author: string;
  postedAt: string; // ISO date string
  message: string;
  likes: number;
}

export interface TimelineStep {
  stage: string;
  date?: string;
  status: "done" | "active" | "pending";
}

export interface SimilarProblem {
  id: string;
  title: string;
  location: string;
  distanceKm: number;
  severity: Severity;
}

export interface ProblemDetail extends ProblemSummary {
  referenceId: string; // e.g. "#JS-2026-1043"
  description: string;
  tags: string[];
  photos: string[];
  aiAnalysis: AiAnalysis;
  solutionApproaches: SolutionApproach[];
  recommendedTeams: RecommendedTeam[];
  discussion: DiscussionComment[];
  timeline: TimelineStep[];
  similarProblems: SimilarProblem[];
}
