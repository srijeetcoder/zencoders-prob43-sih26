import { tabs } from "../../data/mockData";

export default function TabNav({ activeTab = "overview", onTabChange }) {
  return (
    <div className="border-b border-line">
      <div className="flex gap-6 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
