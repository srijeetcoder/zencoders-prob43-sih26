import GoogleHazardMap from "../maps/GoogleHazardMap";

export default function ImpactMap() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#10245e]">Statewide Impact & Deployment Map</h3>
          <p className="text-xs text-slate-500">Live Jharkhand District Deployments & Pilot Interventions</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl">
        <GoogleHazardMap height="340px" />
      </div>
    </div>
  );
}

