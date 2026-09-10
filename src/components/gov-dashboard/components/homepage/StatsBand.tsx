import {
  FileText,
  CheckCircle2,
  Wrench,
  Users,
  MapPinned,
} from "lucide-react";
import type { ElementType } from "react";

interface Stat {
  label: string;
  value: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
}

const stats: Stat[] = [
  {
    label: "Total Case Reports",
    value: "1,240",
    icon: FileText,
    iconBg: "bg-navy-100",
    iconColor: "text-navy-600",
  },
  {
    label: "Cases Resolved",
    value: "386",
    icon: CheckCircle2,
    iconBg: "bg-brand-100",
    iconColor: "text-brand-600",
  },
  {
    label: "In Progress",
    value: "512",
    icon: Wrench,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    label: "Active Volunteers",
    value: "928",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Districts Covered",
    value: "24",
    icon: MapPinned,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

function StatsBand() {
  return (
    <section className="px-8 pb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon size={22} className={iconColor} />
            </div>

            <div className="min-w-0">
              <p className="text-2xl font-bold text-navy-900">{value}</p>
              <p className="truncate text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsBand;