import { Check, Calendar } from "lucide-react";
import { timeline } from "../../../data/smartDrainageData";

export default function ProjectTimeline() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Project Timeline</h3>
        </div>
        <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium flex items-center gap-1">
          View full timeline →
        </button>
      </div>

      <div className="flex items-start justify-between relative px-2">
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200" />
        <div
          className="absolute top-5 left-8 h-0.5 bg-[#2d8a7a]"
          style={{ width: "30%" }}
        />

        {timeline.map((item) => (
          <div key={item.step} className="flex flex-col items-center relative z-10 w-[80px]">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold mb-2 ${
                item.status === "completed"
                  ? "bg-[#2d8a7a] text-white"
                  : item.status === "current"
                  ? "bg-[#1a5c5a] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {item.status === "completed" ? <Check size={16} /> : item.step}
            </div>
            <p className="text-[11px] font-semibold text-gray-800 text-center leading-tight">
              {item.label}
            </p>
            <p className={`text-[10px] text-center mt-1 ${
              item.status === "current" ? "text-[#1a5c5a] font-semibold" : "text-gray-400"
            }`}>
              {item.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
