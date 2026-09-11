import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const RECENT_STORIES = [
  {
    title: "Smart Sump & Urban Drainage Telemetry",
    tag: "Infrastructure",
    tagColor: "#047d48",
    tagBg: "#e6f4ea",
    image: "/sample-assets/prob-water.png",
    description: "Automated ultrasonic depth sensors linked to high-capacity sluice pumps in Morabadi Ward 12.",
    partner: "BIT Mesra & RMC",
  },
  {
    title: "Decentralized Tribal Solar Micro-Grid",
    tag: "Clean Energy",
    tagColor: "#d97706",
    tagBg: "#fef3c7",
    image: "/sample-assets/story-solar.png",
    description: "45 kW community solar microgrid delivering 24/7 power and cold storage to Murhu block.",
    partner: "IIT (ISM) Dhanbad",
  },
  {
    title: "AI Organic Waste Conversion Hub",
    tag: "Sanitation",
    tagColor: "#0284c7",
    tagBg: "#e0f2fe",
    image: "/sample-assets/prob-waste.png",
    description: "Automated optical sorting conveyor and 5-tonne aerobic rapid composting unit.",
    partner: "NIT Jamshedpur",
  },
  {
    title: "Autonomous LiDAR Drone Survey & Road Repair",
    tag: "GIS & Drone",
    tagColor: "#7c3aed",
    tagBg: "#ede9fe",
    image: "/sample-assets/prob-drone.png",
    description: "LiDAR drone surveying mapped subsurface voids, enabling rapid pavement stabilization.",
    partner: "Birsa Agri Univ & PWD",
  },
];

export default function RecentStories() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Recent Field Resolutions</h2>
          <p className="text-xs text-gray-500">Verified deployments across Jharkhand districts</p>
        </div>
        <Link
          to="/successstories"
          className="flex items-center gap-1.5 text-xs text-[#047d48] hover:text-[#03663a] font-semibold"
        >
          <span>View all stories</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RECENT_STORIES.map((story) => (
          <Link
            to="/successstories"
            key={story.title}
            className="group cursor-pointer rounded-xl border border-slate-100 p-3 hover:border-emerald-200 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-28 rounded-lg overflow-hidden mb-3 bg-slate-900">
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span
                  className="absolute top-2 left-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs"
                  style={{
                    color: story.tagColor,
                    backgroundColor: story.tagBg,
                  }}
                >
                  {story.tag}
                </span>
                <span className="absolute bottom-2 right-2 text-white text-[9px] font-semibold bg-emerald-700/80 px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  Deployed
                </span>
              </div>

              <h4 className="text-xs font-bold text-gray-900 mb-1 group-hover:text-[#047d48] transition-colors leading-snug line-clamp-2">
                {story.title}
              </h4>
              <p className="text-[11px] text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                {story.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-[#047d48] font-semibold">
              <span className="truncate">{story.partner}</span>
              <ArrowUpRight size={13} className="shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
