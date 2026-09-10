import {
  ClipboardList,
  Lightbulb,
  GraduationCap,
  Users,
  TrendingUp,
} from "lucide-react";
import type { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
}

const stats = {
  problemsSubmitted: 1240,
  activeProjects: 320,
  universitiesInvolved: 180,
  industryPartners: 75,

  problemsChange: 12,
  projectsChange: 18,
  universitiesChange: 8,
  partnersChange: 25,
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{title}</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>

          <div className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-600">
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span>{change}% from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function DashboardStats() {
  return (
    // Fixed: removed `w-full` alongside `m-5`. w-full sets width:100% of the
    // parent, then m-5 adds margin OUTSIDE that 100%, so the element's real
    // footprint became 100% + 2.5rem — wider than its container/viewport.
    // Spacing is now handled with padding on a wrapping div instead.
    <div className="p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Problems Submitted"
          value={stats.problemsSubmitted}
          change={stats.problemsChange}
          icon={ClipboardList}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          change={stats.projectsChange}
          icon={Lightbulb}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Universities Involved"
          value={stats.universitiesInvolved}
          change={stats.universitiesChange}
          icon={GraduationCap}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Industry / NGO Partners"
          value={stats.industryPartners}
          change={stats.partnersChange}
          icon={Users}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>
    </div>
  );
}

export default DashboardStats;
