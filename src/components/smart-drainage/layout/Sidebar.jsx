import {
  LayoutDashboard, FileText, Brain, Layers, FolderOpen,
  GraduationCap, BarChart3, BookOpen, Bell, Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { navItems } from "../../../data/smartDrainageData";

const iconMap = {
  layoutDashboard: LayoutDashboard,
  fileText: FileText,
  brain: Brain,
  layers: Layers,
  folderOpen: FolderOpen,
  graduationCap: GraduationCap,
  barChart3: BarChart3,
  bookOpen: BookOpen,
  bell: Bell,
  settings: Settings,
};

const routeMap = {
  "Dashboard": "/gov",
  "Problem Analysis": "/gov/ai-analysis",
  "AI Deep Dive": "/gov/ai-analysis",
  "Solution Matching": "/solution-matching",
  "Project Management": "/smart-drainage",
  "Partners & Academia": "/partners",
  "Impact Analytics": "/trackprogress",
  "Knowledge Base": "/successstories",
  "Notifications": "/gov/alerts",
  "Settings": "/gov/settings",
};

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#1a5c5a] flex flex-col z-50">
      <div className="px-5 py-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
            <span className="text-[#1a5c5a] font-bold text-sm">JS</span>
          </div>
          <div>
            <h1 className="text-[15px] font-extrabold text-white leading-tight">
              <span>Poo</span><span className="text-emerald-400">Kar</span>
            </h1>
            <p className="text-[10px] text-white/60 leading-tight">Government of India</p>
            <p className="text-[9px] text-white/40 leading-tight">People · Ideas · Solutions</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const dest = routeMap[item.label] || "/gov-dashboard";
          return (
            <Link
              key={item.label}
              to={dest}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-colors ${
                item.active
                  ? "bg-white/15 text-[#a7f3d0] border-r-3 border-[#6ee7b7]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {Icon && <Icon size={18} className={item.active ? "text-[#6ee7b7]" : "text-white/40"} />}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-[11px] font-bold text-white leading-snug mb-2">
            Viksit Bharat Through<br />People-Centric<br />Innovation
          </p>
          <div className="flex justify-center my-2">
            <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
              <rect x="10" y="20" width="80" height="30" rx="2" fill="rgba(255,255,255,0.15)" />
              <rect x="15" y="10" width="10" height="40" rx="1" fill="rgba(255,255,255,0.25)" />
              <rect x="30" y="15" width="8" height="35" rx="1" fill="rgba(255,255,255,0.25)" />
              <rect x="45" y="5" width="12" height="45" rx="1" fill="rgba(255,255,255,0.35)" />
              <rect x="62" y="15" width="8" height="35" rx="1" fill="rgba(255,255,255,0.25)" />
              <rect x="75" y="10" width="10" height="40" rx="1" fill="rgba(255,255,255,0.25)" />
              <rect x="5" y="48" width="90" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
          <p className="text-[10px] font-semibold text-white/80">Sustainable Solutions</p>
          <p className="text-[10px] font-semibold text-white/80">Stronger Communities</p>
        </div>
      </div>
    </aside>
  );
}
