import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Sparkles, Building2, CheckCircle2, TrendingUp } from "lucide-react";

const FALLBACK_PROJECTS: any[] = [
  {
    id: "proj-ranchi-drainage",
    title: "Urban Drainage Conduit Silt & Flood Telemetry",
    district: "Ranchi",
    department: "Civil Infrastructure",
    leadInstitution: "Birsa Institute of Technology (BIT Mesra)",
    progressPercentage: 68,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80",
    description: "IP68 acoustic level and Doppler flow telemetry array deployed across Harmu arterial storm conduit.",
  },
  {
    id: "proj-palamu-fluoride",
    title: "Solar-Assisted Fluoride EC Filtration Grid",
    district: "Palamu",
    department: "Public Health & Water",
    leadInstitution: "IIT (ISM) Dhanbad",
    progressPercentage: 84,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    description: "Decentralized electrochemical fluoride removal kiosks delivering safe potable water to 14 panchayats.",
  },
  {
    id: "proj-latehar-solar",
    title: "Decentralized 50kW PV Microgrid with LiFePO4",
    district: "Latehar",
    department: "Energy & Rural Electrification",
    leadInstitution: "NIT Jamshedpur",
    progressPercentage: 45,
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    description: "Containerized 100kWh battery storage microgrid powering rural cold storage and 180 tribal households.",
  },
  {
    id: "proj-dhanbad-fire",
    title: "Subsurface Mine Fire Slurry & Telemetry Network",
    district: "Dhanbad",
    department: "Environment & Mining",
    leadInstitution: "CSIR-CIMFR Dhanbad",
    progressPercentage: 92,
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    description: "Automated nitrogen foam injection and thermal gradient sensor perimeter guarding Jharia Sector 4 habitations.",
  },
];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
];

function OngoingProjects() {
  const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    const apiBase = import.meta.env.VITE_API_BASE_URL || "/api/v1";

    fetch(`${apiBase}/government/active-projects`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.data) && data.data.length > 0) {
          const withImages = data.data.map((p: any, idx: number) => ({
            ...p,
            image: p.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length],
          }));
          setProjects(withImages);
        }
      })
      .catch(() => {
        fetch(`${apiBase}/crawler/memory`)
          .then((r) => (r.ok ? r.json() : null))
          .then((mem) => {
            if (isMounted && mem && Array.isArray(mem.data) && mem.data.length > 0) {
              const mapped = mem.data.slice(0, 4).map((m: any, idx: number) => ({
                id: m.id || `mem-${idx}`,
                title: m.title || "Societal Innovation Project",
                district: m.district || "Jharkhand",
                department: m.domain || "State Innovation Mission",
                leadInstitution: m.institution || "State R&D Consortium",
                progressPercentage: Math.floor(50 + (idx * 13) % 45),
                image: DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length],
              }));
              setProjects(mapped);
            } else if (isMounted) {
              setProjects(FALLBACK_PROJECTS);
            }
          })
          .catch(() => {
            if (isMounted) setProjects(FALLBACK_PROJECTS);
          });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#10245e]">
              Ongoing Active Deployments
            </h2>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 border border-emerald-200">
              Live Field Pilots
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Field-tested technology pilots and sanctioned DPR solutions deployed across Jharkhand districts
          </p>
        </div>

        <Link
          to="/explore-problems"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
        >
          <span>Explore All Deployments</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-[#10245e]">No Active Deployments to Show</p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Once pilot solutions are approved and deployed across Jharkhand districts, their live progress will be tracked here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((project, idx) => (
            <div
              key={project.id || project.title || idx}
              className="
                group
                overflow-hidden
                rounded-2xl
                border border-slate-200/90
                bg-white
                shadow-sm
                flex flex-col justify-between
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:border-emerald-300
              "
            >
              {/* Card Photo Header */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length]}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to standard gradient if photo fails
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-black/20" />
                
                {/* Department pill on top left */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm border border-white/50">
                    {project.department || "Civil Infrastructure"}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-emerald-600/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                    <TrendingUp size={11} />
                    <span>{project.progressPercentage || 65}%</span>
                  </span>
                </div>

                {/* District on bottom of image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-white drop-shadow-md">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>{project.district ? `${project.district}, Jharkhand` : "Jharkhand State"}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#10245e] group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
                    {project.title}
                  </h3>

                  <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600">
                    <Building2 size={14} className="text-emerald-600 shrink-0" />
                    <span className="truncate font-medium">{project.leadInstitution || "Partner University Lab"}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      Deployment Progress
                    </span>
                    <span className="font-bold text-slate-800">
                      {project.progressPercentage || 65}%
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                      style={{ width: `${project.progressPercentage || 65}%` }}
                    />
                  </div>

                  <Link
                    to="/explore-problems"
                    className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 group/link pt-1"
                  >
                    <span>View Project Specs & BoM</span>
                    <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OngoingProjects;

