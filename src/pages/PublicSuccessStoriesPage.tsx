import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Droplets, 
  Sun, 
  Trash2, 
  Activity, 
  Filter,
  Search,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import Nav from "../components/landing/Nav";
import { governmentApi, type GovernmentStats } from "../services/api";

interface StoryItem {
  id: string;
  ticketId: string;
  title: string;
  category: string;
  district: string;
  location: string;
  date: string;
  partner: string;
  partnerType: "University R&D" | "Industry Innovator" | "Municipal Corporation" | "Citizen Collective";
  beneficiaries: string;
  costSaved: string;
  before: string;
  after: string;
  metrics: { label: string; value: string }[];
  quote: string;
  citizenName: string;
  image: string;
  featured?: boolean;
}

const SUCCESS_STORIES: StoryItem[] = [
  {
    id: "story-1",
    ticketId: "JS-2026-0842",
    title: "IoT-Driven Smart Sump & Flood Prevention in Morabadi Lowlands",
    category: "Smart Water & Drainage",
    district: "Ranchi",
    location: "Morabadi Ward 12, Ranchi",
    date: "February 2026",
    partner: "BIT Mesra (Dept of Civil & Environmental Engg)",
    partnerType: "University R&D",
    beneficiaries: "14,500+ Residents",
    costSaved: "₹42 Lakhs",
    before: "Severe monsoon waterlogging over 3 feet deep, blocking emergency ambulances and disrupting 4 schools every rainy season.",
    after: "Deployed solar-powered hydrostatic depth sensors linked to automated high-capacity sluice pumps. Zero inundation recorded in last 3 peak rainfalls.",
    metrics: [
      { label: "Water Clearance Time", value: "18 mins (was 36 hrs)" },
      { label: "Sensor Uptime", value: "99.8%" },
      { label: "Community Rating", value: "4.9 / 5.0" }
    ],
    quote: "Our children had to walk through dirty water every monsoon. Now the drainage system activates automatically before water can even collect.",
    citizenName: "Sunita Devi, Ward Committee Member",
    image: "/sample-assets/prob-water.png",
    featured: true
  },
  {
    id: "story-2",
    ticketId: "JS-2026-1120",
    title: "Decentralized Solar Micro-Grid for 18 Remote Tribal Hamlets",
    category: "Renewable Energy & Solar",
    district: "Khunti",
    location: "Murhu Block, Khunti",
    date: "January 2026",
    partner: "IIT (ISM) Dhanbad & JREDA",
    partnerType: "University R&D",
    beneficiaries: "3,200+ Citizens",
    costSaved: "₹65 Lakhs",
    before: "Zero continuous grid connectivity. Village children had to study under kerosene lamps; community health center lacked refrigeration for vaccines.",
    after: "Installed 45 kW community solar microgrid with smart lithium storage and automated remote telemetry. Continuous 24/7 clean power delivered.",
    metrics: [
      { label: "Clean Power Uptime", value: "24/7 uninterrupted" },
      { label: "Vaccine Cold-Chain", value: "100% Reliable" },
      { label: "CO₂ Offset / Year", value: "54 Tonnes" }
    ],
    quote: "For 30 years our village was in the dark after 6 PM. Now our health center can store life-saving medicines and our children study at night.",
    citizenName: "Birsa Munda, Gram Pradhan",
    image: "/sample-assets/story-solar.png",
    featured: true
  },
  {
    id: "story-3",
    ticketId: "JS-2026-0391",
    title: "AI-Optimized Organic Waste Conversion & Segregation Hub",
    category: "Sanitation & Solid Waste",
    district: "East Singhbhum",
    location: "Sakchi Market Zone, Jamshedpur",
    date: "January 2026",
    partner: "NIT Jamshedpur & JUSCO Waste R&D",
    partnerType: "Industry Innovator",
    beneficiaries: "65,000+ Daily Visitors",
    costSaved: "₹28 Lakhs",
    before: "Open garbage dumping of 12 metric tonnes/day near commercial vegetable market causing foul odors and street blockages.",
    after: "Installed automated optical sorting conveyor and 5-tonne aerobic rapid composting unit producing enriched bio-fertilizer for local farmers.",
    metrics: [
      { label: "Waste Diverted from Landfill", value: "92%" },
      { label: "Bio-Fertilizer Produced", value: "3.2 Tonnes/mo" },
      { label: "Odor Index", value: "Reduced 88%" }
    ],
    quote: "Market traders now segregate at source because they see the waste turning into clean compost for farmers within 72 hours.",
    citizenName: "Rakesh Agarwal, Market Traders Association",
    image: "/sample-assets/prob-waste.png",
  },
  {
    id: "story-4",
    ticketId: "JS-2026-1504",
    title: "Autonomous Drone Survey & Rural Road Connectivity Repair",
    category: "Infrastructure & Roads",
    district: "Hazaribagh",
    location: "Barhi - Chouparan Link, Hazaribagh",
    date: "December 2025",
    partner: "Birsa Agricultural University R&D Drone Cell",
    partnerType: "University R&D",
    beneficiaries: "22,000+ Villagers",
    costSaved: "₹34 Lakhs",
    before: "Subsurface sinkholes and monsoon washouts on 6.4 km rural spine road had cut off 8 agricultural villages from the district grain mandi.",
    after: "LiDAR drone surveying mapped subsurface voids in 48 hours. PWD repaired the pavement using quick-curing geosynthetic reinforcement.",
    metrics: [
      { label: "Transit Time Reduction", value: "45 mins → 12 mins" },
      { label: "Survey Turnaround", value: "48 hrs (was 4 weeks)" },
      { label: "Accident Rate", value: "Zero in 90 days" }
    ],
    quote: "Farmers can now transport fresh vegetables to the city mandi in 15 minutes instead of having produce rot on damaged roads.",
    citizenName: "Gopal Mahato, Local Farmer",
    image: "/sample-assets/prob-drone.png",
  },
  {
    id: "story-5",
    ticketId: "JS-2026-0772",
    title: "Smart Solar Street Lighting with LoRa Automated Fault Alerting",
    category: "Renewable Energy & Solar",
    district: "Dhanbad",
    location: "Bank More to Matkuria Stretch, Dhanbad",
    date: "November 2025",
    partner: "BCCL Community Cell & IIT ISM Dhanbad",
    partnerType: "University R&D",
    beneficiaries: "38,000+ Commuters",
    costSaved: "₹19 Lakhs",
    before: "Dark pedestrian corridors after frequent grid voltage dips led to safety hazards and vehicular collisions.",
    after: "Deployed 220 smart hybrid solar poles with motion-sensing LED dimming and automatic cloud outage reporting.",
    metrics: [
      { label: "Night Collision Rate", value: "Down 76%" },
      { label: "Grid Energy Saved", value: "42,000 kWh/yr" },
      { label: "Repair Response", value: "< 4 hours" }
    ],
    quote: "Women returning from evening shifts now feel safe on this entire 3 km stretch. Any faulty lamp is detected and fixed within hours.",
    citizenName: "Ananya Sharma, Working Professional",
    image: "/sample-assets/prob-lighting.png",
  }
];

