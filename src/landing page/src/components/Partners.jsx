import React from 'react'

const PARTNERS = [
  { name: 'Ministry of Education', src: '/sample-assets/partner-moe.png', h: 'h-10' },
  { name: 'AICTE', src: '/sample-assets/partner-aicte.png', h: 'h-10' },
  { name: 'NIC', src: '/sample-assets/partner-nic.png', h: 'h-9' },
  { name: 'i-Hub', src: '/sample-assets/partner-ihub.png', h: 'h-9' },
  { name: 'MeitY', src: '/sample-assets/partner-meity.png', h: 'h-10' },
  { name: 'Smart India Hackathon', src: '/sample-assets/partner-sih.png', h: 'h-10' },
  { name: 'Vocal For Local', src: '/sample-assets/partner-vocal.png', h: 'h-9' },
]

export default function Partners({ large = false }) {
  return (
    <section id="partners" className="py-10 md:py-16 border-t border-gray-100 bg-white">
      <div className="container-page">
        <h2 className={`${large ? 'text-lg' : 'text-sm'} font-bold tracking-tight text-gray-900 mb-4`}>
          Our Partners
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200 opacity-90 hover:opacity-100"
            >
              <img
                src={p.src}
                alt={p.name}
                className={`${p.h} w-auto object-contain max-w-[170px]`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}