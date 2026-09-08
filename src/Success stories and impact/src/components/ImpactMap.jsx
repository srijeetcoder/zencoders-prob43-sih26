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
        if (label === "50+") return "#22c55e";
        if (label === "10-50") return "#eab308";
        return "#9ca3af";
      };

      const getSize = (label) => {
        if (label === "50+") return 14;
        if (label === "10-50") return 10;
        return 7;
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
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          "></div>`,
          className: "",
          iconSize: [size * 2, size * 2],
          iconAnchor: [size, size],
        });

        L.marker([marker.lat, marker.lng], { icon })
          .bindPopup(
            `<div style="font-family: Geist Variable, sans-serif; padding: 2px;">
              <p style="font-weight: 600; font-size: 13px; margin: 0;">${marker.city}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0;">${marker.projects} projects</p>
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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Impact Across India</h3>
      <div className="relative h-[280px] rounded-lg overflow-hidden">
        <div ref={mapRef} className="h-full w-full" />
        <div className="absolute bottom-2 left-2 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">50+ projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-gray-600">10 – 50 projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-600">1 – 10 projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
