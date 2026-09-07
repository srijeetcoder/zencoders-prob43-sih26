import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const STATS = [
  { value: '1,240', label: 'Problems Submitted' },
  { value: '320', label: 'Projects in Progress' },
  { value: '180', label: 'Universities Involved' },
  { value: '75', label: 'Industry Partners' },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-[#eaf4fa]/90 via-[#f0f9f5]/70 to-white pt-10 pb-16 md:pt-14 md:pb-20">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Eyebrow */}
            <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              PEOPLE · UNIVERSITIES · INDUSTRY · REAL SOLUTIONS
            </p>

            {/* Main Headline */}
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.2rem)] font-extrabold leading-[1.06] tracking-tight text-gray-900">
              Turning Real-World <br />
              Problems into <br />
              <span className="text-[#148554]">Real Solutions</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
              A national platform to crowdsource societal challenges and connect them
              with the right academic talent and industry partners.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                to="/get-started"
                className="flex items-center gap-2 rounded-lg bg-[#148554] hover:bg-[#0e6c43] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md"
              >
                <span>Report a Problem</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#challenges"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-xs hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Explore Problems
              </a>
            </div>

            {/* 4 Stats in a row */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 pt-6 border-t border-gray-200/80 w-full">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs font-medium text-gray-500 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Exact Photo Collage from sample.png */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative max-w-full">
              <img
                src="/sample-assets/hero-collage.png"
                alt="Stronger Communities, Smarter Solutions - JanSahyog collage"
                className="w-full max-w-[700px] h-auto object-contain drop-shadow-md select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}