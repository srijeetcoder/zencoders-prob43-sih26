import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Heart,
  MessageSquare,
  ArrowRight,
  Users,
  Home,
  TrendingDown,
  Handshake,
  GraduationCap,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import ProblemDetailModal from './ProblemDetailModal'
import { PROBLEMS } from '../../data/landingProblemsData'

const TRENDING = [
  {
    id: 'PROB-0214',
    title: 'Water Logging & Drainage Runoff in Ward 12',
    location: 'Kolkata, West Bengal · कोलकाता',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=1000&auto=format&fit=crop&q=85',
    priority: 'High Priority',
    priorityColor: 'bg-rose-500 text-white',
    tags: ['Urban Infrastructure', 'Environment', 'Drainage'],
    likes: '--',
    comments: '--',
    rawProblem: PROBLEMS[0],
  },
  {
    id: 'PROB-0172',
    title: 'Decentralized Municipal Solid Waste Upcycling',
    location: 'Indore, Madhya Pradesh · इंदौर',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1000&auto=format&fit=crop&q=85',
    priority: 'Medium',
    priorityColor: 'bg-amber-500 text-white',
    tags: ['Clean Cities', 'Public Health', 'Bio-Gas'],
    likes: '--',
    comments: '--',
    rawProblem: PROBLEMS[1] || PROBLEMS[0],
  },
  {
    id: 'PROB-0188',
    title: 'Adaptive Smart Grid Street Lighting & Energy Saving',
    location: 'Jaipur, Rajasthan · जयपुर',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1000&auto=format&fit=crop&q=85',
    priority: 'Medium',
    priorityColor: 'bg-amber-500 text-white',
    tags: ['Smart Cities', 'Energy', 'IoT Mesh'],
    likes: '--',
    comments: '--',
    rawProblem: PROBLEMS[2] || PROBLEMS[0],
  },
  {
    id: 'PROB-0159',
    title: 'Drone Multispectral Crop Disease Detection',
    location: 'Nashik, Maharashtra · नाशिक',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000&auto=format&fit=crop&q=85',
    priority: 'Critical Priority',
    priorityColor: 'bg-emerald-600 text-white',
    tags: ['Agriculture', 'AI/ML', 'Computer Vision'],
    likes: '--',
    comments: '--',
    rawProblem: PROBLEMS[3] || PROBLEMS[0],
  },
]

const STORY_METRICS = [
  {
    icon: Users,
    value: '--',
    label: 'People Benefited',
  },
  {
    icon: Home,
    value: '--',
    label: 'Villages Covered',
  },
  {
    icon: TrendingDown,
    value: '--',
    label: 'Reduction in Waterborne Diseases',
  },
  {
    icon: Handshake,
    value: '--',
    label: 'Partner Organizations',
  },
]

