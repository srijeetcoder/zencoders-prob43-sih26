import { useState } from "react";
import Sidebar from "../components/ai-analysis/layout/Sidebar";
import Header from "../components/ai-analysis/layout/Header";
import TabNav from "../components/ai-analysis/analysis/TabNav";
import ProblemSummary from "../components/ai-analysis/analysis/ProblemSummary";
import KeyInsights from "../components/ai-analysis/analysis/KeyInsights";
import DataAnalysis from "../components/ai-analysis/analysis/DataAnalysis";
import LocationAnalysis from "../components/ai-analysis/analysis/LocationAnalysis";
import RootCauseAnalysis from "../components/ai-analysis/analysis/RootCauseAnalysis";
import ImpactAssessment from "../components/ai-analysis/analysis/ImpactAssessment";

export default function AIAnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50">
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
