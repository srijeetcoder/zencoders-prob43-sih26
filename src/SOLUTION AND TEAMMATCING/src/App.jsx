import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import SolutionTabs from "./components/solution/SolutionTabs";
import SolutionStats from "./components/solution/SolutionStats";
import FilterPanel from "./components/solution/FilterPanel";
import SolutionList from "./components/solution/SolutionList";
import TopMatchedTeam from "./components/teams/TopMatchedTeam";
import OtherMatchedTeams from "./components/teams/OtherMatchedTeams";
import { solutions as initialSolutions, filterOptions } from "./data/mockData";

export default function App() {
  const [activeTab, setActiveTab] = useState("recommended");
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
    <div className="min-h-screen bg-[#f8fafc] font-[Geist_Variable,sans-serif]">
      <Sidebar />
      <div className="ml-[240px]">
        <Header />
        <SolutionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="p-6 space-y-6">
          <SolutionStats />
          <div className="flex gap-6">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              onApply={handleApply}
            />
            <SolutionList
              solutions={filteredSolutions}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
            <div className="w-[320px] shrink-0 space-y-4">
              <TopMatchedTeam />
              <OtherMatchedTeams />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