export default function TrendingAndStories() {
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const INTERVAL_MS = 6000

  useEffect(() => {
    if (paused) return
    const stepTime = 50
    const increment = (stepTime / INTERVAL_MS) * 100

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActive((a) => (a + 1) % TRENDING.length)
          return 0
        }
        return prev + increment
      })
    }, stepTime)

    return () => clearInterval(progressTimer)
  }, [paused, active])

  const go = (dir) => {
    setActive((a) => (a + dir + TRENDING.length) % TRENDING.length)
    setProgress(0)
  }

  const selectSlide = (idx) => {
    setActive(idx)
    setProgress(0)
  }

  return (
    <section id="challenges" className="py-10 md:py-16">
      <div className="container-page">
        <div className="grid gap-6 xl:grid-cols-12 xl:gap-6 items-start">
          {/* ================= LEFT: TRENDING SLIDER (7 Cols) ================= */}
          <div className="xl:col-span-7 flex flex-col min-w-0">
            {/* Header + Controls */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                  Trending Problems
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  Live Feed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="mr-1 font-mono text-xs font-semibold text-gray-500">
                  {String(active + 1).padStart(2, '0')} / {String(TRENDING.length).padStart(2, '0')}
                </span>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous problem"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-xs transition-all hover:border-[#148554] hover:text-[#148554] active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next problem"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-xs transition-all hover:border-[#148554] hover:text-[#148554] active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Slide Container with Smooth Animated Viewport */}
            <div
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Top Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-20">
                <div
                  className="h-full bg-emerald-600 transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Slide Stack */}
              <div className="relative min-h-[380px] sm:min-h-[340px]">
                {TRENDING.map((item, idx) => {
                  const isActive = idx === active
                  return (
                    <article
                      key={item.id}
                      className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-out ${
                        isActive
                          ? 'opacity-100 translate-x-0 pointer-events-auto z-10'
                          : 'opacity-0 translate-x-8 pointer-events-none z-0'
                      }`}
                    >
                      <div className="grid md:grid-cols-2 h-full">
                        {/* Image side with refined zoom effect */}
                        <div className="group relative min-h-52 md:min-h-full bg-slate-900 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                          
                          <span
                            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${item.priorityColor}`}
                          >
                            {item.priority}
                          </span>
                          <span
                            className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs`}
                          >
                            {item.rawProblem.status}
                          </span>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-sm">
                              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              {item.location}
                            </p>
                          </div>
                        </div>

                        {/* Detail side */}
                        <div className="flex flex-col justify-between p-5 sm:p-6 bg-white">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold tracking-wider text-[#148554] uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                {item.id}
                              </span>
                              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                                {item.rawProblem.category}
                              </span>
                            </div>

                            <h3 className="mt-2 text-base sm:text-lg font-bold leading-tight text-gray-900">
                              {item.title}
                            </h3>

                            <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-3">
                              {item.rawProblem.summary}
                            </p>

                            {/* Detail chips */}
                            <div className="mt-3.5 grid gap-1.5 text-[11px]">
                              <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-gray-700 border border-slate-100">
                                <Users className="h-3.5 w-3.5 text-[#148554] shrink-0" />
                                <span className="truncate">{item.rawProblem.beneficiaries}</span>
                              </span>
                              <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-gray-700 border border-slate-100">
                                <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                <span className="truncate">{item.rawProblem.matchedLab || item.rawProblem.targetLab}</span>
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="mt-3 flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-emerald-50/70 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-100"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-rose-500" />
                                {item.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3 text-sky-500" />
                                {item.comments}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedProblem(item.rawProblem)}
                                className="rounded-lg border border-[#148554]/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#0e6c43] transition-colors hover:bg-emerald-100"
                              >
                                Full Detail
                              </button>
                              <Link
                                to="/register"
                                className="flex items-center gap-1.5 rounded-lg bg-[#148554] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#0e6c43] shadow-xs hover:shadow-sm"
                              >
                                <span>Join Challenge</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* Interactive Dots / Progress indicators */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {TRENDING.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => selectSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === active
                        ? 'w-7 bg-[#148554]'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Auto-advancing • Hover to inspect
              </span>
            </div>
          </div>

          {/* ================= RIGHT: SUCCESS STORIES (5 Cols) ================= */}
          <div id="stories" className="xl:col-span-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Success Stories
              </h2>
              <Link
                to="/successstories"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                View all stories →
              </Link>
            </div>

            {/* Split Container: Featured Story Card + Metrics Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
              {/* Featured Case Card */}
              <div className="md:col-span-7 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80"
                    alt="Solar Water Purification in Rural Bengal"
                    className="h-full w-full object-cover filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-[#148554] text-white px-2.5 py-0.5 text-[9px] font-bold shadow-xs">
                    Verified Deployment
                  </span>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold leading-tight text-gray-900">
                      Solar Water Purification in Rural Bengal
                    </h3>
                    <p className="mt-0.5 text-[10px] font-semibold text-emerald-700">
                      IIT KGP • Local Panchayat Desk • Community
                    </p>
                    <p className="mt-1.5 text-[11px] leading-snug text-gray-600">
                      Implemented decentralized solar capacitive deionization systems, delivering reliable potable water to rural hamlets.
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 text-[10px]">
                    <Link to="/successstories" className="font-semibold text-[#148554] hover:underline">
                      Read Field Audit
                    </Link>

                    {/* Team Avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden items-center">
                      <span className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-[#148554] text-white text-[8px] font-bold text-center leading-5">
                        AK
                      </span>
                      <span className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-[#0f766e] text-white text-[8px] font-bold text-center leading-5">
                        RM
                      </span>
                      <span className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-[#3b82f6] text-white text-[8px] font-bold text-center leading-5">
                        PS
                      </span>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[8px] font-bold text-gray-600 ring-1 ring-white">
                        +3
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Metrics List */}
              <div className="md:col-span-5 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs flex flex-col justify-around gap-2.5">
                {STORY_METRICS.map((metric) => {
                  const IconComp = metric.icon
                  return (
                    <div key={metric.label} className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-50 text-[#148554] border border-emerald-100">
                        <IconComp className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs font-extrabold text-emerald-800 leading-tight">
                          {metric.value}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-tight truncate">
                          {metric.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </section>
  )
}
