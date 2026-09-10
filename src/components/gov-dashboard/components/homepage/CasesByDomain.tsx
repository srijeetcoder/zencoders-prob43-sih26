import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const domainData = [
  { name: "Infrastructure", count: 348 },
  { name: "Healthcare", count: 195 },
  { name: "Environment", count: 172 },
  { name: "Education", count: 151 },
  { name: "Agriculture", count: 118 },
  { name: "Others", count: 256 },
];

function CasesByDomain() {
  return (
    <section className="px-8 pb-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">
              Cases Ranked by Domain
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              How reported problems are distributed across sectors ·
              क्षेत्र के अनुसार मामले
            </p>
          </div>
        </div>

        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData} barSize={44}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#475569", fontSize: 13 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                width={36}
              />

              <Tooltip
                cursor={{ fill: "rgba(21, 49, 87, 0.06)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
              />

              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {domainData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? "#0d9488" : "#153157"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default CasesByDomain;