import {
  BrainCircuit,
  Sparkles,
  Activity,
  AlertTriangle,
  Target,
  Gauge,
} from "lucide-react";
import type { ElementType } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface InsightStat {
  label: string;
  value: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
}

const insightStats: InsightStat[] = [
  {
    label: "Problems Analyzed",
    value: "1,240",
    icon: BrainCircuit,
    iconBg: "bg-navy-100",
    iconColor: "text-navy-700",
  },
  {
    label: "High-Severity Share",
    value: "38%",
    icon: AlertTriangle,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    label: "Avg. Resolution Time",
    value: "21 days",
    icon: Gauge,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  {
    label: "Prediction Accuracy",
    value: "86%",
    icon: Target,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

const domainData = [
  { name: "Infrastructure", count: 348 },
  { name: "Healthcare", count: 195 },
  { name: "Environment", count: 172 },
  { name: "Education", count: 151 },
  { name: "Agriculture", count: 118 },
  { name: "Others", count: 256 },
];

const severityData = [
  { name: "Low", value: 32 },
  { name: "Medium", value: 30 },
  { name: "High", value: 38 },
];

const severityColors = ["#99f6e4", "#f9a825", "#e11d48"];

const keyInsights = [
  {
    title: "Water infrastructure dominates",
    detail:
      "Pipelines, sewage and water supply account for the largest share of high-severity reports in the past 3 months.",
  },
  {
    title: "Monsoon seasonality detected",
    detail:
      "Road and drainage reports spike 2.1× between June–September; early repairs could cut damage claims.",
  },
  {
    title: "Rural access is the top gap",
    detail:
      "Healthcare and education complaints cluster in districts >40 km from district HQ (Simdega, Gumla, Dumka).",
  },
];

const impactData = [
  { sector: "Residents Reached", value: 2840 },
  { sector: "Teams Deployed", value: 96 },
  { sector: "Life-Years Saved (est.)", value: 1520 },
  { sector: "CO₂ Avoided (t)", value: 410 },
];

function AiAnalysis() {
  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <BrainCircuit size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">AI Analysis</h1>
          <p className="text-sm text-slate-500">
            Insights from community reports · एआई विश्लेषण
          </p>
        </div>
      </div>

      {/* Insight stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insightStats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
            >
              <Icon size={22} className={iconColor} />
            </div>

            <div className="min-w-0">
              <p className="text-xl font-bold text-navy-900">{value}</p>
              <p className="truncate text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">
            Cases by Domain
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            What citizens are reporting most
          </p>

          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} barSize={40}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={32}
                />
                <Tooltip
                  cursor={{ fill: "rgba(21, 49, 87, 0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill="#153157" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">
            Severity Distribution
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            By assessed priority
          </p>

          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={96}
                  paddingAngle={2}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={entry.name} fill={severityColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={9}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key insights */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
          <Sparkles size={18} className="text-teal-600" />
          Key Insights
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {keyInsights.map((insight) => (
            <div key={insight.title} className="rounded-2xl bg-slate-50 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <Activity size={15} className="text-teal-600" />
                {insight.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {insight.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact assessment */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {impactData.map((impact) => (
          <div
            key={impact.sector}
            className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-center"
          >
            <p className="text-3xl font-bold text-teal-700">
              {impact.value.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-600">{impact.sector}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Live AI telemetry analysis & predictive risk clustering · National Innovation Ledger
      </p>
    </div>
  );
}

export default AiAnalysis;