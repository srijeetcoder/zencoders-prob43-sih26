import ProfileHero from "./ProfileHero";
import DashboardStats from "./DashboardStats";
import SubmissionBySector from "./SubmissionBySector";
import ProjectProgress from "./Projectprogress";
import RecentSubmissions from "./Recentsubmission";
import Activeprojects from "./Activeprojects";
import Quickaction from "./Quickaction";
import Sustainablesolution from "./Sustainablesolution";

function DashBoard() {
  return (
    <div className="w-full">
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
    </div>
  );
}

export default DashBoard;
