import { useEffect, useRef, useState } from 'react'
import { FileText, ShieldCheck, GraduationCap, Users, CheckCircle2 } from 'lucide-react'

const STAGES = [
  {
    n: 1,
    title: 'Posted & Geo-Tagged',
    icon: FileText,
    detail:
      'A citizen, panchayat or ministry logs a field challenge with location, photos and local context. The entry is public from day one.',
    who: 'Community · Panchayat · Ministry',
    ledger: 'Recorded: PROB-0214 · Geo-tagged',
  },
  {
    n: 2,
    title: 'Desk Triage & Verified',
    icon: ShieldCheck,
    detail:
      'AI triage and desk reviewers check the claim, confirm the ground reality, assign technical categories and remove duplicates before it enters the pipeline.',
    who: 'Verification Desk · AI Triage',
    ledger: 'Verified: category + urgency locked',
  },
  {
    n: 3,
    title: 'Research Lab Matched',
    icon: GraduationCap,
    detail:
      'The challenge is matched to an academic lab with the right expertise and to an industry or CSR sponsor who commits the resources to solve it.',
    who: 'IIT / NIT Lab · Industry Partner',
    ledger: 'Matched: IIT Kanpur Water Lab',
  },
  {
    n: 4,
    title: 'Pilot Built & Field Tested',
    icon: Users,
    detail:
      'Student teams co-design a working prototype with the community, build it and test it on-site — in the real monsoon, on the real farm, in the real classroom.',
    who: 'Student Team · Field Community',
    ledger: 'Pilot: 42 units field-tested',
  },
  {
    n: 5,
    title: 'Deployed & Monitored',
    icon: CheckCircle2,
    detail:
      'The solution goes live and stays visible. Impact is measured on health, water and livelihood outcomes, with local technicians keeping it running.',
    who: 'Field Monitor · Local Technicians',
    ledger: 'Live: monitored on the ledger',
  },
]

function useSectionProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        setP(Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / rect.height)))
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])
  return p
}

function StageContent({ stage, active, align }) {
  const IconComp = stage.icon
  const textRight = align === 'right'
  return (
    <div
      className={`flex flex-col ${
        textRight ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'
      }`}
    >
      <div className={`flex flex-wrap items-center gap-3 ${textRight ? 'lg:flex-row-reverse' : ''}`}>
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
            active ? 'bg-emerald-100 text-[#148554]' : 'bg-gray-100 text-gray-400'
          }`}
        >
          <IconComp className="h-5 w-5" />
        </span>
        <span className="flex items-center gap-2.5">
          <span
            className={`font-mono text-xs font-bold transition-colors duration-500 ${
              active ? 'text-[#148554]' : 'text-gray-300'
            }`}
          >
            /0{stage.n}
          </span>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            {stage.title}
          </h3>
        </span>
      </div>

      <p className="mt-3 max-w-lg text-base leading-relaxed text-gray-600">
        {stage.detail}
      </p>

      <div className={`mt-4 flex flex-wrap items-center gap-2 ${textRight ? 'lg:justify-end' : ''}`}>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0e6c43]">
          {stage.who}
        </span>
        <span className="font-mono text-xs text-[#148554]">{stage.ledger}</span>
      </div>
    </div>
  )
}

export default function Steps() {
  const wrapRef = useRef(null)
  const dotRefs = useRef([])
  const p = useSectionProgress(wrapRef)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (dotRefs.current[STAGES.length - 1]) {
          const top = el.getBoundingClientRect().top
          const first = dotRefs.current[0].getBoundingClientRect().top - top + 24
          const last =
            dotRefs.current[STAGES.length - 1].getBoundingClientRect().top - top + 24
          el.style.setProperty('--line-top', `${first}px`)
          el.style.setProperty('--line-end', `${last}px`)
        }
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const activeFor = (i) => p >= (i + 0.5) / STAGES.length

  return (
    <section id="how" className="py-16 md:py-28">
      <div className="container-page">
        {/* Centered header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold tracking-[0.28em] text-[#148554] uppercase">
            Public Ledger Pipeline
          </p>
          <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-bold tracking-tight text-gray-900">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
            Five stages, one public record. The green line draws as the ledger moves — every
            step leaves an audit trail anyone can check.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-[#0e6c43]">
            <CheckCircle2 className="h-4 w-4" />
            Each step leaves an audit record on the ledger
          </span>
        </div>

        {/* Timeline */}
        <div className="mx-auto mt-16 max-w-5xl md:mt-24">
          <div ref={wrapRef} className="relative">
            {/* Connecting line */}
            <svg
              aria-hidden="true"
              className="absolute w-[4px] left-6 lg:left-1/2 lg:-translate-x-1/2"
              style={{ top: 'var(--line-top)', height: 'var(--line-end)' }}
            >
              <path
                d="M2 0 L2 100000"
                stroke="#e5e7eb"
                strokeWidth="3"
                strokeDasharray="4 6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M2 0 L2 100000"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - p}
                stroke="#148554"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.08s linear' }}
              />
            </svg>

            <ol>
              {STAGES.map((stage, i) => {
                const active = activeFor(i)
                const last = i === STAGES.length - 1
                const left = i % 2 === 0
                return (
                  <li
                    key={stage.n}
                    className={`relative ${last ? '' : 'pb-16 md:pb-24'}`}
                  >
                    {/* Numbered dot */}
                    <span
                      ref={(el) => {
                        dotRefs.current[i] = el
                      }}
                      className={`absolute top-0 left-0 grid h-12 w-12 place-items-center rounded-full border-[3px] font-mono text-sm font-bold transition-all duration-500 lg:left-1/2 lg:-translate-x-1/2 ${
                        active
                          ? 'border-[#148554] bg-[#148554] text-white shadow-[0_0_28px_rgba(20,133,84,0.55)]'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {String(stage.n).padStart(2, '0')}
                    </span>

                    <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-0">
                      {left ? (
                        <>
                          <div className="pl-20 pr-0 lg:col-span-5 lg:col-start-1 lg:pl-0 lg:pr-20">
                            <StageContent stage={stage} active={active} align="right" />
                          </div>
                          <div className="hidden lg:col-span-7 lg:col-start-6 lg:block" />
                        </>
                      ) : (
                        <>
                          <div className="hidden lg:col-span-7 lg:block" />
                          <div className="pl-20 pr-0 lg:col-span-5 lg:col-start-8 lg:pl-20 lg:pr-0">
                            <StageContent stage={stage} active={active} align="left" />
                          </div>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
