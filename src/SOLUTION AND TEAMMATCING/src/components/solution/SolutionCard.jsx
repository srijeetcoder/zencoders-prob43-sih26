import { Clock, IndianRupee, BarChart3, ArrowRight } from "lucide-react";

export default function SolutionCard({ solution }) {
  const isHigh = solution.matchType === "High Match";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
      {/* Image */}
      <img
        src={solution.image}
        alt={solution.title}
        className="w-[180px] h-[140px] rounded-lg object-cover shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Title + Match */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-[13px] font-bold text-gray-900">{solution.title}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isHigh
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {solution.matchType}
              </span>
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
              {solution.description}
            </p>
          </div>
          <span className="text-sm font-bold text-cyan-600 whitespace-nowrap shrink-0">
            {solution.matchPercent}% Match
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {solution.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {solution.duration}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3 h-3" />
              {solution.cost}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {solution.impact}
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
