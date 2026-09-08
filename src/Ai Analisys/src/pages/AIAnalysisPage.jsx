import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TabNav from "../components/analysis/TabNav";
import ProblemSummary from "../components/analysis/ProblemSummary";
import KeyInsights from "../components/analysis/KeyInsights";
import DataAnalysis from "../components/analysis/DataAnalysis";
import LocationAnalysis from "../components/analysis/LocationAnalysis";
import RootCauseAnalysis from "../components/analysis/RootCauseAnalysis";
import ImpactAssessment from "../components/analysis/ImpactAssessment";

export default function AIAnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />

      <div className="ml-60">
        <Header />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <ProblemSummary />
              <DataAnalysis />
              <RootCauseAnalysis />
            </div>

            <div className="space-y-6">
              <KeyInsights />
              <LocationAnalysis />
              <ImpactAssessment />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
