import { Camera, Share2, Download, ChevronRight } from "lucide-react";
import { projectInfo } from "../../data/mockData";

export default function ProjectHeader() {
  return (
    <div>
      <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
        <span className="hover:text-[#1a5c5a] cursor-pointer">Home</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#1a5c5a] cursor-pointer">Projects</span>
        <ChevronRight size={12} />
        <span className="text-gray-900 font-medium">{projectInfo.title}</span>
      </div>

      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-2">
          <button className="text-[13px] text-gray-500 hover:text-gray-800 flex items-center gap-1 mt-0.5">
            <ChevronRight size={14} className="rotate-180" />
            Back to Projects
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50">
            <Share2 size={15} />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5c5a] text-white rounded-lg text-[13px] font-medium hover:bg-[#15524f]">
            <Download size={15} />
            Export Report
          </button>
          <button className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <span className="text-lg leading-none">···</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-6">
        <div className="relative w-[160px] h-[120px] rounded-lg overflow-hidden shrink-0 bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=320&h=240&fit=crop"
            alt="Drainage monitoring"
            className="w-full h-full object-cover"
          />
          <button className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
            <Camera size={11} />
            Change Photo
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[22px] font-bold text-gray-900">{projectInfo.title}</h1>
            <span className="flex items-center gap-1.5 bg-[#e6f2f1] text-[#1a5c5a] text-[11px] font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#2d8a7a] rounded-full" />
              {projectInfo.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-3">
            <span className="text-gray-400">📍</span>
            {projectInfo.location}
          </div>

          <p className="text-[13px] text-gray-600 leading-relaxed mb-4 max-w-2xl">
            {projectInfo.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {projectInfo.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
