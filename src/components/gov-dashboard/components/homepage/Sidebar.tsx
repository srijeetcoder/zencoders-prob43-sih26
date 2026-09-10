import {
  Home,
  Activity,
  Brain,
  Layers,
  UserPlus,
  GraduationCap,
  BookOpen,
  Bell,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import buildingSilhouette from "../../../assets/ss.png";

const menuItems = [
  { name: "Home", icon: Home, path: "/gov" },
  { name: "Live Problems", icon: Activity, path: "/gov/live-problems" },
  { name: "Ai Analysis", icon: Brain, path: "/gov/ai-analysis" },
  { name: "Solution Match", icon: Layers, path: "/gov/solution-matching" },
  { name: "Create/Form Team", icon: UserPlus, path: "/gov/create-team" },
  { name: "University And Partner", icon: GraduationCap, path: "/gov/university-partners" },
  { name: "Resource Center", icon: BookOpen, path: "/gov/resource-center" },
  { name: "Alerts", icon: Bell, path: "/gov/alerts" },
  { name: "Settings", icon: Settings, path: "/gov/settings" },
  { name: "Help And Support", icon: HelpCircle, path: "/gov/help" },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isItemActive = (path: string) => {
    if (path === "/gov") {
      return location.pathname === "/gov" || location.pathname === "/gov/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`
        sticky top-0 z-50
        flex h-screen shrink-0 flex-col
        ${isOpen ? "w-[240px]" : "w-[70px]"}
        relative overflow-hidden
        border-r border-slate-200 bg-white px-3 py-4
        transition-[width] duration-300 ease-in-out select-none
      `}
    >
      {/* Background silhouette watermark matching citizen layout */}
      <div
        className={`
          pointer-events-none absolute inset-x-0 bottom-0
          flex justify-center overflow-hidden
          transition-all duration-500 ease-in-out
          ${isOpen ? "opacity-[0.08]" : "opacity-[0.03]"}
        `}
      >
        <img
          src={buildingSilhouette}
          alt=""
          className="w-[110%] max-w-none select-none object-contain object-bottom"
          style={{
            maskImage: "linear-gradient(to top, black 45%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 95%)",
            mixBlendMode: "multiply",
            filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.1))",
          }}
        />
      </div>

      {/* Top Header */}
      <div
        className={`relative z-10 flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } gap-3 px-2`}
      >
        <button
          className="rounded-lg p-2 text-[#10245e] hover:bg-slate-100 transition-colors cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? "Collapse menu" : "Expand menu"}
        >
          <Menu size={20} />
        </button>

        <Link
          to="/"
          className={`
            select-none overflow-hidden
            transition-all duration-300 ease-in-out
            ${isOpen ? "w-[150px] opacity-100" : "w-0 opacity-0"}
          `}
          title="Return to Landing Page"
        >
          <h1 className="whitespace-nowrap text-xl font-extrabold tracking-tight">
            <span className="text-slate-900">Poo</span>
            <span className="text-[#148554]">Kar</span>
          </h1>
          <p className="whitespace-nowrap text-[10px] font-semibold text-slate-500">
            People. Ideas. Solutions.
          </p>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="relative z-10 mt-5 flex-1 overflow-y-auto space-y-1 pr-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.path);

          return (
            <Link
              to={item.path}
              key={item.name}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-left transition-all ${
                active
                  ? "bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-xs"
                  : "text-[#263968] hover:bg-slate-50 hover:text-emerald-700 font-medium"
              }`}
            >
              <Icon
                size={19}
                strokeWidth={active ? 2.5 : 2}
                className={`shrink-0 ${active ? "text-emerald-700" : "text-slate-500"}`}
              />

              <span
                className={`
                  overflow-hidden whitespace-nowrap text-[13.5px] tracking-tight
                  transition-all duration-300 ease-in-out
                  ${isOpen ? "w-[150px] opacity-100" : "w-0 opacity-0"}
                `}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div
        className={`
          relative z-10 overflow-hidden border-t border-slate-100 pt-3
          transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-2">
          <p className="text-[11px] font-bold text-[#10245e]">Viksit Bharat 2047</p>
          <p className="text-[10px] font-medium text-slate-500">Jharkhand Command Center</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;