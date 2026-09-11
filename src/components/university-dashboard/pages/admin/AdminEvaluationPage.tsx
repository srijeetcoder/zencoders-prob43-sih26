import { useState } from "react";
import {
  CheckSquare,
  Coins,
  FileCheck2,
  Users,
  CheckCircle2,
  Send,
  Building2,
  Cpu,
  Clock,
  Sparkles,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import {
  getStoredApplications,
  saveApplications,
  getStoredPlans,
  savePlans,
  saveAlerts,
  getStoredAlerts,
} from "../../data/mockData";
import type { TeamApplication, ProblemSolutionPlan } from "../../types";

export default function AdminEvaluationPage() {
  const [applications, setApplications] = useState<TeamApplication[]>(() => getStoredApplications());
  const [plans, setPlans] = useState<ProblemSolutionPlan[]>(() => getStoredPlans());

  const [grantInputs, setGrantInputs] = useState<Record<string, string>>({
    "plan-01": "₹ 1,25,000",
  });
  const [actionToast, setActionToast] = useState<string | null>(null);

  // 1. Final Institutional Clearance of Faculty-Approved Team Applications
  const handleAdminClearTeam = (appId: string, teamName: string) => {
    const updated = applications.map((a) =>
      a.id === appId
        ? {
            ...a,
            status: "APPROVED_ADMIN" as const,
            adminNotes: "Institutional clearance granted. Laboratory bench space and AISHE student innovator credentials allocated.",
          }
        : a
    );
    setApplications(updated);
    saveApplications(updated);

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: "Team Formally Cleared by University Admin",
      message: `Institution R&D Admin has sanctioned laboratory access and student credentials for "${teamName}".`,
      category: "APPROVAL" as const,
      priority: "HIGH" as const,
      timestamp: "Just now",
      read: false,
    };
    saveAlerts([newAlert, ...getStoredAlerts()]);

    setActionToast(`Team "${teamName}" received final institutional clearance & lab access!`);
    setTimeout(() => setActionToast(null), 4000);
  };

  // 2. Final Evaluation, Grant Sanction, and Government War Room Dispatch of Faculty-Endorsed Solutions
  const handleSanctionAndDispatch = (planId: string, planTitle: string) => {
    const sanctionedAmount = grantInputs[planId] || "₹ 1,25,000";
    const updated = plans.map((p) =>
      p.id === planId
        ? {
            ...p,
            status: "DISPATCHED_TO_GOV" as const,
            adminGrantSanction: `${sanctionedAmount} Sanctioned & Dispatched to State Government War Room`,
          }
        : p
    );
    setPlans(updated);
    savePlans(updated);

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: "Grant Sanctioned & Dispatched to Govt",
      message: `Institutional grant of ${sanctionedAmount} released for "${planTitle}". Solution dispatched to Jharkhand State War Room.`,
      category: "GRANT" as const,
      priority: "HIGH" as const,
      timestamp: "Just now",
      read: false,
    };
    saveAlerts([newAlert, ...getStoredAlerts()]);

    setActionToast(`Grant of ${sanctionedAmount} sanctioned for "${planTitle}" & dispatched to State War Room!`);
    setTimeout(() => setActionToast(null), 4500);
  };

  const facultyEndorsedTeams = applications.filter(
    (a) => a.status === "APPROVED_FACULTY" || a.status === "APPROVED_ADMIN"
  );
  const facultyEndorsedPlans = plans.filter(
    (p) => p.status === "FACULTY_ENDORSED" || p.status === "ADMIN_SANCTIONED" || p.status === "DISPATCHED_TO_GOV"
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {actionToast && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <CheckSquare size={18} />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
            Admin Post-Faculty Evaluation & Grant Sanction Workspace
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Following mentor evaluation, institutional administrators conduct financial clearance, grant allocations, and formal prototype dispatch to the Jharkhand State Government.
        </p>
      </div>

      {/* SECTION 1: Evaluated Team Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-[#10245e] flex items-center gap-2">
            <Users size={16} className="text-indigo-600" />
            <span>Faculty-Endorsed Student Team Applications ({facultyEndorsedTeams.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Stage: Institutional Clearance</span>
        </div>

        <div className="space-y-3">
          {facultyEndorsedTeams.map((app) => {
            const isCleared = app.status === "APPROVED_ADMIN";

            return (
              <div
                key={app.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#10245e]">{app.teamName}</h3>
                    <p className="text-xs text-slate-500">
                      Problem: [{app.problemId}] {app.problemTitle} &bull; Endorsed by <strong>{app.facultyMentor}</strong>
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCleared ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {isCleared ? "ADMIN CLEARED & LAB ENROLLED" : "FACULTY ENDORSED (AWAITING CLEARANCE)"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span>Lead Student: <strong>{app.leadStudent.name}</strong> ({app.leadStudent.rollNo})</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span>Members: {app.members.length}</span>
                  </div>

                  {!isCleared ? (
                    <button
                      type="button"
                      onClick={() => handleAdminClearTeam(app.id, app.teamName)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Grant Institutional Lab Clearance
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 size={13} />
                      Lab Space & AISHE Token Allocated
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Evaluated Solution Plans & Grant Sanction */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-[#10245e] flex items-center gap-2">
            <Coins size={16} className="text-emerald-600" />
            <span>Faculty-Endorsed Solution Plans & DPR Grant Sanctions ({facultyEndorsedPlans.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Stage: State Dispatch & Funding</span>
        </div>

        <div className="space-y-4">
          {facultyEndorsedPlans.map((plan) => {
            const isDispatched = plan.status === "DISPATCHED_TO_GOV";

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border bg-white shadow-xs space-y-4 transition-all ${
                  isDispatched ? "border-emerald-200 bg-emerald-50/15" : "border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#10245e]">{plan.planTitle}</h3>
                    <p className="text-xs text-slate-500">
                      Team: <strong>{plan.teamName}</strong> &bull; Problem: [{plan.problemId}] {plan.problemTitle}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isDispatched
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {isDispatched ? "DISPATCHED TO GOVT WAR ROOM" : "READY FOR ADMIN GRANT SANCTION"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.executiveSummary}
                </p>

                {/* Faculty Endorsement Memo */}
                {plan.facultyFeedback && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
                    <span className="font-bold text-indigo-900">Faculty Guide Technical Endorsement: </span>
                    {plan.facultyFeedback}
                  </div>
                )}

                {/* Admin Grant Sanction Control Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">Proposed BoM Budget:</span>
                      <span className="font-mono font-bold text-slate-800">
                        ₹ {plan.totalBudgetRequired.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-700">Grant Allocation Amount:</label>
                      <input
                        type="text"
                        value={grantInputs[plan.id] || "₹ 1,25,000"}
                        onChange={(e) => setGrantInputs({ ...grantInputs, [plan.id]: e.target.value })}
                        disabled={isDispatched}
                        className="w-32 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white text-emerald-900 outline-none"
                      />
                    </div>
                  </div>

                  {!isDispatched ? (
                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSanctionAndDispatch(plan.id, plan.planTitle)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <Send size={14} />
                        <span>Sanction Grant & Dispatch Solution to State Govt War Room</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        {plan.adminGrantSanction}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        Transmission Hash: 0x8f2a...c891 &bull; Active
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
