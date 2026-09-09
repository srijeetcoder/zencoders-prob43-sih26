import ProfileHero from "../components/user-dashboard/ProfileHero.tsx"
import DashboardStats from "../components/user-dashboard/DashboardStats.tsx"
import SubmissionBySector from "../components/user-dashboard/SubmissionBySector.tsx" 
import ProjectProgress from "../components/user-dashboard/Projectprogress.tsx"
import RecentSubmissions from "../components/user-dashboard/Recentsubmission.tsx"
import Activeprojects from "../components/user-dashboard/Activeprojects.tsx"
import Quickaction from "../components/user-dashboard/Quickaction.tsx"
import Sustainablesolution from "../components/user-dashboard/Sustainablesolution.tsx"

function DashBoard() {
  return (
    <>
      <ProfileHero />
      <DashboardStats />
      
      <div className="grid grid-cols-1 gap-3 px-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <SubmissionBySector />
        </div>
        <div className="xl:col-span-1">
          <ProjectProgress />
        </div>
        <div className="xl:col-span-1">
          <RecentSubmissions />
        </div>
      </div>
      <div className="flex flex-col">
        <Activeprojects />
        <Quickaction />
        <Sustainablesolution />
      </div>
    </>
  );
}

