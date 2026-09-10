import { AlertTriangle, ArrowRight } from "lucide-react";
import { risks } from "../../../data/smartDrainageData";

const severityConfig = {
  High: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Medium: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  Low: { bg: "bg-[#e6f2f1]", text: "text-[#1a5c5a]", dot: "bg-[#2d8a7a]" },
};

export default function RisksAndIssues() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Risks & Issues</h3>
        </div>
        <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium flex items-center gap-1">
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-0">
        {risks.map((risk, i) => {
          const config = severityConfig[risk.severity] || severityConfig.Low;
          return (
            <div
              key={risk.id}
              className={`py-3 ${
                i < risks.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.bg} ${config.text} shrink-0 mt-0.5`}
                >
                  {risk.severity}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <p className="text-[12px] font-semibold text-gray-800">{risk.title}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 ml-4">{risk.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
