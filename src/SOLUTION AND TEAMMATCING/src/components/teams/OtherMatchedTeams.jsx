import { ArrowRight, GraduationCap, Building2 } from "lucide-react";
import { otherTeams } from "../../data/mockData";

export default function OtherMatchedTeams() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Other Matched Teams</h3>
          <a href="#" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Teams list */}
        <div className="space-y-1">
          {otherTeams.map((team) => (
            <div
              key={team.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                {team.name.includes("Tata") ? (
                  <Building2 className="w-5 h-5 text-cyan-600" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-cyan-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-bold text-gray-900 truncate">{team.name}</h4>
                <p className="text-[10px] text-gray-400 truncate">{team.department}</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                {team.matchPercent}% Match
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Search Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M11 8v6" />
              <path d="M8 11h6" />
            </svg>
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900">Need a Custom Search?</h4>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              Refine your requirements or request manual review by our expert panel.
            </p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold border border-cyan-200 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors mt-2">
          Request Expert Review
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
