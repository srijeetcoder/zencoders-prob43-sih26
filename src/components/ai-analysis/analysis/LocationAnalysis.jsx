import { MapPin } from "lucide-react";
import Card from "../ui/Card";
import GoogleHazardMap from "../../maps/GoogleHazardMap";

export default function LocationAnalysis() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Geospatial Hazard Analysis</h2>
            <p className="text-xs text-slate-500">Live Jharkhand District Vulnerability & Hotspots</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden">
        <GoogleHazardMap height="300px" showFilters={false} />
      </div>
    </Card>
  );
}

