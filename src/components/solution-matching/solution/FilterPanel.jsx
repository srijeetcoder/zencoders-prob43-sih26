import { RotateCcw } from "lucide-react";

export default function FilterPanel({ filters, onFilterChange, onReset, onApply }) {
  return (
    <div className="w-[260px] shrink-0">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900">Filter Solutions</h3>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Solution Domain */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-900 mb-2.5">Solution Domain</p>
          <div className="space-y-2">
            {filters.domains.map((item) => (
              <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onFilterChange("domains", item.id, "checkbox")}
                  className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feasibility */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-900 mb-2.5">Feasibility</p>
          <div className="space-y-2">
            {filters.feasibility.map((item) => (
              <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="feasibility"
                  checked={item.checked}
                  onChange={() => onFilterChange("feasibility", item.id, "radio")}
                  className="w-4 h-4 border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-900 mb-2.5">Estimated Cost</p>
          <div className="space-y-2">
            {filters.cost.map((item) => (
              <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="cost"
                  checked={item.checked}
                  onChange={() => onFilterChange("cost", item.id, "radio")}
                  className="w-4 h-4 border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Implementation Time */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-900 mb-2.5">Implementation Time</p>
          <div className="space-y-2">
            {filters.time.map((item) => (
              <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="time"
                  checked={item.checked}
                  onChange={() => onFilterChange("time", item.id, "radio")}
                  className="w-4 h-4 border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={onApply}
          className="w-full py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
