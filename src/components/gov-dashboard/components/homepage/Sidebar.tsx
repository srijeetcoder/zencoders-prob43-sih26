import {
  Home,
  Activity,
  BrainCircuit,
  UserPlus,
  GraduationCap,
  BookOpen,
  BellRing,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";

import { useState } from "react";
import { NavLink } from "react-router-dom";

import bottomOfHome from "../../assets/bottom-of-home.png";

const menuItems = [
  { name: "Home", icon: Home, path: "/gov" },
  { name: "Live Problems", icon: Activity, path: "/gov/live-problems" },
  { name: "Ai Analysis", icon: BrainCircuit, path: "/gov/ai-analysis" },
  { name: "Create/Form Team", icon: UserPlus, path: "/gov/create-team" },
  { name: "University And Partners", icon: GraduationCap, path: "/gov/university-partners" },
  { name: "Resource Center", icon: BookOpen, path: "/gov/resource-center" },
  { name: "Alerts", icon: BellRing, path: "/gov/alerts" },
  { name: "Settings", icon: Settings, path: "/gov/settings" },
  { name: "Help And Support", icon: HelpCircle, path: "/gov/help" },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`
        sticky top-0 z-50
        flex h-screen shrink-0 flex-col
        ${isOpen ? "w-[250px]" : "w-[70px]"}
        border-r border-slate-200 bg-white px-3 py-4
        transition-[width] duration-300 ease-in-out
      `}
    >
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } gap-4 px-2`}
      >
        <button
          className="rounded-lg p-2 text-navy-900 hover:bg-slate-100"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Menu size={20} />
        </button>

        <div
          className={`
            select-none overflow-hidden
            transition-all duration-300 ease-in-out
            ${isOpen ? "w-[150px] opacity-100" : "w-0 opacity-0"}
          `}
        >
          <h1 className="whitespace-nowrap text-2xl font-bold tracking-tight text-navy-900">
            Poo<span className="text-teal-500">Kar</span>
          </h1>
          <p className="whitespace-nowrap text-[10px] font-medium text-slate-500">
            People. Ideas. Solutions.
          </p>
        </div>
      </div>

      <nav className="mt-8 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                to={item.path}
                key={item.name}
                className={({ isActive }) =>
                  `flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-navy-100 text-navy-700"
                      : "text-[#263968] hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className="shrink-0"
                    />

                    <span
                      className={`
                        overflow-hidden whitespace-nowrap text-sm font-medium
                        transition-all duration-300 ease-in-out
                        ${isOpen ? "w-[150px] opacity-100" : "w-0 opacity-0"}
                      `}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div
        className={`
          relative z-10 overflow-hidden border-t border-slate-100 pt-2
          transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <img
          src={bottomOfHome}
          alt="Viksit Bharat 2047 · National Innovation Platform"
          className="w-full rounded-xl object-contain"
        />
      </div>
    </aside>
  );
}

export default Sidebar;