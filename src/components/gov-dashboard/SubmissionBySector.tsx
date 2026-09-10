import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { governmentApi, type SectorItem } from "../../services/api";

const DEFAULT_SECTORS: SectorItem[] = [
  { name: "Water & Urban Drainage", count: 48, percentage: 33.8, status: "HIGH_ATTENTION", color: "#0284c7" },
  { name: "Mining Safety & Geo-Hazards", count: 32, percentage: 22.5, status: "CRITICAL", color: "#ea580c" },
  { name: "Rural Health & Cold Chain", count: 26, percentage: 18.3, status: "MODERATE", color: "#16a34a" },
  { name: "Renewable Microgrids & Power", count: 21, percentage: 14.8, status: "NORMAL", color: "#eab308" },
  { name: "Agri-Forestry & Livelihood", count: 15, percentage: 10.6, status: "STABLE", color: "#8b5cf6" },
];

function SubmissionsBySector() {
  const [sectors, setSectors] = useState<SectorItem[]>(DEFAULT_SECTORS);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getSectors().then((res) => {
      if (isMounted && res && res.length > 0) {
        setSectors(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalCount = sectors.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Problem Submissions by Sector
        </h2>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          Live State Intake
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative h-[220px] w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectors}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
              >
                {sectors.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color || "#0284c7"}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900">
              {totalCount}
            </span>

            <span className="text-xs text-slate-500">
              Total Intake
            </span>
          </div>
        </div>

        <div className="mr-4 flex flex-col gap-2.5">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: sector.color || "#0284c7",
                }}
              />

              <span className="w-36 truncate text-slate-600">
                {sector.name}
              </span>

              <span className="font-semibold text-slate-800">
                {sector.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubmissionsBySector;

