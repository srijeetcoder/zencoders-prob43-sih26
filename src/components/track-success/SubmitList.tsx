import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ChevronRight, Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import { SUBMISSIONS, CATEGORY_META, STATUS_META, type Status } from "../data/submissions";
import { citizenApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const FILTER_TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "matched", label: "Matched" },
  { key: "solution_development", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "resolved", label: "Resolved" },
];

export default function MySubmissionsList() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");
  const [allSubmissions, setAllSubmissions] = useState(SUBMISSIONS);

  useEffect(() => {
    let isMounted = true;
    const loadLiveSubmissions = async () => {
      const merged = [...SUBMISSIONS];

      // Check local storage submissions from this session
      try {
        const local = localStorage.getItem("pookar_user_submissions");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              merged.unshift({
                id: item.ticketId || item.id || `SUB-${Date.now()}`,
                psCode: item.ticketId || "JS-2026-LIVE",
                title: item.title || item.rawDescription || "Citizen Reported Bottleneck",
                category: "drainage",
                status: (item.status === "RESOLVED" ? "resolved" : item.status === "LAB_MATCHED" ? "matched" : "submitted") as Status,
                submittedOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Today",
                location: item.district ? `${item.district}, Jharkhand` : "Ranchi, Jharkhand",
                description: item.normalizedText || item.rawDescription || item.text || "Citizen bottleneck logged in state ledger.",
                progressPercent: 25,
                team: "National R&D Matching Pool",
              });
            });
          }
        }
      } catch {}

      // Fetch from public feed API
      try {
        const liveFeed = await citizenApi.getPublicFeed();
        if (Array.isArray(liveFeed) && liveFeed.length > 0) {
          liveFeed.forEach((item) => {
            if (!merged.some((m) => m.id === item.ticketId || m.psCode === item.ticketId)) {
              merged.push({
                id: item.ticketId || item.id,
                psCode: item.ticketId,
                title: item.title,
                category: item.domainTags?.[0]?.toLowerCase().includes("water") ? "drainage" : item.domainTags?.[0]?.toLowerCase().includes("fire") ? "fire" : "garbage",
                status: (item.status === "RESOLVED" ? "resolved" : item.status === "LAB_MATCHED" || item.status === "BLUEPRINT_GENERATED" ? "matched" : "submitted") as Status,
                submittedOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
                location: `${item.district}, Jharkhand`,
                description: item.description,
                progressPercent: item.status === "LAB_MATCHED" ? 60 : 30,
                team: "Assigned Institutional Desk",
              });
            }
          });
        }
      } catch {}

      if (isMounted) {
        setAllSubmissions(merged);
      }
    };

    loadLiveSubmissions();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filtered = allSubmissions.filter((s) => {
    const matchesTab = activeTab === "all" || s.status === activeTab;
    const matchesQuery =
      query.trim().length === 0 ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.location.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
      <div className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Submissions</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track the problems you've reported and their progress toward a solution.
            </p>
          </div>
          <Link
            to="/problem"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Report a Problem
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search your submissions..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px">
          {FILTER_TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-600">No submissions match this filter.</p>
              <p className="mt-1 text-sm text-slate-400">Try a different tab or search term.</p>
            </div>
          )}

          {filtered.map((submission) => {
            const category = CATEGORY_META[submission.category];
            const status = STATUS_META[submission.status];
            const Icon = category.icon;

            return (
              <Link
                key={submission.id}
                to={`/trackprogress/${submission.id}`}
                className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-shadow hover:shadow-sm sm:flex-row sm:items-start"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${category.bg}`}>
                  <Icon className={`h-6 w-6 ${category.fg}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                      {submission.psCode}
                    </span>
                    <span className="text-xs text-slate-400">#{submission.id}</span>
                  </div>

                  <h3 className="mt-1.5 truncate text-base font-bold text-slate-900 group-hover:text-blue-700">
                    {submission.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{submission.location}</span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{submission.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>Submitted {submission.submittedOn}</span>
                    {submission.team && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>Matched with {submission.team}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.fg}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                  <ChevronRight className="hidden h-4 w-4 text-slate-300 group-hover:text-blue-500 sm:block" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
