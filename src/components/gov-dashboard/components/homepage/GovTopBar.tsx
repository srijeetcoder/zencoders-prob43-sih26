import { Phone } from "lucide-react";
import Emblem from "./Emblem";

function GovTopBar() {
  return (
    <div className="bg-navy-950 text-white">
      <div className="flex h-10 items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Emblem size={18} className="text-teal-400" />

          <p className="whitespace-nowrap text-xs font-semibold tracking-wide">
            Government of Jharkhand
          </p>

          <span className="hidden text-xs text-slate-400 sm:inline">
            | झारखंड सरकार
          </span>

          <span className="hidden rounded-full bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium text-teal-300 md:inline">
            Official Community Grievance Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate-300 sm:flex">
            राष्ट्रीय आपातकालीन नंबर / Emergency: 112
          </span>

          <a
            href="tel:1070"
            className="flex items-center gap-1.5 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-navy-950 transition-colors hover:bg-teal-400"
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