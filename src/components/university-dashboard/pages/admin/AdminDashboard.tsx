import { useState } from "react";
import {
  ShieldCheck,
  Coins,
  Users,
  CheckSquare,
  Building2,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  Cpu,
  Layers,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { getStoredApplications, getStoredPlans, getStoredProblems } from "../../data/mockData";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [applications] = useState(() => getStoredApplications());
  const [plans] = useState(() => getStoredPlans());
  const [problems] = useState(() => getStoredProblems());

  const facultyEndorsedPlans = plans.filter((p) => p.status === "FACULTY_ENDORSED");
  const sanctionedPlans = plans.filter((p) => p.status === "ADMIN_SANCTIONED" || p.status === "DISPATCHED_TO_GOV");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1d30] via-[#10245e] to-[#1e3a8a] p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-200">
              <ShieldCheck size={14} className="text-indigo-300" />
              <span>Institutional R&D Command Console &bull; BIT Mesra Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Institutional Admin Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome, <strong>{user?.name || "Dr. Priya Murmu (Dean R&D)"}</strong>. Supervise university grant allocations, evaluate faculty-endorsed student DPRs, and dispatch bankable prototypes to Jharkhand State departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/university-dashboard/evaluation"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <CheckSquare size={14} />
              <span>Admin Evaluation Workspace</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/university-dashboard/admin-center"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <Building2 size={14} />
              <span>Admin Center</span>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Coins size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Active Grants</p>
            <p className="text-xl font-extrabold text-[#10245e]">₹ 48.5 Lakhs</p>
            <span className="text-[10px] text-emerald-600 font-bold">14 Active Prototype Allocations</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Approved Teams</p>
            <p className="text-xl font-extrabold text-[#10245e]">{applications.length}</p>
            <span className="text-[10px] text-indigo-700 font-bold">48 Student Innovators</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <CheckSquare size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Faculty-Endorsed DPRs</p>
            <p className="text-xl font-extrabold text-[#10245e]">
              {facultyEndorsedPlans.length + sanctionedPlans.length}
            </p>
            <span className="text-[10px] text-amber-700 font-bold">
              {facultyEndorsedPlans.length} Awaiting Final Sanction
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <Send size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Govt Dispatches</p>
            <p className="text-xl font-extrabold text-[#10245e]">6 Solutions</p>
            <span className="text-[10px] text-blue-700 font-bold">Live in State War Room</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Department Allocation & Live Evaluation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Allocation Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#10245e]">
                Institutional Department Breakdown & Lab Grant Utilization
              </h2>
              <p className="text-xs text-slate-500">
                Active grant funding distributed across centers of excellence.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">AY 2026-27</span>
          </div>

          <div className="space-y-3">
            {[
              {
                dept: "IoT & Embedded Urban Hydrology Lab",
                lead: "Dr. Anirban Mukherjee",
                budget: "₹ 18.5 Lakhs",
                percent: 74,
                teams: "3 Student Teams Active",
              },
              {
                dept: "Centre for Renewable Microgrids & Storage",
                lead: "Dr. Sunita Murmu",
                budget: "₹ 14.2 Lakhs",
                percent: 58,
                teams: "2 Student Teams Active",
              },
              {
                dept: "Geological Safety & Thermal Mine Grid Center",
                lead: "Prof. Rajesh Sengupta",
                budget: "₹ 15.8 Lakhs",
                percent: 82,
                teams: "4 Student Teams Active",
              },
            ].map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#10245e]">
                  <span>{d.dept}</span>
                  <span className="font-mono text-indigo-900">{d.budget}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Lead: {d.lead}</span>
                  <span>{d.teams} &bull; {d.percent}% Allocated</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2 mb-2">
              <CheckSquare size={16} className="text-indigo-600" />
              <span>Pending Final Sanctions</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Student solutions evaluated and endorsed by faculty mentors awaiting your final institutional grant sanction.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-950 block">HydroMesh-JH Telemetry Plan</span>
              <p className="text-[11px] text-amber-800">
                Endorsed by Dr. Anirban Mukherjee. Proposed budget: ₹ 89,900.
              </p>
            </div>
          </div>

          <Link
            to="/university-dashboard/evaluation"
            className="w-full py-2.5 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Review & Sanction Grants &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
