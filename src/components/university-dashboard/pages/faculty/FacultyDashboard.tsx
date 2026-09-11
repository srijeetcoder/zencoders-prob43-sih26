import { useState } from "react";
import {
  Microscope,
  Users,
  CheckSquare,
  FileCheck2,
  Brain,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Coins,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { getStoredApplications, getStoredPlans, getStoredProblems } from "../../data/mockData";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [teams] = useState(() => getStoredApplications());
  const [plans] = useState(() => getStoredPlans());
  const [problems] = useState(() => getStoredProblems());

  const pendingTeams = teams.filter((t) => t.status === "PENDING_FACULTY").length;
  const pendingPlans = plans.filter((p) => p.status === "SUBMITTED_FACULTY").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1d30] via-[#10245e] to-[#1e3a8a] p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-200">
              <Microscope size={14} className="text-indigo-300" />
              <span>Faculty Mentorship & Evaluation Desk &bull; BIT Mesra</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome, {user?.name || "Dr. Anirban Mukherjee"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Supervise student engineering teams, evaluate hardware BoM compliance with deterministic safeguards, and endorse high-impact solutions for civic infrastructure redressing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/university-dashboard/evaluation"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <CheckSquare size={14} />
              <span>Open Evaluation Workspace</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/university-dashboard/ai-analysis"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <Brain size={14} />
              <span>AI Feasibility Audit</span>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Teams Supervised</p>
            <p className="text-xl font-extrabold text-[#10245e]">{teams.length}</p>
            <span className="text-[10px] text-indigo-700 font-bold">BIT Mesra IoT Nodes</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Pending Evaluations</p>
            <p className="text-xl font-extrabold text-[#10245e]">{pendingTeams + pendingPlans}</p>
            <span className="text-[10px] text-amber-700 font-bold">Action Required</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <FileCheck2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Endorsed DPRs</p>
            <p className="text-xl font-extrabold text-[#10245e]">
              {plans.filter((p) => p.status === "FACULTY_ENDORSED" || p.status === "ADMIN_SANCTIONED").length}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">Escalated to State Admin</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <Coins size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Active Research Grants</p>
            <p className="text-xl font-extrabold text-[#10245e]">
              {plans.length > 0 ? `₹ ${(plans.length * 0.9).toFixed(1)} L` : "₹ 0"}
            </p>
            <span className="text-[10px] text-blue-700 font-bold">
              {plans.length > 0 ? `${plans.length} Grants Allocated` : "No Active Grants"}
            </span>
          </div>
        </div>
      </div>

      {/* Review Queue & Evaluation Workspace Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#10245e]">
                Faculty Review & Approval Queue
              </h2>
              <p className="text-xs text-slate-500">
                Pending student applications requiring mentor endorsement before admin budget release.
              </p>
            </div>
            <Link
              to="/university-dashboard/evaluation"
              className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 rounded-xl border border-dashed border-slate-200">
              No pending student applications to evaluate. When student innovator teams form and apply for problem tracks, they will appear here for your endorsement.
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#10245e]">{t.teamName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          t.status.includes("APPROVED")
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Lead: <strong>{t.leadStudent.name}</strong> &bull; Problem: [{t.problemId}] {t.problemTitle}
                    </p>
                  </div>

                  <Link
                    to="/university-dashboard/evaluation"
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all shrink-0"
                  >
                    Evaluate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Feasibility Quick Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2 mb-2">
              <Brain size={16} className="text-indigo-600" />
              <span>AI Bill of Materials (BoM) Audit</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify student hardware components against negative BoM guidelines (e.g. rejecting non-industrial ultrasonic transducers or invalid frequency radios).
            </p>

            {plans.length > 0 ? (
              <div className="mt-4 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-indigo-950 text-[11px]">
                  <span>{plans[0].solutionName} BoM Audit</span>
                  <span className="text-emerald-700">COMPLIANT</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Components adhere to industrial telemetry standards.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No student hardware BoMs submitted for compliance check yet.
              </div>
            )}
          </div>

          <Link
            to="/university-dashboard/ai-analysis"
            className="w-full py-2.5 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Launch AI BoM & Novelty Inspector
          </Link>
        </div>
      </div>
    </div>
  );
}
