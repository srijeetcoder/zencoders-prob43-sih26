import { useState } from "react";
import {
  GraduationCap,
  Users,
  Activity,
  FileCheck2,
  Coins,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { getStoredProblems, getStoredApplications, getStoredPlans } from "../../data/mockData";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [problems] = useState(() => getStoredProblems());
  const [teams] = useState(() => getStoredApplications());
  const [plans] = useState(() => getStoredPlans());

  const acceptedCount = problems.filter((p) => p.status === "ACCEPTED").length;
  const approvedTeamsCount = teams.filter((t) => t.status.includes("APPROVED")).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1d30] via-[#10245e] to-[#1e3a8a] p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-200">
              <GraduationCap size={14} className="text-indigo-300" />
              <span>Student Innovation Console &bull; BIT Mesra Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || "Student Innovator"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You are assigned to the <strong>IoT & Embedded Urban Hydrology Lab</strong>. Collaborate with faculty guides, form multidisciplinary student teams, and formulate bankable solutions for live Jharkhand civic challenges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/university-dashboard/live-problems"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <Activity size={14} />
              <span>Browse Live Problems</span>
            </Link>
            <Link
              to="/university-dashboard/form-team"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <Users size={14} />
              <span>Form / View Team</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Decorative soft glow */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Accepted Problems</p>
            <p className="text-xl font-extrabold text-[#10245e]">{acceptedCount}</p>
            <span className="text-[10px] text-emerald-600 font-bold">2 Live in Lab Mesh</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Student Teams Formed</p>
            <p className="text-xl font-extrabold text-[#10245e]">{teams.length}</p>
            <span className="text-[10px] text-emerald-600 font-bold">
              {approvedTeamsCount} Faculty Approved
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <FileCheck2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">DPR Plans Submitted</p>
            <p className="text-xl font-extrabold text-[#10245e]">{plans.length}</p>
            <span className="text-[10px] text-indigo-600 font-bold">1 Faculty Endorsed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Coins size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Prototype Sanctions</p>
            <p className="text-xl font-extrabold text-[#10245e]">
              {plans.length > 0 ? `₹ ${(plans.length * 0.85).toFixed(2)} L` : "₹ 0"}
            </p>
            <span className="text-[10px] text-amber-700 font-bold">
              {plans.length > 0 ? "Sanctioned Allocations" : "No Active Sanctions"}
            </span>
          </div>
        </div>
      </div>

      {/* Active Project & Solution Milestone Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          {plans.length === 0 && teams.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Sparkles size={24} />
              </div>
              <h2 className="text-base font-bold text-[#10245e]">No Active Projects Yet</h2>
              <p className="text-xs text-slate-500 max-w-sm">
                You haven't accepted any civic bottlenecks or formed a solution team. Browse the live problem ledger to start an R&D intervention.
              </p>
              <Link
                to="/university-dashboard/live-problems"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Browse Live Problems</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#10245e]">
                    Active Project: {plans[0]?.solutionName || teams[0]?.teamName || "Innovation Prototype"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {teams[0]?.problemTitle || "Civic Problem Solution Desk"}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {plans[0]?.status ? plans[0].status.replace("_", " ") : "ACTIVE TEAM"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Prototype Development Progress</span>
                  <span className="text-indigo-600 font-bold">45%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Cpu size={14} className="text-indigo-600" />
                  <span>Lead Student: <strong>{user?.name || "Student Innovator"}</strong></span>
                </div>
                <Link
                  to="/university-dashboard/form-team"
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1"
                >
                  <span>Manage Team Workspace</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick Innovation Checklist */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-indigo-600" />
              <span>Student Action Steps</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 size={16} className={acceptedCount > 0 ? "text-emerald-600 shrink-0 mt-0.5" : "text-slate-400 shrink-0 mt-0.5"} />
                <div>
                  <p className="font-bold text-slate-800">1. Problem Accepted</p>
                  <p className="text-[11px] text-slate-500">
                    {acceptedCount > 0 ? `${acceptedCount} active civic bottlenecks accepted.` : "No problems accepted yet. Browse live problem ledger."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 size={16} className={approvedTeamsCount > 0 ? "text-emerald-600 shrink-0 mt-0.5" : "text-slate-400 shrink-0 mt-0.5"} />
                <div>
                  <p className="font-bold text-slate-800">2. Team Application</p>
                  <p className="text-[11px] text-slate-500">
                    {approvedTeamsCount > 0 ? `${approvedTeamsCount} team application endorsed by faculty.` : "Form your student innovation team with roll numbers."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <Clock size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-950">3. Physical Prototype & BoM</p>
                  <p className="text-[11px] text-indigo-800">
                    {plans.length > 0 ? "Prototype BoM under faculty review." : "Submit DPR & hardware BoM for institutional grant sanctions."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/university-dashboard/resource-center"
            className="w-full py-2.5 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            Download Sensor Standards & DPR Forms
          </Link>
        </div>
      </div>
    </div>
  );
}
