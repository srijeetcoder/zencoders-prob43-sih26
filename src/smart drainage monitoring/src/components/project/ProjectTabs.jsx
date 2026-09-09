const tabs = [
  "Overview",
  "Tasks",
  "Team",
  "Documents",
  "Discussions",
  "Progress & Analytics",
  "Field Updates",
  "Reports",
];

export default function ProjectTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex gap-0 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#1a5c5a] text-[#1a5c5a]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
