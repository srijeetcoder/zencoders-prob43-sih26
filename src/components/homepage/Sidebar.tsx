import {
  Home,
  FilePlus2,
  Search,
  ClipboardList,
  Activity,
  MapPin,
  Users,
  Heart,
  HelpCircle,
  Menu,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { name: "Home", icon: Home, path: "/main" },
  { name: "Report a Problem", icon: FilePlus2 },
  { name: "Explore Problems", icon: Search },
  { name: "My Submissions", icon: ClipboardList },
  { name: "Track Status", icon: Activity },
  { name: "Nearby Issues", icon: MapPin },
  { name: "Community", icon: Users },
  { name: "Impact & Badges", icon: Heart },
  { name: "Help & Support", icon: HelpCircle },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`
        left-0 top-0 z-50
        flex min-h-screen flex-col
        ${isOpen ? "w-[230px]" : "w-[70px]"}
        border-r border-slate-200 bg-white px-4 py-4
        transition-[width] duration-300 ease-in-out
      `}
    >
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } gap-4 px-2`}
      >
        <button
          className="rounded-lg p-2 text-[#10245e] hover:bg-slate-100"
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
          <h1 className="whitespace-nowrap text-2xl font-bold tracking-tight">
            Pu<span className="text-[#087f5b]">kaar</span>
          </h1>
          <p className="whitespace-nowrap text-[10px] font-medium text-slate-500">
            People. Ideas. Solutions.
          </p>
        </div>
      </div>

      <nav className="mt-8 flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeItem === item.name;

            return (
              <Link to={item.path}
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-[#263968] hover:bg-slate-50"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} className="shrink-0" />

                <span
                  className={`
                    overflow-hidden whitespace-nowrap text-sm font-medium
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "w-[150px] opacity-100" : "w-0 opacity-0"}
                  `}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
