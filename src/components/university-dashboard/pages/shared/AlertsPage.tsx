import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Filter,
  Sparkles,
  AlertCircle,
  Clock,
  Coins,
  ShieldCheck,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStoredAlerts, saveAlerts } from "../../data/mockData";
import type { AlertNotification } from "../../types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertNotification[]>(() => getStoredAlerts());
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  const markAllRead = () => {
    const updated = alerts.map((a) => ({ ...a, read: true }));
    setAlerts(updated);
    saveAlerts(updated);
  };

  const toggleRead = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, read: !a.read } : a));
    setAlerts(updated);
    saveAlerts(updated);
  };

  const deleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  };

  const filtered = alerts.filter((a) => {
    if (selectedCategory !== "ALL" && a.category !== selectedCategory) return false;
    if (priorityFilter !== "ALL" && a.priority !== priorityFilter) return false;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Bell size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
              Institutional Alerts & Notification Ledger
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time telemetry on evaluation approvals, student team formations, state grant disbursements, and deadlines.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 text-xs font-bold transition-all"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter size={12} /> Type:
          </span>
          {["ALL", "APPROVAL", "GRANT", "DEADLINE", "SYSTEM"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority:</span>
          {["ALL", "HIGH", "MEDIUM"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                priorityFilter === p
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8">
            <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">All Caught Up!</h3>
            <p className="text-xs text-slate-500 mt-1">
              No notifications matching the selected filter.
            </p>
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all ${
                alert.read
                  ? "bg-white border-slate-200/80"
                  : "bg-indigo-50/40 border-indigo-200 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                    alert.category === "APPROVAL"
                      ? "bg-emerald-100 text-emerald-700"
                      : alert.category === "GRANT"
                      ? "bg-amber-100 text-amber-700"
                      : alert.category === "DEADLINE"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {alert.category === "APPROVAL" ? (
                    <Sparkles size={16} />
                  ) : alert.category === "GRANT" ? (
                    <Coins size={16} />
                  ) : alert.category === "DEADLINE" ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-bold ${alert.read ? "text-slate-800" : "text-[#10245e]"}`}>
                      {alert.title}
                    </h3>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        alert.priority === "HIGH"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {alert.priority}
                    </span>
                    <span className="text-[10px] text-slate-400">&bull; {alert.timestamp}</span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.actionUrl && (
                    <div className="mt-2.5">
                      <Link
                        to={alert.actionUrl}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                      >
                        <span>Open Workspace Action</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleRead(alert.id)}
                  className="text-xs text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
                  title={alert.read ? "Mark as Unread" : "Mark as Read"}
                >
                  {alert.read ? "Unread" : "Read"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteAlert(alert.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
                  title="Delete Alert"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
