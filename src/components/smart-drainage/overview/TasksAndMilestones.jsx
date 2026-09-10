import { CheckSquare, ArrowRight } from "lucide-react";
import { tasks } from "../../../data/smartDrainageData";

export default function TasksAndMilestones() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-gray-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Tasks & Milestones</h3>
        </div>
        <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium flex items-center gap-1">
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-0">
        {tasks.map((task, i) => (
          <div
            key={task.id}
            className={`flex items-center justify-between py-2.5 ${
              i < tasks.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center ${
                  task.done
                    ? "bg-[#1a5c5a]"
                    : "border-2 border-gray-300"
                }`}
              >
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[12px] ${task.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                {task.text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">◆ {task.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
