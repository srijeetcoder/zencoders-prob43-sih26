import { useParams, Link } from "react-router-dom";
import { Users, Clock, CheckSquare, HelpCircle, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { SUBMISSIONS, type Submission } from "../data/submissions";
import SubmissionHeader from "./SubmissionHeader";
import OverallProgress from "./OverallProgress";
import LatestUpdate from "./LatestUpdate";
import ProgressTimeline from "./ProgressTimeline";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-600">We couldn't find that submission.</p>
        <Link to="/trackprogress" className="mt-3 inline-block text-sm font-semibold text-blue-600">
          Back to My Submissions
        </Link>
      </div>
    </div>
  );
}

function MatchedTeam({ submission }: { submission: Submission }) {
  if (!submission.team) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Users className="h-5 w-5 text-blue-600" /> Matched Team
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-blue-600">
          View Team Profile <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 font-bold text-indigo-700">
          {submission.team.substring(0, 3).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900">{submission.team}</h3>
              <p className="text-xs text-slate-500">Department of Civil Engineering</p>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Matched
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {submission.teamExpertise} Previously worked on 5 similar projects.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExpectedTimeline() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2 font-bold text-slate-800">
        <Clock className="h-5 w-5 text-blue-600" /> Expected Timeline
      </div>
      <div className="relative flex flex-col gap-3 pl-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-[2px] before:bg-slate-200">
        <div className="relative flex justify-between text-sm">
          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300"></span>
          <span className="text-slate-700">Solution Prototype</span>
          <span className="text-slate-500">Mar 2026</span>
        </div>
        <div className="relative flex justify-between text-sm">
          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300"></span>
          <span className="text-slate-700">Review & Feedback</span>
          <span className="text-slate-500">Apr 2026</span>
        </div>
        <div className="relative flex justify-between text-sm">
          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300"></span>
          <span className="text-slate-700">Pilot Implementation</span>
          <span className="text-slate-500">May 2026</span>
        </div>
        <div className="relative flex justify-between text-sm">
          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300"></span>
          <span className="text-slate-700">Final Deployment</span>
          <span className="text-slate-500">Jun 2026</span>
        </div>
      </div>
      <div className="mt-4 rounded bg-blue-50 p-2 text-xs text-blue-600">
        Timelines are estimates and may change based on complexity and approvals.
      </div>
    </div>
  );
}

function YourActions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2 font-bold text-slate-800">
        <CheckSquare className="h-5 w-5 text-emerald-600" /> Your Actions
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-700">Problem details submitted</span>
          </div>
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Completed</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-700">Additional information (if required)</span>
          </div>
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Completed</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-slate-300" />
            <span className="text-sm text-slate-500">Provide feedback on proposed solution</span>
          </div>
          <span className="rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">Pending</span>
        </div>
      </div>
    </div>
  );
}

function ContactSupport() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Need Help?</h3>
          <p className="mt-1 text-xs text-slate-500">
            Have questions about your submission or the process?
            <br />
            We're here to help!
          </p>
        </div>
      </div>
      <button className="whitespace-nowrap rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50">
        Contact Support
      </button>
    </div>
  );
}

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();

  const submission = SUBMISSIONS.find((s) => s.id === id);

  if (!submission) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SubmissionHeader submission={submission} />

      <div className="w-full px-8 py-6">
        <div className="mt-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <OverallProgress submission={submission} lastUpdated={submission.lastUpdated ?? submission.submittedOn} />
              {submission.updates && submission.updates.length > 0 && (
                <>
                  <LatestUpdate update={submission.updates[0]} />
                  <ProgressTimeline updates={submission.updates} onViewAll={() => {}} />
                </>
              )}
            </div>

            <div className="flex flex-col gap-6 lg:col-span-1">
              <MatchedTeam submission={submission} />
              <ExpectedTimeline />
              <YourActions />
              <ContactSupport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
