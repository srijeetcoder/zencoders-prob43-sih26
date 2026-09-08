import { ArrowRight, ArrowUpRight } from "lucide-react";
import { recentStories } from "../data/mockData";

export default function RecentStories() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-gray-900">Recent Success Stories</h2>
        <button className="flex items-center gap-1.5 text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium">
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {recentStories.map((story) => (
          <div key={story.title} className="group cursor-pointer">
            <div className="relative h-[120px] rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                  <span className="text-lg">
                    {story.tag === "Infrastructure" && "💡"}
                    {story.tag === "Agriculture" && "🌾"}
                    {story.tag === "Healthcare" && "🏥"}
                    {story.tag === "Education" && "📚"}
                  </span>
                </div>
              </div>
              <span
                className="absolute top-2 left-2 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  color: story.tagColor,
                  backgroundColor: story.tagBg,
                }}
              >
                {story.tag}
              </span>
            </div>

            <h4 className="text-[13px] font-semibold text-gray-900 mb-1 group-hover:text-[#1a5c5a] transition-colors leading-tight">
              {story.title}
            </h4>
            <p className="text-[11px] text-gray-500 mb-2 line-clamp-2 leading-relaxed">
              {story.description}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] text-[#1a5c5a] font-medium">
              <span>{story.partner}</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
