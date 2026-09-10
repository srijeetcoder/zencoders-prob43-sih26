import { Activity, UserPlus, BrainCircuit, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getToday() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const actions = [
  {
    label: "Review Live Problems",
    icon: Activity,
    path: "/gov/live-problems",
  },
  {
    label: "Form Executive Team",
    icon: UserPlus,
    path: "/gov/create-team",
  },
  {
    label: "Run AI Analysis",
    icon: BrainCircuit,
    path: "/gov/ai-analysis",
  },
];

const todaysSummary = [
  { label: "New reports", value: "12" },
  { label: "Awaiting approval", value: "3" },
  { label: "Over-due", value: "5" },
];

function WelcomeBack() {
  return (
    <section className="px-8 py-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 px-8 py-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-green-900">
              {getGreeting()} · {getToday()}
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-navy-900 sm:text-5xl">
              Welcome back,{" "}
              <span className="text-green-600">Officer</span>.
            </h1>

            <p className="mt-2 text-sm font-medium text-green-900">
              आपका स्वागत है।
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              You're signed in as a Government of Jharkhand employee on the
              PooKar Civic Dashboard. Review new reports, track resolutions,
              and coordinate with your departments and teams.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {actions.map(({ label, icon: Icon, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="
                    flex items-center gap-2
                    rounded-xl
                    border border-slate-200
                    bg-white
                    px-5 py-3
                    text-sm font-semibold
                    text-navy-900
                    transition-colors
                    hover:bg-green-50
                  "
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Mail size={14} />
              Today's Summary
            </p>

            <div className="mt-3 flex gap-6">
              {todaysSummary.map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-bold text-navy-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomeBack;