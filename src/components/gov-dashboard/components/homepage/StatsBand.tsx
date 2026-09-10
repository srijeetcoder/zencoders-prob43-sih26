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
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-800",
  },
  {
    label: "Cases Resolved",
    value: "386",
    icon: CheckCircle2,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-800",
  },
  {
    label: "In Progress",
    value: "512",
    icon: Wrench,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
  },
  {
    label: "Active Volunteers",
    value: "928",
    icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
  },
  {
    label: "Districts Covered",
    value: "24",
    icon: MapPinned,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-800",
  },
];

function StatsBand() {
  return (
    <section className="px-8 pb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
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