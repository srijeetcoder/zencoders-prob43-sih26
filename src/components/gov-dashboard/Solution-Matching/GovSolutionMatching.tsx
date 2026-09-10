import { useState } from "react";
import SolutionStats from "../../solution-matching/solution/SolutionStats";
import FilterPanel from "../../solution-matching/solution/FilterPanel";
import SolutionList from "../../solution-matching/solution/SolutionList";
import TopMatchedTeam from "../../solution-matching/teams/TopMatchedTeam";
import OtherMatchedTeams from "../../solution-matching/teams/OtherMatchedTeams";
import { solutions as initialSolutions, filterOptions } from "../../../data/solutionMatchingData";

export default function GovSolutionMatching() {
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState(JSON.parse(JSON.stringify(filterOptions)));
  const [filteredSolutions, setFilteredSolutions] = useState(initialSolutions);

  const handleFilterChange = (category, id, type) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (type === "checkbox") {
        updated[category] = prev[category].map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        );
      } else {
        updated[category] = prev[category].map((item) =>
          item.id === id
            ? { ...item, checked: true }
            : { ...item, checked: false }
        );
      }
      return updated;
    });
  };

  const handleReset = () => {
    setFilters(JSON.parse(JSON.stringify(filterOptions)));
    setFilteredSolutions(initialSolutions);
  };

  const handleApply = () => {
    let result = [...initialSolutions];

    const activeDomains = filters.domains.filter((d) => d.checked).map((d) => d.id);
    if (activeDomains.length > 0) {
      result = result.filter((s) =>
        s.tags.some((t) => {
          const tagLower = t.toLowerCase();
          return activeDomains.some((d) => {
            if (d === "infrastructure") return tagLower.includes("infrastructure") || tagLower.includes("urban");
            if (d === "iot-monitoring") return tagLower.includes("iot") || tagLower.includes("monitoring") || tagLower.includes("data") || tagLower.includes("early warning");
            if (d === "nature-based") return tagLower.includes("nature") || tagLower.includes("sustainability");
            if (d === "policy") return tagLower.includes("municipal") || tagLower.includes("operations");
            if (d === "community") return tagLower.includes("community");
            return false;
          });
        })
      );
    }

    const activeFeasibility = filters.feasibility.find((f) => f.checked);
    if (activeFeasibility && activeFeasibility.id !== "any") {
      if (activeFeasibility.id === "high") {
        result = result.filter((s) => s.matchPercent >= 85);
      } else if (activeFeasibility.id === "medium") {
        result = result.filter((s) => s.matchPercent >= 70 && s.matchPercent < 85);
      }
    }

    setFilteredSolutions(result);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const sorted = [...filteredSolutions];
    switch (value) {
      case "match-high":
        sorted.sort((a, b) => b.matchPercent - a.matchPercent);
        break;
      case "match-low":
        sorted.sort((a, b) => a.matchPercent - b.matchPercent);
        break;
      case "cost-low":
        sorted.sort((a, b) => {
          const getCost = (c) => { const m = c.cost.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
          return getCost(a) - getCost(b);
        });
        break;
      case "cost-high":
        sorted.sort((a, b) => {
          const getCost = (c) => { const m = c.cost.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
          return getCost(b) - getCost(a);
        });
        break;
      default:
        sorted.sort((a, b) => b.matchPercent - a.matchPercent);
    }
    setFilteredSolutions(sorted);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#10245e]">
            Solution & Team Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            AI-powered recommendations connecting citizen challenges with verified research labs, universities, and enterprise innovators across Jharkhand.
          </p>
        </div>
      </div>
      
      <SolutionStats />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onApply={handleApply}
          />
        </div>

        <div className="flex-1 min-w-0">
          <SolutionList
            solutions={filteredSolutions}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        <div className="w-full lg:w-[320px] shrink-0 space-y-4">
          <TopMatchedTeam />
          <OtherMatchedTeams />
        </div>
      </div>
    </div>
  );
}
