import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { governmentApi, type SectorItem } from "../../../../services/api";

function CasesByDomain() {
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getSectors()
      .then((data) => {
        if (isMounted) {
          setSectors(Array.isArray(data) ? data : []);
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
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">
              Cases Ranked by Domain
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              How reported problems are distributed across sectors · क्षेत्र के अनुसार मामले
            </p>
          </div>
        </div>

        {sectors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No Domain Data to Show</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No sector distribution available yet. Problems submitted to the state ledger will be categorized and visualized here in real-time.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectors} barSize={44}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 13 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={36}
                />

                <Tooltip
                  cursor={{ fill: "rgba(21, 49, 87, 0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                />

                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {sectors.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color || (index === 0 ? "#0d9488" : "#153157")}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default CasesByDomain;