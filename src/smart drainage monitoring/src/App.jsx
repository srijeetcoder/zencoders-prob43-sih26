import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ProjectHeader from "./components/project/ProjectHeader";
import ProjectHealthCard from "./components/project/ProjectHealthCard";
import ProjectTabs from "./components/project/ProjectTabs";
import ProjectTimeline from "./components/overview/ProjectTimeline";
import KeyDetails from "./components/overview/KeyDetails";
import TeamPanel from "./components/overview/TeamPanel";
import RecentActivities from "./components/overview/RecentActivities";
import TasksAndMilestones from "./components/overview/TasksAndMilestones";
import DocumentsPanel from "./components/overview/DocumentsPanel";
import AIAssistant from "./components/overview/AIAssistant";
import RisksAndIssues from "./components/overview/RisksAndIssues";

export default function App() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#f8fafc] font-[Geist_Variable,sans-serif]">
      <Sidebar />
      <div className="ml-[240px]">
        <Header />
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="p-6 space-y-5">
          <ProjectHeader />
          <ProjectHealthCard />

          {activeTab === "Overview" && (
            <>
              <div className="grid grid-cols-3 gap-5">
                <ProjectTimeline />
                <KeyDetails />
                <TeamPanel />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <RecentActivities />
                <TasksAndMilestones />
                <DocumentsPanel />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2">
                  <AIAssistant />
                </div>
                <RisksAndIssues />
              </div>
            </>
          )}

          {activeTab === "Tasks" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Tasks view coming soon...</p>
            </div>
          )}

          {activeTab === "Team" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Team view coming soon...</p>
            </div>
          )}

          {activeTab === "Documents" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Documents view coming soon...</p>
            </div>
          )}

          {activeTab === "Discussions" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Discussions view coming soon...</p>
            </div>
          )}

          {activeTab === "Progress & Analytics" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Progress & Analytics view coming soon...</p>
            </div>
          )}

          {activeTab === "Field Updates" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Field Updates view coming soon...</p>
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Reports view coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
