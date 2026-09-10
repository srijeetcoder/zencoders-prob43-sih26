import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import ImpactBand from '../components/landing/ImpactBand'
import Steps from '../components/landing/Steps'
import TrendingAndStories from '../components/landing/TrendingAndStories'
import Partners from '../components/landing/Partners'
import FinalCta from '../components/landing/FinalCta'
import Footer from '../components/landing/Footer'
import SmoothScroll from '../components/landing/SmoothScroll'

export default function LandingPage() {
  return (
    <div id="page" className="min-h-screen bg-[#f8fafc] text-ink">
      <SmoothScroll />
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
