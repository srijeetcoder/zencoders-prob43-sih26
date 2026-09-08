import {
  ArrowRight, MapPin, GraduationCap, Building, Landmark,
  Users, Shield, Clock, IndianRupee,
} from "lucide-react";
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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-gray-900">Featured Success Story</h2>
        <button className="flex items-center gap-1.5 text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium">
          View All Stories
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex gap-5">
        <div className="relative w-[360px] h-[220px] rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-200 to-teal-400">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-teal-500/30 flex items-center justify-center">
              <span className="text-3xl">💧</span>
            </div>
          </div>
          <span className="absolute top-3 left-3 bg-[#1a5c5a] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
            {featuredStory.tag}
          </span>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
            <MapPin size={12} className="text-white" />
            <span className="text-[11px] text-white">{featuredStory.location}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-bold text-gray-900 mb-1">
            {featuredStory.title}
          </h3>
          <p className="text-[13px] text-gray-500 mb-3">{featuredStory.subtitle}</p>
          <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
            {featuredStory.description}
          </p>

          <div className="flex items-center gap-5">
            {featuredStory.partners.map((partner) => {
              const Icon = partnerIconMap[partner.icon];
              return (
                <div key={partner.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-800 leading-tight">
                      {partner.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{partner.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[200px] flex-shrink-0 border-l border-gray-100 pl-5">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Key Impact</h4>
          <div className="space-y-3">
            {featuredStory.impact.map((item) => {
              const Icon = impactIconMap[item.icon];
              return (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#e6f7f5] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#1a5c5a]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">{item.value}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{item.label}</p>
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
