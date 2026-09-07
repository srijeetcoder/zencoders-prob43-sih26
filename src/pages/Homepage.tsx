import Sidebar from "../components/homepage/Sidebar.tsx"
import Navbar from "../components/homepage/Navbar.tsx"
import Hero from "../components/homepage/Hero.tsx"
import ProblemsNearYou from "../components/homepage/ProblemsNearYou.tsx"
import OngoingProjects from "../components/homepage/OngoingProjects.tsx"

function Homepage() {
  return (
    <div className="flex min-h-screen bg-[#f5f9fc]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <Hero />
        <ProblemsNearYou />
        <OngoingProjects />
      </div>
    </div>
  );
}

export default Homepage
