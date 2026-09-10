import {
  Home,
  FilePlus2,
  Activity,
  University,
  Trophy,
  Menu,
  Brain,
  Layers,
  LayoutDashboard,
  User,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import buildingSilhouette from "../assets/ss.png";

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  roles?: string[];
}

const baseMenuItems: MenuItem[] = [
  { name: "Home Feed", icon: Home, path: "/main" },
  { name: "Report Problem", icon: FilePlus2, path: "/problem" },
  { name: "AI Analysis", icon: Brain, path: "/analysis", roles: ["government", "institution", "university", "admin"] },
  { name: "Solution Match", icon: Layers, path: "/solution-matching", roles: ["government", "institution", "university", "admin"] },
  { name: "Smart Drainage", icon: Activity, path: "/smart-drainage", roles: ["government", "admin"] },
  { name: "Gov Dashboard", icon: LayoutDashboard, path: "/gov-dashboard", roles: ["government", "admin"] },
  { name: "University Dashboard", icon: GraduationCap, path: "/university-dashboard", roles: ["institution", "university", "admin"] },
  { name: "User Dashboard", icon: User, path: "/userdashboard" },
  { name: "Track Progress", icon: Activity, path: "/trackprogress" },
  { name: "Success Stories", icon: Trophy, path: "/successstories" },
  { name: "Universities & Partners", icon: University, path: "/partners" },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  const userRole = (user?.role || "citizen").toLowerCase();

  const menuItems = baseMenuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole) || userRole === "admin"
  );

  return (
    <aside
      className={`
        sticky top-0 z-50
        flex h-screen shrink-0 flex-col
        ${isOpen ? "w-[240px]" : "w-[70px]"}
        relative overflow-hidden
        border-r border-slate-200 bg-white px-3 py-4
        transition-[width] duration-300 ease-in-out
      `}
    >
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

      <div
        className={`relative z-10 flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } gap-3 px-2`}
      >
        <button
          className="rounded-lg p-2 text-[#10245e] hover:bg-slate-100"
          onClick={() => setIsOpen((prev) => !prev)}
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
        >
          <h1 className="whitespace-nowrap text-xl font-extrabold tracking-tight">
            <span className="text-slate-900">Poo</span>
            <span className="text-[#148554]">Kar</span>
          </h1>
          <p className="whitespace-nowrap text-[10px] font-medium text-slate-500">
            People. Ideas. Solutions.
          </p>
        </Link>
      </div>

      <nav className="relative z-10 mt-5 flex-1 overflow-y-auto space-y-0.5 pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              to={item.path}
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-[#263968] hover:bg-slate-50"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                className="shrink-0"
              />

              <span
                className={`
                  overflow-hidden whitespace-nowrap text-[13px]
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

      <div
        className={`
          relative z-10 overflow-hidden border-t border-slate-100 pt-3
          transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-2">
          <p className="text-[11px] font-semibold text-[#10245e]">Viksit Bharat 2047</p>
          <p className="text-[10px] text-slate-500">National Innovation Platform</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
