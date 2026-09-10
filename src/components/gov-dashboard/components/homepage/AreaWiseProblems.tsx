import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const areaData = [
  { name: "Ranchi", value: 26 },
  { name: "Jamshedpur", value: 19 },
  { name: "Dhanbad", value: 16 },
  { name: "Bokaro", value: 12 },
  { name: "Hazaribagh", value: 9 },
  { name: "Deoghar", value: 8 },
  { name: "Others", value: 10 },
];

const areaColors = [
  "#153157",
  "#1e4273",
  "#27518c",
  "#0a6ab5",
  "#1683d0",
  "#0d9488",
  "#99f6e4",
];

function AreaWiseProblems() {
  return (
    <section className="px-8 pb-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-navy-900">
            Area-Wise Problem Distribution
          </h2>

<p className="mt-0.5 text-sm text-slate-500">
              Where problems are being reported across Jharkhand ·
              क्षेत्रवार समस्याएँ
            </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={areaData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {areaData.map((entry, index) => (
                    <Cell key={entry.name} fill={areaColors[index]} />
                  ))}
                </Pie>

                <Tooltip
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
                  formatter={(value) => (
                    <span className="text-sm text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3">
            {areaData.map((area, index) => (
              <div key={area.name} className="flex items-center gap-3 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: areaColors[index] }}
                />

                <span className="w-28 text-slate-600">{area.name}</span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${area.value * 2}%`,
                      backgroundColor: areaColors[index],
                    }}
                  />
                </div>

                <span className="w-12 text-right font-semibold text-navy-800">
                  {area.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AreaWiseProblems;