export default function TabNav({ activeTab, onTabChange }) {
  const tabs = ["Overview", "Stories by Sector", "Impact Metrics", "Featured Partners"];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex gap-0 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 text-[13px] font-medium transition-colors relative ${
              activeTab === tab
                ? "text-[#1a5c5a]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6ee7b7]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
