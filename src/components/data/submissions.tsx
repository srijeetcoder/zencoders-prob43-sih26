import { Droplet, Trash2, Zap, Construction, TreePine, ShieldAlert } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Status =
  | "submitted"
  | "ai_analysis"
  | "matched"
  | "solution_development"
  | "review"
  | "implementation"
  | "resolved";

// A single entry in a submission's progress log. Newest first.
export interface UpdateEntry {
  date: string;
  time?: string;
  title: string;
  description: string;
  completed?: boolean;
}

export interface Submission {
  id: string;
  psCode: string;
  title: string;
  category: "water" | "waste" | "power" | "infra" | "environment" | "safety";
  location: string;
  description: string;
  status: Status;
  submittedOn: string;
  team?: string;
  teamExpertise?: string;
  // Date each step of STEP_ORDER (in OverallProgress) was reached, keyed by Status.
  // "submitted" isn't included here since that date is just submittedOn.
  milestoneDates?: Partial<Record<Status, string>>;
  // Shown at the top-right of the Overall Progress card.
  lastUpdated?: string;
  // Feeds both the Latest Update banner and the Progress Timeline, newest first.
  updates?: UpdateEntry[];
}

// ---------------------------------------------------------------------------
// Presentation config
// ---------------------------------------------------------------------------

export const CATEGORY_META: Record<
  string,
  { icon: typeof Droplet; bg: string; fg: string }
> = {
  water: { icon: Droplet, bg: "bg-blue-50", fg: "text-blue-600" },
  drainage: { icon: Droplet, bg: "bg-blue-50", fg: "text-blue-600" },
  waste: { icon: Trash2, bg: "bg-amber-50", fg: "text-amber-600" },
  garbage: { icon: Trash2, bg: "bg-amber-50", fg: "text-amber-600" },
  sanitation: { icon: Trash2, bg: "bg-emerald-50", fg: "text-emerald-600" },
  power: { icon: Zap, bg: "bg-yellow-50", fg: "text-yellow-600" },
  infra: { icon: Construction, bg: "bg-orange-50", fg: "text-orange-600" },
  roads: { icon: Construction, bg: "bg-orange-50", fg: "text-orange-600" },
  environment: { icon: TreePine, bg: "bg-green-50", fg: "text-green-600" },
  safety: { icon: ShieldAlert, bg: "bg-red-50", fg: "text-red-600" },
};

export function getCategoryMeta(cat?: string) {
  if (!cat) return CATEGORY_META.infra;
  const key = cat.toLowerCase().trim();
  return CATEGORY_META[key] || CATEGORY_META.water;
}

export const STATUS_META: Record<string, { label: string; bg: string; fg: string; dot: string }> = {
  submitted: { label: "Submitted", bg: "bg-slate-100", fg: "text-slate-600", dot: "bg-slate-400" },
  ai_analysis: { label: "AI Analysis", bg: "bg-slate-100", fg: "text-slate-600", dot: "bg-slate-400" },
  matched: { label: "Matched with Team", bg: "bg-indigo-50", fg: "text-indigo-600", dot: "bg-indigo-500" },
  solution_development: {
    label: "Under Solution Development",
    bg: "bg-green-50",
    fg: "text-green-700",
    dot: "bg-green-600",
  },
  review: { label: "Review & Feedback", bg: "bg-amber-50", fg: "text-amber-700", dot: "bg-amber-500" },
  implementation: { label: "Implementation", bg: "bg-purple-50", fg: "text-purple-700", dot: "bg-purple-500" },
  resolved: { label: "Resolved", bg: "bg-emerald-50", fg: "text-emerald-700", dot: "bg-emerald-600" },
};

export function getStatusMeta(stat?: string) {
  if (!stat) return STATUS_META.submitted;
  const key = stat.toLowerCase().trim();
  return STATUS_META[key] || STATUS_META.submitted;
}

// A one-line, plain-English translation of each status, used on the detail page.
export const STATUS_SIMPLE: Record<string, string> = {
  submitted: "We've received your report and it's waiting to be looked at.",
  ai_analysis: "We're reading through your report to understand the problem.",
  matched: "A team with the right skills has picked up your problem.",
  solution_development: "That team is now building a solution for your problem.",
  review: "A first solution is ready and is being checked over.",
  implementation: "The solution is being put in place on the ground.",
  resolved: "This problem has been fixed.",
};

// ---------------------------------------------------------------------------
// Clean initial submissions - live problems populated from database and user session
// ---------------------------------------------------------------------------
export const SUBMISSIONS: Submission[] = [];

