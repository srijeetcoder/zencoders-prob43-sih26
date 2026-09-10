import { useEffect, useState } from "react";
import { governmentApi, type ActiveProject } from "../../services/api";

const STATUS_STYLES: Record<string, string> = {
  FIELD_VALIDATION: "bg-emerald-50 text-emerald-700 border-emerald-200",
  HARDWARE_CALIBRATION: "bg-blue-50 text-blue-700 border-blue-200",
  DEPLOYED_PILOT: "bg-purple-50 text-purple-700 border-purple-200",
  PROTOTYPING: "bg-amber-50 text-amber-700 border-amber-200",
};

const DEFAULT_PROJECTS: ActiveProject[] = [
  {
    id: "proj-001",
    title: "IoT Real-Time Smart Drainage Siltation Telemetry",
    district: "Ranchi",
    leadInstitution: "Birsa Institute of Technology (BIT Mesra)",
    department: "Urban Development & Housing Dept",
    budgetSanctioned: "₹ 14.8 Lakhs",
    progressPercentage: 74,
    readinessScore: 88,
    status: "FIELD_VALIDATION",
    hardwareBoMCount: 14,
    startDate: "2026-07-15",
    expectedCompletion: "2026-10-30",
  },
  {
    id: "proj-002",
    title: "Subsurface Thermal Imaging & Gas Telemetry Grid",
    district: "Dhanbad",
    leadInstitution: "IIT (ISM) Dhanbad & CSIR-CIMFR",
    department: "Dept of Mines & Geology",
    budgetSanctioned: "₹ 28.5 Lakhs",
    progressPercentage: 62,
    readinessScore: 92,
    status: "HARDWARE_CALIBRATION",
    hardwareBoMCount: 22,
    startDate: "2026-06-01",
    expectedCompletion: "2026-12-15",
  },
  {
    id: "proj-003",
    title: "Phase-Change Material Solar Cold-Chain Storage",
    district: "Ramgarh",
    leadInstitution: "NIT Jamshedpur Clean Energy Lab",
    department: "Health & Family Welfare Dept",
    budgetSanctioned: "₹ 9.2 Lakhs",
    progressPercentage: 81,
    readinessScore: 85,
    status: "DEPLOYED_PILOT",
    hardwareBoMCount: 9,
    startDate: "2026-05-20",
    expectedCompletion: "2026-09-30",
  },
  {
    id: "proj-004",
    title: "IoT Water Filtration & Heavy Metal Adsorption Unit",
    district: "Bokaro",
    leadInstitution: "Birsa Agricultural University & BIT Sindri",
    department: "Drinking Water & Sanitation Dept",
    budgetSanctioned: "₹ 18.0 Lakhs",
    progressPercentage: 45,
    readinessScore: 79,
    status: "PROTOTYPING",
    hardwareBoMCount: 16,
    startDate: "2026-08-01",
    expectedCompletion: "2027-01-20",
  },
];

function ActiveProjects() {
  const [projects, setProjects] = useState<ActiveProject[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getProjects().then((res) => {
      if (isMounted && res && res.length > 0) {
        setProjects(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white px-5 py-4 mx-5 my-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Active Institutional Innovation Pilots
          </h3>
          <p className="text-xs text-slate-500">Live academic research projects mapped to Jharkhand state departments</p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {projects.length} Active Deployments
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
              <th className="pb-2 pr-4 font-medium">Pilot Project</th>
              <th className="pb-2 pr-4 font-medium">District</th>
              <th className="pb-2 pr-4 font-medium">Lead Academic Partner</th>
              <th className="pb-2 pr-4 font-medium">Budget</th>
              <th className="pb-2 pr-4 font-medium">Progress</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
              >
                <td className="py-3 pr-4">
                  <div>
                    <span className="font-medium text-slate-900">
                      {project.title}
                    </span>
                    <p className="text-xs text-slate-400">{project.department}</p>
                  </div>
                </td>
                <td className="py-3 pr-4 font-medium text-slate-700">{project.district}</td>
                <td className="py-3 pr-4 text-xs text-slate-600">
                  {project.leadInstitution}
                </td>
                <td className="py-3 pr-4 text-xs font-semibold text-slate-800">
                  {project.budgetSanctioned}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {project.progressPercentage}%
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <span
                    className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                      STATUS_STYLES[project.status] || "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {project.status.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActiveProjects;
