import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, MessageCircle, ArrowUp, Sparkles, AlertCircle } from "lucide-react";
import { citizenApi, type ProblemFeedItem } from "../../services/api";

const CATEGORY_TABS = [
  "All",
  "Civic Infrastructure",
  "Water & Drainage",
  "Mining & Environment",
  "Rural Healthcare",
  "Renewable Energy",
];

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: "bg-rose-50 text-rose-600 border border-rose-200",
  HIGH: "bg-amber-50 text-amber-600 border border-amber-200",
  MEDIUM: "bg-blue-50 text-blue-600 border border-blue-200",
  STANDARD: "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE_TRIAGE: "bg-blue-50 text-blue-700",
  LAB_MATCHED: "bg-purple-50 text-purple-700",
  BLUEPRINT_GENERATED: "bg-emerald-50 text-emerald-700",
  IN_REVIEW: "bg-amber-50 text-amber-700",
};

function ProblemCard({ item }: { item: ProblemFeedItem }) {
  return (
    <Link
      to={`/explore-solutions/smart-drainage`}
      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-emerald-600">
            {item.ticketId}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                STATUS_STYLES[item.status] || "bg-slate-100 text-slate-700"
              }`}
            >
              {item.status.replace(/_/g, " ")}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                SEVERITY_STYLES[item.priority] || "bg-slate-100 text-slate-600"
              }`}
            >
              {item.priority}
            </span>
          </div>
        </div>

        <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2">
          {item.title}
        </h3>

        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.domainTags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{item.district}, Jharkhand</span>
          <span className="text-slate-400">&bull; {item.dialect}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
            {item.upvotes}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ExploreProblems() {
  const [problems, setProblems] = useState<ProblemFeedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    citizenApi.getPublicFeed().then((data) => {
      if (isMounted) {
        setProblems(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const tagsString = (problem.domainTags || []).join(" ").toLowerCase();
      const matchesCategory =
        activeCategory === "All" ||
        tagsString.includes(activeCategory.toLowerCase()) ||
        problem.title.toLowerCase().includes(activeCategory.toLowerCase());

      const matchesQuery =
        problem.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        problem.description.toLowerCase().includes(query.trim().toLowerCase()) ||
        problem.district.toLowerCase().includes(query.trim().toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [problems, activeCategory, query]);

  return (
    <div className="px-6 py-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Explore Community Challenges
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> Live Public Feed
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            Real-time multi-lingual grievances ingested, normalized, and triaged across 24 Jharkhand districts
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
          placeholder="Search by keyword, district (e.g. Ranchi, Dhanbad)..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_TABS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === category
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} item={problem} />
        ))}
      </div>

      {filteredProblems.length === 0 && !loading && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-500 bg-white">
          <AlertCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="font-bold text-slate-800">No Data to Show</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No active civic problems recorded yet in the ledger. When citizens report issues, they will appear here in real time.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExploreProblems;
