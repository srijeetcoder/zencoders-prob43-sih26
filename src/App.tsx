import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import Prototype from "./pages/Prototype";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPW";
import ExploreProblemsPage from "./pages/ExploreProblemsPage";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import SolutionMatchingPage from "./pages/SolutionMatchingPage";
import SmartDrainagePage from "./pages/SmartDrainagePage";
import PublicSuccessStoriesPage from "./pages/PublicSuccessStoriesPage";
import GovDashboardPage from "./pages/GovDashboardPage";
import UniversityDashboardPage from "./pages/UniversityDashboardPage";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore-problems" element={<ExploreProblemsPage />} />
          <Route path="/problemlist" element={<ExploreProblemsPage />} />
          <Route path="/successstories" element={<PublicSuccessStoriesPage />} />
          <Route path="/stories" element={<PublicSuccessStoriesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/get-started" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/prototype" element={<Prototype />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/gov-dashboard" element={<Navigate to="/gov" replace />} />
          <Route
            path="/gov/*"
            element={
              <AuthGuard allowedRoles={["GOVERNMENT", "ADMIN"]} portalName="Government Portal & Command Console">
                <GovDashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/university-dashboard"
            element={
              <AuthGuard allowedRoles={["INSTITUTION", "ADMIN"]} portalName="University & R&D Lab Portal">
                <UniversityDashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/analysis"
            element={<Navigate to="/gov/ai-analysis" replace />}
          />
          <Route
            path="/solution-matching"
            element={<Navigate to="/gov/solution-matching" replace />}
          />
          <Route
            path="/smart-drainage"
            element={
              <AuthGuard allowedRoles={["GOVERNMENT", "ADMIN"]} portalName="Government Smart Drainage Control">
                <SmartDrainagePage />
              </AuthGuard>
            }
          />
          <Route path="/*" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

