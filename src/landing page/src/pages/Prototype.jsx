import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Partners from '../components/Partners'
import FinalCta from '../components/FinalCta'
import Footer from '../components/Footer'
import { STATS, PROBLEMS } from '../data/problemsData'

/* ------------------------------------------------------------------ */
/* scroll-linked progress hook (0 → 1 through the section)            */
/* ------------------------------------------------------------------ */

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
        setP(Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / rect.height)))
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

/* ------------------------------------------------------------------ */
/* equalizer bars (HackSpire-style visualizer)                        */
/* ------------------------------------------------------------------ */

function Equalizer({ bars = 26 }) {
  const items = Array.from({ length: bars }, (_, i) => ({
    delay: (i * 0.07).toFixed(2),
    dur: (0.85 + ((i * 37) % 10) * 0.09).toFixed(2),
    h: 16 + ((i * 53) % 72),
  }))
  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {items.map((b, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-white/70"
          style={{
            height: b.h,
            transformOrigin: 'bottom',
            animation: `proto-eq ${b.dur}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* prototype fullscreen overlay nav                                    */
/* ------------------------------------------------------------------ */

const MENU_LINKS = [
  { label: 'Numbers', href: '#proto-numbers' },
  { label: 'How it works', href: '#proto-how' },
  { label: 'Problems', href: '#proto-challenges', note: 'slider + full detail' },
  { label: 'Get Started', href: '/get-started', note: 'actor portal' },
]

function PrototypeNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Top bar */}
      <header
        className={`fixed top-0 right-0 left-0 z-[90] flex h-16 items-center justify-between px-5 transition-colors duration-500 sm:px-8 ${
          open ? 'text-black' : 'text-white'
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[#148554]" />
          Zencoders
          <span className="hidden font-mono text-xs font-medium tracking-widest text-current/60 sm:inline">
            SIH 2026
          </span>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="relative z-[91] grid h-11 w-11 place-items-center rounded-full border transition-colors duration-500 sm:h-12 sm:w-12"
        >
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
              open ? 'rotate-45' : '-translate-y-[7px]'
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
              open ? 'opacity-0 scale-x-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
              open ? '-rotate-45' : 'translate-y-[7px]'
            }`}
          />
        </button>
      </header>

      {/* Fullscreen overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-[88] flex flex-col justify-center bg-white transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              'radial-gradient(ellipse 82% 72% at 50% 100%, rgba(20,133,84,0.14) 0%, rgba(20,133,84,0.05) 28%, transparent 72%)',
          }}
        />
        <nav className="relative z-10 flex flex-col px-[8vw]" aria-label="Site sections">
          {MENU_LINKS.map((link, i) => (
            <span
              key={link.label}
              className={`overflow-hidden transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${150 + i * 70}ms` : '0ms' }}
            >
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 py-1.5 outline-none sm:gap-8"
                >
                  <span className="relative overflow-hidden">
                    <span
                      className="block font-sans text-[clamp(1.9rem,7vw,4.4rem)] leading-[0.95] font-bold tracking-tight text-black"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#148554] transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </span>
                </a>
              ) : (
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 py-1.5 outline-none sm:gap-8"
                >
                  <span className="relative overflow-hidden">
                    <span className="block font-sans text-[clamp(1.9rem,7vw,4.4rem)] leading-[0.95] font-bold tracking-tight text-black">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#148554] transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </span>
                  {link.note && (
                    <span className="hidden font-mono text-sm tracking-[0.18em] text-black/40 uppercase sm:inline">
                      {link.note}
                    </span>
                  )}
                </Link>
              )}
            </span>
          ))}
        </nav>
        <p className="absolute bottom-8 left-[8vw] font-mono text-sm tracking-[0.24em] text-black/40 uppercase">
          Every challenge finds its team
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* dark hero ramp + tagline eyebrow                                    */
/* ------------------------------------------------------------------ */

function PrototypeHero() {
  return (
    <section
      id="proto-hero"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#0d1b2e_0%,#13263f_52%,#1a3355_100%)] text-white"
    >
      <img
        src="/sample-assets/hero-collage.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-25 saturate-0 md:w-3/5"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,#0d1b2e_0%,rgba(13,27,46,0.7)_40%,rgba(13,27,46,0)_75%)]"
      />

      <div className="container-page relative z-10 pt-32 pb-20 md:pt-48 md:pb-32">
        <p className="font-mono text-sm font-bold tracking-[0.28em] text-emerald-300 uppercase">
          Every challenge finds its team
        </p>
        <h1 className="mt-4 max-w-3xl text-[clamp(3rem,7vw,5.5rem)] leading-[0.96] font-bold tracking-tight">
          From a real problem to a deployed solution — built in the open.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Ward-level problems are posted, matched to labs, built by student teams and
          monitored publicly on a ledger. The progress is the product.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/get-started"
            className="group flex items-center gap-2 rounded-full bg-[#148554] px-7 py-3 text-base font-semibold text-white transition-all hover:bg-[#0e6c43] hover:shadow-[0_0_24px_rgba(20,133,84,0.55)]"
          >
            <span>Report a Problem</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#proto-how"
            className="rounded-full border border-white/30 px-7 py-3 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            See how it works
          </a>
        </div>

        <p className="mt-8 font-mono text-sm tracking-[0.18em] text-slate-400 uppercase">
          {STATS[0].value} challenges live · {STATS[1].value} labs matched · {STATS[2].value}{' '}
          deployed · {STATS[3].value} mobilized
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* equalizer numbers band ("Glory" style)                              */
/* ------------------------------------------------------------------ */

function PrototypeNumbers() {
  return (
    <section id="proto-numbers" className="bg-[#0f1b2e] text-white">
      <style>{`@keyframes proto-eq{0%,100%{transform:scaleY(0.2)}50%{transform:scaleY(1)}}`}</style>
      <div className="container-page py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="font-mono text-sm font-bold tracking-[0.28em] text-emerald-300 uppercase">
              Live ledger · conclusion
            </p>
            <h2 className="mt-3 text-[2rem] font-bold tracking-tight md:text-5xl">
              Proof, not promises
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-400">
              The same counters that a visitor can check — challenges logged, labs matched,
              solutions on the ground.
            </p>
          </div>
          <Equalizer />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-4xl font-bold tracking-tight md:text-6xl">{s.value}</p>
              <p className="mt-2 text-base font-semibold text-white/85">{s.label}</p>
              <p className="mt-0.5 text-sm text-emerald-300/80">{s.change}</p>
              <p className="mt-3 font-mono text-sm tracking-wide text-slate-500">
                {s.hi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* HackSpire-style static 5-stage timeline                            */
/* ------------------------------------------------------------------ */

const STAGES = [
  {
    n: 1,
    title: 'Posted & Geo-Tagged',
    who: 'Community · Panchayat · Ministry',
    detail:
      'A citizen, panchayat or ministry logs a field challenge with location, photos and local context. The entry is public from day one.',
    ledger: 'Recorded: PROB-0214 · Geo-tagged',
  },
  {
    n: 2,
    title: 'Desk Triage & Verified',
    who: 'Verification Desk · AI Triage',
    detail:
      'AI triage and desk reviewers check the claim, confirm ground reality and assign technical categories.',
    ledger: 'Verified: category + urgency locked',
  },
  {
    n: 3,
    title: 'Research Lab Matched',
    who: 'IIT / NIT Lab · Industry Partner',
    detail:
      'The challenge is matched to an academic lab and an industry or CSR sponsor who commit resources.',
    ledger: 'Matched: IIT Kanpur Water Lab',
  },
  {
    n: 4,
    title: 'Pilot Built & Field Tested',
    who: 'Student Team · Field Community',
    detail:
      'Student teams co-design a prototype with the community, build it and test it on-site.',
    ledger: 'Pilot: 42 units field-tested',
  },
  {
    n: 5,
    title: 'Deployed & Monitored',
    who: 'Field Monitor · Local Technicians',
    detail:
      'The solution goes live and impact is measured on health, water and livelihood outcomes.',
    ledger: 'Live: monitored on the ledger',
  },
]

const DESKTOP_POS = [
  'lg:top-[4%] lg:left-[3%] xl:left-[6%]',
  'lg:top-[26%] lg:right-[-2%] xl:right-[2%]',
  'lg:top-[50%] lg:left-[3%] xl:left-[6%]',
  'lg:top-[73%] lg:right-[-2%] xl:right-[2%]',
  'lg:top-[92%] lg:left-[3%] xl:left-[6%]',
]

function PrototypeSteps() {
  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const [anchors, setAnchors] = useState([])
  const p = useSectionProgress(wrapRef)

  useEffect(() => {
    const canvas = wrapRef.current
    const lineEl = canvas && canvas.querySelector('[data-tl-line]')
    const pathEl = pathRef.current
    if (!canvas || !lineEl || !pathEl) return

    let raf = 0
    const buildAnchors = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const canvasRect = canvas.getBoundingClientRect()
        const lineRect = lineEl.getBoundingClientRect()
        const lineH = lineRect.height
        if (!lineH) return
        const total = pathEl.getTotalLength()
        if (!total) return

        const distAt = (targetY) => {
          if (targetY <= 0) return 0
          let lo = 0
          let hi = total
          for (let k = 0; k < 48; k++) {
            const mid = (lo + hi) / 2
            if (pathEl.getPointAtLength(mid).y < targetY) lo = mid
            else hi = mid
          }
          return (lo + hi) / 2
        }

        const canvasH = canvasRect.height
        const lineTopRel = lineRect.top - canvasRect.top

        const itemAnchors = Array.from(
          canvas.querySelectorAll('[data-tl-item]')
        ).map((el) => {
          const top = el.getBoundingClientRect().top - canvasRect.top
          const cy = Math.min(0.97, Math.max(0.03, top / canvasH))
          const fy = (top - lineTopRel) / lineH
          return { cy, d: distAt(fy * 2800 - 40) }
        })

        const pts = [
          { y: 0, d: 0 },
          ...itemAnchors.map((a) => ({ y: a.cy, d: a.d })),
          { y: 1, d: total },
        ]
        for (let i = 1; i < pts.length; i++) {
          if (pts[i].d < pts[i - 1].d) pts[i].d = pts[i - 1].d
        }
        setAnchors(pts.map((pt) => ({ y: pt.y, d: total ? pt.d / total : 0 })))
      })
    }
    buildAnchors()
    window.addEventListener('resize', buildAnchors)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', buildAnchors)
    }
  }, [])

  let draw = 0
  if (anchors.length) {
    if (p <= anchors[0].y) draw = anchors[0].d
    else if (p >= anchors[anchors.length - 1].y) draw = anchors[anchors.length - 1].d
    else {
      for (let i = 1; i < anchors.length; i++) {
        const a0 = anchors[i - 1]
        const a1 = anchors[i]
        if (p <= a1.y) {
          const t = (p - a0.y) / (a1.y - a0.y || 1)
          draw = a0.d + t * (a1.d - a0.d)
          break
        }
      }
    }
  }

  return (
    <section
      id="proto-how"
      className="relative z-10 flex w-full flex-col items-center overflow-x-clip bg-white px-5 pt-[14vh] pb-16 sm:px-[6vw] sm:pt-[16vh] sm:pb-24"
    >
      <div className="flex w-full max-w-[88rem] flex-col items-center gap-6 sm:gap-[3vh]">
        <h2 className="text-center font-sans text-[clamp(2.4rem,10vw,4rem)] leading-[0.95] font-bold tracking-tight text-[#148554]">
          How It Works
        </h2>
        <div className="relative flex w-full max-w-[62rem] justify-center px-2 sm:px-0">
          <p className="text-center font-sans text-[1.05rem] leading-[1.75] text-black/75 sm:text-[clamp(1.3rem,2vw,1.6rem)] sm:leading-[1.95]">
            Five stages, one public record. Every step leaves an audit trail anyone can
            check — from the first field report to the monitored deployment.
          </p>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative mt-[6vh] w-full max-w-[78rem] lg:-mt-[8vh] lg:h-[115vw] xl:h-[100vw]"
      >
        {/* Desktop wavy timeline line */}
        <div
          data-tl-line
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] left-[0%] right-[30%] hidden h-[88%] lg:block"
        >
          <svg
            viewBox="-40 -40 1320 2800"
            preserveAspectRatio="none"
            fill="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="proto-tl-grad"
                x1="200"
                y1="0"
                x2="1000"
                y2="2600"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7fe0b2" />
                <stop offset="0.45" stopColor="#148554" />
                <stop offset="1" stopColor="#0e6c43" />
              </linearGradient>
            </defs>
            <path
              d="M9.001 4C9.001 4 -15.155 65.5 50.5 133.5C116.155 201.5 229.557 204.076 294.5 296.5C352.121 378.5 348.348 441.21 440.5 512C550.5 596.5 710.501 479.853 862.001 535C955 568.5 1010 720 1040 820C1080 955 1120 1100 1184.5 1180C1240 1250 1280 1380 1220 1500C1150 1640 980 1680 880 1780C780 1880 720 1980 780 2100C850 2240 980 2320 1100 2420C1180 2490 1240 2580 1184.5 2680"
              stroke="#D4D4D4"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeDasharray="14 16"
            />
            <path
              ref={pathRef}
              d="M9.001 4C9.001 4 -15.155 65.5 50.5 133.5C116.155 201.5 229.557 204.076 294.5 296.5C352.121 378.5 348.348 441.21 440.5 512C550.5 596.5 710.501 479.853 862.001 535C955 568.5 1010 720 1040 820C1080 955 1120 1100 1184.5 1180C1240 1250 1280 1380 1220 1500C1150 1640 980 1680 880 1780C780 1880 720 1980 780 2100C850 2240 980 2320 1100 2420C1180 2490 1240 2580 1184.5 2680"
              stroke="url(#proto-tl-grad)"
              strokeWidth="6.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - draw}
            />
          </svg>
        </div>

        {/* Mobile straight timeline rail */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-2 bottom-2 left-[1.15rem] w-6 lg:hidden"
        >
          <svg viewBox="0 0 24 1000" preserveAspectRatio="none" fill="none" className="h-full w-full overflow-visible">
            <path d="M12 0 L12 1000" stroke="#D4D4D4" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" />
            <path
              d="M12 0 L12 1000"
              stroke="#148554"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - p}
              style={{ transition: 'stroke-dashoffset 0.08s linear' }}
            />
          </svg>
        </div>

        {/* Timeline items */}
        <div className="relative z-20 mt-10 flex flex-col items-center gap-10 lg:mt-0 lg:block lg:h-full lg:gap-0">
          {STAGES.map((stage, i) => (
            <div
              key={stage.n}
              data-tl-item
              className={`relative z-20 flex w-full max-w-[26rem] items-start pl-10 sm:max-w-[34rem] lg:absolute lg:max-w-[34rem] lg:pl-0 xl:max-w-[42rem] ${DESKTOP_POS[i]}`}
            >
              <span
                aria-hidden="true"
                className="absolute top-5 left-0 z-10 flex h-6 w-6 -translate-x-0.5 items-center justify-center lg:hidden"
              >
                <span
                  className="h-3 w-3 rounded-full border-2 bg-white"
                  style={{
                    borderColor: '#148554',
                    boxShadow: '0 0 10px rgba(20,133,84,0.45)',
                  }}
                />
              </span>

              <div className="shrink-0 self-start">
                <span className="font-sans text-[4.4rem] leading-[1.05] font-normal tracking-[0.04em] text-[#ADADAD] tabular-nums sm:text-[6.25rem] md:text-[7.5rem] lg:text-[8rem] xl:text-[10rem]">
                  {stage.n}
                </span>
              </div>

              <div className="flex flex-col px-2 pt-2 sm:px-5 lg:py-4">
                <h3 className="pt-2 font-sans text-2xl leading-tight font-medium text-[#148554] sm:text-3xl sm:leading-10 lg:pt-0 lg:leading-10 xl:text-4xl">
                  {stage.title}
                </h3>
                <div
                  aria-hidden="true"
                  className="mt-2 h-0.5 w-[min(54vw,16rem)] bg-linear-to-r from-[#148554] via-[#7fe0b2] to-transparent sm:w-[min(40vw,20rem)]"
                />
                <div className="mt-2 flex flex-col gap-2">
                  <p className="font-mono text-lg leading-snug font-bold tracking-wide text-black/85 sm:text-xl">
                    {stage.who}
                  </p>
                  <p className="font-sans text-lg leading-relaxed font-normal text-black/75 sm:text-xl">
                    {stage.detail}
                  </p>
                  <p className="font-mono text-base text-[#148554] sm:text-lg">
                    {stage.ledger}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* prototype page                                                      */
/* ------------------------------------------------------------------ */

export default function Prototype() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <style>{`@keyframes proto-eq{0%,100%{transform:scaleY(0.2)}50%{transform:scaleY(1)}}`}</style>
      <PrototypeNav />

      <Link
        to="/"
        className="fixed bottom-5 right-5 z-[80] flex items-center gap-1.5 rounded-full border border-gray-300 bg-white/95 px-4 py-2 font-mono text-sm font-semibold text-slate-600 shadow-md transition-colors hover:border-[#148554] hover:text-[#148554]"
      >
        Live site <ArrowRight className="h-4 w-4" />
      </Link>

      <main>
        <PrototypeHero />
        <PrototypeNumbers />
        <PrototypeSteps />
        <div id="proto-challenges" className="border-t border-gray-100 bg-[#f8fafc] pt-16 md:pt-20">
<div className="container-page">
          <p className="font-mono text-sm font-bold tracking-[0.28em] text-[#148554] uppercase">
            Trending ledger entries
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            On the board right now
          </h2>
        </div>
      </div>
      <div className="container-page pt-8">
        <div id="proto-challenges" className="grid gap-4 md:grid-cols-3">
            {PROBLEMS.slice(0, 3).map((prob) => (
              <Link
                key={prob.id}
                to="/get-started"
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-[#148554]/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] font-semibold tracking-wider text-[#148554] uppercase">
                    {prob.id}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {prob.urgency}
                  </span>
                </div>
                <h3 className="mt-3 text-lg leading-snug font-bold text-slate-900">
                  {prob.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[13px] text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {prob.place}
                </p>
                <p className="mt-2 line-clamp-2 text-base leading-relaxed text-slate-500">
                  {prob.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#148554]">
                  Open the record
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-16">
          <Partners large />
        </div>
        <FinalCta large />
        <Footer large />
      </main>
    </div>
  )
}