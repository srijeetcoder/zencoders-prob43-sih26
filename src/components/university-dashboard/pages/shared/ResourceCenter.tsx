import { useState } from "react";
import { BookOpen, Download, FileText, Search, Tag, CheckCircle2, Filter, Sparkles } from "lucide-react";
import { INITIAL_RESOURCES } from "../../data/mockData";
import type { ResourceItem } from "../../types";

export default function ResourceCenter() {
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const categories = ["ALL", "Technical Standards", "BoM Catalog", "DPR Template", "Research Paper", "State Guidelines"];

  const handleDownload = (res: ResourceItem) => {
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, downloads: r.downloads + 1 } : r))
    );
    setDownloadToast(`Downloading "${res.title}" (${res.format} &bull; ${res.fileSize})...`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const filtered = resources.filter((r) => {
    if (selectedCategory !== "ALL" && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Download Alert Toast */}
      {downloadToast && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: downloadToast }} />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <BookOpen size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
              Academic Resource & Technical Standard Center
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Official hardware BoM guidelines, DPR templates, IEEE sensor datasheets, and state innovation policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {resources.length} Verified Documents
          </span>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manuals, specifications, guidelines..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter size={12} /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {item.category}
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.format} &bull; {item.fileSize}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-[#10245e] leading-snug line-clamp-2">
                {item.title}
              </h3>

              <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                {item.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {item.downloads} downloads &bull; {item.updatedDate}
              </span>

              <button
                type="button"
                onClick={() => handleDownload(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all"
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
