import { Routes, Route, Navigate } from "react-router-dom"

// Layout
import GovTopBar from "./components/homepage/GovTopBar.tsx"
import Sidebar from "./components/homepage/Sidebar.tsx"
import Navbar from "./components/homepage/Navbar.tsx"
import Footer from "./components/homepage/Footer.tsx"

// Homepage sections
import WelcomeBack from "./components/homepage/WelcomeBack.tsx"
import StatsBand from "./components/homepage/StatsBand.tsx"
import HighDemandCases from "./components/homepage/HighDemandCases.tsx"
import CasesByDomain from "./components/homepage/CasesByDomain.tsx"
import AreaWiseProblems from "./components/homepage/AreaWiseProblems.tsx"
import ProblemsNearYou from "./components/homepage/ProblemsNearYou.tsx"
import OngoingProjects from "./components/homepage/OngoingProjects.tsx"
import Testimonials from "./components/homepage/Testimonials.tsx"

// Sidebar pages
import LiveProblems from "./Live-Problems/LiveProblems.tsx"
import ProblemDetail from "./Live-Problems/ProblemDetail.tsx"
import AiAnalysis from "./AI-Analysis/AiAnalysis.tsx"
import CreateTeam from "./Create-Form-Team/CreateTeam.tsx"
import UniversityPartners from "./University-Partners/UniversityPartners.tsx"
import ResourceCenter from "./Resource-Center/ResourceCenter.tsx"
import AlertsPage from "./Alerts/AlertsPage.tsx"
import SettingsPage from "./Settings/SettingsPage.tsx"
import HelpPage from "./Help/HelpPage.tsx"

function Home() {
  return (
    <main>
      <WelcomeBack />
      <StatsBand />
      <HighDemandCases />
      <CasesByDomain />
      <AreaWiseProblems />
      <ProblemsNearYou />
      <OngoingProjects />
      <Testimonials />
    </main>
  );
}

function GovDashboardApp() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#f2f6fb]">
        <GovTopBar />

        <div className="flex flex-1">
          <Sidebar />

          <div className="min-w-0 flex-1">
            <Navbar />

            <Routes>
              <Route path="/gov" element={<Home />} />
              <Route path="/gov/live-problems" element={<LiveProblems />} />
              <Route path="/gov/live-problems/:problemId" element={<ProblemDetail />} />
              <Route path="/gov/ai-analysis" element={<AiAnalysis />} />
              <Route path="/gov/create-team" element={<CreateTeam />} />
              <Route path="/gov/university-partners" element={<UniversityPartners />} />
              <Route path="/gov/resource-center" element={<ResourceCenter />} />
              <Route path="/gov/alerts" element={<AlertsPage />} />
              <Route path="/gov/settings" element={<SettingsPage />} />
              <Route path="/gov/help" element={<HelpPage />} />
              <Route path="/gov/*" element={<Navigate to="/gov" replace />} />
            </Routes>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default GovDashboardApp;