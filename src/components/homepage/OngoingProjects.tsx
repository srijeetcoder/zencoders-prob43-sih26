import { MapPin, Users, ArrowRight } from "lucide-react";

/* Dummy Data */
const projects = [
  {
    title: "Community Road Repair",
    location: "Salt Lake, Sector V",
    progress: 72,
  },
  {
    title: "Clean Streets Initiative",
    location: "College More",
    progress: 55,
  },
  {
    title: "Better Street Lighting",
    location: "Karunamoyee",
    progress: 84,
  },
  {
    title: "Neighbourhood Water Project",
    location: "Sector I",
    progress: 40,
  },
];

function OngoingProjects() {
  return (
    <section className="px-8 pb-8">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#10245e]">
            Ongoing Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Solutions being built by the community
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
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
              border border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="h-40 bg-emerald-50" />

            <div className="p-5">

              <h3 className="text-lg font-semibold text-[#10245e]">
                {project.title}
              </h3>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={15} />
                {project.location}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-500">
                    Project progress
                  </span>

                  <span className="font-semibold text-emerald-600">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <button className="mt-4 text-sm font-semibold text-emerald-600">
                View project →
              </button>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

export default OngoingProjects;
