import { Search, ChevronDown, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search problems, projects, partners, documents..."
          className="text-[13px] text-gray-600 placeholder-gray-400 outline-none w-full max-w-xl bg-transparent"
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-[13px] text-gray-600 cursor-pointer">
          <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px]">
            📍
          </span>
          <span>India</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>

        <div className="relative cursor-pointer">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#1a5c5a] flex items-center justify-center">
            <span className="text-white text-[13px] font-semibold">A</span>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-gray-900">Arun Mehta</p>
            <p className="text-[11px] text-gray-500">Government Official</p>
            <p className="text-[11px] text-gray-400">Ministry of Jal Shakti</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
