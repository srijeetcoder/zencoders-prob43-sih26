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
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stat.bgColor }}
            >
              <Icon size={22} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[22px] font-bold text-gray-900 leading-tight">{stat.value}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{stat.label}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-[11px] text-green-600 font-medium">{stat.growth}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
