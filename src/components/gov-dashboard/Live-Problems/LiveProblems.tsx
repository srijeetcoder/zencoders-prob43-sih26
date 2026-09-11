import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, MessageCircle, ArrowUp, Radio, Sparkles } from "lucide-react";
import type { Category, Severity, ProblemDetail } from "../types/problem";
import { PROBLEMS } from "./mockData";
import { citizenApi } from "../../../services/api";

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
  Low: "bg-teal-50 text-teal-600",
};

const STATUS_STYLES: Record<string, string> = {
  "Under Analysis": "bg-navy-100 text-navy-700",
  "Matching Teams": "bg-blue-50 text-blue-600",
  "In Discussion": "bg-purple-50 text-purple-600",
  "Solution Planned": "bg-amber-50 text-amber-600",
  "In Progress": "bg-teal-50 text-teal-700",
  Resolved: "bg-slate-100 text-slate-600",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} month(s) ago`;
}

function LiveProblems() {
  const [problemsList, setProblemsList] = useState<ProblemDetail[]>(PROBLEMS);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    citizenApi.getPublicFeed().then((feed) => {
      if (Array.isArray(feed) && feed.length > 0) {
        const mapped: ProblemDetail[] = feed.map((item: any) => ({
          id: item.ticketId || item.id,
          referenceId: `#${item.ticketId || item.id}`,
          title: item.title,
          category: "Infrastructure",
          status: item.status === "RESOLVED" ? "Resolved" : "Under Analysis",
          severity: (item.priority === "CRITICAL" ? "High" : item.priority === "HIGH" ? "Medium" : "Low") as Severity,
          location: { area: item.district || "Ranchi", city: item.district || "Ranchi", state: "Jharkhand", distanceKm: 0.5 },
          submittedAt: item.createdAt || new Date().toISOString(),
          thumbnailUrl: "",
          upvotes: 0,
          commentsCount: 0,
          description: item.description,
          tags: item.domainTags || [],
          photos: [],
        }));
        setProblemsList(mapped);
      } else {
        setProblemsList([]);
      }
    }).catch(() => setProblemsList([]));
  }, []);

  const filtered = useMemo(() => {
    return problemsList.filter((problem) => {
      const matchesCategory =
        activeCategory === "All" || problem.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        problem.title.toLowerCase().includes(q) ||
        problem.location.area.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [problemsList, activeCategory, query]);

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
          <Radio size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Live Problems
          </h1>
          <p className="text-sm text-slate-500">
            Real-time community reports · सक्रिय मामले
          </p>
        </div>
      </div>

      <div className="mt-5 relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems or areas..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-400"
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
                ? "bg-navy-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filtered.map((problem) => (
          <Link
            key={problem.id}
            to={`/gov/live-problems/${problem.id}`}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                problem.severity === "High"
                  ? "bg-rose-50 text-rose-600"
                  : problem.severity === "Medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-teal-50 text-teal-600"
              }`}
            >
              {problem.title.split(" ")[0][0]}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-navy-900">
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

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {problem.location.area}, {problem.location.city}
                  </span>
                  <span>{timeAgo(problem.submittedAt)}</span>
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
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-navy-900">No Data to Show</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            All live district issues reported by citizens on the state ledger will appear here in real time.
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveProblems;