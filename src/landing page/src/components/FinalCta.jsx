import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FinalCta({ large = false }) {
  return (
    <section className="bg-[#1a3355] py-10 md:py-16 text-white">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className={`${large ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'} font-bold tracking-tight text-white text-center sm:text-left`}>
          Let's Build a Stronger, Smarter, More Inclusive India — Together.
        </h2>

        <Link
          to="/get-started"
          className={`rounded-lg bg-[#148554] hover:bg-[#0e6c43] px-6 py-2.5 ${large ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} font-semibold text-white shadow-sm flex items-center gap-2 transition-all shrink-0 hover:shadow-md hover:scale-102`}
        >
          <span>Get Started Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}