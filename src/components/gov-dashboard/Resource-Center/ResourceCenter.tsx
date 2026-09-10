import { useState } from "react";
import { BookOpen, Search, Download, FileText } from "lucide-react";

type Category = "Guidelines" | "Reports" | "Templates" | "SOPs";

interface Doc {
  id: number;
  title: string;
  category: Category;
  pages: number;
  size: string;
  updated: string;
}

const docs: Doc[] = [
  { id: 1, title: "Civic Grievance Resolution Guidelines 2026", category: "Guidelines", pages: 24, size: "1.8 MB", updated: "Jan 2026" },
  { id: 2, title: "District Case Hourly SLA Policy", category: "Guidelines", pages: 12, size: "940 KB", updated: "Dec 2025" },
  { id: 3, title: "Q1 2026 State-Wide Problem Analysis Report", category: "Reports", pages: 46, size: "4.2 MB", updated: "Feb 2026" },
  { id: 4, title: "Water Infrastructure Priority Districts", category: "Reports", pages: 30, size: "2.6 MB", updated: "Nov 2025" },
  { id: 5, title: "Team Formation Request Form", category: "Templates", pages: 3, size: "210 KB", updated: "Jan 2026" },
  { id: 6, title: "Institution MoU Template", category: "Templates", pages: 8, size: "340 KB", updated: "Oct 2025" },
  { id: 7, title: "Case Escalation SOP", category: "SOPs", pages: 6, size: "280 KB", updated: "Dec 2025" },
  { id: 8, title: "Revenue-Scheme Compliance SOP", category: "SOPs", pages: 10, size: "410 KB", updated: "Sep 2025" },
];

const CATEGORIES: ("All" | Category)[] = ["All", "Guidelines", "Reports", "Templates", "SOPs"];

function ResourceCenter() {
  const [activeCat, setActiveCat] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");

  const visible = docs.filter((doc) => {
    const matchesCat = activeCat === "All" || doc.category === activeCat;
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || doc.title.toLowerCase().includes(term);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <BookOpen size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">Resource Center</h1>
          <p className="text-sm text-slate-500">
            Guidelines, reports, templates & SOPs · साधन केंद्र
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeCat === cat
                  ? "bg-navy-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-400"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        {visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            No documents match "{query}". {` `}
          </div>
        )}

        {visible.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-200 sm:flex-row sm:items-center"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100">
              <FileText size={20} className="text-navy-700" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy-900">
                {doc.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 font-medium text-teal-700 ring-1 ring-inset ring-teal-100">
                  {doc.category}
                </span>
                <span>{doc.pages} pages</span>
                <span>{doc.size}</span>
                <span>Updated {doc.updated}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => console.log(`Downloading: ${doc.title}`)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-800 transition-colors hover:bg-navy-50"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceCenter;