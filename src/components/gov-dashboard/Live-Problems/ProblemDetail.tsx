import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ArrowUp,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
  CalendarClock,
} from "lucide-react";
import type { Severity } from "../types/problem";
import { getProblemById } from "./mockData";

const SEVERITY_STYLES: Record<Severity, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-teal-50 text-teal-600",
};

const STATUS_STYLES: Record<string, string> = {
  "Under Analysis": "bg-navy-100 text-navy-700",
  "Matching Teams": "bg-blue-50 text-blue-600",
  "In Discussion": "bg-purple-50 text-purple-600",
  "Solution Planned": "bg-amber-50 text-amber-600",
  "In Progress": "bg-teal-50 text-teal-700",
  Resolved: "bg-slate-100 text-slate-600",
};

function ProblemDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const problem = problemId ? getProblemById(problemId) : undefined;

  if (!problem) {
    return (
      <div className="px-6 py-10 sm:px-8">
        <Link
          to="/gov/live-problems"
          className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Live Problems
        </Link>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">
            Problem not found. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 sm:px-8">
      <Link
        to="/gov/live-problems"
        className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft size={16} />
        Back to Live Problems
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Header */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">{problem.referenceId}</span>
              <span>·</span>
              <span>{problem.category}</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
              {problem.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[problem.status] || "bg-navy-100 text-navy-700"}`}>
                {problem.status}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${SEVERITY_STYLES[problem.severity] || "bg-rose-50 text-rose-600"}`}>
                {problem.severity}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                <MapPin size={12} />
                {problem.location?.area || "Ranchi Sadar"}, {problem.location?.city || "Ranchi"}, {problem.location?.state || "Jharkhand"}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <ArrowUp size={16} className="text-teal-600" />
                {problem.upvotes ?? 1} upvotes
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={16} className="text-navy-500" />
                {problem.commentsCount ?? 0} comments
              </span>
            </div>
          </div>

          {/* Photo placeholder */}
          {(!problem.photos || problem.photos.length === 0) && (
            <div className="flex h-44 items-center justify-center rounded-3xl bg-gradient-to-br from-navy-100 to-brand-100 text-sm text-navy-500">
              Photo evidence to be attached by the reporter
            </div>
          )}

          {/* Description */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Description</h2>
            <p className="mt-3 leading-7 text-slate-600">{problem.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(problem.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* AI analysis */}
          {problem.aiAnalysis && (
            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-brand-600" />
                <h2 className="text-lg font-semibold text-navy-900">
                  AI Problem Analysis
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                {problem.aiAnalysis.problemUnderstanding}
              </p>

              <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-700">
                <Users size={15} />
                {problem.aiAnalysis.peopleAffectedEstimate}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(problem.aiAnalysis.keyIssues || []).map((issue) => (
                  <span
                    key={issue}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-800 ring-1 ring-brand-200"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <CalendarClock size={18} className="text-navy-600" />
              Status Timeline
            </h2>

            <div className="mt-5 space-y-0">
              {(problem.timeline || []).map((step, index) => (
                <div key={step.stage} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < (problem.timeline?.length || 0) - 1 && (
                    <span
                      className={`absolute left-[11px] top-6 h-full w-0.5 ${
                        step.status === "done" ? "bg-teal-400" : "bg-slate-200"
                      }`}
                    />
                  )}

                  <span
                    className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      step.status === "done"
                        ? "bg-teal-500 text-white"
                        : step.status === "active"
                          ? "border-2 border-teal-500 bg-white"
                          : "border-2 border-slate-200 bg-white"
                    }`}
                  >
                    {step.status === "done" && <CheckCircle2 size={14} />}
                  </span>

                  <div className="pt-0.5">
                    <p
                      className={`text-sm font-medium ${
                        step.status === "pending" ? "text-slate-400" : "text-navy-900"
                      }`}
                    >
                      {step.stage}
                    </p>
                    {step.date && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={11} />
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy-900">Discussion</h2>

            <div className="mt-4 space-y-4">
              {(problem.discussion || []).map((comment) => (
                <div
                  key={`${comment.author}-${comment.postedAt}`}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy-900">
                      {comment.author}
                    </p>
                    <p className="text-xs text-slate-400">{comment.postedAt}</p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {comment.message}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <ThumbsUp size={13} className="text-teal-600" />
                    {comment.likes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Lightbulb size={16} className="text-teal-600" />
              Proposed Solutions
            </h2>

            <div className="mt-3 space-y-3">
              {(problem.solutionApproaches || []).map((solution) => (
                <div key={solution.title} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-navy-900">
                    {solution.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Users size={16} className="text-navy-600" />
              Recommended Teams
            </h2>

            <div className="mt-3 space-y-3">
              {(problem.recommendedTeams || []).map((team) => (
                <div key={team.name} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-xs font-bold text-white">
                    {team.name
                      .split(" ")
                      .filter((word) => word.length > 1)
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {team.name}
                    </p>
                    <p className="text-xs text-slate-500">{team.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <MapPin size={16} className="text-rose-500" />
              Similar Problems
            </h2>

            <div className="mt-3 space-y-3">
              {(problem.similarProblems || []).map((similar) => (
                <Link
                  key={similar.id}
                  to={`/gov/live-problems/${similar.id}`}
                  className="block rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <p className="text-sm font-semibold text-navy-900">
                    {similar.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {similar.location} · {similar.distanceKm} km
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;