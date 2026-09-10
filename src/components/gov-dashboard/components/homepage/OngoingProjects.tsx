import { MapPin, ArrowRight } from "lucide-react";

/* Dummy Data */
const projects = [
  {
    title: "Ratu Road Water Supply",
    location: "Ranchi",
    progress: 72,
  },
  {
    title: "Clean Streets Initiative",
    location: "Bistupur, Jamshedpur",
    progress: 55,
  },
  {
    title: "Street Lighting Upgrade",
    location: "Bokaro City",
    progress: 84,
  },
  {
    title: "Neighbourhood Drainage Project",
    location: "Dhanbad",
    progress: 40,
  },
];

function OngoingProjects() {
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

      <div className="flex gap-5 overflow-x-auto pb-3">
        {projects.map((project) => (
          <div
            key={project.title}
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
                {project.location}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    Project progress
                  </span>

                  <span className="font-bold text-emerald-700">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <button className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors">
                View project details →
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

export default OngoingProjects;