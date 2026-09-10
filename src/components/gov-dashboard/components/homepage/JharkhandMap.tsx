import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jharkhandData from "../../data/jharkhand.json";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const hotspots = [
  {
    title: "Drinking Water Shortage",
    location: "Ratu Road, Ranchi",
    position: [23.3441, 85.3096] as [number, number],
    severity: "High" as const,
  },
  {
    title: "Broken Sewage Lines",
    location: "Pardih, Jamshedpur",
    position: [22.8046, 86.2029] as [number, number],
    severity: "High" as const,
  },
  {
    title: "Unsafe Road Condition",
    location: "Bokaro Steel City",
    position: [23.6693, 86.1511] as [number, number],
    severity: "Medium" as const,
  },
  {
    title: "Frequent Power Cuts",
    location: "Bastacola, Dhanbad",
    position: [23.7957, 86.4304] as [number, number],
    severity: "Medium" as const,
  },
  {
    title: "Garbage Collection Gap",
    location: "Hazaribagh",
    position: [23.9925, 85.3637] as [number, number],
    severity: "Low" as const,
  },
];

const SEVERITY_MARKER_COLOR: Record<string, string> = {
  High: "#e11d48",
  Medium: "#f59e0b",
  Low: "#0d9488",
};

function JharkhandMap() {
  return (
    <MapContainer
      center={[23.6, 85.5]}
      zoom={7}
      minZoom={6}
      maxZoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GeoJSON
        data={jharkhandData}
        style={{
          color: "#153157",
          weight: 1.5,
          fillColor: "#1683d0",
          fillOpacity: 0.18,
        }}
        onEachFeature={(feature, layer) => {
          const props = feature.properties as { district?: string } | null;
          layer.bindTooltip(props?.district ?? "Jharkhand", {
            sticky: true,
            className: "jharkhand-tooltip",
          });
        }}
      />

      {hotspots.map((spot) => (
        <Marker
          key={spot.title}
          position={spot.position}
          icon={L.divIcon({
            className: "sp-div-icon",
            html: `<div style="width:14px;height:14px;border-radius:9999px;background:${SEVERITY_MARKER_COLOR[spot.severity]};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          })}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-navy-900">{spot.title}</p>
              <p className="text-slate-500">{spot.location}</p>
              <p className="mt-1 text-xs font-medium text-navy-600">
                {spot.severity} priority
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default JharkhandMap;