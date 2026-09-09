import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type RangeOption = "Last 6 Months" | "Last 3 Months" | "This Month";

interface ProgressStage {
  stage: string;
  count: number;
  color: string;
}

const data: ProgressStage[] = [
  { stage: "Planning", count: 80, color: "#93c5fd" },
  { stage: "In Progress", count: 120, color: "#3b82f6" },
  { stage: "Testing", count: 70, color: "#2dd4bf" },
  { stage: "Completed", count: 50, color: "#94a3b8" },
];

const RANGE_OPTIONS: RangeOption[] = [
  "Last 6 Months",
  "Last 3 Months",
  "This Month",
];

function ProjectProgress() {
  const [range, setRange] = useState<RangeOption>("Last 6 Months");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Project Progress
        </h3>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            {range}
            <svg
              className="h-3.5 w-3.5 text-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-md">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setRange(option);
                    setMenuOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 ${
                    option === range
                      ? "font-medium text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={48}>
            <XAxis
              dataKey="stage"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 13 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProjectProgress;
