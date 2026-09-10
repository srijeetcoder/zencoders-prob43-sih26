import {
  Hash, MapPin, Building, IndianRupee, Users, Activity,
  Calendar, CalendarCheck, Pencil,
} from "lucide-react";
import { keyDetails } from "../../../data/smartDrainageData";

const iconMap = {
  hash: Hash,
  mapPin: MapPin,
  building: Building,
  indianRupee: IndianRupee,
  users: Users,
  activity: Activity,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
};

export default function KeyDetails() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hash size={16} className="text-gray-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Key Details</h3>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium">
          <Pencil size={12} />
          Edit
        </button>
      </div>

      <div className="space-y-0">
        {keyDetails.map((detail, i) => {
          const Icon = iconMap[detail.icon];
          return (
            <div
              key={detail.label}
              className={`flex items-center py-2.5 ${
                i < keyDetails.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="w-8 flex justify-center">
                {Icon && <Icon size={14} className="text-gray-400" />}
              </div>
              <span className="text-[12px] text-gray-500 w-[160px]">{detail.label}</span>
              <span className="text-[12px] font-medium text-gray-800">
                {detail.label === "Status" ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#2d8a7a] rounded-full" />
                    <span className="text-[#1a5c5a] font-semibold">{detail.value}</span>
                  </span>
                ) : (
                  detail.value
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
