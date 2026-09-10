import {
  LayoutDashboard,
  FileText,
  Brain,
  Target,
  Folder,
  Building2,
  BarChart3,
  BookOpen,
  Bell,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { sidebarNav } from "../../../data/solutionMatchingData";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  brain: Brain,
  target: Target,
  folder: Folder,
  "building-2": Building2,
  "bar-chart-3": BarChart3,
  "book-open": BookOpen,
  bell: Bell,
  settings: Settings,
};

const routeMap = {
  "dashboard": "/gov",
  "problems": "/problemlist",
  "analysis": "/gov/ai-analysis",
  "solutions": "/solution-matching",
  "monitoring": "/smart-drainage",
  "partners": "/partners",
  "success": "/successstories",
  "track": "/trackprogress",
  "notifications": "/gov/alerts",
  "settings": "/gov/settings",
};

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#164e63] flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 pb-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-extrabold text-[15px] leading-tight">
              <span>Poo</span><span className="text-emerald-400">Kar</span>
            </h1>
            <p className="text-white/50 text-[11px] leading-tight">Government of India</p>
          </div>
        </Link>
        <p className="text-white/40 text-[10px] mt-2 tracking-wide">People · Ideas · Solutions</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {sidebarNav.map((item) => {
          const Icon = iconMap[item.icon];
          const dest = routeMap[item.id] || "/gov-dashboard";
          return (
            <Link
              key={item.id}
              to={dest}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                item.active
                  ? "bg-white/15 text-white font-semibold"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {Icon && <Icon className="w-[18px] h-[18px] shrink-0" />}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <div className="rounded-lg bg-white/5 p-3 mb-2">
          <p className="text-white font-bold text-sm leading-snug">Collaborative</p>
          <p className="text-white font-bold text-sm leading-snug">Governance</p>
          <p className="text-white font-bold text-sm leading-snug">Stronger India</p>
          <div className="mt-2.5 h-[3px] w-14 rounded-full bg-gradient-to-r from-orange-400 via-white to-green-400" />
        </div>
        <p className="text-white/35 text-[10px] leading-relaxed">
          Ideas from People<br />Solutions through Partnership
        </p>
      </div>
    </aside>
  );
}
