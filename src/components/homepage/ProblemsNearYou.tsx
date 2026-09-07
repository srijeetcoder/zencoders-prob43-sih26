import { MapPin, Clock, ArrowRight } from "lucide-react";

/* Dummy Data */
const problems = [
  {
    title: "Pothole on Main Road",
    location: "Salt Lake, Sector V",
    time: "2 hours ago",
  },
  {
    title: "Street Light Not Working",
    location: "College More",
    time: "5 hours ago",
  },
  {
    title: "Garbage Collection Issue",
    location: "Karunamoyee",
    time: "Yesterday",
  },
];

function ProblemsNearYou() {
  return (
    <section className="px-8 pb-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#10245e]">
            Problems Near You
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See what's happening around your community
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="relative h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-emerald-50">

          <div className="flex h-full items-center justify-center">
          </div>

          <button
            className="
              absolute bottom-4 right-4
              rounded-xl bg-white
              px-4 py-2
              text-sm font-medium
              text-[#10245e]
              shadow-sm
              hover:bg-slate-50
            "
          >
            Use my location
          </button>
        </div>

        <div className="space-y-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-5
                transition
                hover:-translate-y-0.5
                hover:shadow-sm
              "
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <h3 className="font-semibold text-[#10245e]">
                    {problem.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={15} />
                    {problem.location}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={14} />
                    {problem.time}
                  </div>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                  Open
                </span>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProblemsNearYou;
