import { Routes, Route, Navigate } from "react-router-dom"

// Main page components
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
import TrackProgress from "../pages/TrackProgress.tsx"
import SubmissionDetail from "../components/track-success/SubmissionPages.tsx"

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

function Homepage() {
  return (
    <div className="flex min-h-screen bg-[#f5f9fc]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainContent />} />
          <Route path="/userdashboard" element={<UserDasboard />} />
          <Route path="/user-dashboard" element={<UserDasboard />} />
          <Route path="/problem" element={<Problems />} />
          <Route path="/explore-solutions/:problemId" element={<ProblemDetails />} />
          <Route path="/partners" element={<University />} />
          <Route path="/successstories" element={<SuccessStory />} />
          <Route path="/trackprogress" element={<TrackProgress />} />
          <Route path="/track-progress" element={<TrackProgress />} />
          <Route path="/trackprogress/:id" element={<SubmissionDetail />} />
          <Route path="/track-progress/:id" element={<SubmissionDetail />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default Homepage;
