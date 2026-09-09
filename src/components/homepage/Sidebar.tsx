import {
  Home,
  FilePlus2,
  Activity,
  University,
  Settings,
  Trophy,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import buildingSilhouette from "../assets/ss.png";

const menuItems = [
  { name: "Home", icon: Home, path: "/main" },
  { name: "Report a Problem", icon: FilePlus2, path: "/problem" },
  { name: "Track Progress", icon: Activity, path: "/main" },
  { name: "Success Stories", icon: Trophy, path: "/successstories" },
  { name: "University and Partners", icon: University, path: "/partners" },
  { name: "Settings", icon: Settings, path: "/userdashboard" },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`
        sticky top-0 z-50
        flex h-screen shrink-0 flex-col
        ${isOpen ? "w-[230px]" : "w-[70px]"}
        relative overflow-hidden
        border-r border-slate-200 bg-white px-4 py-4
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

      <nav className="relative z-10 mt-8 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeItem === item.name;

            return (
              <Link
                to={item.path}
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-[#263968] hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
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
              </Link>
            );
          })}
        </div>
      </nav>

      <div
        className={`
          relative z-10 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >

        <div className="mt-4 px-1">
          <p className="text-xs font-semibold text-[#10245e]">Need help?</p>
          <p className="mt-1 text-xs text-slate-500">support@pukaar.gov.in</p>
          <p className="text-xs text-slate-500">1800-11-2233</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
