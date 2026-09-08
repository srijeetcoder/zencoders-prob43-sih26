import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import Card from "../ui/Card";
import { locationData } from "../../data/mockData";

function MapInner() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: locationData.center,
        zoom: locationData.zoom,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const reportedIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:#ef4444;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const affectedIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:#f87171;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);opacity:0.8;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.circle(locationData.center, {
        radius: 500,
        color: "#f87171",
        fillColor: "#fca5a5",
        fillOpacity: 0.2,
        weight: 1,
      }).addTo(map);

      L.marker(
        [locationData.reportedLocation.lat, locationData.reportedLocation.lng],
        { icon: reportedIcon }
      )
        .addTo(map)
        .bindPopup(
          `<div class="text-sm"><strong>${locationData.reportedLocation.label}</strong><br/>Reported Location</div>`
        );

      L.marker(
        [locationData.affectedArea.lat, locationData.affectedArea.lng],
        { icon: affectedIcon }
      )
        .addTo(map)
        .bindPopup(
          `<div class="text-sm"><strong>${locationData.affectedArea.label}</strong><br/>Affected Area (AI)</div>`
        );

      mapInstance.current = map;
    });

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
}

export default function LocationAnalysis() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-accent-wash flex items-center justify-center">
          <MapPin className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-ink">Location Analysis</h2>
      </div>

      <div className="h-72 rounded-lg overflow-hidden border border-line relative">
        <MapInner />

        <div className="absolute top-3 right-3 bg-white rounded-lg shadow-md p-3 z-[1000] text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow" />
            <span className="text-ink-2">Reported Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300 border border-white shadow opacity-80" />
            <span className="text-ink-2">Affected Area (AI)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-cyan-600" />
            <span className="text-ink-2">Drainage Network</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-cyan-100 border border-cyan-200" />
            <span className="text-ink-2">Low Elevation Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-ink-2">Past Incidents (Nearby)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
