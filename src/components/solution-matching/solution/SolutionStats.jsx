import { Lightbulb, Users, Target, Clock } from "lucide-react";
import { stats } from "../../../data/solutionMatchingData";

const iconMap = {
  lightbulb: Lightbulb,
  users: Users,
  target: Target,
  clock: Clock,
};

export default function SolutionStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <div
            key={stat.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              {Icon && <Icon className="w-6 h-6" style={{ color: stat.color }} />}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
              <p className="text-[13px] font-medium text-gray-700 leading-tight">{stat.label}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
