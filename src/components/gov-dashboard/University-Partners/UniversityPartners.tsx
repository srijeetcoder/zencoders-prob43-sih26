import { useState } from "react";
import { GraduationCap, MapPin, Search, Sparkles, Handshake, Building2 } from "lucide-react";

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
  logo: string;
  cta: "Form Team" | "Connect";
}

const nodes: Node[] = [
  // Universities
  {
    id: "u1",
    name: "Ranchi University",
    city: "Ranchi",
    type: "Universities",
    focus: "Arts, Science, Commerce & Vocational Innovation",
    logo: "/sample-assets/partner-moe.png",
    cta: "Form Team",
  },
  {
    id: "u2",
    name: "Vinoba Bhave University",
    city: "Hazaribagh",
    type: "Universities",
    focus: "General Higher Education & Tribal Tech",
    logo: "/sample-assets/partner-aicte.png",
    cta: "Form Team",
  },
  {
    id: "u3",
    name: "Kolhan University",
    city: "Chaibasa",
    type: "Universities",
    focus: "Tribal Region Ecology & Rural Systems",
    logo: "/sample-assets/partner-ihub.png",
    cta: "Form Team",
  },
  {
    id: "u4",
    name: "Birsa Agricultural University",
    city: "Ranchi",
    type: "Universities",
    focus: "Agriculture Extension & Drone Telemetry",
    logo: "/sample-assets/partner-vocal.png",
    cta: "Form Team",
  },
  {
    id: "u5",
    name: "Nilamber-Pitamber University",
    city: "Palamu",
    type: "Universities",
    focus: "Hydrogeology & Drought Mitigation",
    logo: "/sample-assets/partner-moe.png",
    cta: "Form Team",
  },
  {
    id: "u6",
    name: "Sido Kanhu Murmu University",
    city: "Dumka",
    type: "Universities",
    focus: "Santhal Pargana Forest Ecology & Education",
    logo: "/sample-assets/partner-ihub.png",
    cta: "Form Team",
  },
  {
    id: "u7",
    name: "Jharkhand Raksha Shakti University",
    city: "Ranchi",
    type: "Universities",
    focus: "Cybersecurity, Disaster & Forensic Tech",
    logo: "/sample-assets/partner-nic.png",
    cta: "Form Team",
  },
  // Partners
  {
    id: "p1",
    name: "IIT (ISM) Dhanbad",
    city: "Dhanbad",
    type: "Research Partner",
    focus: "Subsurface Thermal Grid & Mine Fire Safety",
    logo: "/sample-assets/partner-meity.png",
    cta: "Connect",
  },
  {
    id: "p2",
    name: "Birla Institute of Technology (BIT) Mesra",
    city: "Ranchi",
    type: "Academic Partner",
    focus: "IoT Telemetry & Smart Urban Drainage",
    logo: "/sample-assets/partner-sih.png",
    cta: "Connect",
  },
  {
    id: "p3",
    name: "NIT Jamshedpur",
    city: "Jamshedpur",
    type: "Research Partner",
    focus: "Phase-Change Cold Chain & Battery Systems",
    logo: "/sample-assets/partner-aicte.png",
    cta: "Connect",
  },
  {
    id: "p4",
    name: "XISS, Ranchi",
    city: "Ranchi",
    type: "Innovation Partner",
    focus: "Rural Health & Socio-economic Impact Analytics",
    logo: "/sample-assets/partner-vocal.png",
    cta: "Connect",
  },
  {
    id: "p5",
    name: "Siksha 'O' Anusandhan (SOA)",
    city: "Bhubaneswar / Ranchi",
    type: "Innovation Partner",
    focus: "MedTech, Telemedicine & Clinical Diagnostics",
    logo: "/sample-assets/partner-ihub.png",
    cta: "Connect",
  },
  {
    id: "p6",
    name: "CSIR-CIMFR",
    city: "Dhanbad",
    type: "Government R&D",
    focus: "Fuel Research, Toxic Gas & Rock Mechanics",
    logo: "/sample-assets/partner-meity.png",
    cta: "Connect",
  },
  {
    id: "p7",
    name: "ICAR Research Complex",
    city: "Ranchi",
    type: "Government R&D",
    focus: "Agri-Forestry & Soil Nitrogen Sensor Grid",
    logo: "/sample-assets/partner-nic.png",
    cta: "Connect",
  },
];

const TABS: TabType[] = [
  "All",
  "Universities",
  "Academic Partner",
  "Research Partner",
  "Innovation Partner",
  "Government R&D",
];

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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10245e] to-[#047d48] text-white shadow-md">
          <GraduationCap size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#10245e]">
            University and Research Partners
          </h1>
          <p className="text-sm text-slate-500">
            Official accredited academic & R&D lab network across Jharkhand · विश्वविद्यालय और भागीदार
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
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[#10245e] text-white shadow-sm"
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
            placeholder="Search universities, focus, city..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {filtered.length} accredited partner institution{filtered.length === 1 ? "" : "s"} indexed
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">
            No universities or partners match "{query}".
          </div>
        )}

        {filtered.map((node) => (
          <div
            key={node.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#10245e] via-emerald-600 to-teal-400" />

            <div className="relative mb-4 flex items-start justify-between">
              {/* Dynamic Official Institutional Logo */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <img
                  src={node.logo}
                  alt={`${node.name} logo`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                />
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {node.city}
              </span>
            </div>

            <div className="mb-4 flex-1">
              <h3 className="text-base font-bold text-[#10245e] leading-snug">
                {node.name}
              </h3>

              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200/80">
                <Sparkles size={11} className="text-emerald-600" />
                {node.type}
              </span>

              <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">{node.focus}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={13} className="shrink-0 text-emerald-600" />
                <span className="truncate">{node.city}, Jharkhand</span>
              </span>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] px-3.5 py-2 text-xs font-semibold text-white transition-colors shadow-xs"
              >
                <Handshake size={13} />
                <span>{node.cta}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UniversityPartners;