import { useEffect, useRef } from "react";
import { mapMarkers } from "../data/mockData";

export default function ImpactMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      const getColor = (label) => {
        if (label === "50+") return "#087f5b";
        if (label === "10-50") return "#d97706";
        return "#94a3b8";
      };

      const getSize = (label) => {
        if (label === "50+") return 12;
        if (label === "10-50") return 9;
        return 6;
      };

      mapMarkers.forEach((marker) => {
        const color = getColor(marker.label);
        const size = getSize(marker.label);

        const icon = L.divIcon({
          html: `<div style="
            width: ${size * 2}px;
            height: ${size * 2}px;
            background: ${color};
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "></div>`,
          className: "",
          iconSize: [size * 2, size * 2],
          iconAnchor: [size, size],
        });

        L.marker([marker.lat, marker.lng], { icon })
          .bindPopup(
            `<div style="font-family: inherit; padding: 2px;">
              <p style="font-weight: 700; font-size: 13px; color: #10245e; margin: 0;">${marker.city}</p>
              <p style="font-size: 11px; color: #64748b; margin: 2px 0 0;">${marker.projects} projects</p>
            </div>`
          )
          .addTo(map);
      });

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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-[#10245e]">Impact Across India</h3>
      <div className="relative h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50">
        <div ref={mapRef} className="h-full w-full" />
        <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#087f5b]" />
              <span className="text-slate-600">50+ projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">10 – 50 projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-slate-600">1 – 10 projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
