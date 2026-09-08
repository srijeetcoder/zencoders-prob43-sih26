import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import SuccessHero from "./components/SuccessHero";
import TabNav from "./components/TabNav";
import StatsRow from "./components/StatsRow";
import FeaturedStory from "./components/FeaturedStory";
import ImpactMap from "./components/ImpactMap";
import ImpactBySector from "./components/ImpactBySector";
import KeyHighlights from "./components/KeyHighlights";
import RecentStories from "./components/RecentStories";

export default function App() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#f8fafc] font-[Geist_Variable,sans-serif]">
      <Sidebar />
      <div className="ml-[240px]">
        <Header />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="p-6 space-y-5">
          <SuccessHero />

          {activeTab === "Overview" && (
            <>
              <StatsRow />
              <FeaturedStory />
              <div className="grid grid-cols-3 gap-5">
                <ImpactMap />
                <ImpactBySector />
                <KeyHighlights />
              </div>
              <RecentStories />
            </>
          )}

          {activeTab === "Stories by Sector" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Stories by Sector view coming soon...</p>
            </div>
          )}

          {activeTab === "Impact Metrics" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Impact Metrics view coming soon...</p>
            </div>
          )}

          {activeTab === "Featured Partners" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-[14px]">Featured Partners view coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
