import { Users, Layers, MapPin, TrendingUp } from "lucide-react";
import { keyHighlights } from "../data/mockData";

const iconMap = {
  users: Users,
  layers: Layers,
  mapPin: MapPin,
  trendingUp: TrendingUp,
};

export default function KeyHighlights() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Key Highlights</h3>
      <div className="grid grid-cols-2 gap-3">
        {keyHighlights.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={item.label}
              className="bg-gray-50 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#e6f7f5] flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[#1a5c5a]" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-gray-900 leading-tight">{item.value}</p>
                <p className="text-[11px] text-gray-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
