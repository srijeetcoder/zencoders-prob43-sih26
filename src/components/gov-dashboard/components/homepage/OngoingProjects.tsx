import { useState, useEffect } from "react";
import { MapPin, ArrowRight, FolderKanban } from "lucide-react";
import { governmentApi, type ActiveProject } from "../../../../services/api";

function OngoingProjects() {
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-8 pb-8">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">
            Ongoing Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Solutions being built by the community · चल रही परियोजनाएँ
          </p>
        </div>

        <button className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-white border border-dashed border-slate-200">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <FolderKanban size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No Data to Show</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            No community projects currently active. When solutions are matched and sanctioned, they will appear here.
          </p>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-3">
          {projects.map((project) => (
            <div
              key={project.id || project.title}
              className="
                min-w-[300px]
                overflow-hidden
                rounded-2xl
                border border-slate-200/90
                bg-white
                shadow-sm
                transition-all
                hover:border-emerald-300
                hover:shadow-md
              "
            >
              <div className="h-36 bg-gradient-to-br from-emerald-100/90 via-teal-50 to-slate-100 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-800 bg-white/90 px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                  Active Project
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900">
                  {project.title}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <MapPin size={15} className="text-emerald-700" />
                  {project.district || "Jharkhand"}
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      Project progress
                    </span>

                    <span className="font-bold text-emerald-700">
                      {project.progressPercentage || 0}%
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-700 transition-all duration-500"
                      style={{ width: `${project.progressPercentage || 0}%` }}
                    />
                  </div>
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