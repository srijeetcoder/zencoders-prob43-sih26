import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Sparkles, ShieldAlert, ArrowUpRight } from "lucide-react";
import GoogleHazardMap from "../maps/GoogleHazardMap";
import { citizenApi } from "../../services/api";
import { fetchAllRealSubmissions } from "../../services/realSubmissions";

const DOMAIN_THUMBNAILS: Record<string, string> = {
  "Civil Infrastructure": "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=400&q=80",
  "Water & Sanitation": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
  "Renewable Energy": "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80",
  "Mining & Environment": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80",
  "Default": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
};

function ProblemsNearYou() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    citizenApi
      .getPublicFeed()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProblems(data.slice(0, 4));
        } else {
          // Fallback to real user submissions
          fetchAllRealSubmissions().then((subs) => {
            if (isMounted && subs && subs.length > 0) {
              const mapped = subs.slice(0, 4).map((s, idx) => ({
                id: s.id,
                ticketId: s.referenceId?.replace("#", "") || s.id,
                title: s.title,
                district: s.location?.city || "Ranchi",
                priority: s.severity === "High" ? "CRITICAL" : "HIGH",
                status: s.status,
                domain: s.domain || "Civil Infrastructure",
                image: s.photoUrl || DOMAIN_THUMBNAILS[s.domain || ""] || DOMAIN_THUMBNAILS["Default"],
                createdAt: s.submittedAt || new Date().toISOString(),
              }));
              setProblems(mapped);
            }
          });
        }
      })
      .catch(() => {
        fetchAllRealSubmissions().then((subs) => {
          if (isMounted && subs && subs.length > 0) {
            const mapped = subs.slice(0, 4).map((s, idx) => ({
              id: s.id,
              ticketId: s.referenceId?.replace("#", "") || s.id,
              title: s.title,
              district: s.location?.city || "Ranchi",
              priority: s.severity === "High" ? "CRITICAL" : "HIGH",
              status: s.status,
              domain: s.domain || "Civil Infrastructure",
              image: s.photoUrl || DOMAIN_THUMBNAILS[s.domain || ""] || DOMAIN_THUMBNAILS["Default"],
              createdAt: s.submittedAt || new Date().toISOString(),
            }));
            setProblems(mapped);
          }
        });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#10245e]">
              District Hazard Grid & Problems Near You
            </h2>
            <span className="rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold px-2.5 py-0.5 border border-rose-200">
              Live Field Ledger
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Real-time geospatial vulnerability telemetry and ground citizen submissions across Jharkhand
          </p>
        </div>

        <Link
          to="/explore-problems"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
        >
          <span>View Problem Ledger</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left: Interactive Hazard Map / Vector Visualizer */}
        <div className="lg:col-span-7">
          <GoogleHazardMap height="410px" showFilters={false} />
        </div>

        {/* Right: Live Problems List */}
        <div className="lg:col-span-5 space-y-3.5">
          {problems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#10245e]">No Submissions to Show</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                No active civic bottlenecks currently reported. As citizens submit problems, they will appear here in real time.
              </p>
            </div>
          ) : (
            problems.map((problem, idx) => (
              <Link
                to={`/trackprogress/${problem.ticketId || problem.id}`}
                key={problem.id || problem.ticketId || idx}
                className="
                  group
                  flex items-center gap-3.5
                  rounded-2xl
                  border border-slate-200/90
                  bg-white
                  p-3.5
                  shadow-xs
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:shadow-md
                  hover:border-emerald-300
                "
              >
                {/* Thumbnail Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                  <img
                    src={problem.image || DOMAIN_THUMBNAILS["Default"]}
                    alt={problem.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DOMAIN_THUMBNAILS["Default"];
                    }}
                  />
                  {problem.priority === "CRITICAL" && (
                    <span className="absolute top-1 right-1 rounded-sm bg-rose-600 px-1 py-0.2 text-[8px] font-bold text-white uppercase tracking-wider">
                      CRITICAL
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {problem.ticketId || "JS-2026"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {problem.status ? problem.status.replace(/_/g, " ") : "Active Triage"}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-[#10245e] group-hover:text-emerald-700 transition line-clamp-1">
                    {problem.title}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">{problem.district}, JH</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      <span>
                        {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ProblemsNearYou;


