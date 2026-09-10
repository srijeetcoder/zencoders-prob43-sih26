import React, { useState, useMemo, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { AlertTriangle, ShieldCheck, MapPin, Building2, Clock, Sparkles } from "lucide-react";

export interface DistrictHazardPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  hazardScore: number;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  dominantRisk: string;
  activeDprTitle: string;
  leadInstitution: string;
  slaDays: number;
  reportedCases: number;
}

export const JHARKHAND_HAZARD_POINTS: DistrictHazardPoint[] = [
  {
    id: "dhanbad",
    name: "Dhanbad",
    lat: 23.7957,
    lng: 86.4304,
    hazardScore: 92,
    riskLevel: "CRITICAL",
    dominantRisk: "Subsurface Mine Fires & Ground Subsidence (Jharia Sector 4)",
    activeDprTitle: "Radiometric UAV Thermal & Void Infill Slurry Grid",
    leadInstitution: "IIT (ISM) Dhanbad & CSIR-CIMFR",
    slaDays: 3,
    reportedCases: 34,
  },
  {
    id: "ranchi",
    name: "Ranchi",
    lat: 23.3441,
    lng: 85.3096,
    hazardScore: 78,
    riskLevel: "HIGH",
    dominantRisk: "Harmu River Urban Conduit Siltation & Monsoon Overflow",
    activeDprTitle: "IoT Ultrasonic Drainage Siltation Telemetry Grid",
    leadInstitution: "Birsa Institute of Technology (BIT Mesra)",
    slaDays: 7,
    reportedCases: 48,
  },
  {
    id: "bokaro",
    name: "Bokaro",
    lat: 23.6693,
    lng: 86.1511,
    hazardScore: 84,
    riskLevel: "CRITICAL",
    dominantRisk: "Industrial Heavy Metal Effluents & Damodar Runoff",
    activeDprTitle: "Solar Hydro-Chemical Adsorption & Inline Water ATM Kiosk",
    leadInstitution: "Birsa Agricultural University & BIT Sindri",
    slaDays: 5,
    reportedCases: 29,
  },
  {
    id: "jamshedpur",
    name: "East Singhbhum (Jamshedpur)",
    lat: 22.8046,
    lng: 86.2029,
    hazardScore: 71,
    riskLevel: "HIGH",
    dominantRisk: "Mining Tailings Dam Slurry Stability & Dust Particulates",
    activeDprTitle: "Continuous Ambient Air Quality Monitoring (CAAQM) Pods",
    leadInstitution: "NIT Jamshedpur Clean Energy Lab",
    slaDays: 9,
    reportedCases: 22,
  },
  {
    id: "ramgarh",
    name: "Ramgarh",
    lat: 23.6338,
    lng: 85.5186,
    hazardScore: 65,
    riskLevel: "MODERATE",
    dominantRisk: "Rural Health Sub-center Vaccine Cold-Storage Power Outages",
    activeDprTitle: "Phase-Change Material (PCM) Solar Cold-Chain Storage",
    leadInstitution: "NIT Jamshedpur & AIIMS Deoghar Cell",
    slaDays: 12,
    reportedCases: 16,
  },
  {
    id: "dumka",
    name: "Dumka (Santhal Pargana)",
    lat: 24.2677,
    lng: 87.2494,
    hazardScore: 58,
    riskLevel: "MODERATE",
    dominantRisk: "Tribal Anganwadi Solar Microgrid Inverter Tripping",
    activeDprTitle: "Decentralized Solar Dehydration & Micro-Power Skid",
    leadInstitution: "Birsa Agricultural University (BAU)",
    slaDays: 14,
    reportedCases: 14,
  },
  {
    id: "palamu",
    name: "Palamu",
    lat: 24.0416,
    lng: 84.0707,
    hazardScore: 62,
    riskLevel: "MODERATE",
    dominantRisk: "Groundwater Table Depletion & Fluoride Intrusion",
    activeDprTitle: "Capacitive Deionization Solar Kiosk Network",
    leadInstitution: "BIT Mesra Environmental Cell",
    slaDays: 11,
    reportedCases: 19,
  },
  {
    id: "seraikela",
    name: "Seraikela Kharsawan",
    lat: 22.7000,
    lng: 85.9300,
    hazardScore: 73,
    riskLevel: "HIGH",
    dominantRisk: "Mine Overburden Runoff & Groundwater Acidification",
    activeDprTitle: "Automated Electrochemical Water Quality Telemetry",
    leadInstitution: "NIT Jamshedpur",
    slaDays: 8,
    reportedCases: 17,
  },
];

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
};

const JHARKHAND_CENTER = {
  lat: 23.6102,
  lng: 85.5000,
};

const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#bae6fd" }],
  },
];

interface GoogleHazardMapProps {
  height?: string;
  selectedDistrictId?: string;
  onSelectDistrict?: (district: DistrictHazardPoint) => void;
  showFilters?: boolean;
}

