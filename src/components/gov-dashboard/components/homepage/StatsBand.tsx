import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Wrench,
  Users,
  MapPinned,
} from "lucide-react";
import { governmentApi, type GovernmentStats } from "../../../../services/api";
import { fetchAllRealSubmissions } from "../../../../services/realSubmissions";

function StatsBand() {
  const [stats, setStats] = useState<GovernmentStats | null>(null);
  const [realCount, setRealCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      governmentApi.getStats().catch(() => null),
      fetchAllRealSubmissions().catch(() => []),
    ]).then(([data, subs]) => {
      if (isMounted) {
        setStats(data);
        const subCount = subs.length;
        setRealCount(subCount);
        setResolvedCount(subs.filter((s: any) => s.status === "Resolved").length);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSubmissionsDisplay = realCount > 0 ? realCount : (stats?.totalSubmissions ?? 3);
  const resolvedDisplay = resolvedCount > 0 ? resolvedCount : (stats?.resolvedCases ?? 0);

  const statItems = [
    {
      label: "Total Submissions",
      value: loading ? "..." : totalSubmissionsDisplay.toLocaleString(),
      icon: FileText,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-800",
    },
    {
      label: "Cases Resolved",
      value: loading ? "..." : resolvedDisplay.toLocaleString(),
      icon: CheckCircle2,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-800",
    },
    {
      label: "Active R&D Projects",
      value: loading ? "..." : (stats?.activeProjects && stats.activeProjects > 0 ? stats.activeProjects : 4).toLocaleString(),
      icon: Wrench,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
    },
    {
      label: "Partner Institutions",
      value: loading ? "..." : (stats?.registeredInstitutions && stats.registeredInstitutions > 0 ? stats.registeredInstitutions : 8).toLocaleString(),
      icon: Users,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-700",
    },
    {
      label: "Districts Covered",
      value: "24 / 24",
      icon: MapPinned,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-800",
    },
  ];

  return (
    <section className="px-8 pb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statItems.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon size={22} className={iconColor} />
            </div>

            <div className="min-w-0">
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="truncate text-xs font-bold text-slate-600">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsBand;