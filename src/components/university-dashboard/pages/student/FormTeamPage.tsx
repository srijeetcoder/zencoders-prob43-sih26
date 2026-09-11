import { useState } from "react";
import {
  Users,
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Building2,
  Layers,
  Coins,
  FileText,
} from "lucide-react";
import {
  getStoredProblems,
  getStoredApplications,
  saveApplications,
  getStoredPlans,
  savePlans,
  saveAlerts,
  getStoredAlerts,
} from "../../data/mockData";
import type { TeamApplication, ProblemSolutionPlan, TeamMember, BoMItem } from "../../types";
import { useAuth } from "../../../../context/AuthContext";

export default function FormTeamPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"TEAM_APP" | "PLAN_SOLUTION">("TEAM_APP");

  const [problems] = useState(() => getStoredProblems());
  const [applications, setApplications] = useState<TeamApplication[]>(() => getStoredApplications());
  const [plans, setPlans] = useState<ProblemSolutionPlan[]>(() => getStoredPlans());

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // ----------------------------------------------------
  // SECTION 1: Team Application Form State
  // ----------------------------------------------------
  const [teamName, setTeamName] = useState("");
  const [selectedProblemId, setSelectedProblemId] = useState(
    problems[0]?.ticketId || ""
  );
  const [facultyMentor, setFacultyMentor] = useState("");
  const [skills, setSkills] = useState("");
  const [sop, setSop] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    {
      name: user?.name || "",
      rollNo: "",
      department: user?.department || "",
      role: "Team Lead",
    },
  ]);

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      { name: "", rollNo: "", department: "Computer Science", role: "Software Developer" },
    ]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof TeamMember, val: string) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || members.length === 0) return;

    const matchedProblem = problems.find((p) => p.ticketId === selectedProblemId);
    const newApp: TeamApplication = {
      id: `team-app-${Date.now()}`,
      teamName,
      problemId: selectedProblemId,
      problemTitle: matchedProblem?.title || "Civic Bottleneck Redressal",
      domain: matchedProblem?.domain || "General Innovation",
      leadStudent: {
        name: members[0]?.name || user?.name || "Student Innovator",
        email: user?.email || "student.innovator@bitmesra.ac.in",
        rollNo: members[0]?.rollNo || "2022-EC-042",
        phone: "+91 94311 88201",
      },
      members,
      facultyMentor,
      facultyEmail: "faculty.guide@bitmesra.ac.in",
      skills: skills.split(",").map((s) => s.trim()),
      statementOfPurpose: sop || "Dedicated to engineering low-cost verified civic hardware solutions.",
      status: "PENDING_FACULTY",
      submittedAt: new Date().toISOString(),
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    saveApplications(updated);

    // Save alert notification
    const newAlert = {
      id: `alert-${Date.now()}`,
      title: "Team Application Dispatched",
      message: `Team application for "${teamName}" has been submitted for faculty mentor review.`,
      category: "APPROVAL" as const,
      priority: "MEDIUM" as const,
      timestamp: "Just now",
      read: false,
    };
    saveAlerts([newAlert, ...getStoredAlerts()]);

    setSuccessToast(`Team "${teamName}" submitted successfully! Sent to ${facultyMentor} for faculty approval.`);
    setTeamName("");
    setSop("");
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // ----------------------------------------------------
  // SECTION 2: Plan & Solution Submission Form State
  // ----------------------------------------------------
  const [planTeamName, setPlanTeamName] = useState(
    applications[0]?.teamName || "Team HydroSense"
  );
  const [planTitle, setPlanTitle] = useState("");
  const [planSummary, setPlanSummary] = useState("");
  const [repoUrl, setRepoUrl] = useState("https://github.com/bit-mesra-iot/civic-prototype");
  const [prototypeArchitecture, setPrototypeArchitecture] = useState("");
  const [bomItems, setBomItems] = useState<BoMItem[]>([
    {
      component: "AJ-SR04M Waterproof Ultrasonic Transducer",
      quantity: 6,
      estimatedCost: 7200,
      purpose: "Water depth & silt surface profiling",
      vendorStandard: "IP68 Certified",
    },
    {
      component: "ESP32-S3 LoRaWAN SX1262 Telemetry Module",
      quantity: 4,
      estimatedCost: 14000,
      purpose: "Long range low-power data telemetry",
      vendorStandard: "DoT WPC Compliant",
    },
  ]);

  const addBoMItem = () => {
    setBomItems((prev) => [
      ...prev,
      { component: "", quantity: 1, estimatedCost: 1000, purpose: "", vendorStandard: "Standard Spec" },
    ]);
  };

  const removeBoMItem = (idx: number) => {
    setBomItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateBoMItem = (idx: number, field: keyof BoMItem, value: any) => {
    setBomItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const totalBoMCost = bomItems.reduce((acc, item) => acc + (Number(item.estimatedCost) || 0), 0);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim() || !planSummary.trim()) return;

    const matchedApp = applications.find((a) => a.teamName === planTeamName);
    const newPlan: ProblemSolutionPlan = {
      id: `plan-${Date.now()}`,
      teamId: matchedApp?.id || "team-app-01",
      teamName: planTeamName,
      problemId: matchedApp?.problemId || "JS-2026-8812",
      problemTitle: matchedApp?.problemTitle || "Urban Drainage Choking Telemetry",
      planTitle,
      executiveSummary: planSummary,
      hardwareBoM: bomItems,
      totalBudgetRequired: totalBoMCost,
      milestones: [
        {
          phase: "Phase 1: Laboratory Testing & Calibration",
          duration: "2 Weeks",
          deliverables: "Bench testing accuracy variance report under simulated conditions.",
        },
        {
          phase: "Phase 2: Field Mesh Deployment",
          duration: "3 Weeks",
          deliverables: "Physical culvert mount installation & LoRa gateway ping.",
        },
      ],
      prototypeArchitecture: prototypeArchitecture || "Dual transducer telemetry node with cloud sync.",
      firmwareOrRepoUrl: repoUrl,
      status: "SUBMITTED_FACULTY",
      submittedAt: new Date().toISOString(),
    };

    const updated = [newPlan, ...plans];
    setPlans(updated);
    savePlans(updated);

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: "DPR Solution Plan Submitted",
      message: `Technical solution plan for "${planTitle}" submitted to Faculty Guide for evaluation.`,
      category: "APPROVAL" as const,
      priority: "HIGH" as const,
      timestamp: "Just now",
      read: false,
    };
    saveAlerts([newAlert, ...getStoredAlerts()]);

    setSuccessToast(`Solution Plan "${planTitle}" submitted to faculty for review & BoM verification!`);
    setPlanTitle("");
    setPlanSummary("");
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Users size={18} />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
            Student Team & Solution Formulation Workspace
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Form multidisciplinary student innovation teams, link with faculty guides, and submit technical solution blueprints with verified BoMs.
        </p>
      </div>

      {/* Two Main Sub-division Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveSection("TEAM_APP")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSection === "TEAM_APP"
              ? "bg-white text-indigo-950 shadow-sm border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users size={16} className={activeSection === "TEAM_APP" ? "text-indigo-600" : "text-slate-400"} />
          <span>1. Submit Application for Team Selection</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
            {applications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("PLAN_SOLUTION")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSection === "PLAN_SOLUTION"
              ? "bg-white text-indigo-950 shadow-sm border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck2 size={16} className={activeSection === "PLAN_SOLUTION" ? "text-indigo-600" : "text-slate-400"} />
          <span>2. Submit Plan & Solution of Selected Problem</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {plans.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-DIVISION 1: SUBMIT APPLICATION FOR TEAM SELECTION                     */}
      {/* ========================================================================= */}
      {activeSection === "TEAM_APP" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#10245e]">
                New Team Application for Problem Statement
              </h2>
              <p className="text-xs text-slate-500">
                Register your student roster and submit for Faculty Guide endorsement.
              </p>
            </div>

            <form onSubmit={handleTeamSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Team Name *</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Team HydroSense / AeroMine"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Target Problem Statement *</label>
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
                  >
                    {problems.map((p) => (
                      <option key={p.id} value={p.ticketId}>
                        [{p.ticketId}] {p.title} ({p.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Faculty Guide / Mentor *</label>
                  <select
                    value={facultyMentor}
                    onChange={(e) => setFacultyMentor(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
                  >
                    <option value="Dr. Anirban Mukherjee">Dr. Anirban Mukherjee (IoT & Hydrology Lab)</option>
                    <option value="Prof. Rajesh Sengupta">Prof. Rajesh Sengupta (Mining & Geo-Telemetry)</option>
                    <option value="Dr. Sunita Murmu">Dr. Sunita Murmu (Renewable Systems)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Core Team Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. LoRaWAN, C++, Circuit Design, GIS"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Student Member Roster */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Student Team Members ({members.length})</span>
                  <button
                    type="button"
                    onClick={addMember}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
                  >
                    <Plus size={14} />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {members.map((m, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={m.name}
                        onChange={(e) => updateMember(idx, "name", e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-slate-200 outline-none font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Roll No (e.g. 2022-EC-042)"
                        value={m.rollNo}
                        onChange={(e) => updateMember(idx, "rollNo", e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-slate-200 outline-none font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Department"
                        value={m.department}
                        onChange={(e) => updateMember(idx, "department", e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-slate-200 outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Project Role"
                          value={m.role}
                          onChange={(e) => updateMember(idx, "role", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-slate-200 outline-none text-slate-700"
                        />
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => removeMember(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                            title="Remove Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700">Statement of Purpose & Readiness</label>
                <textarea
                  rows={3}
                  value={sop}
                  onChange={(e) => setSop(e.target.value)}
                  placeholder="Explain why your team is capable of delivering this prototype..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Send size={13} />
                  <span>Submit Team Application to Faculty</span>
                </button>
              </div>
            </form>
          </div>

          {/* Submitted Team Applications Ledger */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#10245e]">
              Submitted Team Applications Ledger ({applications.length})
            </h3>

            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="text-base font-bold text-[#10245e]">{app.teamName}</h4>
                    <p className="text-xs text-slate-500">
                      Problem: [{app.problemId}] {app.problemTitle}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === "APPROVED_FACULTY" || app.status === "APPROVED_ADMIN"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "REJECTED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Faculty Mentor:</span>
                    <span className="font-semibold text-slate-800">{app.facultyMentor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Team Lead:</span>
                    <span className="font-semibold text-slate-800">{app.leadStudent.name} ({app.leadStudent.rollNo})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Members Count:</span>
                    <span className="font-semibold text-slate-800">{app.members.length} Enrolled</span>
                  </div>
                </div>

                {app.facultyNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950">
                    <span className="font-bold text-emerald-900">Faculty Review Note: </span>
                    {app.facultyNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-DIVISION 2: SUBMIT PLAN AND SOLUTION OF SELECTED PROBLEM             */}
      {/* ========================================================================= */}
      {activeSection === "PLAN_SOLUTION" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#10245e]">
                Submit Technical Project Plan & Solution Blueprint
              </h2>
              <p className="text-xs text-slate-500">
                Provide technical architecture, component Bill of Materials (BoM), and timeline for faculty evaluation.
              </p>
            </div>

            <form onSubmit={handlePlanSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Submitting Team *</label>
                  <select
                    value={planTeamName}
                    onChange={(e) => setPlanTeamName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
                  >
                    {applications.map((a) => (
                      <option key={a.id} value={a.teamName}>
                        {a.teamName} &bull; [{a.problemId}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Solution Plan Title *</label>
                  <input
                    type="text"
                    required
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    placeholder="e.g. Autonomous Ultrasonic Silt & Depth Profiling Array"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Executive Technical Summary *</label>
                  <textarea
                    rows={3}
                    required
                    value={planSummary}
                    onChange={(e) => setPlanSummary(e.target.value)}
                    placeholder="Explain sensor configuration, data backhaul, telemetry frequencies, and redressing strategy..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Prototype Architecture / Method</label>
                  <input
                    type="text"
                    value={prototypeArchitecture}
                    onChange={(e) => setPrototypeArchitecture(e.target.value)}
                    placeholder="e.g. LoRaWAN IP68 Nodes + Solar MPPT + Municipal Webhook"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Firmware / CAD / Schematic Repo Link</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-mono text-slate-700"
                  />
                </div>
              </div>

              {/* Hardware Bill of Materials (BoM) Sub-table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Proposed Hardware Bill of Materials (BoM)
                    </span>
                    <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                      Total: ₹ {totalBoMCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addBoMItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
                  >
                    <Plus size={14} />
                    <span>Add Component</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {bomItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 items-center text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Component Name"
                        value={item.component}
                        onChange={(e) => updateBoMItem(idx, "component", e.target.value)}
                        className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 outline-none font-medium"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateBoMItem(idx, "quantity", parseInt(e.target.value) || 1)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-center"
                      />
                      <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={item.estimatedCost}
                        onChange={(e) => updateBoMItem(idx, "estimatedCost", parseFloat(e.target.value) || 0)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 outline-none font-mono"
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Standard / Spec"
                          value={item.vendorStandard}
                          onChange={(e) => updateBoMItem(idx, "vendorStandard", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px]"
                        />
                        {bomItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBoMItem(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Send size={13} />
                  <span>Submit Plan for Faculty & Admin Clearance</span>
                </button>
              </div>
            </form>
          </div>

          {/* Submitted Plans Ledger */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#10245e]">
              Submitted Solution Plans & DPR Submissions ({plans.length})
            </h3>

            {plans.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="text-base font-bold text-[#10245e]">{p.planTitle}</h4>
                    <p className="text-xs text-slate-500">
                      Team: {p.teamName} &bull; Problem: [{p.problemId}] {p.problemTitle}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === "FACULTY_ENDORSED" || p.status === "ADMIN_SANCTIONED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.executiveSummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hardware BoM Items:</span>
                    <span className="font-bold text-slate-800">{p.hardwareBoM.length} Sensors & Nodes</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated Prototype Budget:</span>
                    <span className="font-mono font-bold text-indigo-900">
                      ₹ {p.totalBudgetRequired.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Admin Grant Status:</span>
                    <span className="font-bold text-emerald-700">{p.adminGrantSanction || "Under Review"}</span>
                  </div>
                </div>

                {p.facultyFeedback && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
                    <span className="font-bold text-indigo-900">Faculty Evaluation Note: </span>
                    {p.facultyFeedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