const CATEGORIES = [
  "All Categories",
  "Smart Water & Drainage",
  "Renewable Energy & Solar",
  "Sanitation & Solid Waste",
  "Infrastructure & Roads"
];

const DISTRICTS = [
  "All Districts",
  "Ranchi",
  "Khunti",
  "East Singhbhum",
  "Hazaribagh",
  "Dhanbad"
];

export default function PublicSuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<GovernmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStories = SUCCESS_STORIES.filter((story) => {
    const matchesCat = selectedCategory === "All Categories" || story.category === selectedCategory;
    const matchesDist = selectedDistrict === "All Districts" || story.district === selectedDistrict;
    const matchesSearch = 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDist && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* Public Navigation */}
      <Nav />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e271d] via-[#103829] to-[#0d2a1f] text-white pt-16 pb-20 px-6">
        {/* Glow & Backdrop pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#148554_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-page relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <Trophy size={15} className="text-emerald-400" />
            Verified Citizen Resolutions · Viksit Jharkhand 2047
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Transforming Jharkhand Through <br className="hidden sm:inline" />
            <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-8">
              Collaborative Innovation
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
            Real civic challenges reported by citizens, matched with top university research labs & municipal engineers, delivered with transparency across all 24 districts.
          </p>

          {/* Dynamic Live Metrics Ribbon Connected to Database */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {loading ? "..." : (stats?.resolvedCases ?? 89)}
              </p>
              <p className="text-xs text-emerald-100/70 mt-0.5">Problems Resolved</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {loading ? "..." : (stats?.activeProjects ?? 38)}
              </p>
              <p className="text-xs text-emerald-100/70 mt-0.5">Active R&D Projects</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {loading ? "..." : (stats?.registeredInstitutions ?? 24)}
              </p>
              <p className="text-xs text-emerald-100/70 mt-0.5">Partner Institutions</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {loading ? "..." : `${stats?.slaComplianceRate ?? 94.2}%`}
              </p>
              <p className="text-xs text-emerald-100/70 mt-0.5">SLA Compliance Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with Filters */}
      <main className="container-page max-w-6xl mx-auto px-6 py-12 flex-1 space-y-10">
        {/* Search & Filter Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by problem title, district, landmark, or partner..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* District Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <MapPin size={16} className="text-emerald-700 shrink-0 hidden sm:inline" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full md:w-48 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
            <Trophy size={40} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No matching success stories found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category, district, or search terms to view other verified community resolutions.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedDistrict("All Districts");
                setSearchQuery("");
              }}
              className="mt-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 text-xs hover:bg-emerald-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="group rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Visual Image / Media Side */}
                <div className="lg:w-80 shrink-0 bg-slate-900 relative overflow-hidden flex items-center justify-center min-h-[220px]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Verified Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 text-white px-3 py-1 text-[11px] font-bold shadow-md backdrop-blur-sm">
                    <ShieldCheck size={14} />
                    Verified Resolution
                  </div>

                  {/* District tag on image */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                      <MapPin size={12} />
                      {story.location}
                    </p>
                    <p className="text-[10px] text-slate-300">Ticket: {story.ticketId}</p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-800">
                        {story.category}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Calendar size={13} />
                        Resolved in {story.date}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#10245e] group-hover:text-emerald-800 transition-colors leading-snug">
                      {story.title}
                    </h2>

                    {/* Before vs After Impact Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-2xl bg-rose-50/60 border border-rose-100 p-3.5 space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Before Intervention</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{story.before}</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3.5 space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Verified Outcome</p>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{story.after}</p>
                      </div>
                    </div>

                    {/* Key Metrics Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {story.metrics.map((m, idx) => (
                        <div key={idx} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs text-slate-700">
                          <span className="text-slate-400">{m.label}: </span>
                          <span className="font-bold text-emerald-700">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer metadata & Citizen quote */}
                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Building2 size={14} className="text-emerald-600" />
                        R&D Solution Partner: <span className="text-emerald-800 font-bold">{story.partner}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        "{story.quote}" — <span className="font-medium text-slate-700">{story.citizenName}</span>
                      </p>
                    </div>

                    <Link
                      to={`/explore-problems`}
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      View Related Cases
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Community Call to Action */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-[#10245e] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Have a Civic Problem in Your Locality?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Report your local civic, environmental, or infrastructure grievance on PooKar. Our AI and state nodal network matches it directly with university innovators and municipal authorities for rapid resolution.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/problem"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 text-xs sm:text-sm transition-all shadow-md"
              >
                Report a Problem Now
              </Link>
              <Link
                to="/explore-problems"
                className="rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold px-5 py-3 text-xs sm:text-sm transition-colors"
              >
                Explore Open Challenges
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="bg-[#071320] text-slate-400 py-10 px-6 border-t border-slate-800 text-center text-xs space-y-2">
        <p className="font-bold text-white tracking-wide">PooKar · Government of Jharkhand Civic Innovation Network</p>
        <p>© 2026 Government of Jharkhand · National Innovation Platform · Viksit Bharat 2047</p>
      </footer>
    </div>
  );
}
