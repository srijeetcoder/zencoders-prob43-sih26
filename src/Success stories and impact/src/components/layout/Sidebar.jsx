import {
  LayoutDashboard, FileText, Brain, Layers, FolderOpen,
  GraduationCap, BarChart3, BookOpen, Bell, Settings, Star,
} from "lucide-react";
import { navItems } from "../../data/mockData";

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
  star: Star,
};

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#1a5c5a] flex flex-col z-50">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
            <span className="text-[#1a5c5a] font-bold text-sm">JS</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-white leading-tight">JanSahyog</h1>
            <p className="text-[10px] text-white/60 leading-tight">Government of India</p>
            <p className="text-[9px] text-white/40 leading-tight">People · Ideas · Solutions</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-colors ${
                item.active
                  ? "bg-white/15 text-[#a7f3d0] border-r-3 border-[#6ee7b7]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} className={item.active ? "text-[#6ee7b7]" : "text-white/40"} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <p className="text-[11px] font-bold text-white leading-snug mb-2">
            Sashakt Bharat<br />Sambhagi Bharat
          </p>
          <div className="flex justify-center my-2">
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
              <rect x="0" y="0" width="60" height="6.67" rx="1" fill="#FF9933" />
              <rect x="0" y="6.67" width="60" height="6.67" fill="white" />
              <rect x="0" y="13.33" width="60" height="6.67" rx="1" fill="#138808" />
            </svg>
          </div>
          <p className="text-[10px] font-semibold text-white/80">Collaboration Today</p>
          <p className="text-[10px] font-semibold text-white/80">A Better Tomorrow</p>
        </div>
      </div>
    </aside>
  );
}
