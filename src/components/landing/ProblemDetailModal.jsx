import React from 'react'
import { X, MapPin, Calendar, Building2, GraduationCap, CheckCircle2, ArrowRight, Share2, Sparkles, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProblemDetailModal({ problem, onClose }) {
  if (!problem) return null

  const stages = [
    { name: 'Posted & Geo-Tagged', done: true },
    { name: 'Desk Triage & Verified', done: problem.statusStage >= 2 },
    { name: 'Research Lab Matched', done: problem.statusStage >= 3 },
    { name: 'Pilot Built & Field Tested', done: problem.statusStage >= 4 },
    { name: 'Deployed & Monitored', done: problem.statusStage >= 5 },
  ]

  return (
    <div className="fixed inset-0 z-[990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl transition-all my-8">
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-line bg-paper-2/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
              {problem.id}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${problem.statusTone}`}>
              {problem.status}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-paper-3 px-2 py-0.5 text-xs font-medium text-ink-2">
              <Tag className="h-3 w-3 text-ink-3" />
              {problem.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-3 hover:bg-paper-3 hover:text-ink transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {/* Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-3">
              <span className="flex items-center gap-1 font-medium text-ink-2">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {problem.place}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {problem.when}
              </span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent uppercase">
                Priority: {problem.urgency}
              </span>
            </div>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {problem.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              {problem.body || problem.summary}
            </p>
          </div>

          {/* Timeline / Progress Stepper */}
          <div className="rounded-xl border border-line bg-paper-2/50 p-4 sm:p-5">
            <p className="text-xs font-semibold tracking-wider uppercase text-ink-3 mb-4">
              Public Ledger Progress Pipeline
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {stages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col rounded-lg p-2.5 text-xs transition-all ${
                    stage.done
                      ? 'border border-accent/30 bg-accent/10 text-ink'
                      : 'border border-line bg-paper text-ink-3 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className="serif-num text-xs font-bold text-accent">0{idx + 1}</span>
                    {stage.done && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                  </div>
                  <span className="mt-1 line-clamp-2 leading-tight">{stage.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Context Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                Previous Blockers & Attempts
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-2">
                {problem.tried || 'Field teams have documented earlier interventions. Needs structured academic evaluation.'}
              </p>
            </div>

            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                Expected Impact Scale
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink font-medium">
                {problem.beneficiaries || 'Targeting community-wide deployment with measurable health/livelihood outcomes.'}
              </p>
            </div>
          </div>

          {/* Working Ring / Stakeholder Matrix */}
          <div className="rounded-xl border border-line bg-paper-2/60 p-4 sm:p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
              Stakeholder Working Ring
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-lg border border-line bg-paper p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-paper-3 text-ink-2">
                  <Building2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-3">Raised By</p>
                  <p className="text-xs font-semibold text-ink">{problem.raisedBy}</p>
                  <p className="text-[10px] text-ink-3">Role: {problem.raisedRole}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-line bg-paper p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/15 text-accent">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-3">Research Lab</p>
                  <p className="text-xs font-semibold text-ink">{problem.matchedLab || problem.targetLab}</p>
                  <p className="text-[10px] text-accent font-medium">Academic Lead</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-line bg-paper p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-paper-3 text-ink-2">
                  <Sparkles className="h-4 w-4 text-sun" />
                </span>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-3">Industry / Grant</p>
                  <p className="text-xs font-semibold text-ink">{problem.industryPartner}</p>
                  <p className="text-[10px] text-ink-3">Deployment Fund</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {problem.tags && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-ink-3 mr-1">Tags:</span>
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-line bg-paper px-2 py-0.5 font-mono text-[11px] text-ink-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper-2/80 px-6 py-4 sm:px-8">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href)
                alert('Ledger link copied to clipboard!')
              }
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-accent transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share Ledger Link
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-full border border-line bg-paper px-4 py-2 text-xs font-medium text-ink hover:bg-paper-2 transition-colors"
            >
              Close
            </button>
            <Link
              to="/register"
              className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-medium text-white hover:bg-accent-deep transition-colors shadow-sm"
              onClick={onClose}
            >
              <span>Join this Challenge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
