import { tabs } from "../../data/mockData";

export default function SolutionTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6 flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative py-3.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-cyan-600 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
