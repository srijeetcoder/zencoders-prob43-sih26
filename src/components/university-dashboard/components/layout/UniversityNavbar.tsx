import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, CheckCheck, Sparkles, AlertCircle, Info, X, GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth, type AcademicRole } from "../../../../context/AuthContext";
import { getStoredAlerts, saveAlerts } from "../../data/mockData";
import type { AlertNotification } from "../../types";

export default function UniversityNavbar() {
  const { user, setAcademicRole } = useAuth();
  const academicRole: AcademicRole = user?.academicRole || "STUDENT";

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertNotification[]>(() => getStoredAlerts());
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    const updated = alerts.map((a) => ({ ...a, read: true }));
    setAlerts(updated);
    saveAlerts(updated);
  };

  const markAsRead = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
    setAlerts(updated);
    saveAlerts(updated);
  };

  const removeAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  };

  const displayName = user?.name || (
    academicRole === "STUDENT"
      ? "Student Innovator"
      : academicRole === "FACULTY"
      ? "Faculty Evaluator"
      : "Institution Admin"
  );

  const roleLabel =
    academicRole === "STUDENT"
      ? "Student Innovator"
      : academicRole === "FACULTY"
      ? "Faculty Guide & Evaluator"
      : "Institutional R&D Admin";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-xs">
      <div className="flex h-full items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-64 md:w-80 hidden sm:block">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search problems, DPRs, teams..."
            className="
              w-full rounded-xl
              border border-slate-200
              bg-slate-50/80
              py-2 pl-10 pr-4
              text-xs sm:text-sm font-medium
              outline-none
              placeholder:text-slate-400
              focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10
              transition-all
            "
          />
        </div>

        {/* Live Academic Role Switcher (Crucial for Review & Multi-Persona Testing) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 text-xs font-semibold">
          <span className="hidden xl:inline text-[10px] uppercase font-bold text-slate-500 px-2 tracking-wider">
            Workspace:
          </span>
          <button
            type="button"
            onClick={() => setAcademicRole("STUDENT")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
              academicRole === "STUDENT"
                ? "bg-white text-indigo-950 font-bold shadow-xs border border-indigo-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Switch to Student Workspace"
          >
            <GraduationCap size={13} className={academicRole === "STUDENT" ? "text-indigo-600" : "text-slate-400"} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setAcademicRole("FACULTY")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
              academicRole === "FACULTY"
                ? "bg-white text-indigo-950 font-bold shadow-xs border border-indigo-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Switch to Faculty Workspace"
          >
            <Microscope size={13} className={academicRole === "FACULTY" ? "text-indigo-600" : "text-slate-400"} />
            <span>Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => setAcademicRole("ADMIN")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
              academicRole === "ADMIN"
                ? "bg-white text-indigo-950 font-bold shadow-xs border border-indigo-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Switch to Admin Workspace"
          >
            <ShieldCheck size={13} className={academicRole === "ADMIN" ? "text-indigo-600" : "text-slate-400"} />
            <span>Admin</span>
          </button>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="University Alerts"
              className={`
                relative rounded-xl p-2.5 transition-colors
                ${notificationsOpen ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
              `}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="
                  absolute right-2 top-2
                  h-2.5 w-2.5
                  rounded-full
                  bg-red-500 ring-2 ring-white animate-pulse"
                />
              )}
            </button>

            {/* Notification Dropdown Window */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#10245e]">Academic & Grant Alerts</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-800"
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {alerts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No active alerts at this time.
                    </div>
                  ) : (
                    alerts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markAsRead(item.id)}
                        className={`group relative flex items-start gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
                          item.read
                            ? "bg-slate-50/60 hover:bg-slate-50"
                            : "bg-indigo-50/50 border border-indigo-100/80 hover:bg-indigo-50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${
                            item.category === "APPROVAL"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.category === "GRANT"
                              ? "bg-amber-100 text-amber-800"
                              : item.category === "DEADLINE"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {item.category === "APPROVAL" ? (
                            <Sparkles size={14} />
                          ) : item.category === "DEADLINE" ? (
                            <AlertCircle size={14} />
                          ) : (
                            <Info size={14} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-semibold ${item.read ? "text-slate-700" : "text-[#10245e]"}`}>
                              {item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                            {item.message}
                          </p>
                        </div>

                        <button
                          onClick={(e) => removeAlert(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                          title="Dismiss"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                  <Link
                    to="/university-dashboard/alerts"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-800"
                  >
                    View All University Notifications &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <Link to="/university-dashboard/settings" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-800 ring-2 ring-indigo-500/20 transition-transform duration-200 group-hover:scale-105">
              {initial}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs sm:text-sm font-semibold text-[#10245e] max-w-[130px] truncate">
                {displayName}
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                {roleLabel}
              </p>
            </div>

            <ChevronDown size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}
