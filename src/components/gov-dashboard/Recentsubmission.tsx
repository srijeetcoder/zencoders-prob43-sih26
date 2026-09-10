import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, HeartPulse, Trash2, ShieldAlert, Clock } from "lucide-react";
import { governmentApi, type EscalationQueueItem } from "../../services/api";

const DEFAULT_ESCALATIONS: EscalationQueueItem[] = [
  {
    id: "esc-001",
    ticketId: "JS-2026-9041",
    title: "Jharia Coalfield Sector 4 Subsurface Thermal Breach",
    district: "Dhanbad",
    department: "Dept of Mines & Geology / CSIR-CIMFR",
    priority: "CRITICAL",
    slaDeadlineHours: 6,
    status: "DISPATCHED_TO_CIMFR",
    detectedDialect: "Khortha",
    reportedHoursAgo: 3.2,
  },
  {
    id: "esc-002",
    ticketId: "JS-2026-8812",
    title: "Harmu River Conduit Choking & Backflow Risk",
    district: "Ranchi",
    department: "RMC Municipal Flood Cell",
    priority: "CRITICAL",
    slaDeadlineHours: 12,
    status: "FIELD_PILOT_ACTIVE",
    detectedDialect: "Nagpuri",
    reportedHoursAgo: 5.8,
  },
  {
    id: "esc-003",
    ticketId: "JS-2026-6192",
    title: "Chitarpur Rural Health Sub-center Vaccine Cold-Storage Outage",
    district: "Ramgarh",
    department: "Dept of Health & Family Welfare",
    priority: "HIGH",
    slaDeadlineHours: 18,
    status: "LAB_MATCHED",
    detectedDialect: "Hinglish",
    reportedHoursAgo: 8.4,
  },
];

function RecentSubmissions() {
  const [escalations, setEscalations] = useState<EscalationQueueItem[]>(DEFAULT_ESCALATIONS);

  useEffect(() => {
    let isMounted = true;
    governmentApi.getEscalations().then((res) => {
      if (isMounted && res && res.escalationQueue && res.escalationQueue.length > 0) {
        setEscalations(res.escalationQueue);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-600" />
          <h3 className="text-base font-semibold text-slate-900">
            Priority Escalations Queue
          </h3>
        </div>
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
          Live Hazard Queue
        </span>
      </div>

      <ul className="mt-3 divide-y divide-slate-100">
        {escalations.map((item) => {
          const isCritical = item.priority === "CRITICAL";
          return (
            <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isCritical ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                }`}
              >
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                    {item.ticketId}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {item.district} &bull; {item.department} &bull; {item.reportedHoursAgo}h ago
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isCritical ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.priority}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="h-3 w-3" /> SLA: {item.slaDeadlineHours}h
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentSubmissions;

