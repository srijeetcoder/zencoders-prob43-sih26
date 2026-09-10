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
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/90 via-[#eef9f3] to-[#d6f5e5] p-8 sm:p-10 border border-emerald-200/90 shadow-sm">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-3.5 py-1 text-xs font-bold text-white shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              {getGreeting()} · {getToday()}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Welcome back,{" "}
              <span className="text-emerald-700">Officer</span>.
            </h1>

            <p className="mt-1.5 text-sm font-bold text-emerald-900">
              झारखंड सरकार नागरिक समाधान मंच · आपका स्वागत है।
            </p>

            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
              You're signed in to the PooKar Executive Command Dashboard. Review verified citizen grievances, monitor live district telemetry, and track real-time resolution workflows.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {actions.map(({ label, icon: Icon, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="
                    group
                    flex items-center gap-2.5
                    rounded-xl
                    border border-emerald-300/90
                    bg-white
                    px-5 py-3
                    text-xs font-bold
                    text-slate-800
                    shadow-xs
                    transition-all
                    hover:border-emerald-700 hover:bg-emerald-700 hover:text-white
                    sm:text-sm
                  "
                >
                  <Icon size={17} className="text-emerald-700 transition-colors group-hover:text-white" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/90 bg-white/95 p-6 shadow-sm backdrop-blur-md">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Mail size={15} className="text-emerald-700" />
              Today's Summary
            </p>

            <div className="mt-4 flex gap-6 sm:gap-8">
              {todaysSummary.map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-black text-slate-900 sm:text-3xl">{item.value}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600">{item.label}</p>
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
