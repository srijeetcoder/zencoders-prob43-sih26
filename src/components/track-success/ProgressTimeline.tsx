import { MessageSquareText, ArrowRight, Check } from "lucide-react";
import type { UpdateEntry } from "./LatestUpdate";

interface ProgressTimelineProps {
  updates: UpdateEntry[];
  onViewAll?: () => void;
}

function ProgressTimeline({ updates, onViewAll }: ProgressTimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <MessageSquareText className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Progress Timeline</h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All Updates
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-5">
        {updates.map((update, index) => {
          const isLast = index === updates.length - 1;

          return (
            <div key={`${update.date}-${index}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    update.completed ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  {update.completed && <Check className="h-3 w-3 text-white" />}
                </div>
                {!isLast && <div className="w-px flex-1 bg-slate-200" />}
              </div>

              <div className={`min-w-0 ${isLast ? "pb-0" : "pb-6"}`}>
                <p className="text-xs text-slate-400">
                  {update.date}
                  {update.time && <span> {update.time}</span>}
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{update.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{update.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressTimeline;
