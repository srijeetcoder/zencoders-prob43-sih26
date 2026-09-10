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
    <div className="flex min-h-screen bg-[#f5f9fc]">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <GovTopBar />
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="live-problems" element={<LiveProblems />} />
            <Route path="live-problems/:problemId" element={<ProblemDetail />} />
            <Route path="ai-analysis" element={<AiAnalysis />} />
            <Route path="create-team" element={<CreateTeam />} />
            <Route path="university-partners" element={<UniversityPartners />} />
            <Route path="resource-center" element={<ResourceCenter />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default GovDashboardApp;