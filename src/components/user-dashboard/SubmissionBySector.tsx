import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const totalProblems = 1240;

const sectorData = [
  { name: "Infrastructure", value: 28 },
  { name: "Environment", value: 22 },
  { name: "Healthcare", value: 15 },
  { name: "Education", value: 12 },
  { name: "Agriculture", value: 10 },
  { name: "Others", value: 13 },
];

const sectorColors = [
  "#4A90E2",
  "#45B98A",
  "#E95B5B",
  "#F5B94C",
  "#D98B7A",
  "#8B7BC8",
];

function SubmissionsBySector() {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Problem Submissions by Sector
        </h2>

        <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 outline-none">
          <option>Last 6 Months</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative h-[220px] w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={1}
              >
                {sectorData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={sectorColors[index]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900">
              {totalProblems.toLocaleString()}
            </span>

            <span className="text-xs text-slate-500">
              Total
            </span>
          </div>
        </div>

        <div className="mr-4 flex flex-col gap-3">
          {sectorData.map((sector, index) => (
            <div
              key={sector.name}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: sectorColors[index],
                }}
              />

              <span className="w-28 text-slate-600">
                {sector.name}
              </span>

              <span className="font-medium text-slate-700">
                {sector.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubmissionsBySector;
