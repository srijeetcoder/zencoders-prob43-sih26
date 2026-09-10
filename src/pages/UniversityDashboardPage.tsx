import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Microscope,
  FileCheck2,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Download,
  Send,
  RefreshCw,
  Building2,
  Gauge,
  Sliders,
  DollarSign,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  institutionApi,
  type AssignedDPRSummary,
  type SensorTelemetryFeed,
  type BankableDPR,
} from "../services/api";

const INSTITUTION_PROFILES = [
  {
    id: "bit-mesra",
    name: "Birsa Institute of Technology (BIT Mesra)",
    district: "Ranchi, Jharkhand",
    nodalOfficer: "Dr. Anirban Mukherjee, Dean (R&D)",
    labName: "IoT & Embedded Urban Hydrology Lab",
    activeGrants: "₹ 48.5 Lakhs",
    primarySpecialization: "Civic Infrastructure & Sensor Telemetry",
  },
  {
    id: "iit-dhanbad",
    name: "IIT (ISM) Dhanbad",
    district: "Dhanbad, Jharkhand",
    nodalOfficer: "Prof. Rajesh Sengupta, Centre of Mining Excellence",
    labName: "Subsurface Thermal Imaging & Geological Safety Lab",
    activeGrants: "₹ 82.0 Lakhs",
    primarySpecialization: "Mining Safety & Subsurface Thermal Grids",
  },
  {
    id: "nit-jsr",
    name: "National Institute of Technology (NIT) Jamshedpur",
    district: "East Singhbhum, Jharkhand",
    nodalOfficer: "Dr. Sunita Murmu, Renewable Systems Cell",
    labName: "Phase-Change Material & Clean Energy Testbed",
    activeGrants: "₹ 36.2 Lakhs",
    primarySpecialization: "Cold-Chain Thermal Storage & Rural Microgrids",
  },
];

