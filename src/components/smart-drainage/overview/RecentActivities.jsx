import { Clock, Upload, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { recentActivities } from "../../../data/smartDrainageData";

const colorMap = {
  green: "bg-[#2d8a7a]",
  orange: "bg-orange-500",
  blue: "bg-[#1a5c5a]",
  purple: "bg-purple-500",
};

const iconMap = {
  upload: Upload,
  fileText: FileText,
  checkCircle: CheckCircle,
};

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium flex items-center gap-1">
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-0">
        {recentActivities.map((activity, i) => {
          const Icon = iconMap[activity.icon] || FileText;
          return (
            <div
              key={activity.id}
              className={`flex gap-3 py-3 ${
                i < recentActivities.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex flex-col items-center pt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${colorMap[activity.color] || "bg-[#1a5c5a]"}`} />
                {i < recentActivities.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-medium text-gray-500">{activity.date}</span>
                  <span className="text-[11px] text-gray-400">{activity.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon size={13} className="text-gray-600 shrink-0" />
                  <p className="text-[12px] font-medium text-gray-800 truncate">{activity.text}</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{activity.by}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
