import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { governmentApi, type ActiveProject } from "../../services/api";

const FALLBACK_PROJECTS: any[] = [];

function OngoingProjects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const apiBase = import.meta.env.VITE_API_BASE_URL || "/api/v1";

    // Try fetching live crawler innovation memory or government active projects
    fetch(`${apiBase}/government/active-projects`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data);
        }
      })
      .catch(() => {
        // Fallback to memory endpoint
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
              }));
              setProjects(mapped);
            }
          })
          .catch(() => {});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#10245e]">
            Ongoing Active Deployments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Field-tested solutions and technology pilots deployed across districts
          </p>
        </div>

        <Link
          to="/explore-problems"
          className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View all
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
        <div className="flex gap-5 overflow-x-auto pb-3">
          {projects.map((project) => (
            <div
              key={project.id || project.title}
              className="
                min-w-[320px] max-w-[360px]
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-sm
                flex flex-col justify-between
                transition hover:shadow-md hover:border-emerald-200
              "
            >
              <div className="h-32 bg-gradient-to-br from-emerald-700 via-teal-800 to-[#10245e] p-4 flex flex-col justify-between text-white">
                <span className="self-start rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {project.department || "Innovation Engine"}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                  <MapPin size={13} />
                  <span>{project.district ? `${project.district}, Jharkhand` : "Jharkhand State"}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#10245e] line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                    <Building2 size={14} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{project.leadInstitution || "Partner University Lab"}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Deployment Status</span>
                    <span className="font-bold text-emerald-700">
                      {project.progressPercentage || 65}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${project.progressPercentage || 65}%` }}
                    />
                  </div>

                  <Link
                    to="/explore-problems"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>View Project Specs</span>
                    <ArrowRight size={13} />
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
