import { Routes, Route } from "react-router-dom"

import Sidebar from "../components/homepage/Sidebar.tsx"
import Navbar from "../components/homepage/Navbar.tsx"
import Hero from "../components/homepage/Hero.tsx"
import ProblemsNearYou from "../components/homepage/ProblemsNearYou.tsx"
import OngoingProjects from "../components/homepage/OngoingProjects.tsx"
import ProfileHero from "../components/homepage/ProfileHero.tsx"

function MainContent() {
  return (
    <>
      <Hero />
      <ProblemsNearYou />
      <OngoingProjects />
    </>
  );
}

function DashBoard() {
  return (
    <>
      <ProfileHero />
    </>
  );
}

function Homepage() {
  return (
    <div className="flex min-h-screen bg-[#f5f9fc]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <Routes>
          <Route path="/main" element={<MainContent />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </div>
    </div>
  );
}

export default Homepage;
