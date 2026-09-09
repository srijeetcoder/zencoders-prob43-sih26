import { useState } from "react";
import SuccessHero from "../components/successstories/SuccessHero.tsx";
import StatsRow from "../components/successstories/StatsRow.tsx";
import FeaturedStory from "../components/successstories/FeaturedStory.tsx";
import ImpactBySector from "../components/successstories/ImpactBySector.tsx";
import ImpactMap from "../components/successstories/ImpactMap.tsx";
import RecentStories from "../components/successstories/RecentStories.tsx";

export default function SuccessStories() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        <SuccessHero />

        <StatsRow />

        <FeaturedStory />

        <div className="grid grid-cols-2 gap-6">
          <ImpactBySector />
          <ImpactMap />
        </div>

        <RecentStories />
      </div>
    </div>
  );
}
