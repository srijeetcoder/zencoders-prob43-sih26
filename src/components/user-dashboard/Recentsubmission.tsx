import { MapPin, HeartPulse, Trash2, BookOpen, Sprout } from "lucide-react";
import type { ElementType } from "react";

type Category =
  | "Infrastructure"
  | "Healthcare"
  | "Environment"
  | "Education"
  | "Agriculture";

interface Submission {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  category: Category;
  icon: ElementType;
}

const CATEGORY_STYLES: Record<Category, { badge: string; iconBg: string; iconColor: string }> = {
  Infrastructure: {
    badge: "bg-blue-50 text-blue-700",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  Healthcare: {
    badge: "bg-rose-50 text-rose-700",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  Environment: {
    badge: "bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  Education: {
    badge: "bg-purple-50 text-purple-700",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  Agriculture: {
    badge: "bg-amber-50 text-amber-700",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
};

const submissions: Submission[] = [
  {
    id: "1",
    title: "Water logging in Ward 12",
    location: "Kolkata, West Bengal",
    timeAgo: "2 hours ago",
    category: "Infrastructure",
    icon: MapPin,
  },
  {
    id: "2",
    title: "Lack of primary healthcare center",
    location: "Jalpaiguri, West Bengal",
    timeAgo: "5 hours ago",
    category: "Healthcare",
    icon: HeartPulse,
  },
  {
    id: "3",
    title: "Waste management in local market",
    location: "Siliguri, West Bengal",
    timeAgo: "1 day ago",
    category: "Environment",
    icon: Trash2,
  },
  {
    id: "4",
    title: "Need for smart classrooms",
    location: "Howrah, West Bengal",
    timeAgo: "1 day ago",
    category: "Education",
    icon: BookOpen,
  },
  {
    id: "5",
    title: "Irrigation support for farmers",
    location: "Bankura, West Bengal",
    timeAgo: "2 days ago",
    category: "Agriculture",
    icon: Sprout,
  },
];

function RecentSubmissions() {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Recent Submissions
        </h3>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3a.75.75 0 010-1.5h12.94l-3.22-3.22a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <ul className="mt-3 divide-y divide-slate-100">
        {submissions.map(({ id, title, location, timeAgo, category, icon: Icon }) => {
          const style = CATEGORY_STYLES[category];
          return (
            <li key={id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
              >
                <Icon className={`h-4.5 w-4.5 ${style.iconColor}`} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {title}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {location} &middot; {timeAgo}
                </p>
              </div>

              <span
                className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
              >
                {category}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentSubmissions;
