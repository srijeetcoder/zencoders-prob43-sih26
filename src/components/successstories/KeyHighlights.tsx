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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {keyHighlights.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#10245e]">{item.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
