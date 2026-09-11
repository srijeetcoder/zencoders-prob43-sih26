import { MapPin, Calendar, Sparkles } from "lucide-react";

interface UniversityPartner {
  id: string;
  name: string;
  location: string;
  partnershipType: string;
  since: string;
  logo: string;
}

const UNIVERSITY_PARTNERS: UniversityPartner[] = [
  {
    id: "1",
    name: "IIT (ISM) Dhanbad",
    location: "Dhanbad, Jharkhand",
    partnershipType: "Mine Safety & Subsurface Thermal Grid Lab",
    since: "2023",
    logo: "/sample-assets/partner-meity.png",
  },
  {
    id: "2",
    name: "BIT Mesra (Birsa Institute of Technology)",
    location: "Ranchi, Jharkhand",
    partnershipType: "IoT Telemetry & Smart Urban Drainage",
    since: "2023",
    logo: "/sample-assets/partner-sih.png",
  },
  {
    id: "3",
    name: "NIT Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    partnershipType: "Phase-Change Cold Storage & Clean Energy",
    since: "2024",
    logo: "/sample-assets/partner-aicte.png",
  },
  {
    id: "4",
    name: "CSIR - Central Institute of Mining and Fuel Research",
    location: "Dhanbad, Jharkhand",
    partnershipType: "Mine Fire Suppression & Disaster Research",
    since: "2023",
    logo: "/sample-assets/partner-nic.png",
  },
  {
    id: "5",
    name: "Birsa Agricultural University",
    location: "Ranchi, Jharkhand",
    partnershipType: "LiDAR Drone Agriculture & Soil Telemetry",
    since: "2024",
    logo: "/sample-assets/partner-vocal.png",
  },
  {
    id: "6",
    name: "IIT Kharagpur",
    location: "Kharagpur, West Bengal",
    partnershipType: "Cryogenic Phase-Change Medical Transit",
    since: "2024",
    logo: "/sample-assets/partner-moe.png",
  },
  {
    id: "7",
    name: "NIT Patna",
    location: "Patna, Bihar",
    partnershipType: "LoRa Mesh Riverine Flood Corridors",
    since: "2023",
    logo: "/sample-assets/partner-ihub.png",
  },
  {
    id: "8",
    name: "AIIMS Deoghar Research Hub",
    location: "Deoghar, Jharkhand",
    partnershipType: "Rural Telemedicine & Biomedical Telemetry",
    since: "2024",
    logo: "/sample-assets/partner-meity.png",
  },
  {
    id: "9",
    name: "Ranchi University Innovation Cell",
    location: "Ranchi, Jharkhand",
    partnershipType: "Urban Social Bottleneck Analytics",
    since: "2024",
    logo: "/sample-assets/partner-moe.png",
  },
];

interface UniversityPartnersPageProps {
  universities?: UniversityPartner[];
}

function UniversityPartnersPage({
  universities = UNIVERSITY_PARTNERS,
}: UniversityPartnersPageProps) {
  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-6 py-10 sm:py-12">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl" />

      <div className="relative mb-10 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Sparkles size={13} />
          National Academic & Lab Network
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#10245e] sm:text-4xl">
          Partner Institutions{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Powering Solutions
          </span>
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Accredited universities and R&D centers across Jharkhand and national institutes linked to the PooKar problem ledger.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {universities.map((partner, index) => (
          <div
            key={partner.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 opacity-90" />

            <div className="relative mb-4 flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                />
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                Partnered {partner.since}
              </span>
            </div>

            <div className="mb-4 flex-1">
              <h3 className="text-base font-bold tracking-tight text-[#10245e] leading-snug">
                {partner.name}
              </h3>
              <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200/80">
                {partner.partnershipType}
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <MapPin size={13} className="shrink-0 text-emerald-600" />
              <span className="truncate">{partner.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UniversityPartnersPage;
