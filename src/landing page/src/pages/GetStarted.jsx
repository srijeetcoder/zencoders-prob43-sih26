import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { LedgerMark } from '../components/Figures'
import {
  User,
  Landmark,
  Building,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react'

const ACTORS = [
  {
    id: 'citizen',
    label: 'Citizen',
    hi: 'नागरिक',
    icon: User,
    desc: 'Individual resident or community activist reporting an everyday societal bottleneck.',
    next: [
      'Your report is logged on the public ledger with GPS coordinates and date.',
      'A regional desk verifies the claim against municipal or district records.',
      'You are invited into the active coordination chat once a lab team is matched.',
    ],
  },
  {
    id: 'panchayat',
    label: 'Gram Panchayat',
    hi: 'ग्राम पंचायत',
    icon: Landmark,
    desc: 'Elected village local governance body representing rural hamlets and blocks.',
    next: [
      'The block development office officially countersigns the ledger entry.',
      'A district technical desk maps relevant state/central scheme budget heads.',
      'An engineering university team is matched and field trials are scheduled.',
    ],
  },
  {
    id: 'ministry',
    label: 'Ministry / Dept',
    hi: 'मंत्रालय',
    icon: Building,
    desc: 'State or Central government department seeking scalable engineering interventions.',
    next: [
      'The ministry issue receives an expedited national priority routing tag.',
      'A central innovation coordinator facilitates academic-industry consortia.',
      'Regulatory compliance and pilot approval lanes clear before hardware fabrication.',
    ],
  },
  {
    id: 'university',
    label: 'University Lab',
    hi: 'विश्वविद्यालय',
    icon: GraduationCap,
    desc: 'Academic faculty or student research team seeking real-world challenge mandates.',
    next: [
      'Your laboratory profile and engineering capacity are indexed.',
      'Algorithmic matching pairs your lab with open problem geometries.',
      'Formal co-development charter and research grant agreements are finalized.',
    ],
  },
  {
    id: 'industry',
    label: 'Industry / CSR',
    hi: 'उद्योग / सीएसआर',
    icon: Briefcase,
    desc: 'Corporate sponsor, foundation, or MSME ready to fund or manufacture at scale.',
    next: [
      'Your CSR charter focus areas are matched against validated ledger rows.',
      'You fund, fabricate, or advise—never a silent or passive sponsorship slot.',
      'Every delivered milestone is transparently published back to the public ledger.',
    ],
  },
]

const CATEGORIES = [
  'Water Resources',
  'Public Health',
  'Agriculture & Food',
  'Clean Energy & Climate',
  'Civic Tech & Disaster',
  'Education',
  'Waste Management',
  'Other',
]

function makeId() {
  return `PROB-${String(1000 + Math.floor(Math.random() * 9000))}`
}

export default function GetStarted() {
  const [currentStep, setCurrentStep] = useState(1)
  const [actor, setActor] = useState('citizen')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [district, setDistrict] = useState('')
  const [state, setState] = useState('')
  const [urgency, setUrgency] = useState('High')
  const [tried, setTried] = useState('')
  const [beneficiaries, setBeneficiaries] = useState('')
  const [skillsNeeded, setSkillsNeeded] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  const activeActor = ACTORS.find((a) => a.id === actor) || ACTORS[0]

  const handleNextStep = (e) => {
    e.preventDefault()
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFinalSubmit = (e) => {
    e.preventDefault()
    const newRecord = {
      id: makeId(),
      actor: activeActor,
      title: title.trim() || 'Community Drinking Water Access',
      category,
      place: `${district.trim() || 'Jhansi'}, ${state.trim() || 'Uttar Pradesh'}`,
      district: district.trim() || 'Jhansi',
      state: state.trim() || 'Uttar Pradesh',
      urgency,
      tried: tried.trim() || 'Traditional borewells dry out during summer; manual tankers only supply 30% of requirement.',
      beneficiaries: beneficiaries.trim() || '18,000 residents across 14 hamlets',
      skillsNeeded: skillsNeeded.trim() || 'Solar desalination / Water purification engineering',
      date: 'Just now',
    }
    setSubmittedData(newRecord)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setSubmittedData(null)
    setCurrentStep(1)
    setTitle('')
    setDistrict('')
    setState('')
    setTried('')
    setBeneficiaries('')
    setSkillsNeeded('')
  }

  return (
    <div id="get-started" className="min-h-screen flex flex-col justify-between bg-paper">
      <Nav />

      <main className="overflow-x-clip pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-page">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
              <Sparkles className="h-3 w-3" />
              <span>शुरुआत · Step-by-Step Problem Intake</span>
            </div>

            <h1 className="mt-4 text-[clamp(2.3rem,4.5vw,3.6rem)] leading-[1.05] font-extrabold tracking-tight text-ink">
              Put a challenge on the public ledger.
            </h1>

            <p className="mt-3 text-base leading-relaxed text-ink-2">
              Follow the 4-step wizard to articulate your community's challenge.
              Once verified, the platform pairs it with relevant university research labs and funding.
            </p>
          </div>

          {/* Stepper Wizard Indicator */}
          {!submittedData && (
            <div className="mt-8 rounded-2xl border border-line bg-paper-2 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                {[
                  { n: 1, label: 'Stakeholder Role' },
                  { n: 2, label: 'Problem Essentials' },
                  { n: 3, label: 'Context & Attempts' },
                  { n: 4, label: 'Review & Verify' },
                ].map((s) => (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => s.n < currentStep && setCurrentStep(s.n)}
                    className={`flex items-center gap-2 text-xs font-semibold transition-all ${
                      currentStep === s.n
                        ? 'text-accent'
                        : s.n < currentStep
                        ? 'text-olive cursor-pointer'
                        : 'text-ink-3 opacity-60'
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                        currentStep === s.n
                          ? 'bg-accent text-white ring-4 ring-accent/20'
                          : s.n < currentStep
                          ? 'bg-olive text-white'
                          : 'border border-line bg-paper text-ink-3'
                      }`}
                    >
                      {s.n < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.n}
                    </span>
                    <span className="hidden md:inline">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Submitted Success View */}
          {submittedData ? (
            <div className="mt-10 rounded-3xl border border-line bg-paper-2 p-6 sm:p-10 shadow-xl max-w-3xl">
              <div className="flex items-center gap-2 text-olive">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Queued on Public Ledger · Demo Mode
                </span>
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-ink">
                Problem Successfully Registered!
              </h2>

              <p className="mt-2 text-sm text-ink-2">
                Your entry has been assigned a cryptographic ledger ID and queued for desk verification.
              </p>

              {/* Simulated Ledger Entry Card */}
              <div className="mt-6 rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <LedgerMark className="h-4 w-4" />
                    <span className="font-mono text-sm font-bold text-accent">
                      {submittedData.id}
                    </span>
                  </div>
                  <span className="rounded-full bg-accent/15 px-3 py-0.5 font-mono text-xs font-semibold text-accent uppercase">
                    Stage 01 · Verification Pending
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-bold text-ink">{submittedData.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-ink-3">
                    <span className="flex items-center gap-1 font-medium text-ink-2">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {submittedData.place}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {submittedData.category}
                    </span>
                    <span className="font-mono text-accent font-semibold">
                      Urgency: {submittedData.urgency}
                    </span>
                  </div>

                  <div className="rounded-xl border border-line bg-paper-2 p-3 text-xs text-ink-2">
                    <p className="font-bold text-ink-3 uppercase text-[10px] mb-1">
                      Prior Attempts
                    </p>
                    <p>{submittedData.tried}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 text-xs">
                    <div className="rounded-xl border border-line bg-paper-2 p-3">
                      <p className="font-bold text-ink-3 uppercase text-[10px]">Beneficiaries</p>
                      <p className="font-semibold text-ink mt-0.5">{submittedData.beneficiaries}</p>
                    </div>
                    <div className="rounded-xl border border-line bg-paper-2 p-3">
                      <p className="font-bold text-ink-3 uppercase text-[10px]">Skill Profile</p>
                      <p className="font-semibold text-ink mt-0.5">{submittedData.skillsNeeded}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps for this actor */}
              <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-3">
                  What Happens Next for {submittedData.actor.label} ({submittedData.actor.hi})
                </p>
                <ol className="space-y-2">
                  {submittedData.actor.next.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-2">
                      <span className="serif-num font-bold text-accent">0{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-accent px-6 py-3 text-xs font-semibold text-white hover:bg-accent-deep transition-colors"
                >
                  Post Another Challenge
                </button>
                <Link
                  to="/#challenges"
                  className="rounded-full border border-line bg-paper px-6 py-3 text-xs font-medium text-ink hover:bg-paper-2 transition-colors"
                >
                  Explore Public Ledger
                </Link>
              </div>
            </div>
          ) : (
            /* Multi-step Form Wizard */
            <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
              {/* Form Input Area */}
              <div className="lg:col-span-7">
                {/* STEP 1: Stakeholder Role */}
                {currentStep === 1 && (
                  <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Step 1 of 4
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-ink">
                        Who is putting this on the ledger?
                      </h2>
                      <p className="mt-1 text-xs text-ink-2">
                        Select your stakeholder archetype to tailor verification and governance lanes.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {ACTORS.map((a) => {
                        const isSelected = actor === a.id
                        const ActorIcon = a.icon
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setActor(a.id)}
                            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                              isSelected
                                ? 'border-accent bg-accent/10 ring-1 ring-accent shadow-xs'
                                : 'border-line bg-paper-2/50 hover:border-accent/40 hover:bg-paper-2'
                            }`}
                          >
                            <span
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm ${
                                isSelected ? 'bg-accent text-white' : 'bg-paper-3 text-ink-2'
                              }`}
                            >
                              <ActorIcon className="h-4 w-4" />
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-ink">{a.label}</p>
                                <span className="font-mono text-xs text-ink-3">{a.hi}</span>
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-ink-2">{a.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold text-white hover:bg-accent-deep transition-all"
                      >
                        <span>Continue to Problem Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Problem Essentials */}
                {currentStep === 2 && (
                  <form onSubmit={handleNextStep} className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Step 2 of 4
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-ink">
                        Problem statement & geographic scope
                      </h2>
                      <p className="mt-1 text-xs text-ink-2">
                        State the core challenge clearly in one line and define where it occurs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="prob-title" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                          One-Line Problem Title *
                        </label>
                        <input
                          id="prob-title"
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Safe drinking water for 18 Bundelkhand hamlets"
                          className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="prob-category" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                            Domain Category *
                          </label>
                          <select
                            id="prob-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-3 py-3 text-xs text-ink focus:border-accent focus:outline-none"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="prob-urgency" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                            Urgency / Priority *
                          </label>
                          <select
                            id="prob-urgency"
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-3 py-3 text-xs text-ink focus:border-accent focus:outline-none"
                          >
                            <option value="Critical">Critical (Life / Seasonal Hazard)</option>
                            <option value="High">High (Immediate Community Need)</option>
                            <option value="Medium">Medium (Systemic Improvement)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="prob-district" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                            District / Block *
                          </label>
                          <input
                            id="prob-district"
                            type="text"
                            required
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="e.g. Jhansi, Babina Block"
                            className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
                          />
                        </div>

                        <div>
                          <label htmlFor="prob-state" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                            State / UT *
                          </label>
                          <input
                            id="prob-state"
                            type="text"
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="e.g. Uttar Pradesh"
                            className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold text-white hover:bg-accent-deep transition-all"
                      >
                        <span>Continue to Context</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: Context & Previous Attempts */}
                {currentStep === 3 && (
                  <form onSubmit={handleNextStep} className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Step 3 of 4
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-ink">
                        Why is this stuck & what failed previously?
                      </h2>
                      <p className="mt-1 text-xs text-ink-2">
                        University labs need honest technical context to engineer the right fix.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="prob-tried" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                          What interventions were attempted before? *
                        </label>
                        <textarea
                          id="prob-tried"
                          rows="3"
                          required
                          value={tried}
                          onChange={(e) => setTried(e.target.value)}
                          placeholder="e.g. Installed standard RO plants in 2021, but heavy maintenance costs and 60% water rejection made them non-operational."
                          className="mt-1.5 w-full resize-none rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label htmlFor="prob-beneficiaries" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                          Estimated Population / Scale of Impact
                        </label>
                        <input
                          id="prob-beneficiaries"
                          type="text"
                          value={beneficiaries}
                          onChange={(e) => setBeneficiaries(e.target.value)}
                          placeholder="e.g. 18,400 villagers across 14 hamlets"
                          className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="prob-skills" className="text-xs font-bold uppercase tracking-wider text-ink-3">
                          Specific Scientific / Engineering Capability Needed
                        </label>
                        <input
                          id="prob-skills"
                          type="text"
                          value={skillsNeeded}
                          onChange={(e) => setSkillsNeeded(e.target.value)}
                          placeholder="e.g. Solar capacitive deionization, low-cost bio-filtration"
                          className="mt-1.5 w-full rounded-xl border border-line bg-paper-2 px-4 py-3 text-xs sm:text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold text-white hover:bg-accent-deep transition-all"
                      >
                        <span>Preview Ledger Card</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 4: Review & Final Submission */}
                {currentStep === 4 && (
                  <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Step 4 of 4 · Final Verification
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-ink">
                        Review your public ledger row
                      </h2>
                      <p className="mt-1 text-xs text-ink-2">
                        Check all details before submitting to the immutable registry.
                      </p>
                    </div>

                    {/* Live Preview Card */}
                    <div className="rounded-2xl border border-line bg-paper-2 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-line pb-2.5">
                        <div className="flex items-center gap-2">
                          <LedgerMark className="h-4 w-4" />
                          <span className="font-mono text-xs font-bold text-accent">
                            PROB-PREVIEW
                          </span>
                        </div>
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent uppercase">
                          Ready for Ingestion
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-ink">
                          {title.trim() || 'Untitled Societal Challenge'}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-3">
                          <span className="flex items-center gap-1 font-medium text-ink-2">
                            <MapPin className="h-3 w-3 text-accent" />
                            {district || 'District'}, {state || 'State'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {category}
                          </span>
                          <span className="font-mono text-accent">
                            Priority: {urgency}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-line bg-paper p-3 text-xs space-y-1.5">
                        <p className="font-bold text-ink-3 uppercase text-[10px]">Context / Blocker</p>
                        <p className="text-ink-2">{tried || 'Detailed engineering blocker description.'}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-ink-3 pt-1">
                        <span>Submitted as: <strong className="text-ink">{activeActor.label}</strong></span>
                        <span>Impact: <strong className="text-ink">{beneficiaries || 'Community scale'}</strong></span>
                      </div>
                    </div>

                    {/* Checkbox verification */}
                    <div className="flex items-start gap-3 rounded-xl border border-line bg-paper-2/60 p-4">
                      <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-ink-2 leading-relaxed">
                        I confirm this challenge represents an authentic civic or rural bottleneck.
                        Data submitted will be publicly viewable on the Zencoders ledger for university matching.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-accent"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        className="flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xs font-semibold text-white shadow-md hover:bg-accent-deep hover:shadow-lg transition-all"
                      >
                        <span>Put on Ledger</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Guide */}
              <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                {/* Active Actor Guidance */}
                <div className="rounded-3xl border border-line bg-paper-2 p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 border-b border-line pb-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent">
                      {React.createElement(activeActor.icon, { className: 'h-4 w-4' })}
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                        Stakeholder Roadmap
                      </p>
                      <h3 className="text-sm font-bold text-ink">
                        {activeActor.label} ({activeActor.hi})
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-ink-2">
                    {activeActor.desc}
                  </p>

                  <div className="mt-5 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      Next Milestones upon Submission
                    </p>
                    <ol className="space-y-2.5">
                      {activeActor.next.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-2">
                          <span className="serif-num font-bold text-accent">0{idx + 1}.</span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Transparency Commitment Box */}
                <div className="rounded-3xl bg-ink p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 text-white/70">
                    <ShieldCheck className="h-4 w-4 text-sun" />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      Public Accountability
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-white/80">
                    Every row entered on the ledger is open to public inspection. No private paywalls,
                    no hidden matching fees.
                  </p>
                  <Link
                    to="/#challenges"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sun hover:underline"
                  >
                    <span>← Return to Public Ledger</span>
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}