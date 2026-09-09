import { ArrowRight, MapPin, GraduationCap, Building, Landmark, Users, Shield, Clock, IndianRupee } from "lucide-react";
import { featuredStory } from "../data/mockData";

const partnerIconMap = {
  graduationCap: GraduationCap,
  building: Building,
  landmark: Landmark,
};

const impactIconMap = {
  users: Users,
  shield: Shield,
  clock: Clock,
  indianRupee: IndianRupee,
};

export default function FeaturedStory() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#10245e]">Featured Success Story</h2>
        <button className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          View All Stories
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative h-56 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-emerald-50 lg:w-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100/80">
              <span className="text-3xl">💧</span>
            </div>
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            {featuredStory.tag}
          </span>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[#10245e]/80 px-3 py-1.5 backdrop-blur-sm">
            <MapPin size={13} className="text-white" />
            <span className="text-xs text-white">{featuredStory.location}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-xl font-bold text-[#10245e]">
            {featuredStory.title}
          </h3>
          <p className="mb-3 text-sm font-medium text-emerald-600">{featuredStory.subtitle}</p>
          <p className="mb-5 text-sm leading-relaxed text-slate-600">
            {featuredStory.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
            {featuredStory.partners.map((partner) => {
              const Icon = partnerIconMap[partner.icon];
              return (
                <div key={partner.name} className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#10245e]">{partner.name}</p>
                    <p className="text-[11px] text-slate-500">{partner.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full flex-shrink-0 border-t border-slate-100 pt-5 lg:w-56 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h4 className="mb-4 text-sm font-bold text-[#10245e]">Key Impact</h4>
          <div className="space-y-4">
            {featuredStory.impact.map((item) => {
              const Icon = impactIconMap[item.icon];
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#10245e]">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
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
