import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { sectorData } from "../data/mockData";

export default function ImpactBySector() {
  const [timeRange, setTimeRange] = useState("Last 1 Year");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#10245e]">Impact by Sector</h3>
          <p className="mt-0.5 text-xs text-slate-500">Distribution across key initiatives</p>
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-medium text-slate-600 outline-none focus:border-emerald-400"
          >
            <option>Last 1 Year</option>
            <option>Last 2 Years</option>
            <option>All Time</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="space-y-4">
        {sectorData.map((item) => (
          <div key={item.sector} className="flex items-center gap-3">
            <span className="w-28 text-right text-xs font-medium text-slate-600">{item.sector}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <span className="w-10 text-xs font-semibold text-emerald-600">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
