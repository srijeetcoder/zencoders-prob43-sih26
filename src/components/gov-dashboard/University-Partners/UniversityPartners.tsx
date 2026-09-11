import { useState } from "react";
import {
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  Handshake,
  Building2,
  Mail,
  Send,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip,
  Trash2,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  Link2,
} from "lucide-react";

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
  email: string;
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
    email: "dean.research@ranchiuniversity.ac.in",
  },
  {
    id: "u2",
    name: "Vinoba Bhave University",
    city: "Hazaribagh",
    type: "Universities",
    focus: "General Higher Education & Tribal Tech",
    logo: "/sample-assets/partner-aicte.png",
    cta: "Form Team",
    email: "rnd.director@vbu.ac.in",
  },
  {
    id: "u3",
    name: "Kolhan University",
    city: "Chaibasa",
    type: "Universities",
    focus: "Tribal Region Ecology & Rural Systems",
    logo: "/sample-assets/partner-ihub.png",
    cta: "Form Team",
    email: "innovation@kolhanuniversity.ac.in",
  },
  {
    id: "u4",
    name: "Birsa Agricultural University",
    city: "Ranchi",
    type: "Universities",
    focus: "Agriculture Extension & Drone Telemetry",
    logo: "/sample-assets/partner-vocal.png",
    cta: "Form Team",
    email: "director.research@bauranchi.org",
  },
  {
    id: "u5",
    name: "Nilamber-Pitamber University",
    city: "Palamu",
    type: "Universities",
    focus: "Hydrogeology & Drought Mitigation",
    logo: "/sample-assets/partner-moe.png",
    cta: "Form Team",
    email: "palamu.rnd@npu.ac.in",
  },
  {
    id: "u6",
    name: "Sido Kanhu Murmu University",
    city: "Dumka",
    type: "Universities",
    focus: "Santhal Pargana Forest Ecology & Education",
    logo: "/sample-assets/partner-ihub.png",
    cta: "Form Team",
    email: "tribal.tech@skmu.ac.in",
  },
  {
    id: "u7",
    name: "Jharkhand Raksha Shakti University",
    city: "Ranchi",
    type: "Universities",
    focus: "Cybersecurity, Disaster & Forensic Tech",
    logo: "/sample-assets/partner-nic.png",
    cta: "Form Team",
    email: "nodal.cyber@jrsu.ac.in",
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
    email: "dean_rnd@iitism.ac.in",
  },
  {
    id: "p2",
    name: "Birla Institute of Technology (BIT) Mesra",
    city: "Ranchi",
    type: "Academic Partner",
    focus: "IoT Telemetry & Smart Urban Drainage",
    logo: "/sample-assets/partner-sih.png",
    cta: "Connect",
    email: "iot.urbanlab@bitmesra.ac.in",
  },
  {
    id: "p3",
    name: "NIT Jamshedpur",
    city: "Jamshedpur",
    type: "Research Partner",
    focus: "Phase-Change Cold Chain & Battery Systems",
    logo: "/sample-assets/partner-aicte.png",
    cta: "Connect",
    email: "dean.research@nitjsr.ac.in",
  },
  {
    id: "p4",
    name: "XISS, Ranchi",
    city: "Ranchi",
    type: "Innovation Partner",
    focus: "Rural Health & Socio-economic Impact Analytics",
    logo: "/sample-assets/partner-vocal.png",
    cta: "Connect",
    email: "rural.innovation@xiss.ac.in",
  },
  {
    id: "p5",
    name: "Siksha 'O' Anusandhan (SOA)",
    city: "Bhubaneswar / Ranchi",
    type: "Innovation Partner",
    focus: "MedTech, Telemedicine & Clinical Diagnostics",
    logo: "/sample-assets/partner-ihub.png",
    cta: "Connect",
    email: "medtech.collaborations@soa.ac.in",
  },
  {
    id: "p6",
    name: "CSIR-CIMFR",
    city: "Dhanbad",
    type: "Government R&D",
    focus: "Fuel Research, Toxic Gas & Rock Mechanics",
    logo: "/sample-assets/partner-meity.png",
    cta: "Connect",
    email: "director@cimfr.res.in",
  },
  {
    id: "p7",
    name: "ICAR Research Complex",
    city: "Ranchi",
    type: "Government R&D",
    focus: "Agri-Forestry & Soil Nitrogen Sensor Grid",
    logo: "/sample-assets/partner-nic.png",
    cta: "Connect",
    email: "head.icar-rcer@icar.gov.in",
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

  // Gmail-style compose state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [selectedCase, setSelectedCase] = useState("JS-2026-5167");
  const [priority, setPriority] = useState("High (48h SLA)");
  const [grantAmount, setGrantAmount] = useState("12.50");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openComposeForNode = (node: Node) => {
    setSelectedNode(node);
    setToEmail(node.email);
    setSubject(`[GOV-JH-WAR-2026] Technical R&D Collaboration Directive: ${node.name}`);
    setBodyText(
      `Respected Dean / R&D Director,\n\n` +
      `The Government of Jharkhand State War Room has mapped a critical civic infrastructure requirement to your specialized laboratory: "${node.focus}".\n\n` +
      `📌 Problem Statement: Urban Drainage Choking & Stormwater Telemetry Redressal (Ranchi Sadar)\n` +
      `💼 Approved DMF Grant Allocation: ₹ 12.50 Lakhs (Direct Sanction under MMDR Act Sec 9B)\n` +
      `🏛️ Mandated Task: Deploy faculty mentors and multidisciplinary student innovation teams to prototype and validate the localized IP68 ultrasonic sensor telemetry architecture.\n\n` +
      `Please review the attached technical blueprint and confirm laboratory onboarding within 48 hours.\n\n` +
      `Best regards,\n` +
      `Principal Secretary / Nodal Command Officer\n` +
      `State Government AI Intelligence War Room, Ranchi`
    );
    setIsComposeOpen(true);
    setIsMinimized(false);
  };

  const handleSendDispatch = () => {
    if (!toEmail || !subject) {
      alert("Please specify a valid recipient email and subject.");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsComposeOpen(false);
      setToastMessage(`✉️ Official Collaboration Directive dispatched successfully to ${selectedNode?.name || toEmail}!`);
      setTimeout(() => setToastMessage(null), 4500);
    }, 1200);
  };

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
    <div className="px-6 py-6 sm:px-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-700 text-white px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 size={18} className="text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10245e] to-[#047d48] text-white shadow-md">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#10245e]">
              University and Research Partners
            </h1>
            <p className="text-xs text-slate-500">
              Official accredited academic & R&D lab network across Jharkhand &bull; विश्वविद्यालय और भागीदार
            </p>
          </div>
        </div>

        <button
          onClick={() => openComposeForNode(nodes[7])}
          className="flex items-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <Mail size={14} />
          <span>Compose University Dispatch</span>
        </button>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-emerald-500 shadow-xs"
          />
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-500">
        {filtered.length} accredited partner institution{filtered.length === 1 ? "" : "s"} indexed
      </p>

      {/* University Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={13} className="shrink-0 text-emerald-600" />
                <span className="truncate">{node.city}, Jharkhand</span>
              </span>

              <button
                type="button"
                onClick={() => openComposeForNode(node)}
                className="flex items-center gap-1.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] px-3 py-2 text-xs font-semibold text-white transition-colors shadow-xs shrink-0"
              >
                <Mail size={13} />
                <span>Connect & Dispatch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Gmail-Style Floating Compose Window */}
      {isComposeOpen && (
        <div
          className={`fixed z-50 bg-white border border-slate-300 shadow-2xl rounded-t-2xl transition-all duration-200 flex flex-col ${
            isMaximized
              ? "inset-4 sm:inset-10 rounded-2xl"
              : isMinimized
              ? "bottom-0 right-4 sm:right-10 w-80 h-12"
              : "bottom-0 right-4 sm:right-10 w-full sm:w-[580px] h-[580px]"
          }`}
        >
          {/* Gmail Titlebar */}
          <div className="flex items-center justify-between bg-[#10245e] text-white px-4 py-3 rounded-t-2xl select-none cursor-pointer">
            <div className="flex items-center gap-2 min-w-0">
              <Mail size={16} className="text-teal-400 shrink-0" />
              <span className="text-xs font-bold truncate">
                New Government Collaboration Dispatch &bull; {selectedNode?.name || "Academic Partner"}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white"
                title="Minimize"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMaximized(!isMaximized);
                  setIsMinimized(false);
                }}
                className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white"
                title={isMaximized ? "Restore down" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsComposeOpen(false);
                }}
                className="p-1 hover:bg-rose-600 rounded text-slate-300 hover:text-white"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Form Body (Hidden when minimized) */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto bg-slate-50/50 text-xs">
              {/* From row */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-600">
                <span className="w-16 font-bold text-slate-500 uppercase tracking-wider text-[10px]">From:</span>
                <span className="font-mono font-medium text-navy-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  state.warroom@jharkhand.gov.in (Official Govt Dispatch Node)
                </span>
              </div>

              {/* To row */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-16 font-bold text-slate-500 uppercase tracking-wider text-[10px]">To:</span>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="recipient@university.ac.in"
                  className="flex-1 bg-transparent font-medium text-navy-900 outline-none text-xs"
                />
              </div>

              {/* Case & Grant Meta Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                <div>
                  <label className="text-[10px] font-bold text-indigo-900 uppercase">Case Reference:</label>
                  <select
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="w-full mt-0.5 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-navy-900 outline-none"
                  >
                    <option value="JS-2026-5167">#JS-2026-5167 (Ranchi Urban Drainage)</option>
                    <option value="JS-2026-2085">#JS-2026-2085 (Harmu Silt Telemetry)</option>
                    <option value="JS-2026-6204">#JS-2026-6204 (Monsoon Road Inundation)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-indigo-900 uppercase">Sanctioned DMF Grant:</label>
                  <div className="mt-0.5 flex items-center bg-white border border-indigo-200 rounded-lg px-2 py-1">
                    <span className="text-slate-500 font-bold mr-1">₹</span>
                    <input
                      type="text"
                      value={grantAmount}
                      onChange={(e) => setGrantAmount(e.target.value)}
                      className="w-full bg-transparent font-bold text-emerald-700 outline-none text-[11px]"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold">Lakhs</span>
                  </div>
                </div>
              </div>

              {/* Subject row */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-16 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 bg-transparent font-bold text-navy-900 outline-none text-xs"
                />
              </div>

              {/* Body Textarea */}
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={10}
                className="flex-1 w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 shadow-inner resize-none font-sans"
              />

              {/* Attached Official Files */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Attached Dossier:</span>
                <span className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-2xs">
                  <FileText size={12} className="text-rose-600" />
                  Technical_Blueprint_Matrix.pdf (1.4 MB)
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-2xs">
                  <ShieldCheck size={12} className="text-teal-600" />
                  Consolidated_BoM_INR.xlsx (420 KB)
                </span>
              </div>

              {/* Bottom Toolbar & Send Button */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendDispatch}
                    disabled={isSending}
                    className="flex items-center gap-2 bg-[#047d48] hover:bg-[#03663a] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Send size={13} className={isSending ? "animate-spin" : ""} />
                    {isSending ? "Dispatching Directive..." : "Send Official Dispatch"}
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("File attachment explorer opened. Added supplementary spatial GIS files.")}
                    className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                    title="Attach files"
                  >
                    <Paperclip size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Government Ledger link inserted.")}
                    className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                    title="Insert link"
                  >
                    <Link2 size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Discard draft"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UniversityPartners;