import React, { useState } from 'react'
import { WaterPlate } from './Figures'
import { CASE_STUDIES } from '../data/problemsData'
import { Award, Quote, MapPin, Sparkles } from 'lucide-react'

export default function SuccessStories() {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const current = CASE_STUDIES[activeCaseIdx]

  return (
    <section
      id="stories"
      className="scroll-mt-24 border-t border-line bg-paper-2 py-20 md:py-28"
    >
      <div className="container-page">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
              Proven Outcomes · सफलता की कहानियाँ
            </p>
            <h2 className="mt-2 text-[clamp(2.3rem,4.5vw,3.8rem)] leading-[1.03] font-extrabold tracking-tight text-ink">
              From the ledger to the field
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-2">
              Every completed challenge publishes verified before-and-after
              telemetry, local training records, and maintenance accountability.
            </p>
          </div>

          {/* Case Study Tab Switcher */}
          <div className="flex flex-wrap gap-2">
            {CASE_STUDIES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseIdx(idx)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeCaseIdx === idx
                    ? 'bg-accent text-white shadow-md'
                    : 'border border-line bg-paper text-ink-2 hover:border-accent hover:text-accent'
                }`}
              >
                {c.category.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Case Study Card */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main Case Study Column */}
          <article className="overflow-hidden rounded-3xl border border-line bg-paper shadow-xl lg:col-span-7 flex flex-col justify-between">
            {/* Visual Plate Header */}
            <figure className="relative bg-paper-2 border-b border-line">
              <WaterPlate className="h-56 w-full md:h-72" />
              <figcaption className="border-t border-line px-6 py-2.5 font-mono text-[10px] tracking-wider text-ink-3 uppercase flex items-center justify-between">
                <span>fig. 01 — field telemetry & hardware schematic</span>
                <span className="text-olive font-bold">Verified Operational</span>
              </figcaption>
            </figure>

            {/* Story Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      {current.problemId}
                    </span>
                    <span className="text-xs text-ink-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-accent" />
                      {current.location}
                    </span>
                  </div>
                  <span className="rounded-full bg-olive/15 px-3 py-1 font-mono text-[11px] font-semibold text-olive uppercase">
                    {current.status}
                  </span>
                </div>

                <h3 className="mt-4 text-xl sm:text-2xl font-bold leading-snug text-ink">
                  {current.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {current.summary}
                </p>

                {/* Quote Box */}
                <div className="mt-6 rounded-2xl border border-line bg-paper-2/60 p-5 relative">
                  <Quote className="absolute right-4 top-4 h-6 w-6 text-accent/20" />
                  <p className="text-xs italic leading-relaxed text-ink font-medium">
                    {current.quote}
                  </p>
                  <p className="mt-2 text-[11px] font-bold text-accent">
                    — {current.author}
                  </p>
                </div>
              </div>

              {/* Partners Footer */}
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-2">
                  Key Implementing Partners
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {current.partners.map((partner) => (
                    <span
                      key={partner}
                      className="rounded-full border border-line bg-paper-2 px-3 py-1 text-xs font-medium text-ink-2"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Right Metrics Column */}
          <aside className="lg:col-span-5 flex flex-col gap-6">
            {/* Hero Impact Card */}
            <div className="rounded-3xl border border-line bg-paper p-6 sm:p-7 shadow-lg">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Primary Field Impact
                </span>
              </div>
              <p className="mt-3 serif-num text-4xl sm:text-5xl font-extrabold text-ink">
                {current.heroStat}
              </p>
              <p className="mt-1 text-xs font-semibold text-ink-2">
                {current.heroStatLabel}
              </p>

              {/* Before vs After Grid */}
              <div className="mt-6 border-t border-line pt-5 space-y-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                  Before vs. After Verified Audits
                </p>

                <div className="grid gap-2.5">
                  {current.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-line bg-paper-2/60 p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-medium text-ink-2">{m.label}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px]">
                          <span className="text-ink-3 line-through">{m.before}</span>
                          <span className="text-ink font-bold">→ {m.after}</span>
                        </div>
                      </div>
                      <span className="rounded-md bg-olive/15 px-2 py-1 font-mono text-xs font-bold text-olive">
                        {m.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Open Verification Card */}
            <div className="flex-1 rounded-3xl bg-ink p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/70">
                  <Award className="h-4 w-4 text-sun" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Ledger Audit Stamp
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  Built collaboratively through our verified tripartite pipeline.
                  Every field calibration log, open blueprint, and community sign-off
                  is permanently archived on the public ledger.
                </p>
              </div>

              <div className="mt-6 border-t border-white/15 pt-4 flex items-center justify-between text-xs text-white/60">
                <span className="font-mono text-[10px] uppercase">
                  Archived Aug 2026 · Immutable
                </span>
                <span className="font-medium text-white/90">Open Blueprint Available</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}