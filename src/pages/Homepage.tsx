import { Routes, Route } from "react-router-dom"

// Main page
import Sidebar from "../components/homepage/Sidebar.tsx"
import Navbar from "../components/homepage/Navbar.tsx"
import Hero from "../components/homepage/Hero.tsx"
import ProblemsNearYou from "../components/homepage/ProblemsNearYou.tsx"
import OngoingProjects from "../components/homepage/OngoingProjects.tsx"

// User dashboard
import UserDasboard from "../pages/UserDashboard.tsx"

// Problems
import ProblemsList from "../components/problems/ProblemsList.tsx" 
import ProblemDetails from "../components/problems/ProblemDetails.tsx"
import ProblemSubmission from "../pages/ProblemSubmission.tsx"

// University and Partners
import University from "../pages/University.tsx"

import SuccessStory from "../pages/SuccessStories.tsx"

function MainContent() {
  return (
    <>
      <Hero />
      <ProblemsNearYou />
      <OngoingProjects />
    </>
  );
}

function Problems() {
  return (
    <>
      <ProblemSubmission />
    </>
  );
}

function Partner() {
  return (
    <>
      <University />
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
          <Route path="/userdashboard" element={<UserDasboard />} />
          <Route path="/problem" element={<Problems />} />
          <Route path="/partners" element={<Partner />} />
          <Route path="/successstories" element={<SuccessStory />} />
        </Routes>
      </div>
    </div>
  );
}

export default Homepage;
