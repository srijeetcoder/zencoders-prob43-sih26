import { Check, Settings } from "lucide-react";
import type { Submission, Status } from "../data/submissions";

// The 6 visible steps in the tracker. "resolved" isn't a step of its own —
// it just means all 6 of these are complete.
const STEP_ORDER: { key: Status; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "ai_analysis", label: "AI Analysis Complete" },
  { key: "matched", label: "Matched with Team" },
  { key: "solution_development", label: "Solution Development" },
  { key: "review", label: "Review & Feedback" },
  { key: "implementation", label: "Implementation" },
];

interface OverallProgressProps {
  submission: Submission;
  lastUpdated: string;
}

function OverallProgress({ submission, lastUpdated }: OverallProgressProps) {
  const rawIndex = STEP_ORDER.findIndex((s) => s.key === submission.status);
  // "resolved" means every step is done, so treat it as past the last index.
  const currentIndex = submission.status === "resolved" ? STEP_ORDER.length : rawIndex;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Overall Progress</h2>
          <p className="mt-1 text-sm text-slate-500">Here's how your submission is moving forward</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">Last Updated</p>
          <p className="text-sm text-slate-600">{lastUpdated}</p>
        </div>
      </div>

      <div className="mt-8 flex items-start">
        {STEP_ORDER.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFirst = index === 0;
          const isLast = index === STEP_ORDER.length - 1;

          const date = index === 0 ? submission.submittedOn : submission.milestoneDates?.[step.key];

          return (
            <div key={step.key} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div
                  className={
                    isFirst
                      ? "invisible flex-1 border-t-2"
                      : `flex-1 border-t-2 ${isDone || isCurrent ? "border-emerald-500" : "border-slate-200"}`
                  }
                />
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                </div>
                <div
                  className={
                    isLast
                      ? "invisible flex-1 border-t-2"
                      : `flex-1 border-t-2 ${isDone ? "border-emerald-500" : "border-slate-200"}`
                  }
                />
              </div>

              <p className={`mt-3 text-sm font-semibold ${isCurrent ? "text-blue-600" : "text-slate-800"}`}>
                {step.label}
              </p>
              <p className={`mt-1 text-xs ${isCurrent ? "font-medium text-blue-600" : "text-slate-400"}`}>
                {isCurrent ? "In Progress" : date ?? "Pending"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OverallProgress;
