import { Activity, ArrowRight } from "lucide-react";
import { projectHealth } from "../../../data/smartDrainageData";

export default function ProjectHealthCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#e6f2f1] rounded-xl flex items-center justify-center">
            <Activity size={22} className="text-[#1a5c5a]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">Project Health</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#2d8a7a] rounded-full" />
              <span className="text-[13px] font-semibold text-[#1a5c5a]">{projectHealth.status}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{projectHealth.message}</p>
          </div>
        </div>
        <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] flex items-center gap-1 font-medium">
          View Details <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-[22px] font-bold text-gray-900">{projectHealth.overallProgress}%</p>
          <p className="text-[11px] text-gray-500 mb-2">Overall Progress</p>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1a5c5a] rounded-full"
              style={{ width: `${projectHealth.overallProgress}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-[22px] font-bold text-gray-900">
            {projectHealth.milestonesCompleted} / {projectHealth.totalMilestones}
          </p>
          <p className="text-[11px] text-gray-500 mb-2">Milestones Completed</p>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2d8a7a] rounded-full"
              style={{
                width: `${(projectHealth.milestonesCompleted / projectHealth.totalMilestones) * 100}%`,
              }}
            />
          </div>
        </div>

        <div>
          <p className="text-[22px] font-bold text-gray-900">{projectHealth.expectedCompletion}</p>
          <p className="text-[11px] text-gray-500">Expected Completion</p>
        </div>
      </div>
    </div>
  );
}
