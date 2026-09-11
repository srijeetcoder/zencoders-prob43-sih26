import React from "react";
import { GraduationCap, Phone, Sparkles } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

export default function UniversityTopBar() {
  const { user } = useAuth();
  const academicRole = user?.academicRole || "STUDENT";

  return (
    <div className="bg-[#0b1d30] text-white border-b border-slate-800 select-none">
      <div className="flex h-10 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 shrink-0">
            <GraduationCap size={14} />
          </div>

          <p className="whitespace-nowrap text-xs font-bold tracking-wide text-white">
            Birsa Institute of Technology (BIT Mesra)
          </p>

          <span className="hidden text-xs text-slate-400 md:inline">
            | Academic & R&D Innovation Node
          </span>

          <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
            <Sparkles size={10} />
            AISHE: U-0268 &bull; NAAC A+ Node
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300">
            <span>State Nodal Cell:</span>
            <span className="font-mono font-semibold text-emerald-400">R&D-JH-2026</span>
          </div>

          <a
            href="tel:06512275444"
            className="flex items-center gap-1.5 rounded-full bg-indigo-600/90 hover:bg-indigo-500 px-2.5 sm:px-3 py-1 text-[11px] font-bold text-white transition-colors shadow-xs"
          >
            <Phone size={11} />
            <span className="hidden sm:inline">Academic Helpline</span>
            <span className="sm:hidden">Help</span>
          </a>
        </div>
      </div>
    </div>
  );
}
