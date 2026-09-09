import {
  FileText,
  BarChart3,
  Users,
  FileBarChart2,
} from "lucide-react";
import type { ElementType } from "react";

interface QuickAction {
  id: string;
  label: string;
  icon: ElementType;
  bg: string;
  iconColor: string;
  onClick?: () => void;
}

const actions: QuickAction[] = [
  {
    id: "view-submissions",
    label: "View New Submissions",
    icon: FileText,
    bg: "bg-blue-50 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "track-progress",
    label: "Track Project Progress",
    icon: BarChart3,
    bg: "bg-emerald-50 hover:bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: "manage-partners",
    label: "Manage Partners",
    icon: Users,
    bg: "bg-purple-50 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "generate-report",
    label: "Generate Report",
    icon: FileBarChart2,
    bg: "bg-amber-50 hover:bg-amber-100",
    iconColor: "text-amber-600",
  },
];

function QuickActions() {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white px-5 py-4 mx-5 my-2 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Quick Actions
      </h3>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ id, label, icon: Icon, bg, iconColor, onClick }) => (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-colors ${bg}`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
            <span className="text-sm font-medium text-slate-700">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
