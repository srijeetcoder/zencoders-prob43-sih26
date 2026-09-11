import { useState } from "react";
import {
  Building2,
  Cpu,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  Activity,
  Award,
} from "lucide-react";

export default function AdminCenterPage() {
  const [activeTab, setActiveTab] = useState<"LABS" | "GRANTS" | "COMPLIANCE">("LABS");

  const labs = [
    {
      id: "lab-01",
      name: "IoT & Embedded Urban Hydrology Lab",
      head: "Dr. Anirban Mukherjee",
      activeTeams: 3,
      equipmentStatus: "Calibrated & Operational",
      grantSanctioned: "₹ 18.5 Lakhs",
      specialization: "Ultrasonic Silt Profiling, LoRaWAN Telemetry, IP68 Node Fabrication",
    },
    {
      id: "lab-02",
      name: "Centre for Renewable Microgrids & Storage",
      head: "Dr. Sunita Murmu",
      activeTeams: 2,
      equipmentStatus: "Calibrated & Operational",
      grantSanctioned: "₹ 14.2 Lakhs",
      specialization: "Solar MPPT Optimization, LiFePO4 Battery Testbeds, Microinverter Diagnostics",
    },
    {
      id: "lab-03",
      name: "Subsurface Mine Safety & Gas Telemetry Center",
      head: "Prof. Rajesh Sengupta",
      activeTeams: 4,
      equipmentStatus: "Calibrated & Operational",
      grantSanctioned: "₹ 15.8 Lakhs",
      specialization: "Thermal Imaging, ATEX/IS Certified Methane Nodes, Seismic MEMS Sensors",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <ShieldCheck size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
              Institutional Admin Center & Lab Command
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Control institutional laboratory allocations, equipment telemetry health, state grant disbursements, and AISHE compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold font-mono">
            AISHE: U-0268
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab("LABS")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "LABS"
              ? "bg-white text-indigo-950 shadow-xs border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Research Labs & Facilities
        </button>
        <button
          onClick={() => setActiveTab("GRANTS")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "GRANTS"
              ? "bg-white text-indigo-950 shadow-xs border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Grant Disbursement Ledger
        </button>
        <button
          onClick={() => setActiveTab("COMPLIANCE")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "COMPLIANCE"
              ? "bg-white text-indigo-950 shadow-xs border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          AISHE State Telemetry
        </button>
      </div>

      {/* LABS TAB */}
      {activeTab === "LABS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                      <Cpu size={18} />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      OPERATIONAL
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#10245e]">
                    {lab.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Lead: <strong>{lab.head}</strong></p>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {lab.specialization}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">{lab.activeTeams} Teams Active</span>
                  <span className="font-mono font-bold text-indigo-950">{lab.grantSanctioned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRANTS TAB */}
      {activeTab === "GRANTS" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#10245e]">
              Institutional Innovation Grant Disbursement Ledger (AY 2026-27)
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Total Disbursed: ₹ 48,50,000
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Sanction ID</th>
                  <th className="py-2.5 px-3">Beneficiary Student Team</th>
                  <th className="py-2.5 px-3">Faculty Guide</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">State Department</th>
                  <th className="py-2.5 px-3">Disbursement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">#GR-2026-081</td>
                  <td className="py-2.5 px-3 font-semibold text-[#10245e]">Team HydroSense</td>
                  <td className="py-2.5 px-3">Dr. Anirban Mukherjee</td>
                  <td className="py-2.5 px-3 font-mono font-bold">₹ 1,25,000</td>
                  <td className="py-2.5 px-3">Ranchi Municipal Corp</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">DISBURSED TO LAB</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">#GR-2026-044</td>
                  <td className="py-2.5 px-3 font-semibold text-[#10245e]">Team GeoShield</td>
                  <td className="py-2.5 px-3">Prof. Rajesh Sengupta</td>
                  <td className="py-2.5 px-3 font-mono font-bold">₹ 2,10,000</td>
                  <td className="py-2.5 px-3">Dept of Mines & Geology</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">DISBURSED TO LAB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === "COMPLIANCE" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-[#10245e]">
              National AISHE & Jharkhand Higher Education Innovation Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-[11px] block">Institutional Standing</span>
              <p className="text-slate-600 leading-relaxed">
                Birsa Institute of Technology (BIT Mesra) holds Category-1 Autonomy and NAAC A+ accreditation. Telemetry feeds to the state government are authenticated via DoT encrypted API channels.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-950 text-[11px] block flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                State Innovation Cell Audit
              </span>
              <p className="text-emerald-900 leading-relaxed">
                Audited & Certified by Department of Higher & Technical Education, Government of Jharkhand (Audit Token: JH-UNIV-2026-042).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
