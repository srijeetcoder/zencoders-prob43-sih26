import { ArrowRight, Users, GraduationCap, Handshake } from "lucide-react";
import { topTeam } from "../../../data/solutionMatchingData";

export default function TopMatchedTeam() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Top Matched Team</h3>
        <a href="#" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
          View all teams
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Team info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6 text-cyan-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-gray-900">{topTeam.name}</h4>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {topTeam.matchPercent}% Match
            </span>
          </div>
          <p className="text-[11px] text-gray-400">{topTeam.department}</p>
        </div>
      </div>

      <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
        {topTeam.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {topTeam.stats.map((stat) => (
          <div key={stat.label} className="text-center p-2.5 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
          <Users className="w-3.5 h-3.5" />
          View Team Profile
          <ArrowRight className="w-3 h-3" />
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
          <Handshake className="w-3.5 h-3.5" />
          Initiate Collaboration
        </button>
      </div>
    </div>
  );
}