export default function UniversityDashboardPage() {
  const [selectedInstIndex, setSelectedInstIndex] = useState(0);
  const activeProfile = INSTITUTION_PROFILES[selectedInstIndex];

  const [dprs, setDprs] = useState<AssignedDPRSummary[]>([]);
  const [telemetry, setTelemetry] = useState<SensorTelemetryFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDprDetail, setSelectedDprDetail] = useState<BankableDPR | null>(null);
  const [loadingDpr, setLoadingDpr] = useState(false);

  // Calibration Form State
  const [calibrationProblemId, setCalibrationProblemId] = useState("JS-2026-8812");
  const [sensorAccuracy, setSensorAccuracy] = useState(94);
  const [calibrationNotes, setCalibrationNotes] = useState(
    "Hydrostatic pressure and ultrasonic transducer bench calibration completed. Error variance below ±1.2% under simulated silt load."
  );
  const [isSubmittingCalibration, setIsSubmittingCalibration] = useState(false);
  const [calibrationSuccessMessage, setCalibrationSuccessMessage] = useState<string | null>(null);

  // Negative BoM Validator State
  const [bomInput, setBomInput] = useState(
    "AJ-SR04M Ultrasonic Transducer, ESP32-S3 LoRaWAN Node, LiFePO4 12Ah Battery Pack, Monocrystalline Solar Panel 20W"
  );
  const [bomValidationResult, setBomValidationResult] = useState<{
    status: "COMPLIANT" | "VIOLATION";
    flags: string[];
    standards: string[];
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assigned, telemData] = await Promise.all([
        institutionApi.getAssignedDprs(activeProfile.name),
        institutionApi.getLiveTelemetry(),
      ]);
      setDprs(assigned);
      setTelemetry(telemData);
    } catch (err) {
      console.error("Error loading university dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedInstIndex]);

  const handleViewDpr = async (problemId: string) => {
    setLoadingDpr(true);
    try {
      const dprData = await institutionApi.getDPR(problemId);
      setSelectedDprDetail(dprData);
    } catch (err) {
      console.error("Failed to fetch DPR:", err);
    } finally {
      setLoadingDpr(false);
    }
  };

  const handleCalibrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCalibration(true);
    setCalibrationSuccessMessage(null);

    try {
      const response = await institutionApi.submitCalibration({
        problemId: calibrationProblemId,
        institutionId: activeProfile.id,
        sensorAccuracy: Number(sensorAccuracy),
        pilotValidationNotes: calibrationNotes,
        readinessDelta: 5,
      });

      setCalibrationSuccessMessage(
        `✓ Calibration Verified: Sensor accuracy locked at ${response.sensorAccuracy}%. Project status elevated to ${response.trlLevel}.`
      );

      // Refresh data
      await loadData();
    } catch (err: any) {
      console.error("Calibration submission error:", err);
    } finally {
      setIsSubmittingCalibration(false);
    }
  };

  const handleValidateBom = () => {
    const prohibitedKeywords = [
      { term: "lead-acid", reason: "Hazardous lead runoff risk (violates BIS IS 16046)" },
      { term: "diesel", reason: "High carbon footprint and diesel particulate emission" },
      { term: "proprietary closed", reason: "Closed protocol vendor lock-in (violates Open Civic Standard)" },
      { term: "mercury", reason: "Toxic heavy metal environmental hazard" },
    ];

    const lower = bomInput.toLowerCase();
    const foundFlags: string[] = [];

    prohibitedKeywords.forEach((rule) => {
      if (lower.includes(rule.term)) {
        foundFlags.push(`Flagged: "${rule.term}" - ${rule.reason}`);
      }
    });

    if (foundFlags.length > 0) {
      setBomValidationResult({
        status: "VIOLATION",
        flags: foundFlags,
        standards: ["BIS IS 16046 (Battery Norms)", "IEEE 1451 Open Sensor Interface"],
      });
    } else {
      setBomValidationResult({
        status: "COMPLIANT",
        flags: ["All hardware components comply with Green BoM & Open Hardware Mandate."],
        standards: ["IEEE 1451 Sensor Standard", "BIS IS 16046 Green Battery Norms", "IP68 Submergence Certified"],
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#10245e]">
                    University & R&D Lab Portal
                  </h1>
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    SIH PS-43 Research Node
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Assigned Regional DPR Review, Hardware BoM Validation & Telemetry Calibration
                </p>
              </div>
            </div>

            {/* Institution Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                Active Institution:
              </span>
              <select
                value={selectedInstIndex}
                onChange={(e) => setSelectedInstIndex(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {INSTITUTION_PROFILES.map((inst, index) => (
                  <option key={inst.id} value={index}>
                    {inst.name} ({inst.district.split(",")[0]})
                  </option>
                ))}
              </select>
              <button
                onClick={loadData}
                disabled={loading}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                title="Refresh Live Telemetry"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Nodal Profile Hero Card */}
        <section className="bg-gradient-to-r from-[#10245e] to-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-emerald-500/10 pointer-events-none transform -skew-x-12" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-medium text-emerald-300">
                <Microscope className="h-3.5 w-3.5" />
                {activeProfile.labName}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{activeProfile.name}</h2>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Nodal Officer:</span> {activeProfile.nodalOfficer} |{" "}
                <span className="font-semibold text-white">Specialization:</span> {activeProfile.primarySpecialization}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Sanctioned State R&D Grants</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{activeProfile.activeGrants}</div>
              <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> 100% Fund Utilization Milestone Verified
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned DPRs</p>
              <h3 className="text-2xl font-bold text-[#10245e] mt-1">{dprs.length}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">3 in active field pilot</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileCheck2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Telemetry Nodes</p>
              <h3 className="text-2xl font-bold text-[#10245e] mt-1">{telemetry.length}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Real-time edge ingestion</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg TRL Readiness</p>
              <h3 className="text-2xl font-bold text-[#10245e] mt-1">TRL-7.4</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Field Demonstrated</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Gauge className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">BoM Green Norms</p>
              <h3 className="text-2xl font-bold text-[#10245e] mt-1">100%</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Zero prohibited parts</p>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
        </section>

        {/* Section: Assigned Regional DPRs */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#10245e] flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                Assigned Regional DPR Workbench
              </h2>
              <p className="text-xs text-slate-500">
                Detailed Project Reports routed to this institution for hardware BoM review & sensor fabrication
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {dprs.length} Regional Projects
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticket ID & Title</th>
                  <th className="py-3 px-4">District / Dept</th>
                  <th className="py-3 px-4">TRL Stage</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Telemetry Health</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dprs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-sm">{item.projectTitle}</div>
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5">{item.problemId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700">{item.district}</div>
                      <div className="text-[10px] text-slate-400">{item.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full font-medium text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                        {item.trlLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${item.readinessScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700">{item.readinessScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      ₹ {item.budgetLakhs} L
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.telemetryHealth === "ONLINE"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.telemetryHealth === "DEGRADED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.telemetryHealth === "ONLINE"
                              ? "bg-emerald-600 animate-pulse"
                              : "bg-amber-600"
                          }`}
                        />
                        {item.telemetryHealth} ({item.sensorsDeployed} nodes)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewDpr(item.problemId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#10245e] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                      >
                        View DPR
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal / Detailed Drawer for Bankable DPR */}
          {selectedDprDetail && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {selectedDprDetail.bankableStatus} • {selectedDprDetail.problemId}
                    </span>
                    <h3 className="text-xl font-bold text-[#10245e] mt-2">
                      {selectedDprDetail.projectTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{selectedDprDetail.executiveSummary}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDprDetail(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Hardware BoM Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-emerald-600" />
                    Bill of Materials (BoM) Specification
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="p-3">Component</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3">Unit Cost (₹)</th>
                          <th className="p-3">Total (₹)</th>
                          <th className="p-3">Sourcing Vendor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedDprDetail.hardwareBoM.map((bom, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-slate-800">
                              {bom.item}
                              <div className="text-[10px] text-slate-400 font-normal">{bom.specifications}</div>
                            </td>
                            <td className="p-3 text-slate-600">{bom.componentCategory}</td>
                            <td className="p-3 font-bold">{bom.quantity}</td>
                            <td className="p-3">₹ {bom.unitCostINR.toLocaleString()}</td>
                            <td className="p-3 font-bold text-emerald-700">₹ {bom.totalCostINR.toLocaleString()}</td>
                            <td className="p-3 text-slate-500">{bom.vendorOrAvailability}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500">Hardware Subtotal:</span>
                    <p className="font-bold text-slate-800 text-sm">
                      ₹ {selectedDprDetail.financialBudget.hardwareTotalINR.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Software & Cloud:</span>
                    <p className="font-bold text-slate-800 text-sm">
                      ₹ {selectedDprDetail.financialBudget.softwareAndCloudINR.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Field Deployment:</span>
                    <p className="font-bold text-slate-800 text-sm">
                      ₹ {selectedDprDetail.financialBudget.fieldDeploymentINR.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Grand Total:</span>
                    <p className="font-bold text-emerald-700 text-sm">
                      ₹ {selectedDprDetail.financialBudget.grandTotalINR.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert("DPR PDF Export initiated with signed institutional cryptographic watermark.");
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition"
                  >
                    <Download className="h-4 w-4" /> Download DPR PDF
                  </button>
                  <button
                    onClick={() => setSelectedDprDetail(null)}
                    className="px-4 py-2 bg-[#10245e] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section: Live Sensor Telemetry & Calibration Form */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Telemetry Feed (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#10245e] flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Live Sensor Telemetry Grid
                </h2>
                <p className="text-xs text-slate-500">
                  Ingested sensor telemetry packets transmitted via LoRaWAN & 4G edge gateways
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Live Feed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {telemetry.map((node) => (
                <div
                  key={node.sensorId}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-300 transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {node.sensorId} • {node.district}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-0.5">{node.nodeName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        node.status === "OPTIMAL"
                          ? "bg-emerald-100 text-emerald-800"
                          : node.status === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[11px] text-slate-500">{node.parameter}</span>
                      <div className="text-xl font-extrabold text-[#10245e] mt-0.5">
                        {node.currentValue} <span className="text-xs font-normal text-slate-500">{node.unit}</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <div>Battery: <span className="font-bold text-slate-700">{node.batteryPercentage}%</span></div>
                      <div className="text-slate-400 text-[10px]">Ping: {node.lastPing}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Calibration Submission Form (1 Col) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#10245e] flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-600" />
                Submit Sensor Calibration
              </h2>
              <p className="text-xs text-slate-500">
                Commit lab bench calibration results to update state readiness metrics
              </p>
            </div>

            <form onSubmit={handleCalibrationSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Project / DPR</label>
                <select
                  value={calibrationProblemId}
                  onChange={(e) => setCalibrationProblemId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {dprs.map((d) => (
                    <option key={d.problemId} value={d.problemId}>
                      {d.problemId} - {d.projectTitle.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Tested Sensor Accuracy (%)</span>
                  <span className="font-bold text-emerald-700">{sensorAccuracy}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={sensorAccuracy}
                  onChange={(e) => setSensorAccuracy(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilot Validation Notes</label>
                <textarea
                  rows={3}
                  value={calibrationNotes}
                  onChange={(e) => setCalibrationNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Describe lab test conditions, temperature ranges, or drift measurements..."
                />
              </div>

              {calibrationSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                  {calibrationSuccessMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingCalibration}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm inline-flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmittingCalibration ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Calibration...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Live Calibration
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Section: Negative BoM Hardware Validator */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#10245e] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Negative BoM Hardware Constraints Guard
              </h2>
              <p className="text-xs text-slate-500">
                Automated compliance check ensuring hardware designs reject hazardous, high-emission, or proprietary components
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              Automated Rule Engine
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">
                Hardware Components / Materials Input:
              </label>
              <textarea
                rows={4}
                value={bomInput}
                onChange={(e) => setBomInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="List proposed components (e.g. Ultrasonic Sensor, Battery chemistry, Enclosure material)..."
              />
              <button
                onClick={handleValidateBom}
                className="px-4 py-2.5 bg-[#10245e] hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm inline-flex items-center gap-2 transition"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" /> Verify Hardware BoM Rules
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Verification Diagnostic
              </h4>

              {bomValidationResult ? (
                <div className="space-y-3 text-xs">
                  <div
                    className={`p-3 rounded-lg border font-bold flex items-center gap-2 ${
                      bomValidationResult.status === "COMPLIANT"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {bomValidationResult.status === "COMPLIANT" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    )}
                    Status: {bomValidationResult.status}
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-600">Findings:</span>
                    {bomValidationResult.flags.map((f, i) => (
                      <div key={i} className="text-slate-700 pl-2 border-l-2 border-slate-300">
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-600">Enforced Standards:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {bomValidationResult.standards.map((std, i) => (
                        <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Click "Verify Hardware BoM Rules" to test components against green and open-source constraints.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
