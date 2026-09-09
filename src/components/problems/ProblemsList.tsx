import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, MessageCircle, ArrowUp } from "lucide-react";
import type { Category, ProblemSummary, Severity } from "../../types/problem";

// TODO(backend): replace with GET /api/problems?category=&status=&search=&page=
const MOCK_PROBLEMS: ProblemSummary[] = [
  {
    id: "1043",
    title: "Water Logging in Ward 12",
    category: "Infrastructure",
    status: "Under Analysis",
    severity: "High",
    location: { area: "Ward 12", city: "Kolkata", state: "West Bengal", distanceKm: 0 },
    submittedAt: "2026-03-12T10:24:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=300&fit=crop",
    upvotes: 214,
    commentsCount: 3,
  },
  {
    id: "1044",
    title: "Water Logging in Kankurgachi",
    category: "Infrastructure",
    status: "Matching Teams",
    severity: "High",
    location: { area: "Kankurgachi", city: "Kolkata", state: "West Bengal", distanceKm: 1.2 },
    submittedAt: "2026-03-10T09:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=400&h=300&fit=crop",
    upvotes: 98,
    commentsCount: 1,
  },
  {
    id: "1045",
    title: "Drainage Overflow near Phool Bagan",
    category: "Infrastructure",
    status: "Under Analysis",
    severity: "Medium",
    location: { area: "Phool Bagan", city: "Kolkata", state: "West Bengal", distanceKm: 2.6 },
    submittedAt: "2026-03-08T14:30:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
    upvotes: 56,
    commentsCount: 0,
  },
  {
    id: "1046",
    title: "Lack of Primary Healthcare Center",
    category: "Healthcare",
    status: "In Discussion",
    severity: "High",
    location: { area: "Jalpaiguri", city: "Jalpaiguri", state: "West Bengal", distanceKm: 45.1 },
    submittedAt: "2026-03-07T05:00:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
    upvotes: 132,
    commentsCount: 6,
  },
  {
    id: "1047",
    title: "Waste Management in Local Market",
    category: "Environment",
    status: "Solution Planned",
    severity: "Medium",
    location: { area: "Siliguri", city: "Siliguri", state: "West Bengal", distanceKm: 78.3 },
    submittedAt: "2026-03-06T11:15:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&h=300&fit=crop",
    upvotes: 41,
    commentsCount: 2,
  },
  {
    id: "1048",
    title: "Need for Smart Classrooms",
    category: "Education",
    status: "In Progress",
    severity: "Low",
    location: { area: "Howrah", city: "Howrah", state: "West Bengal", distanceKm: 12.4 },
    submittedAt: "2026-03-05T08:45:00Z",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop",
    upvotes: 27,
    commentsCount: 0,
  },
];

const CATEGORY_TABS: Array<Category | "All"> = [
  "All",
  "Infrastructure",
  "Healthcare",
  "Environment",
  "Education",
  "Agriculture",
  "Others",
];

const SEVERITY_STYLES: Record<Severity, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const STATUS_STYLES: Record<string, string> = {
  "Under Analysis": "bg-rose-50 text-rose-600",
  "Matching Teams": "bg-blue-50 text-blue-600",
  "In Discussion": "bg-purple-50 text-purple-600",
  "Solution Planned": "bg-amber-50 text-amber-600",
  "In Progress": "bg-emerald-50 text-emerald-600",
  Resolved: "bg-slate-100 text-slate-600",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function ProblemCard({ problem }: { problem: ProblemSummary }) {
  return (
    <Link
      to={`/explore-solutions/${problem.id}`}
      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <img
        src={problem.thumbnailUrl}
        alt=""
        className="h-24 w-32 shrink-0 rounded-lg object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {problem.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                STATUS_STYLES[problem.status]
              }`}
            >
              {problem.status}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {problem.location.area}, {problem.location.city}
            </span>
            {typeof problem.location.distanceKm === "number" && (
              <span className="shrink-0">
                &middot; {problem.location.distanceKm} km
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3.5 w-3.5" />
              {problem.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {problem.commentsCount}
            </span>
            <span>{timeAgo(problem.submittedAt)}</span>
          </div>

          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              SEVERITY_STYLES[problem.severity]
            }`}
          >
            {problem.severity}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ExploreProblems() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");

  // TODO(backend): once the API supports it, move this filtering server-side
  // via query params instead of filtering the full list client-side.
  const filteredProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter((problem) => {
      const matchesCategory =
        activeCategory === "All" || problem.category === activeCategory;
      const matchesQuery = problem.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Explore Problems
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Browse problems submitted by citizens
          </p>
        </div>
      </div>

      <div className="mt-4 relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-400"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_TABS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-500">
          No problems match this search. Try a different keyword or category.
        </div>
      )}
    </div>
  );
}

export default ExploreProblems;