export default function GoogleHazardMap({
  height = "420px",
  selectedDistrictId,
  onSelectDistrict,
  showFilters = true,
}: GoogleHazardMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [selectedPoint, setSelectedPoint] = useState<DistrictHazardPoint | null>(
    JHARKHAND_HAZARD_POINTS[0]
  );
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "google-map-script",
  });

  const filteredPoints = useMemo(() => {
    if (filterRisk === "ALL") return JHARKHAND_HAZARD_POINTS;
    return JHARKHAND_HAZARD_POINTS.filter((p) => p.riskLevel === filterRisk);
  }, [filterRisk]);

  const handleMarkerClick = useCallback(
    (point: DistrictHazardPoint) => {
      setSelectedPoint(point);
      if (onSelectDistrict) onSelectDistrict(point);
    },
    [onSelectDistrict]
  );

  const getMarkerIcon = (risk: string) => {
    let color = "#10b981"; // Emerald
    if (risk === "CRITICAL") color = "#e11d48"; // Rose/Crimson
    if (risk === "HIGH") color = "#f59e0b"; // Amber
    if (risk === "MODERATE") color = "#0284c7"; // Blue

    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1.5,
      strokeColor: "#ffffff",
      scale: 1.5,
      anchor: typeof google !== "undefined" ? new google.maps.Point(12, 22) : undefined,
    };
  };

  // Render Fallback Vector Visualizer if API Key is not set or library is loading
  const renderFallbackVisualizer = () => (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 overflow-hidden shadow-sm" style={{ height }}>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
      
      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-rose-500 animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#10245e]">
            Jharkhand Statewide Vulnerability & Hazard Grid
          </span>
        </div>
        <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-700">
          8 Active Hazard Hubs
        </span>
      </div>

      {/* Grid of Interactive District Nodes */}
      <div className="relative z-10 mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {filteredPoints.map((point) => {
          const isSelected = selectedPoint?.id === point.id;
          const isCritical = point.riskLevel === "CRITICAL";
          const isHigh = point.riskLevel === "HIGH";

          return (
            <button
              key={point.id}
              onClick={() => handleMarkerClick(point)}
              className={`flex flex-col text-left rounded-xl border p-2.5 transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500 shadow-sm"
                  : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#10245e]">{point.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                    isCritical
                      ? "bg-rose-100 text-rose-700"
                      : isHigh
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {point.hazardScore}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-[10px] text-slate-500">{point.dominantRisk}</p>
              <span className="mt-1.5 text-[9px] font-mono text-slate-400">{point.lat.toFixed(2)}°N, {point.lng.toFixed(2)}°E</span>
            </button>
          );
        })}
      </div>

      {/* Detail Overlay Card */}
      {selectedPoint && (
        <div className="relative z-10 mt-3 rounded-xl border border-slate-200 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white p-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-[#10245e]">{selectedPoint.name} District Hazard Profile</h4>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  selectedPoint.riskLevel === "CRITICAL"
                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                    : selectedPoint.riskLevel === "HIGH"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}>
                  {selectedPoint.riskLevel} HAZARD
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{selectedPoint.dominantRisk}</p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <Clock className="h-3.5 w-3.5" />
              <span>SLA Target: {selectedPoint.slaDays} Days</span>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Assigned Bankable DPR</span>
                <span className="font-semibold text-slate-800 text-[11px]">{selectedPoint.activeDprTitle}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Lead Institutional Partner</span>
                <span className="font-semibold text-slate-800 text-[11px]">{selectedPoint.leadInstitution}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Risk Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-700">Filter Hazard Level:</span>
            {["ALL", "CRITICAL", "HIGH", "MODERATE"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterRisk(level)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                  filterRisk === level
                    ? "bg-slate-900 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> Critical (Score ≥ 80)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> High (Score 70-79)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Moderate (Score &lt; 70)
            </span>
          </div>
        </div>
      )}

      {/* Google Maps Container or Interactive Vector View */}
      {isLoaded && apiKey ? (
        <div className="w-full rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ height }}>
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={JHARKHAND_CENTER}
            zoom={7.4}
            options={{
              styles: DARK_MAP_STYLES,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {filteredPoints.map((point) => (
              <MarkerF
                key={point.id}
                position={{ lat: point.lat, lng: point.lng }}
                onClick={() => handleMarkerClick(point)}
                icon={getMarkerIcon(point.riskLevel)}
              />
            ))}

            {selectedPoint && (
              <InfoWindowF
                position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
                onCloseClick={() => setSelectedPoint(null)}
              >
                <div className="p-1 max-w-xs font-sans text-slate-900">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-bold text-xs">{selectedPoint.name}</span>
                    <span className="text-[10px] font-bold text-rose-600">
                      Hazard: {selectedPoint.hazardScore}/100
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-700 font-medium">
                    {selectedPoint.dominantRisk}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Lead: {selectedPoint.leadInstitution}
                  </p>
                  <div className="mt-1 text-[10px] text-emerald-700 font-semibold">
                    DPR: {selectedPoint.activeDprTitle}
                  </div>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        </div>
      ) : (
        renderFallbackVisualizer()
      )}
    </div>
  );
}
