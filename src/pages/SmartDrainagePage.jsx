import { useState } from "react";
import Sidebar from "../components/smart-drainage/layout/Sidebar";
import Header from "../components/smart-drainage/layout/Header";
import ProjectHeader from "../components/smart-drainage/project/ProjectHeader";
import ProjectHealthCard from "../components/smart-drainage/project/ProjectHealthCard";
import ProjectTabs from "../components/smart-drainage/project/ProjectTabs";
import ProjectTimeline from "../components/smart-drainage/overview/ProjectTimeline";
import KeyDetails from "../components/smart-drainage/overview/KeyDetails";
import TeamPanel from "../components/smart-drainage/overview/TeamPanel";
import RecentActivities from "../components/smart-drainage/overview/RecentActivities";
import TasksAndMilestones from "../components/smart-drainage/overview/TasksAndMilestones";
import DocumentsPanel from "../components/smart-drainage/overview/DocumentsPanel";
import AIAssistant from "../components/smart-drainage/overview/AIAssistant";
import RisksAndIssues from "../components/smart-drainage/overview/RisksAndIssues";

export default function SmartDrainagePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="ml-[240px]">
        <Header />
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="p-6 space-y-5">
          <ProjectHeader />
          <ProjectHealthCard />

          {activeTab === "Overview" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <ProjectTimeline />
                <KeyDetails />
                <TeamPanel />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <RecentActivities />
                <TasksAndMilestones />
                <DocumentsPanel />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <AIAssistant />
                </div>
                <RisksAndIssues />
              </div>
            </>
          )}

          {activeTab !== "Overview" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">{activeTab} view coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
