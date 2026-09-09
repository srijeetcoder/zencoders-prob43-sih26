import React from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import ImpactBand from '../components/ImpactBand'
import Steps from '../components/Steps'
import TrendingAndStories from '../components/TrendingAndStories'
import Partners from '../components/Partners'
import FinalCta from '../components/FinalCta'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div id="page" className="bg-[#f8fafc]">
      <Nav />
      <main>
        <Hero />
        <ImpactBand />
        <Steps />
        <TrendingAndStories />
        <Partners />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}