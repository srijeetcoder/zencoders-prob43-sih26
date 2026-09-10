import { useState } from "react";
import { BellRing } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Wrench,
  Trash2,
  MailCheck,
} from "lucide-react";

type AlertCategory = "critical" | "update" | "info";

interface Alert {
  id: number;
  title: string;
  detail: string;
  time: string;
  category: AlertCategory;
  unread: boolean;
}

const initialAlerts: Alert[] = [
  {
    id: 1,
    title: "High-severity report awaiting approval",
    detail: "#PK-2026-1051 — Unsafe Road near Bokaro Steel City needs review before team assignment.",
    time: "18 min ago",
    category: "critical",
    unread: true,
  },
  {
    id: 2,
    title: "Team 'Swasthya Mitra' proposed a plan",
    detail: "Solution approach submitted for #PK-2026-1046 (Primary Healthcare Center, Simdega).",
    time: "1 hr ago",
    category: "update",
    unread: true,
  },
  {
    id: 3,
    title: "New volunteer joined your region",
    detail: "A civil engineering student from BIT Mesra registered under Ranchi.",
    time: "3 hrs ago",
    category: "info",
    unread: true,
  },
  {
    id: 4,
    title: "Resolution confirmed",
    detail: "Water tanker contingency for #PK-2026-1043 marked resolved by the district cell.",
    time: "Yesterday",
    category: "update",
    unread: false,
  },
  {
    id: 5,
    title: "Grievance escalated",
    detail: "A citizen escalated #PK-2026-1051. SLA timer resets to 72 hours.",
    time: "Yesterday",
    category: "critical",
    unread: false,
  },
];

const TAB_ORDER: ("All" | AlertCategory)[] = ["All", "Unread", "Critical", "Update", "Info"];

const categoryStyles: Record<AlertCategory, { icon: typeof Info; iconBg: string; iconColor: string; badge: string }> = {
  critical: {
    icon: AlertTriangle,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
  },
  update: {
    icon: Wrench,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
    badge: "bg-teal-100 text-teal-700",
  },
  info: {
    icon: Info,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
    badge: "bg-sky-100 text-sky-700",
  },
};

function toggleUnread(alertsList: Alert[], id: number) {
  return alertsList.map((a) => (a.id === id ? { ...a, unread: false } : a));
}

function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const activeTab = "All";
  const visible =
    activeTab === "All"
      ? alerts
      : activeTab === "Unread"
        ? alerts.filter((a) => a.unread)
        : alerts.filter((a) => a.category === activeTab);

  const unreadCount = alerts.filter((a) => a.unread).length;

  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  const clearAll = () => setAlerts([]);

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <BellRing size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">Alerts</h1>
          <p className="text-sm text-slate-500">
            Notifications for your assigned cases & regions · सूचनाएँ
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              type="button"
              disabled
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                activeTab === tab
                  ? "bg-navy-900 text-white"
                  : "border border-slate-200 bg-white text-slate-500"
              }`}
            >
              {tab === "Unread" && unreadCount > 0
                ? `Unread (${unreadCount})`
                : tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-800 transition-colors hover:bg-slate-50"
          >
            <MailCheck size={14} />
            Mark all read
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <CheckCircle2 size={28} className="mx-auto text-teal-500" />
            <p className="mt-3 text-sm font-medium text-navy-900">All caught up!</p>
            <p className="text-sm text-slate-500">No alerts in this view.</p>
          </div>
        )}

        {visible.map((alertItem) => {
          const style = categoryStyles[alertItem.category];
          const Icon = style.icon;

          return (
            <button
              type="button"
              key={alertItem.id}
              onClick={() => setAlerts((prev) => toggleUnread(prev, alertItem.id))}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                alertItem.unread
                  ? "border-slate-200 bg-white shadow-sm"
                  : "border-slate-100 bg-slate-50/60"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
                <Icon size={18} className={style.iconColor} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-sm font-semibold ${alertItem.unread ? "text-navy-900" : "text-slate-500"}`}>
                    {alertItem.title}
                  </p>
                  {alertItem.unread && (
                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{alertItem.detail}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${style.badge}`}>
                    {alertItem.category}
                  </span>
                  <span className="text-xs text-slate-400">{alertItem.time}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AlertsPage;