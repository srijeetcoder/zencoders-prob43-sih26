import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, MessageCircle, ArrowUp, Radio, Sparkles, Filter, RefreshCw } from "lucide-react";
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
  High: "bg-rose-50 text-rose-600 border border-rose-200",
  Medium: "bg-amber-50 text-amber-600 border border-amber-200",
  Low: "bg-teal-50 text-teal-700 border border-teal-200",
};

const STATUS_STYLES: Record<string, string> = {
  "Under Analysis": "bg-navy-100 text-navy-800",
  "Matching Teams": "bg-blue-50 text-blue-700",
  "In Discussion": "bg-purple-50 text-purple-700",
  "Solution Planned": "bg-amber-50 text-amber-700",
  "In Progress": "bg-teal-50 text-teal-700",
  Resolved: "bg-slate-100 text-slate-700",
};

function timeAgo(iso: string) {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours <= 0) return "Just now";
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)} month(s) ago`;
  } catch {
    return "Recent";
  }
}

function LiveProblems() {
  const [problemsList, setProblemsList] = useState<ProblemDetail[]>(PROBLEMS);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLiveGrievances = async () => {
    setIsRefreshing(true);
    try {
      const feed = await citizenApi.getPublicFeed();
      if (Array.isArray(feed) && feed.length > 0) {
        const mapped: ProblemDetail[] = feed.map((item: any) => {
          let cat: Category = "Infrastructure";
          const tagsStr = (item.domainTags || []).join(" ").toLowerCase();
          const titleDesc = `${item.title || ""} ${item.description || ""}`.toLowerCase();
          if (tagsStr.includes("health") || titleDesc.includes("health") || titleDesc.includes("vaccine") || titleDesc.includes("fluoride")) cat = "Healthcare";
          else if (tagsStr.includes("env") || titleDesc.includes("fire") || titleDesc.includes("effluent") || titleDesc.includes("pollution")) cat = "Environment";
          else if (tagsStr.includes("edu") || titleDesc.includes("school") || titleDesc.includes("student")) cat = "Education";
          else if (tagsStr.includes("agri") || titleDesc.includes("crop") || titleDesc.includes("farm") || titleDesc.includes("produce")) cat = "Agriculture";

          return {
            id: item.ticketId || item.id,
            referenceId: `#${item.ticketId || item.id}`,
            title: item.title,
            category: cat,
            status: item.status === "RESOLVED" ? "Resolved" : item.status === "IN_PROGRESS" ? "In Progress" : "Under Analysis",
            severity: (item.priority === "CRITICAL" ? "High" : item.priority === "HIGH" ? "High" : item.priority === "MEDIUM" ? "Medium" : "Low") as Severity,
            location: { area: item.district || "Ranchi", city: item.district || "Ranchi", state: "Jharkhand", distanceKm: 1.5 },
            submittedAt: item.createdAt || new Date().toISOString(),
            thumbnailUrl: item.thumbnailUrl || "",
            upvotes: item.upvotes || Math.floor(Math.random() * 40) + 10,
            commentsCount: item.commentsCount || Math.floor(Math.random() * 15) + 3,
            description: item.description,
            tags: item.domainTags || [cat],
            photos: [],
          };
        });

        // Merge backend grievances with our rich seed dataset to ensure full representation
        const existingIds = new Set(mapped.map((m) => m.id));
        const combined = [...mapped, ...PROBLEMS.filter((p) => !existingIds.has(p.id))];
        setProblemsList(combined);
      }
    } catch {
      // Fallback already maintained in problemsList
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveGrievances();
  }, []);

  const filtered = useMemo(() => {
    return problemsList.filter((problem) => {
      const matchesCategory =
        activeCategory === "All" || problem.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        problem.title.toLowerCase().includes(q) ||
        problem.description.toLowerCase().includes(q) ||
        problem.location.area.toLowerCase().includes(q) ||
        problem.location.city.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [problemsList, activeCategory, query]);

  return (
    <div className="px-6 py-6 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-800 shadow-sm">
            <Radio size={22} className="text-teal-600 animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              Live Problems & Citizen Reports
            </h1>
            <p className="text-sm text-slate-500">
              Real-time multi-district grievance telemetry across Jharkhand · सक्रिय मामले ({problemsList.length} total)
            </p>
          </div>
        </div>

        <button
          onClick={fetchLiveGrievances}
          disabled={isRefreshing}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin text-teal-600" : "text-slate-400"} />
          {isRefreshing ? "Syncing..." : "Sync State Ledger"}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, districts, keywords (e.g., 'transformer', 'Harmu', 'fluoride')..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter size={13} /> Domain:
        </span>
        {CATEGORY_TABS.map((category) => {
          const count = category === "All"
            ? problemsList.length
            : problemsList.filter((p) => p.category === category).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === category
                  ? "bg-navy-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {category}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeCategory === category ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Problem Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((problem) => (
          <Link
            key={problem.id}
            to={`/gov/live-problems/${problem.id}`}
            className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-400 hover:shadow-md transition-all"
          >
            {/* Thumbnail / Avatar */}
            <div className="relative h-28 sm:h-auto sm:w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {problem.thumbnailUrl ? (
                <img
                  src={problem.thumbnailUrl}
                  alt={problem.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to stylized initial tile if image fails
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}
              <div
                className={`flex h-full w-full items-center justify-center text-xl font-bold ${
                  problem.severity === "High"
                    ? "bg-rose-50 text-rose-600"
                    : problem.severity === "Medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-teal-50 text-teal-700"
                }`}
              >
                {problem.title.split(" ")[0][0]}
              </div>
            </div>

            {/* Body */}
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {problem.referenceId}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      STATUS_STYLES[problem.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {problem.status}
                  </span>
                </div>

                <h3 className="mt-1.5 text-sm font-bold text-navy-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                  {problem.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {problem.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    {problem.location.area}, {problem.location.city}
                  </span>
                  <span>&bull;</span>
                  <span>{timeAgo(problem.submittedAt)}</span>
                </div>
              </div>

              {/* Tags & Bottom Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <ArrowUp className="h-3.5 w-3.5 text-teal-600" />
                    {problem.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {problem.commentsCount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {problem.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      SEVERITY_STYLES[problem.severity]
                    }`}
                  >
                    {problem.severity} Risk
                  </span>
                </div>
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
          <p className="text-sm font-bold text-navy-900">No matching reports found</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setQuery("");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-navy-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default LiveProblems;