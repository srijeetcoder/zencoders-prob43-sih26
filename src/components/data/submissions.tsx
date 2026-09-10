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
  Submission["category"],
  { icon: typeof Droplet; bg: string; fg: string }
> = {
  water: { icon: Droplet, bg: "bg-blue-50", fg: "text-blue-600" },
  waste: { icon: Trash2, bg: "bg-amber-50", fg: "text-amber-600" },
  power: { icon: Zap, bg: "bg-yellow-50", fg: "text-yellow-600" },
  infra: { icon: Construction, bg: "bg-orange-50", fg: "text-orange-600" },
  environment: { icon: TreePine, bg: "bg-green-50", fg: "text-green-600" },
  safety: { icon: ShieldAlert, bg: "bg-red-50", fg: "text-red-600" },
};

export const STATUS_META: Record<Status, { label: string; bg: string; fg: string; dot: string }> = {
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

// A one-line, plain-English translation of each status, used on the detail page.
export const STATUS_SIMPLE: Record<Status, string> = {
  submitted: "We've received your report and it's waiting to be looked at.",
  ai_analysis: "We're reading through your report to understand the problem.",
  matched: "A team with the right skills has picked up your problem.",
  solution_development: "That team is now building a solution for your problem.",
  review: "A first solution is ready and is being checked over.",
  implementation: "The solution is being put in place on the ground.",
  resolved: "This problem has been fixed.",
};

// ---------------------------------------------------------------------------
// Sample data — replace with a real API call
// ---------------------------------------------------------------------------

export const SUBMISSIONS: Submission[] = [
  {
    id: "JS-2026-1043",
    psCode: "PS 43",
    title: "Water Logging in Ward 12",
    category: "water",
    location: "Ward 12, Kolkata, West Bengal",
    description:
      "Frequent water logging during monsoon season causing traffic disruption, property damage, and public health risks.",
    status: "solution_development",
    submittedOn: "12 Mar 2026",
    team: "IIT Kharagpur",
    teamExpertise: "Urban drainage systems, IoT monitoring, and sustainable infrastructure.",
    milestoneDates: {
      ai_analysis: "13 Mar 2026",
      matched: "15 Mar 2026",
    },
    lastUpdated: "20 Mar 2026, 11:30 AM",
    updates: [
      {
        date: "20 Mar 2026",
        time: "11:30 AM",
        title: "Prototype Under Development",
        description:
          "The matched team (IIT Kharagpur) is currently developing a prototype solution for your reported problem. Initial analysis and map data have been completed.",
        completed: true,
      },
      {
        date: "15 Mar 2026",
        time: "04:20 PM",
        title: "Matched with IIT Kharagpur",
        description: "Your problem has been matched with a suitable team.",
        completed: true,
      },
      {
        date: "13 Mar 2026",
        time: "10:15 AM",
        title: "AI Analysis Completed",
        description: "Our AI has analyzed and categorized your submission.",
        completed: true,
      },
      {
        date: "12 Mar 2026",
        time: "10:24 AM",
        title: "Problem Submitted",
        description: "Your submission has been received successfully.",
        completed: true,
      },
    ],
  },
  {
    id: "JS-2026-0981",
    psCode: "PS 37",
    title: "Irregular Garbage Collection in Sector 9",
    category: "waste",
    location: "Sector 9, Bidhannagar, West Bengal",
    description:
      "Garbage collection has been skipped for over a week, leading to overflow and foul smell across the residential block.",
    status: "matched",
    submittedOn: "28 Feb 2026",
    team: "Jadavpur University",
    teamExpertise: "Municipal waste logistics and route optimization.",
  },
  {
    id: "JS-2026-0902",
    psCode: "PS 29",
    title: "Frequent Power Outages Near Salt Lake",
    category: "power",
    location: "Salt Lake, Kolkata, West Bengal",
    description:
      "Unscheduled power cuts of 3-4 hours daily over the last month, affecting small businesses and households.",
    status: "ai_analysis",
    submittedOn: "19 Feb 2026",
  },
  {
    id: "JS-2026-0844",
    psCode: "PS 21",
    title: "Damaged Footpath Near Gariahat Market",
    category: "infra",
    location: "Gariahat, Kolkata, West Bengal",
    description:
      "Broken pavement tiles and exposed rebar create a tripping hazard for pedestrians, especially the elderly.",
    status: "review",
    submittedOn: "3 Feb 2026",
    team: "IIEST Shibpur",
    teamExpertise: "Structural repair and pedestrian safety design.",
  },
  {
    id: "JS-2026-0776",
    psCode: "PS 15",
    title: "Tree Cover Loss in Rabindra Sarobar Buffer Zone",
    category: "environment",
    location: "Rabindra Sarobar, Kolkata, West Bengal",
    description:
      "Unauthorized felling of trees in the buffer zone is reducing green cover and disturbing local bird habitats.",
    status: "resolved",
    submittedOn: "22 Jan 2026",
    team: "Bose Institute",
    teamExpertise: "Urban ecology and habitat restoration.",
  },
  {
    id: "JS-2026-0703",
    psCode: "PS 08",
    title: "Missing Streetlights on School Route",
    category: "safety",
    location: "Behala, Kolkata, West Bengal",
    description:
      "A 400m stretch near the primary school has no functioning streetlights, raising safety concerns for children.",
    status: "submitted",
    submittedOn: "10 Jan 2026",
  },
];;
