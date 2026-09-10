import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rekha Devi",
    area: "Ranchi",
    role: "Resident",
    quote:
      "I filed a complaint about the water shortage in my ward at night. Within a week, the municipality team was on the ground fixing it. PooKar made my voice count.",
  },
  {
    name: "Suresh Kumar",
    area: "Jamshedpur",
    role: "Shop Owner",
    quote:
      "The broken sewage line outside my shop was getting worse every day. Reporting it here took two minutes, and the progress tracker kept me informed the whole time.",
  },
  {
    name: "Anita Verma",
    area: "Dhanbad",
    role: "Teacher",
    quote:
      "PooKar is how our community stays connected with the district office. You see the issue, the plan, and the result — real transparency.",
  },
];

function Testimonials() {
  return (
    <section className="px-8 pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-900">
          Voices from the Community
        </h2>

        <p className="mt-0.5 text-sm text-slate-500">
          Real people, real change across Jharkhand · समाज की आवाज़
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {testimonials.map((person) => (
          <div
            key={person.name}
            className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm"
          >
            <div>
              <Quote size={28} className="text-brand-400" />

              <p className="mt-4 leading-7 text-slate-600">{person.quote}</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 font-semibold text-white">
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div>
                <p className="font-semibold text-navy-900">{person.name}</p>
                <p className="text-xs text-slate-500">
                  {person.role} · {person.area}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;