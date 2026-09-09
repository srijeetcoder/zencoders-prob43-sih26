import { Users, GraduationCap, Building, Heart, TrendingUp } from "lucide-react";
import { stats } from "../data/mockData";

const iconMap = {
  users: Users,
  graduationCap: GraduationCap,
  building: Building,
  heart: Heart,
};

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight text-[#10245e]">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={13} />
                <span>{stat.growth}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
