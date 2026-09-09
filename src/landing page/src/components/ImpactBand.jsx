import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Loader2, Hourglass } from 'lucide-react'
import { STATS } from '../data/problemsData'

function parseValue(value) {
  const m = String(value).match(/^([^\d]*)([\d.]+)(.*)$/)
  return {
    prefix: m?.[1] ?? '',
    num: m ? parseFloat(m[2].replace(/,/g, '')) : 0,
    suffix: m?.[3] ?? '',
    decimals: m?.[2].includes('.') ? 1 : 0,
  }
}

function Counter({ num, prefix, suffix, decimals }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const duration = 1400
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(num * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, num])

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-IN')

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

const STATUS_STRIP = [
  {
    icon: CheckCircle2,
    label: 'Done',
    value: 62,
    tone: 'text-emerald-300 border-emerald-300/30 bg-emerald-300/10',
  },
  {
    icon: Loader2,
    label: 'In Progress',
    value: 128,
    tone: 'text-amber-300 border-amber-300/30 bg-amber-300/10',
  },
  {
    icon: Hourglass,
    label: 'To Be Done',
    value: 226,
    tone: 'text-sky-300 border-sky-300/30 bg-sky-300/10',
  },
]

export default function ImpactBand() {
  return (
    <section className="bg-[#1a3355] text-white">
      <div className="container-page py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
            Public Problem Ledger
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            The work keeps moving — and it's all on the record
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Challenges are logged, matched to labs, built by student teams and deployed on
            the ground. Everything is counted on the ledger so progress stays checkable.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => {
            const { prefix, num, suffix, decimals } = parseValue(s.value)
            return (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-4xl font-bold tracking-tight md:text-[2.6rem]">
                  <Counter num={num} prefix={prefix} suffix={suffix} decimals={decimals} />
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{s.label}</p>
                <p className="mt-0.5 text-xs text-emerald-300/90">{s.change}</p>
                <p className="mt-2 font-mono text-[11px] tracking-wide text-slate-400">
                  {s.hi}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
          {STATUS_STRIP.map((bucket) => {
            const IconComp = bucket.icon
            return (
              <div
                key={bucket.label}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${bucket.tone}`}
              >
                <IconComp className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">{bucket.label}</span>
                <span className="ml-auto font-mono text-lg font-bold">{bucket.value}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-[11px] tracking-wide text-slate-400">
          Illustrative split of the {STATS[0].value} challenges live on the ledger.
        </p>
      </div>
    </section>
  )
}