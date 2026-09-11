import { useState } from "react";
import { Settings, ShieldCheck, User, Mail, Building2, Bell, Lock, CheckCircle2 } from "lucide-react";
import { useAuth, type AcademicRole } from "../../../../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const academicRole: AcademicRole = user?.academicRole || "STUDENT";

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [department, setDepartment] = useState(
    user?.department || "IoT & Embedded Urban Hydrology Lab, BIT Mesra"
  );
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [grantAlerts, setGrantAlerts] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {savedToast && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-md animate-in fade-in">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>Profile configuration and notification preferences updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Settings size={18} />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
            Account & Institutional Settings
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Manage your verified academic profile, security settings, and departmental alert subscriptions.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2">
            <User size={16} className="text-indigo-600" />
            <span>Academic Identity Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Institutional Email (Read Only)</label>
              <input
                type="text"
                value={email}
                disabled
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-slate-500 cursor-not-allowed outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Department / Center of Excellence</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Assigned Persona</label>
              <div className="px-3.5 py-2 text-xs rounded-xl bg-indigo-50 border border-indigo-100 font-bold text-indigo-900">
                {academicRole === "STUDENT"
                  ? "Student Innovator & Team Lead"
                  : academicRole === "FACULTY"
                  ? "Faculty Guide & Department Evaluator"
                  : "Institutional Admin & Grant Officer"}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Institution AISHE Accreditation</label>
              <div className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-700">
                AISHE: U-0268 &bull; BIT Mesra, Ranchi
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2">
            <Bell size={16} className="text-indigo-600" />
            <span>Telemetry & Alert Preferences</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Notifications on Evaluation Updates</p>
                <p className="text-[11px] text-slate-500">Receive immediate notifications when faculty endorses or reviews your DPR.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 accent-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">State Grant & Fund Disbursement Alerts</p>
                <p className="text-[11px] text-slate-500">Notify upon institutional sanction of prototype and deployment budgets.</p>
              </div>
              <input
                type="checkbox"
                checked={grantAlerts}
                onChange={(e) => setGrantAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 accent-indigo-600"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] text-white text-xs font-bold shadow-xs transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}
