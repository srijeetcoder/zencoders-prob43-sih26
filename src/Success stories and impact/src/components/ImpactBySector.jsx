import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { sectorData } from "../data/mockData";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
        <p className="text-[12px] font-semibold text-gray-800">{payload[0].payload.sector}</p>
        <p className="text-[12px] text-gray-500">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function ImpactBySector() {
  const [timeRange, setTimeRange] = useState("Last 1 Year");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900">Impact by Sector</h3>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer outline-none"
          >
            <option>Last 1 Year</option>
            <option>Last 2 Years</option>
            <option>All Time</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3">
        {sectorData.map((item) => (
          <div key={item.sector} className="flex items-center gap-3">
            <span className="text-[12px] text-gray-600 w-[110px] text-right">{item.sector}</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className="text-[12px] font-semibold text-gray-700 w-[35px]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
