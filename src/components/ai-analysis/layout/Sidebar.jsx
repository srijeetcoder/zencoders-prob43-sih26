import {
  LayoutDashboard,
  FileText,
  Brain,
  Folder,
  Building2,
  BarChart3,
  BookOpen,
  Bell,
  Settings,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { sidebarNav } from "../../../data/aiAnalysisData";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  brain: Brain,
  folder: Folder,
  "building-2": Building2,
  "bar-chart-3": BarChart3,
  "book-open": BookOpen,
  bell: Bell,
  settings: Settings,
};

const routeMap = {
  dashboard: "/main",
  submissions: "/trackprogress",
  "ai-analysis": "/analysis",
  projects: "/smart-drainage",
  universities: "/partners",
  analytics: "/successstories",
  resource: "/main",
  notifications: "/trackprogress",
  settings: "/userdashboard",
};

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-primary flex flex-col z-50">
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-base leading-tight">
              <span>Poo</span><span className="text-emerald-400">Kar</span>
            </h1>
            <p className="text-white/60 text-[11px] leading-tight">
              Government of India
            </p>
          </div>
        </Link>
        <p className="text-white/50 text-[10px] mt-1.5 tracking-wide">
          People · Ideas · Solutions
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarNav.map((item) => {
          const Icon = iconMap[item.icon];
          const path = routeMap[item.id] || "/main";
          return (
            <Link
              key={item.id}
              to={path}
              className={`sidebar-link ${item.active ? "active" : ""}`}
            >
              {Icon && <Icon className="w-[18px] h-[18px] shrink-0" />}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-white font-semibold text-sm leading-tight">
            Sashakt Bharat
          </p>
          <p className="text-white font-semibold text-sm leading-tight">
            Sahbhagi Bharat
          </p>
          <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-400 via-white to-green-400" />
        </div>
        <p className="text-white/40 text-[10px] mt-2.5 leading-relaxed">
          Data for People.
          <br />
          Solutions for a Better India.
        </p>
      </div>
    </aside>
  );
}
