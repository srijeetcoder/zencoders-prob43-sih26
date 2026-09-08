import { useState } from "react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { BarChart3, ChevronDown } from "lucide-react";
import Card from "../ui/Card";
import { rainfallData } from "../../data/mockData";

const subTabs = [
  { id: "rainfall", label: "Rainfall Trend" },
  { id: "incidents", label: "Water Logging Incidents" },
  { id: "population", label: "Population Affected" },
];

export default function DataAnalysis() {
  const [activeSubTab, setActiveSubTab] = useState("rainfall");
  const [timeRange, setTimeRange] = useState("Last 3 Years");

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-wash flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg font-bold text-ink">Data Analysis</h2>
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-paper border border-line rounded-lg px-3 py-1.5 pr-8 text-sm text-ink-2 cursor-pointer hover:border-line-strong transition-colors outline-none"
          >
            <option>Last 3 Years</option>
            <option>Last 5 Years</option>
            <option>Last 10 Years</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3 pointer-events-none" />
        </div>
      </div>

      <div className="flex gap-4 border-b border-line mb-5">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? "text-accent border-accent"
                : "text-ink-3 border-transparent hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-ink mb-4">
        Monthly Rainfall vs Water Logging Incidents (Ward 12)
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "Rainfall (mm)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#6b7280" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "Incidents",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11, fill: "#6b7280" },
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
            />
            <Bar
              yAxisId="left"
              dataKey="rainfall"
              name="Rainfall (mm)"
              fill="#a5f3fc"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="incidents"
              name="Water Logging Incidents"
              stroke="#164e63"
              strokeWidth={2.5}
              dot={{ fill: "#164e63", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
