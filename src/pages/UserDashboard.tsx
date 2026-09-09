import UserProfileCard from "../components/user-dashboard/UserProfileCard";
import UserProblems from "../components/user-dashboard/UserProblems";
import UserSettings from "../components/user-dashboard/UserSettings";

const user = {
  name: "Priya Sharma",
  role: "Citizen",
  id: "USR-2025-0042",
  location: "Kolkata, West Bengal",
  organization: "Local Resident",
  email: "priya@example.com",
  phone: "+91 98765 43210"
};

const myProblems = [
  { id: "1", title: "Waterlogging in Ward 12", submittedAt: "2025-03-18", status: "In Review" as const },
  { id: "2", title: "Streetlight out on MG Road", submittedAt: "2025-03-15", status: "Resolved" as const },
  { id: "3", title: "Missing dustbins in park", submittedAt: "2025-03-10", status: "Pending" as const },
];

function UserDashboard() {
  return (
    <div className="space-y-4 p-4">
      <UserProfileCard {...user} />
      <UserProblems problems={myProblems} onViewAll={() => alert("View all")} />
      <UserSettings
        initialEmail="priya@example.com"
        initialPhone="+91 98765 43210"
        initialDarkMode={false}
        onSave={(data) => console.log("Settings saved:", data)}
      />
    </div>
  );
}

export default UserDashboard;
