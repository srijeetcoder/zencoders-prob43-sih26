import { ArrowRight, MapPin, GraduationCap, Building, Landmark, Users, Shield, Clock, IndianRupee, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedStory() {
  const partners = [
    { name: "Birsa Institute of Technology (BIT Mesra)", role: "IoT Telemetry Lead Lab", icon: GraduationCap },
    { name: "Ranchi Municipal Corporation (RMC)", role: "Nodal Implementation Dept", icon: Building },
    { name: "Morabadi Ward Resident Collective", role: "Field Validation Stakeholder", icon: Landmark },
  ];

  const impact = [
    { label: "Water Clearance Time", value: "18 mins (was 36h)", icon: Clock },
    { label: "Residents Protected", value: "14,500+ Citizens", icon: Users },
    { label: "Municipal Cost Saved", value: "₹42 Lakhs", icon: IndianRupee },
    { label: "Sensor Uptime", value: "99.8% 24/7", icon: Shield },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-lg font-bold text-[#10245e]">Featured Verified Success Story</h2>
        </div>
        <Link to="/successstories" className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
          View All Stories
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Media Container with Fixed Aspect Ratio & Stable Dimensions */}
        <div className="relative h-56 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-slate-900 lg:w-80 shadow-inner">
          <img
            src="/sample-assets/prob-water.png"
            alt="IoT-Driven Smart Sump & Flood Prevention in Morabadi Lowlands"
            className="h-full w-full object-cover filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            Smart Water & Drainage
          </span>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[#10245e]/90 px-3 py-1.5 backdrop-blur-xs text-white">
            <MapPin size={13} className="text-emerald-400" />
            <span className="text-xs font-medium">Morabadi Ward 12, Ranchi</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="mb-1 text-xl font-bold text-[#10245e] leading-snug">
              IoT-Driven Smart Sump & Siltation Telemetry in Morabadi
            </h3>
            <p className="mb-2.5 text-xs font-semibold text-emerald-700">
              BIT Mesra Civil Engg • Ranchi Municipal Corporation Desk • Community
            </p>
            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              Prior to intervention, severe monsoon waterlogging over 3 feet deep blocked ambulances and displaced over 14,000 residents annually. Researchers deployed solar LoRaWAN hydrostatic depth nodes connected to automated dual sluice gates, eliminating flood recurrence completely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-3.5">
            {partners.map((partner) => {
              const Icon = partner.icon;
              return (
                <div key={partner.name} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-800">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#10245e] leading-tight">{partner.name}</p>
                    <p className="text-[10px] text-slate-500">{partner.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex-shrink-0 border-t border-slate-100 pt-5 lg:w-56 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 flex flex-col justify-between">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#10245e]">Verified Impact</h4>
          <div className="space-y-3">
            {impact.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#10245e]">{item.value}</p>
                    <p className="text-[10px] text-slate-500">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
