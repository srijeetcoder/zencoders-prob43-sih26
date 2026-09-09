import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'
import ProblemDetailModal from './ProblemDetailModal'
import { PROBLEMS } from '../data/problemsData'

const TRENDING = [
  {
    id: 'PROB-0214',
    title: 'Water Logging in Ward 12',
    location: 'Kolkata, West Bengal',
    image: '/sample-assets/prob-water.png',
    priority: 'High Priority',
    priorityColor: 'bg-[#ef4444] text-white',
    tags: ['Urban Infrastructure', 'Environment'],
    likes: 34,
    comments: 12,
    rawProblem: PROBLEMS[0],
  },
  {
    id: 'PROB-0172',
    title: 'Solid Waste Management',
    location: 'Indore, Madhya Pradesh',
    image: '/sample-assets/prob-waste.png',
    priority: 'Medium',
    priorityColor: 'bg-[#f59e0b] text-white',
    tags: ['Clean Cities', 'Public Health'],
    likes: 28,
    comments: 8,
    rawProblem: PROBLEMS[1] || PROBLEMS[0],
  },
  {
    id: 'PROB-0188',
    title: 'Smart Street Lighting',
    location: 'Jaipur, Rajasthan',
    image: '/sample-assets/prob-lighting.png',
    priority: 'Medium',
    priorityColor: 'bg-[#f59e0b] text-white',
    tags: ['Smart Cities', 'Energy'],
    likes: 19,
    comments: 6,
    rawProblem: PROBLEMS[2] || PROBLEMS[0],
  },
  {
    id: 'PROB-0159',
    title: 'Crop Disease Detection',
    location: 'Nashik, Maharashtra',
    image: '/sample-assets/prob-drone.png',
    priority: 'Low',
    priorityColor: 'bg-[#22c55e] text-white',
    tags: ['Agriculture', 'AI/ML'],
    likes: 41,
    comments: 14,
    rawProblem: PROBLEMS[3] || PROBLEMS[0],
  },
]

const STORY_METRICS = [
  {
    icon: Users,
    value: '12,000+',
    label: 'People Benefited',
  },
  {
    icon: Home,
    value: '5',
    label: 'Villages Covered',
  },
  {
    icon: TrendingDown,
    value: '60%',
    label: 'Reduction in Water-borne Diseases',
  },
  {
    icon: Handshake,
    value: '3',
    label: 'Partner Organizations',
  },
]

export default function TrendingAndStories() {
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive((a) => (a + 1) % TRENDING.length)
    }, 6000)
    return () => clearInterval(id)
  }, [paused])

  const go = (dir) => {
    setActive((a) => (a + dir + TRENDING.length) % TRENDING.length)
  }

  return (
    <section id="challenges" className="py-10 md:py-16">
      <div className="container-page">
        <div className="grid gap-6 xl:grid-cols-12 xl:gap-6 items-start">
          {/* ================= LEFT: TRENDING SLIDER (7 Cols) ================= */}
          <div className="xl:col-span-7 flex flex-col min-w-0">
            {/* Header + Controls */}
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Trending Problems
              </h2>
              <div className="flex items-center gap-2">
                <span className="mr-1 font-mono text-xs text-gray-400">
                  {String(active + 1).padStart(2, '0')} / {String(TRENDING.length).padStart(2, '0')}
                </span>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous problem"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#148554] hover:text-[#148554]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next problem"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#148554] hover:text-[#148554]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Big Slide */}
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {TRENDING.map((item, idx) => (
                <article
                  key={item.id}
                  className={`${
                    idx === active ? 'block' : 'hidden'
                  } flex flex-col justify-between rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs`}
                >
                  <div className="grid md:grid-cols-2">
                    {/* Image side */}
                    <div className="relative min-h-48 md:min-h-[210px] bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${item.priorityColor}`}
                      >
                        {item.priority}
                      </span>
                      <span
                        className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${item.rawProblem.statusTone}`}
                      >
                        {item.rawProblem.status}
                      </span>
                    </div>

                    {/* Detail side */}
                    <div className="flex flex-col p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold tracking-wider text-[#148554] uppercase">
                          {item.id}
                        </span>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          {item.rawProblem.category}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-base sm:text-lg font-bold leading-tight text-gray-900">
                        {item.rawProblem.title}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                        {item.location}
                      </p>

                      <p className="mt-2 text-[13px] leading-relaxed text-gray-500 line-clamp-2">
                        {item.rawProblem.summary}
                      </p>

                      {/* Detail chips */}
                      <div className="mt-3 grid gap-2 text-[11px]">
                        <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600">
                          <Users className="h-3.5 w-3.5 text-[#148554] shrink-0" />
                          {item.rawProblem.beneficiaries}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600">
                          <Flame className="h-3.5 w-3.5 text-[#ef4444] shrink-0" />
                          Priority: {item.rawProblem.urgency}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-gray-600">
                          <GraduationCap className="h-3.5 w-3.5 text-[#148554] shrink-0" />
                          {item.rawProblem.matchedLab || item.rawProblem.targetLab}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {item.comments} comments
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
                            to="/get-started"
                            className="flex items-center gap-1.5 rounded-lg bg-[#148554] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0e6c43]"
                          >
                            <span>Join this Challenge</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Dots */}
            <div className="mt-3 flex items-center gap-1.5">
              {TRENDING.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to problem ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === active
                      ? 'w-6 bg-[#148554]'
                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ================= RIGHT: SUCCESS STORIES (5 Cols) ================= */}
          <div id="stories" className="xl:col-span-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Success Stories
              </h2>
            </div>

            {/* Split Container: Featured Story Card + Metrics Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
              {/* Featured Case Card (7 cols of right section) */}
              <div className="md:col-span-7 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="relative h-28 w-full bg-gray-100 overflow-hidden">
                  <img
                    src="/sample-assets/story-solar.png"
                    alt="Solar Water Purification in Rural Bengal"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-[#148554] text-white px-2 py-0.5 text-[9px] font-bold">
                    Completed
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold leading-tight text-gray-900">
                      Solar Water Purification in Rural Bengal
                    </h3>
                    <p className="mt-0.5 text-[10px] font-semibold text-gray-600">
                      IIT KGP • Local NGO • 5 Villages
                    </p>
                    <p className="mt-1.5 text-[11px] leading-snug text-gray-500">
                      Implemented low-cost solar water purification systems in 5 rural
                      villages, providing clean drinking water to 12,000+ people.
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px]">
                    <span className="font-semibold text-[#148554]">Read More</span>

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

              {/* Vertical Metrics List (5 cols of right section) */}
              <div className="md:col-span-5 rounded-xl border border-gray-200 bg-white p-3 shadow-xs flex flex-col justify-around gap-2">
                {STORY_METRICS.map((metric) => {
                  const IconComp = metric.icon
                  return (
                    <div key={metric.label} className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-[#148554]">
                        <IconComp className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-gray-900 leading-tight">
                          {metric.value}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-tight">
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