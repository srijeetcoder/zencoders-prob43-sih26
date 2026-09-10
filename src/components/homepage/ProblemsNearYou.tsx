import { MapPin, Clock, ArrowRight } from "lucide-react";
import GoogleHazardMap from "../maps/GoogleHazardMap";

const problems = [
  {
    title: "Harmu River Urban Drainage Siltation & Overflow",
    location: "Ranchi, Jharkhand",
    time: "2 hours ago",
    status: "Active Triage",
    district: "Ranchi",
  },
  {
    title: "Subsurface Thermal Breach in Jharia Coalfield Sector 4",
    location: "Dhanbad, Jharkhand",
    time: "4 hours ago",
    status: "Dispatched to CIMFR",
    district: "Dhanbad",
  },
  {
    title: "Vaccine Cold-Chain Storage Outage at PHC",
    location: "Ramgarh, Jharkhand",
    time: "6 hours ago",
    status: "Lab Matched",
    district: "Ramgarh",
  },
];

function ProblemsNearYou() {
  return (
    <section className="px-8 pb-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#10245e]">
            District Hazard Grid & Problems Near You
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live Google Maps telemetry across 24 Jharkhand state districts
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <div>
          <GoogleHazardMap height="360px" showFilters={false} />
        </div>

        <div className="space-y-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-5
                transition
                hover:-translate-y-0.5
                hover:shadow-sm
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[#10245e]">
                    {problem.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={15} />
                    {problem.location}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={14} />
                    {problem.time}
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  {problem.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemsNearYou;

