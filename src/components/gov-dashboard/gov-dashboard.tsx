import ProfileHero from "./ProfileHero.tsx"
import DashboardStats from "../components/user-dashboard/DashboardStats.tsx"
import SubmissionBySector from ".SubmissionBySector.tsx" 
import ProjectProgress from ".Projectprogress.tsx"
import RecentSubmissions from ".Recentsubmission.tsx"
import Activeprojects from ".Activeprojects.tsx"
import Quickaction from ".Quickaction.tsx"
import Sustainablesolution from ".Sustainablesolution.tsx"

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

