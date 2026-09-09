import { ArrowRight, Calendar, CheckCircle2, Clock, AlertCircle, XCircle, Inbox } from "lucide-react";

type ProblemStatus = "Pending" | "In Review" | "Resolved" | "Rejected";

interface Problem {
  id: string;
  title: string;
  submittedAt: string;
  status: ProblemStatus;
}

const STATUS_CONFIG: Record<
  ProblemStatus,
  {
    badge: string;
    indicator: string;
    icon: typeof Clock;
  }
> = {
  Pending: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    indicator: "bg-amber-500",
    icon: Clock,
  },
  "In Review": {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    indicator: "bg-sky-500",
    icon: AlertCircle,
  },
  Resolved: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    indicator: "bg-emerald-500",
    icon: CheckCircle2,
  },
  Rejected: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    indicator: "bg-rose-500",
    icon: XCircle,
  },
};

interface UserProblemsProps {
  problems: Problem[];
  onViewAll?: () => void;
}

export function UserProblems({ problems, onViewAll }: UserProblemsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Submitted Problems
          </h3>
          <p className="text-xs text-slate-500">Track and view status updates</p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="group flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* List */}
      {problems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Inbox className="mb-2 h-5 w-5 text-slate-300" />
          <p className="text-xs font-medium text-slate-500">No problems submitted</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {problems.map((problem) => {
            const config = STATUS_CONFIG[problem.status];
            const StatusIcon = config.icon;

            return (
              <li
                key={problem.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  {/* Status Indicator Dot */}
                  <span className={`h-2 w-2 shrink-0 rounded-full ${config.indicator}`} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {problem.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>{problem.submittedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${config.badge}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  <span>{problem.status}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default UserProblems;
