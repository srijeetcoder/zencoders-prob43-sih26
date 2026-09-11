import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { MapPin } from "lucide-react";
import { fetchAllRealSubmissions } from "../../../../services/realSubmissions";

const areaColors = [
  "#153157",
  "#1e4273",
  "#27518c",
  "#0a6ab5",
  "#1683d0",
  "#0d9488",
  "#99f6e4",
];

function AreaWiseProblems() {
  const [areaData, setAreaData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchAllRealSubmissions()
      .then((feed) => {
        if (isMounted && Array.isArray(feed) && feed.length > 0) {
          const counts: Record<string, number> = {};
          feed.forEach((item) => {
            const dist = item.location?.city || "Ranchi";
            counts[dist] = (counts[dist] || 0) + 1;
          });
          const mapped = Object.entries(counts).map(([name, value]) => ({ name, value }));
          setAreaData(mapped);
        } else if (isMounted) {
          setAreaData([]);
        }
        if (isMounted) setLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setAreaData([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-navy-900">
            Area-Wise Problem Distribution
          </h2>

<p className="mt-0.5 text-sm text-slate-500">
              Where problems are being reported across Jharkhand ·
              क्षेत्रवार समस्याएँ
            </p>
        </div>

        {areaData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <MapPin size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No Area Data to Show</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No regional problem submissions recorded yet. District distributions will update in real-time as grievances arrive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {areaData.map((entry, index) => (
                      <Cell key={entry.name} fill={areaColors[index % areaColors.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 13,
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={9}
                    formatter={(value) => (
                      <span className="text-sm text-slate-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-3">
              {areaData.map((area, index) => (
                <div key={area.name} className="flex items-center gap-3 text-sm">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: areaColors[index % areaColors.length] }}
                  />

                  <span className="w-28 text-slate-600">{area.name}</span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, area.value * 10)}%`,
                        backgroundColor: areaColors[index % areaColors.length],
                      }}
                    />
                  </div>

                  <span className="w-12 text-right font-semibold text-navy-800">
                    {area.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AreaWiseProblems;