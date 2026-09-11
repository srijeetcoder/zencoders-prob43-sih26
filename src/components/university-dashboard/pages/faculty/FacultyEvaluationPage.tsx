import { useState } from "react";
import {
  CheckSquare,
  Users,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
  Coins,
  Cpu,
  Layers,
  ArrowRight,
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

export default function FacultyEvaluationPage() {
  const [activeSection, setActiveSection] = useState<"APPROVE_TEAMS" | "APPROVE_PLANS">("APPROVE_TEAMS");

  const [applications, setApplications] = useState<TeamApplication[]>(() => getStoredApplications());
  const [plans, setPlans] = useState<ProblemSolutionPlan[]>(() => getStoredPlans());

  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [actionToast, setActionToast] = useState<string | null>(null);

  // ----------------------------------------------------
  // SECTION 1: Approve / Reject Team Applications
  // ----------------------------------------------------
  const handleApproveTeam = (appId: string, teamName: string) => {
    const notes = reviewNote[appId] || "Approved. Strong multidisciplinary team composition verified by Faculty Mentor.";
    const updated = applications.map((a) =>
      a.id === appId ? { ...a, status: "APPROVED_FACULTY" as const, facultyNotes: notes } : a
    );
    setApplications(updated);
    saveApplications(updated);

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: "Team Application Approved",
      message: `Faculty Guide approved "${teamName}". Team is now authorized to draft and submit their DPR Solution Plan.`,
      category: "APPROVAL" as const,
      priority: "HIGH" as const,
      timestamp: "Just now",
      read: false,
    };
    saveAlerts([newAlert, ...getStoredAlerts()]);

    setActionToast(`Team "${teamName}" approved successfully! Students may now submit their solution plan.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleRejectTeam = (appId: string, teamName: string) => {
    const notes = reviewNote[appId] || "Revision needed in student roles or skillsets.";
    const updated = applications.map((a) =>
      a.id === appId ? { ...a, status: "REJECTED" as const, facultyNotes: notes } : a
    );
    setApplications(updated);
    saveApplications(updated);
    setActionToast(`Team "${teamName}" returned with revision notes.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  // ----------------------------------------------------
  // SECTION 2: Analyze & Approve Solution Plans (DPRs)
  // ----------------------------------------------------
  const handleEndorsePlan = (planId: string, title: string) => {
    const feedback = reviewNote[planId] || "Technical calculations, sensor selections, and BoM costs endorsed. Escalated to Institution Admin for grant allocation.";
    const updated = plans.map((p) =>
      p.id === planId ? { ...p, status: "FACULTY_ENDORSED" as const, facultyFeedback: feedback } : p
    );
    setPlans(updated);
    savePlans(updated);

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: "DPR Plan Endorsed by Faculty",
      message: `Faculty Guide endorsed "${title}". Escalated to Institution Admin for grant disbursement.`,
      category: "APPROVAL" as const,
      priority: "HIGH" as const,
      timestamp: "Just now",
      read: false,
      actionUrl: "/university-dashboard/evaluation",
    };
    saveAlerts([newAlert, ...getStoredAlerts()]);

    setActionToast(`Plan "${title}" endorsed by Faculty Guide! Escalated to Institution Admin.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  const pendingTeamsCount = applications.filter((a) => a.status === "PENDING_FACULTY").length;
  const pendingPlansCount = plans.filter((p) => p.status === "SUBMITTED_FACULTY").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Action Toast */}
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
            Faculty Evaluation & Approval Workspace
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Review, analyze, and endorse student team applications and technical solution blueprints prior to institutional grant sanctioning.
        </p>
      </div>

      {/* Two Sub-division Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveSection("APPROVE_TEAMS")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSection === "APPROVE_TEAMS"
              ? "bg-white text-indigo-950 shadow-sm border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users size={16} className={activeSection === "APPROVE_TEAMS" ? "text-indigo-600" : "text-slate-400"} />
          <span>1. Approve Student Team Applications</span>
          {pendingTeamsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {pendingTeamsCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("APPROVE_PLANS")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSection === "APPROVE_PLANS"
              ? "bg-white text-indigo-950 shadow-sm border border-indigo-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck2 size={16} className={activeSection === "APPROVE_PLANS" ? "text-indigo-600" : "text-slate-400"} />
          <span>2. Analyze & Approve Solution Plans</span>
          {pendingPlansCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
              {pendingPlansCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-DIVISION 1: APPROVE STUDENT TEAM APPLICATIONS                         */}
      {/* ========================================================================= */}
      {activeSection === "APPROVE_TEAMS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#10245e]">
              Student Team Selection Applications ({applications.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Assigned Faculty Mentor: <strong>Dr. Anirban Mukherjee</strong>
            </span>
          </div>

          <div className="space-y-4">
            {applications.map((app) => {
              const isApproved = app.status === "APPROVED_FACULTY" || app.status === "APPROVED_ADMIN";

              return (
                <div
                  key={app.id}
                  className={`p-6 rounded-2xl border bg-white shadow-xs space-y-4 transition-all ${
                    isApproved ? "border-emerald-200 bg-emerald-50/15" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#10245e]">{app.teamName}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800"
                              : app.status === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {app.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Target Problem: <strong className="text-slate-800">[{app.problemId}] {app.problemTitle}</strong> ({app.domain})
                      </p>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Team Members Roster */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-2">
                      Enrolled Student Members ({app.members.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {app.members.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <p className="font-bold text-[#10245e]">{m.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">{m.rollNo} &bull; {m.department}</p>
                          <p className="text-[10px] font-semibold text-indigo-700 mt-1">{m.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statement of Purpose */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-700 text-[11px]">Statement of Purpose & Skills:</span>
                    <p className="text-slate-600 leading-relaxed">{app.statementOfPurpose}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {app.skills.map((s, i) => (
                        <span key={i} className="text-[9px] font-semibold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Faculty Notes Input & Actions */}
                  {!isApproved && (
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <input
                        type="text"
                        placeholder="Add mentor notes / guidance for this team..."
                        value={reviewNote[app.id] || ""}
                        onChange={(e) => setReviewNote({ ...reviewNote, [app.id]: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-600 outline-none"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleRejectTeam(app.id, app.teamName)}
                          className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
                        >
                          Request Revisions
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveTeam(app.id, app.teamName)}
                          className="px-5 py-2 rounded-xl bg-[#047d48] hover:bg-[#03663a] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve & Authorize Team</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {app.facultyNotes && isApproved && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Faculty Endorsement: </span>
                        <span>{app.facultyNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-DIVISION 2: ANALYZE AND APPROVE SOLUTION PLANS                        */}
      {/* ========================================================================= */}
      {activeSection === "APPROVE_PLANS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#10245e]">
              Technical Solution Plans & DPR Submissions ({plans.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              BoM Compliance Verified via Deterministic Guard
            </span>
          </div>

          <div className="space-y-5">
            {plans.map((plan) => {
              const isEndorsed = plan.status === "FACULTY_ENDORSED" || plan.status === "ADMIN_SANCTIONED";

              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl border bg-white shadow-xs space-y-4 transition-all ${
                    isEndorsed ? "border-emerald-200 bg-emerald-50/15" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#10245e]">{plan.planTitle}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isEndorsed
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {plan.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Submitting Team: <strong className="text-slate-800">{plan.teamName}</strong> &bull; Problem: [{plan.problemId}] {plan.problemTitle}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-indigo-950 block">
                        ₹ {plan.totalBudgetRequired.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400">Estimated Prototype Cost</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.executiveSummary}
                  </p>

                  {/* Hardware BoM Component Audit Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Cpu size={14} className="text-indigo-600" />
                      <span>Hardware Bill of Materials (BoM) Audit:</span>
                    </span>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3">Component Description</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3">Estimated Cost</th>
                            <th className="py-2 px-3">Regulatory Standard</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {plan.hardwareBoM.map((b, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 text-[#10245e] font-semibold">{b.component}</td>
                              <td className="py-2 px-3 text-center font-mono">{b.quantity}</td>
                              <td className="py-2 px-3 font-mono">₹ {b.estimatedCost.toLocaleString("en-IN")}</td>
                              <td className="py-2 px-3 text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-emerald-600" />
                                {b.vendorStandard}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Faculty Review and Endorsement Action */}
                  {!isEndorsed && (
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <input
                        type="text"
                        placeholder="Add technical evaluation notes and endorsement rationale..."
                        value={reviewNote[plan.id] || ""}
                        onChange={(e) => setReviewNote({ ...reviewNote, [plan.id]: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-600 outline-none"
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleEndorsePlan(plan.id, plan.planTitle)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                        >
                          <CheckCircle2 size={14} />
                          <span>Endorse Plan & Escalate to Admin for Grant Sanction</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {plan.facultyFeedback && isEndorsed && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Faculty Endorsement: </span>
                        <span>{plan.facultyFeedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
