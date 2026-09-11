import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Users,
  Brain,
  CheckSquare,
  ShieldCheck,
  BookOpen,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  GraduationCap,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth, type AcademicRole } from "../../../../context/AuthContext";
import buildingSilhouette from "../../../../assets/ss.png";

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  badge?: string;
}

export default function UniversitySidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const academicRole: AcademicRole = user?.academicRole || "STUDENT";

  const getMenuItems = (): MenuItem[] => {
    if (academicRole === "STUDENT") {
      return [
        { name: "Dashboard", icon: LayoutDashboard, path: "/university-dashboard" },
        { name: "Live Problems", icon: Activity, path: "/university-dashboard/live-problems", badge: "2 Accepted" },
        { name: "Form a Team", icon: Users, path: "/university-dashboard/form-team", badge: "Action" },
        { name: "Resource Center", icon: BookOpen, path: "/university-dashboard/resource-center" },
        { name: "Alerts", icon: Bell, path: "/university-dashboard/alerts", badge: "2" },
        { name: "Settings", icon: Settings, path: "/university-dashboard/settings" },
        { name: "Help and Support", icon: HelpCircle, path: "/university-dashboard/help" },
      ];
    }

    if (academicRole === "FACULTY") {
      return [
        { name: "Dashboard", icon: LayoutDashboard, path: "/university-dashboard" },
        { name: "Live Problems", icon: Activity, path: "/university-dashboard/live-problems", badge: "Active" },
        { name: "AI Analysis", icon: Brain, path: "/university-dashboard/ai-analysis" },
        { name: "Evaluation Workspace", icon: CheckSquare, path: "/university-dashboard/evaluation", badge: "Review" },
        { name: "Resource Center", icon: BookOpen, path: "/university-dashboard/resource-center" },
        { name: "Alerts", icon: Bell, path: "/university-dashboard/alerts", badge: "2" },
        { name: "Settings", icon: Settings, path: "/university-dashboard/settings" },
        { name: "Help and Support", icon: HelpCircle, path: "/university-dashboard/help" },
      ];
    }

    // ADMIN
    return [
      { name: "Dashboard", icon: LayoutDashboard, path: "/university-dashboard" },
      { name: "Live Problems", icon: Activity, path: "/university-dashboard/live-problems" },
      { name: "AI Analysis", icon: Brain, path: "/university-dashboard/ai-analysis" },
      { name: "Evaluation Workspace", icon: CheckSquare, path: "/university-dashboard/evaluation", badge: "Sanction" },
      { name: "Admin Center", icon: ShieldCheck, path: "/university-dashboard/admin-center", badge: "Admin" },
      { name: "Resource Center", icon: BookOpen, path: "/university-dashboard/resource-center" },
      { name: "Alerts", icon: Bell, path: "/university-dashboard/alerts", badge: "2" },
      { name: "Settings", icon: Settings, path: "/university-dashboard/settings" },
      { name: "Help and Support", icon: HelpCircle, path: "/university-dashboard/help" },
    ];
  };

  const menuItems = getMenuItems();

  const isItemActive = (path: string) => {
    if (path === "/university-dashboard") {
      return (
        location.pathname === "/university-dashboard" ||
        location.pathname === "/university-dashboard/" ||
        location.pathname === "/university" ||
        location.pathname === "/university/"
      );
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const roleTag =
    academicRole === "STUDENT"
      ? "Student Innovator"
      : academicRole === "FACULTY"
      ? "Faculty Evaluator"
      : "Institution Admin";

  return (
    <aside
      className={`
        sticky top-0 z-50
        flex h-screen shrink-0 flex-col
        ${isOpen ? "w-[245px]" : "w-[72px]"}
        relative overflow-hidden
        border-r border-slate-200 bg-white px-3 py-4
        transition-[width] duration-300 ease-in-out select-none
      `}
    >
      {/* Background silhouette watermark matching citizen and gov layouts */}
      <div
        className={`
          pointer-events-none absolute inset-x-0 bottom-0
          flex justify-center overflow-hidden
          transition-all duration-500 ease-in-out
          ${isOpen ? "opacity-[0.07]" : "opacity-[0.03]"}
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
        } gap-2 px-1 mb-2`}
      >
        <button
          className="rounded-lg p-2 text-[#10245e] hover:bg-slate-100 transition-colors cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? "Collapse menu" : "Expand menu"}
        >
          <Menu size={19} />
        </button>

        <Link
          to="/"
          className={`
            select-none overflow-hidden
            transition-all duration-300 ease-in-out
            ${isOpen ? "w-[155px] opacity-100" : "w-0 opacity-0"}
          `}
          title="Return to Landing Page"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="whitespace-nowrap text-xl font-extrabold tracking-tight">
              <span className="text-slate-900">Poo</span>
              <span className="text-indigo-600">Kar</span>
            </h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              UNIV
            </span>
          </div>
        </Link>
      </div>

      {/* Active Persona Banner (When open) */}
      {isOpen && (
        <div className="relative z-10 mb-3 mx-1 p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              <GraduationCap size={13} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-indigo-950 truncate">
                {user?.name || "Academic User"}
              </p>
              <p className="text-[9px] font-semibold text-indigo-700 uppercase tracking-wider">
                {roleTag}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto pr-0.5 py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center rounded-xl px-2.5 py-2 text-xs font-semibold
                transition-all duration-150
                ${
                  active
                    ? "bg-indigo-50/90 text-indigo-900 shadow-xs border border-indigo-100 font-bold"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }
                ${isOpen ? "justify-between" : "justify-center"}
              `}
              title={item.name}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  size={18}
                  className={`
                    shrink-0 transition-colors
                    ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"}
                  `}
                />
                {isOpen && (
                  <span className="truncate text-left tracking-tight">{item.name}</span>
                )}
              </div>

              {isOpen && item.badge && (
                <span
                  className={`
                    shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider
                    ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }
                  `}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Actions */}
      <div className="relative z-10 pt-3 border-t border-slate-100 space-y-1">
        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600
            hover:bg-rose-50 transition-colors
            ${isOpen ? "justify-start" : "justify-center"}
          `}
          title="Sign Out"
        >
          <LogOut size={16} className="shrink-0 text-rose-500" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
