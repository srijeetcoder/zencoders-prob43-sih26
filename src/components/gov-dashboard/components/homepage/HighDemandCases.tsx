import { ArrowUp, MapPin, Flame } from "lucide-react";

const highDemandCases = [
  {
    title: "Drinking Water Shortage in Ratu Road",
    location: "Ranchi",
    votes: 342,
    status: "Open",
  },
  {
    title: "Broken Sewage Lines in Pardih",
    location: "Jamshedpur",
    votes: 289,
    status: "Open",
  },
  {
    title: "Unsafe Road near Bokaro Steel City",
    location: "Bokaro",
    votes: 241,
    status: "Under Analysis",
  },
  {
    title: "Power Cuts in Bastacola Area",
    location: "Dhanbad",
    votes: 198,
    status: "Matching Teams",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-rose-50 text-rose-600",
  "Under Analysis": "bg-amber-50 text-amber-600",
  "Matching Teams": "bg-navy-100 text-navy-700",
  "In Progress": "bg-brand-100 text-brand-700",
};

function HighDemandCases() {
  return (
    <section className="px-8 pb-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Flame size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-900">
              High-Demand Cases
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Problems the community is talking about most ·
              सबसे अधिक वोट वाले मामले
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {highDemandCases.map((item, index) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-sm font-bold text-white">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-navy-900">
                  {item.title}
                </h3>

                <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {item.location}
                  </span>

                  <span className="flex items-center gap-1 font-medium text-navy-600">
                    <ArrowUp size={14} />
                    {item.votes} votes
                  </span>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HighDemandCases;