import React from 'react'

export default function Partners({ large = false }) {
  return (
    <section id="partners" className="py-10 md:py-16 border-t border-gray-100 bg-white">
      <div className="container-page">
        <h2 className={`${large ? 'text-lg' : 'text-sm'} font-bold tracking-tight text-gray-900 mb-6 uppercase tracking-wider text-xs text-slate-400 font-semibold`}>
          Supported & Recognized by National Institutions
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8">
          {/* Ministry of Education Clean Vector Lockup */}
          <div className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
            <svg className="h-9 w-auto text-slate-700" viewBox="0 0 24 32" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v28M7 7h10M5 12h14M8 17h8M6 22h12M9 27h6" />
              <circle cx="12" cy="5" r="2" fill="currentColor" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold uppercase tracking-tight text-slate-800 leading-none">
                Ministry of Education
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Government of India
              </span>
            </div>
          </div>

          {/* AICTE */}
          <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100">
            <img
              src="/sample-assets/partner-aicte.png"
              alt="AICTE"
              className="h-10 w-auto object-contain max-w-[150px]"
            />
          </div>

          {/* NIC */}
          <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100">
            <img
              src="/sample-assets/partner-nic.png"
              alt="NIC"
              className="h-9 w-auto object-contain max-w-[150px]"
            />
          </div>

          {/* i-Hub */}
          <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100">
            <img
              src="/sample-assets/partner-ihub.png"
              alt="i-Hub"
              className="h-9 w-auto object-contain max-w-[150px]"
            />
          </div>

          {/* MeitY */}
          <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100">
            <img
              src="/sample-assets/partner-meity.png"
              alt="MeitY"
              className="h-10 w-auto object-contain max-w-[150px]"
            />
          </div>

          {/* Smart India Hackathon */}
          <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100">
            <img
              src="/sample-assets/partner-sih.png"
              alt="Smart India Hackathon"
              className="h-10 w-auto object-contain max-w-[150px]"
            />
          </div>

          {/* Vocal For Local */}
          <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100">
            <img
              src="/sample-assets/partner-vocal.png"
              alt="Vocal For Local"
              className="h-9 w-auto object-contain max-w-[150px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
