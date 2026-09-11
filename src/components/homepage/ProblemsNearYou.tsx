import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import GoogleHazardMap from "../maps/GoogleHazardMap";
import { citizenApi, type ProblemFeedItem } from "../../services/api";

function ProblemsNearYou() {
  const [problems, setProblems] = useState<ProblemFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    citizenApi
      .getPublicFeed()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProblems(data.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#10245e]">
            District Hazard Grid & Problems Near You
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live telemetry & reported bottlenecks across Jharkhand districts
          </p>
        </div>

        <Link
          to="/explore-problems"
          className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <div>
          <GoogleHazardMap height="360px" showFilters={false} />
        </div>

        <div className="space-y-3">
          {problems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#10245e]">No Data to Show</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                No active civic bottlenecks currently reported. As citizens submit problems, they will appear here in real time.
              </p>
            </div>
          ) : problems.map((problem) => (
              <Link
              to={`/trackprogress/${problem.ticketId || problem.id}`}
              key={problem.id || problem.ticketId}
              className="
                block
                rounded-2xl
                border border-slate-200
                bg-white
                p-5
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                hover:border-emerald-300
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {problem.ticketId || "JS-2026"}
                    </span>
                    {problem.priority === "CRITICAL" && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#10245e] line-clamp-1">
                    {problem.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={15} className="text-emerald-600 shrink-0" />
                    <span>{problem.district}, Jharkhand</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>
                      {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : "Active Ledger"}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  {problem.status ? problem.status.replace(/_/g, " ") : "Active Triage"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemsNearYou;

