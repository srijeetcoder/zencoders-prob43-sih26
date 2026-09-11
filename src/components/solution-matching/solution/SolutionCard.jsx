import { useState } from "react";
import { Clock, IndianRupee, BarChart3, ArrowRight, Layers, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function SolutionCard({ solution }) {
  const [imageError, setImageError] = useState(false);
  const isHigh = solution.matchType === "High Match";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md hover:border-teal-400 transition-all">
      {/* Image with Resilient Fallback */}
      <div className="relative w-full sm:w-[180px] h-[140px] rounded-xl overflow-hidden bg-slate-100 shrink-0">
        {!imageError && solution.image ? (
          <img
            src={solution.image}
            alt={solution.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#10245e] to-teal-800 text-white p-3 text-center">
            <Layers className="w-8 h-8 text-teal-300 mb-1" />
            <span className="text-[11px] font-bold leading-tight line-clamp-2">
              {solution.title}
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
              isHigh
                ? "bg-emerald-600 text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {solution.matchType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Title + Match */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-navy-900 leading-snug">{solution.title}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mt-1">
                {solution.description}
              </p>
            </div>
            <span className="text-sm font-bold text-teal-600 whitespace-nowrap shrink-0 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {solution.matchPercent}% Match
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {solution.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {solution.duration}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
              {solution.cost}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              {solution.impact}
            </span>
          </div>
          <Link
            to="/smart-drainage"
            className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
          >
            DPR Blueprint
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
