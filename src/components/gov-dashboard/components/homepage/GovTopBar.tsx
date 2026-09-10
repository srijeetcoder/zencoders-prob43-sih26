import { Phone } from "lucide-react";
import Emblem from "./Emblem";

function GovTopBar() {
  return (
    <div className="bg-[#0b1d30] text-white border-b border-slate-800">
      <div className="flex h-10 items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Emblem size={18} className="text-emerald-400" />

          <p className="whitespace-nowrap text-xs font-bold tracking-wide text-white">
            Government of Jharkhand
          </p>

          <span className="hidden text-xs text-slate-300 sm:inline">
            | झारखंड सरकार
          </span>

          <span className="hidden rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 md:inline">
            Official Community Grievance Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate-200 sm:flex font-medium">
            राष्ट्रीय आपातकालीन नंबर / Emergency: 112
          </span>

          <a
            href="tel:1070"
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-emerald-500 shadow-xs"
          >
            <Phone size={12} />
            Mukhyamantri Helpline 1070
          </a>
        </div>
      </div>
    </div>
  );
}

export default GovTopBar;