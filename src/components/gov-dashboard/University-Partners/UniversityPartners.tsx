import { useState } from "react";
import { GraduationCap, MapPin, Search, Sparkles, Handshake } from "lucide-react";

type NodeType =
  | "Universities"
  | "Academic Partner"
  | "Research Partner"
  | "Innovation Partner"
  | "Government R&D";

type TabType = "All" | NodeType;

interface Node {
  id: string;
  name: string;
  city: string;
  type: NodeType;
  focus: string;
  cta: "Form Team" | "Connect";
}

const nodes: Node[] = [
  // Universities
  { id: "u1", name: "Ranchi University", city: "Ranchi", type: "Universities", focus: "Arts, Science, Commerce & Vocational Courses", cta: "Form Team" },
  { id: "u2", name: "Vinoba Bhave University", city: "Hazaribagh", type: "Universities", focus: "General Higher Education", cta: "Form Team" },
  { id: "u3", name: "Kolhan University", city: "Chaibasa", type: "Universities", focus: "Tribal Region & General Education", cta: "Form Team" },
  { id: "u4", name: "Birsa Agricultural University", city: "Ranchi", type: "Universities", focus: "Agriculture Extension & Research", cta: "Form Team" },
  { id: "u5", name: "Nilamber-Pitamber University", city: "Palamu", type: "Universities", focus: "General Higher Education", cta: "Form Team" },
  { id: "u6", name: "Sido Kanhu Murmu University", city: "Dumka", type: "Universities", focus: "Tribal & Rural Development", cta: "Form Team" },
  { id: "u7", name: "Jharkhand Raksha Shakti University", city: "Ranchi", type: "Universities", focus: "Criminology & Public Safety", cta: "Form Team" },
  // Partners
  { id: "p1", name: "IIT (ISM) Dhanbad", city: "Dhanbad", type: "Research Partner", focus: "Water & Mining Infrastructure", cta: "Connect" },
  { id: "p2", name: "Birla Institute of Technology (BIT) Mesra", city: "Ranchi", type: "Academic Partner", focus: "Engineering & Innovation", cta: "Connect" },
  { id: "p3", name: "NIT Jamshedpur", city: "Jamshedpur", type: "Research Partner", focus: "Environmental Engineering", cta: "Connect" },
  { id: "p4", name: "XISS, Ranchi", city: "Ranchi", type: "Innovation Partner", focus: "Rural Health & Analytics", cta: "Connect" },
  { id: "p5", name: "Siksha 'O' Anusandhan (SOA)", city: "Bhubaneswar / Ranchi Campus", type: "Innovation Partner", focus: "MedTech & Public Health", cta: "Connect" },
  { id: "p6", name: "CSIR-CIMFR", city: "Dhanbad", type: "Government R&D", focus: "Mining, Fuel & Disaster Research", cta: "Connect" },
  { id: "p7", name: "ICAR Research Complex", city: "Ranchi", type: "Government R&D", focus: "Agriculture & Soil Science", cta: "Connect" },
];

const TABS: TabType[] = ["All", "Universities", "Academic Partner", "Research Partner", "Innovation Partner", "Government R&D"];

function getInitials(name: string) {
  return name
    .split(/\s+[(,]/)
    .map((part) => part.trim())
    .filter((word) => word.length > 1)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function UniversityPartners() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [query, setQuery] = useState("");

  const filtered = nodes.filter((node) => {
    const matchesTab = activeTab === "All" || node.type === activeTab;
    const term = query.trim().toLowerCase();
    const matchesQuery =
      !term ||
      node.name.toLowerCase().includes(term) ||
      node.city.toLowerCase().includes(term) ||
      node.focus.toLowerCase().includes(term);
    return matchesTab && matchesQuery;
  });

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <GraduationCap size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            University and Partners
          </h1>
          <p className="text-sm text-slate-500">
            Universities & partner institutions across Jharkhand · विश्वविद्यालय और भागीदार
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-navy-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
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
            placeholder="Search universities, cities, focus..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-400"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">
            No universities or partners match "{query}".
          </div>
        )}

        {filtered.map((node) => (
          <div
            key={node.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-navy-800 via-teal-500 to-teal-400" />

            <div className="relative mb-5 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-base font-bold text-white transition-transform duration-300 group-hover:scale-105">
                {getInitials(node.name)}
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                {node.city}
              </span>
            </div>

            <div className="mb-4 flex-1">
              <h3 className="text-lg font-semibold text-navy-900">
                {node.name}
              </h3>

              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-100">
                <Sparkles size={11} />
                {node.type}
              </span>

              <p className="mt-3 text-xs text-slate-500">{node.focus}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={14} className="shrink-0 text-teal-600" />
                <span className="truncate">{node.city}</span>
              </span>

              <button
                type="button"
                onClick={() => console.log(`${node.cta} with ${node.name}`)}
                className="flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
              >
                <Handshake size={13} />
                {node.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UniversityPartners;