import { MapPin, Calendar, Sparkles } from "lucide-react";

interface UniversityPartner {
  id: string;
  name: string;
  location: string;
  partnershipType: string;
  since: string;
  logo?: string;
}

/** Temporary data — replace with API response when backend is ready */
const UNIVERSITY_PARTNERS: UniversityPartner[] = [
  {
    id: "1",
    name: "IIT Kharagpur",
    location: "Kharagpur, West Bengal",
    partnershipType: "Research Partner",
    since: "2024",
  },
  {
    id: "2",
    name: "Jadavpur University",
    location: "Kolkata, West Bengal",
    partnershipType: "Academic Partner",
    since: "2024",
  },
  {
    id: "3",
    name: "MAKAUT",
    location: "Kolkata, West Bengal",
    partnershipType: "Innovation Partner",
    since: "2025",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

interface UniversityPartnersPageProps {
  universities?: UniversityPartner[];
}

function UniversityPartnersPage({
  universities = UNIVERSITY_PARTNERS,
}: UniversityPartnersPageProps) {
  return (
    <div className="relative w-full overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl" />

      <div className="relative mb-12 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700">
          <Sparkles size={13} />
          Our Academic Network
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#10245e] sm:text-4xl">
          Universities growing
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {" "}
            with us
          </span>
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-500">
          Institutions partnering with us to expand research, innovation, and
          student opportunities across the platform.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {universities.map((partner, index) => (
          <div
            key={partner.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 opacity-90 transition-opacity group-hover:opacity-100" />

            <div className="relative mb-5 flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-lg font-bold text-emerald-700 shadow-inner transition-transform duration-300 group-hover:scale-105">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(partner.name)
                )}
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                Est. {partner.since}
              </span>
            </div>

            <div className="mb-4 flex-1">
              <h3 className="text-lg font-semibold tracking-tight text-[#10245e]">
                {partner.name}
              </h3>
              <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
                {partner.partnershipType}
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <MapPin size={14} className="shrink-0 text-emerald-500" />
              <span className="truncate">{partner.location}</span>
            </div>

            <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-emerald-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UniversityPartnersPage;
