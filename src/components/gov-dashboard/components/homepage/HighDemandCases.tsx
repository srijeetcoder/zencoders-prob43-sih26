import { useState, useEffect } from "react";
import { ArrowUp, MapPin, Flame, Inbox } from "lucide-react";
import { citizenApi, type ProblemFeedItem } from "../../../../services/api";
import { fetchAllRealSubmissions } from "../../../../services/realSubmissions";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-rose-50 text-rose-600 border border-rose-200",
  Open: "bg-rose-50 text-rose-600 border border-rose-200",
  "Under Analysis": "bg-navy-100 text-navy-700",
  LAB_MATCHED: "bg-navy-100 text-navy-700",
  BLUEPRINT_GENERATED: "bg-indigo-100 text-indigo-700",
  IN_REVIEW: "bg-amber-50 text-amber-600 border border-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

function HighDemandCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchAllRealSubmissions()
      .then((data) => {
        if (isMounted) {
          const mapped = data.map((d) => ({
            id: d.id,
            ticketId: d.referenceId,
            title: d.title,
            description: d.description,
            district: d.location?.city || "Ranchi",
            domainTags: d.tags || ["Civil Infrastructure"],
            priority: d.severity === "High" ? "CRITICAL" : "HIGH",
            status: d.status,
            createdAt: d.submittedAt,
            upvotes: d.upvotes || 1,
            commentsCount: d.commentsCount || 0,
          }));
          setCases(mapped);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Flame size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-900">
              High-Demand Cases
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Problems the community is talking about most · सबसे अधिक वोट वाले मामले
            </p>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <Inbox size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No Data to Show</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No citizen community cases registered yet on the state ledger. New submissions will populate here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {cases.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-navy-900">
                    {item.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {item.district}
                    </span>

                    <span className="flex items-center gap-1 font-medium text-navy-600">
                      <ArrowUp size={14} />
                      {item.upvotes || 0} votes
                    </span>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[item.status] || "bg-slate-100 text-slate-600"}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HighDemandCases;