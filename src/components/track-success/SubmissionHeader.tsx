import { Link } from "react-router-dom";
import { ArrowLeft, Copy, MapPin, CheckCircle2 } from "lucide-react";
import { CATEGORY_META, STATUS_META, STATUS_SIMPLE, type Submission } from "../data/submissions";

interface SubmissionHeaderProps {
  submission: Submission;
}

export default function SubmissionHeader({ submission }: SubmissionHeaderProps) {
  const category = CATEGORY_META[submission.category];
  const status = STATUS_META[submission.status];
  const Icon = category.icon;

  return (
    <div className="border-b border-slate-200 bg-white px-8 pt-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
          Submission ID: #{submission.id}
          <button
            onClick={() => navigator.clipboard.writeText(submission.id)}
            className="text-slate-400 hover:text-slate-600"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Link
          to="/trackprogress"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Submissions
        </Link>
        <span className="text-sm text-slate-500">Submitted on {submission.submittedOn}</span>
      </div>

      <div className="mt-6 flex flex-col gap-4 pb-6 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 bg-white p-6">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${category.bg}`}>
            <Icon className={`h-7 w-7 ${category.fg}`} />
          </div>
          <div className="min-w-0">
            <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {submission.psCode}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{submission.title}</h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{submission.location}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{submission.description}</p>
          </div>
        </div>

        <div className={`flex w-full items-start gap-3 rounded-xl p-5 lg:w-[360px] ${status.bg}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
            <CheckCircle2 className={`h-5 w-5 ${status.fg}`} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${status.fg}`}>{status.label}</p>
            <p className="mt-1 text-sm text-slate-600">{STATUS_SIMPLE[submission.status]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
