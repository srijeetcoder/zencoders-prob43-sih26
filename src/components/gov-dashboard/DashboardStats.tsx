import { useEffect, useState } from "react";
import {
  ClipboardList,
  Lightbulb,
  GraduationCap,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";
import type { ElementType } from "react";
import { governmentApi, type GovernmentStats } from "../../services/api";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md">
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
  const [data, setData] = useState<GovernmentStats>({
    totalSubmissions: 142,
    activeProjects: 38,
    registeredInstitutions: 24,
    resolvedCases: 89,
    criticalEscalations: 17,
    avgSlaHours: 18.4,
    slaComplianceRate: 94.2,
    state: "Jharkhand",
    timestamp: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getStats().then((res) => {
      if (isMounted && res) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <Activity className="h-4 w-4 animate-pulse" />
          <span>Live State Telemetry Grid &bull; {data.state} State War Room</span>
        </div>
        <span className="text-xs text-slate-400">
          SLA Compliance: <span className="font-semibold text-slate-700">{data.slaComplianceRate}%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Problems Submitted"
          value={data.totalSubmissions}
          change={12}
          icon={ClipboardList}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Active Field Pilots"
          value={data.activeProjects}
          change={18}
          icon={Lightbulb}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Institutions & CoEs"
          value={data.registeredInstitutions}
          change={8}
          icon={GraduationCap}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Resolved Cases"
          value={data.resolvedCases}
          change={25}
          icon={Users}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>
    </div>
  );
}

export default DashboardStats;

