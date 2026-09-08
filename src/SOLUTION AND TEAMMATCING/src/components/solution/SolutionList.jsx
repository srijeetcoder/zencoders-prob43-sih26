import { ChevronDown } from "lucide-react";
import SolutionCard from "./SolutionCard";

export default function SolutionList({ solutions, sortBy, onSortChange }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">
          Recommended Solutions ({solutions.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-[12px] font-semibold text-gray-700 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="relevance">Relevance</option>
              <option value="match-high">Match % (High to Low)</option>
              <option value="match-low">Match % (Low to High)</option>
              <option value="cost-low">Cost (Low to High)</option>
              <option value="cost-high">Cost (High to Low)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {solutions.map((solution) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
    </div>
  );
}
