import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, type AcademicRole } from "../../context/AuthContext";

// Layout components
import UniversitySidebar from "./components/layout/UniversitySidebar";
import UniversityTopBar from "./components/layout/UniversityTopBar";
import UniversityNavbar from "./components/layout/UniversityNavbar";

// Shared pages
import LiveProblemsPage from "./pages/shared/LiveProblemsPage";
import ResourceCenter from "./pages/shared/ResourceCenter";
import AlertsPage from "./pages/shared/AlertsPage";
import SettingsPage from "./pages/shared/SettingsPage";
import HelpSupportPage from "./pages/shared/HelpSupportPage";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import FormTeamPage from "./pages/student/FormTeamPage";

// Faculty pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyAiAnalysis from "./pages/faculty/FacultyAiAnalysis";
import FacultyEvaluationPage from "./pages/faculty/FacultyEvaluationPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAiAnalysis from "./pages/admin/AdminAiAnalysis";
import AdminEvaluationPage from "./pages/admin/AdminEvaluationPage";
import AdminCenterPage from "./pages/admin/AdminCenterPage";

export default function UniversityDashboardApp() {
  const { user } = useAuth();
  const academicRole: AcademicRole = user?.academicRole || "STUDENT";

  // Dynamic dashboard home based on active persona
  const renderDashboardHome = () => {
    if (academicRole === "STUDENT") return <StudentDashboard />;
    if (academicRole === "FACULTY") return <FacultyDashboard />;
    return <AdminDashboard />;
  };

  // Dynamic evaluation workspace based on role
  const renderEvaluationWorkspace = () => {
    if (academicRole === "FACULTY") return <FacultyEvaluationPage />;
    if (academicRole === "ADMIN") return <AdminEvaluationPage />;
    return <Navigate to="/university-dashboard/form-team" replace />;
  };

  // Dynamic AI Analysis workspace
  const renderAiAnalysis = () => {
    if (academicRole === "ADMIN") return <AdminAiAnalysis />;
    return <FacultyAiAnalysis />;
  };

  return (
    <div className="flex min-h-screen bg-[#f5f9fc]">
      {/* Role-tailored collapsible sidebar */}
      <UniversitySidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <UniversityTopBar />
        <UniversityNavbar />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={renderDashboardHome()} />
            <Route path="/" element={renderDashboardHome()} />
            
            {/* Live Problems with sub-division for Accepted Problems */}
            <Route path="live-problems" element={<LiveProblemsPage />} />

            {/* Student Specific: Form a Team (Application + Plan/Solution) */}
            <Route path="form-team" element={<FormTeamPage />} />

            {/* Faculty & Admin: AI Analysis */}
            <Route path="ai-analysis" element={renderAiAnalysis()} />

            {/* Faculty & Admin: Evaluation Workspace */}
            <Route path="evaluation" element={renderEvaluationWorkspace()} />

            {/* Admin Specific: Admin Center */}
            <Route path="admin-center" element={<AdminCenterPage />} />

            {/* Same for all 3: Resource Center */}
            <Route path="resource-center" element={<ResourceCenter />} />

            {/* Same for all 3: Alerts */}
            <Route path="alerts" element={<AlertsPage />} />

            {/* Settings & Help */}
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpSupportPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
