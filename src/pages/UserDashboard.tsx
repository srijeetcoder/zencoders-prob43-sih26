import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, LogIn, FilePlus2, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserProfileCard from "../components/user-dashboard/UserProfileCard";
import UserProblems from "../components/user-dashboard/UserProblems";
import UserSettings from "../components/user-dashboard/UserSettings";

interface ProblemItem {
  id: string;
  title: string;
  submittedAt: string;
  status: "Pending" | "In Review" | "Resolved" | "Rejected";
}

function UserDashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(false);

  // For unlogged in citizens: Show clean Register, Login, or Report a Problem window
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white/95 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-md md:p-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-inner">
            <UserCheck className="h-10 w-10 text-emerald-600" />
          </div>

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-800">
            <ShieldCheck size={14} />
            Citizen Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#10245e] md:text-3xl">
            Citizen Dashboard Access
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Register or log in to manage your public problem submissions, view real-time department updates, or report an everyday community issue directly.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Register */}
            <Link
              to="/register?role=citizen"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#148554] p-5 text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:-translate-y-1 hover:bg-[#107046] hover:shadow-lg hover:shadow-emerald-900/20"
            >
              <div className="rounded-xl bg-white/10 p-2.5 transition-transform duration-200 group-hover:scale-110">
                <UserPlus className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold">Register</span>
              <span className="text-[11px] text-emerald-100 font-normal">
                New Citizen Node
              </span>
            </Link>

            {/* Login */}
            <Link
              to="/login?role=citizen"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 text-slate-800 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-md"
            >
              <div className="rounded-xl bg-slate-200/60 p-2.5 transition-transform duration-200 group-hover:scale-110">
                <LogIn className="h-6 w-6 text-slate-700" />
              </div>
              <span className="text-sm font-bold">Login</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Existing Account
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch live citizen submissions
  useEffect(() => {
    let isMounted = true;
    const fetchUserGrievances = async () => {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_BASE_URL || "/api/v1";
      const items: ProblemItem[] = [];

      // 1. Check local session submissions first
      try {
        const localSaved = localStorage.getItem("pookar_user_submissions");
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) {
            parsed.forEach((p: any) => {
              items.push({
                id: p.ticketId || p.id || `JS-${Date.now()}`,
                title: p.title || p.rawDescription || p.text || "Citizen Bottleneck Submission",
                submittedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently",
                status: (p.status === "RESOLVED" ? "Resolved" : p.status === "IN_REVIEW" || p.status === "LAB_MATCHED" ? "In Review" : "Pending") as any,
              });
            });
          }
        }
      } catch {}

      // 2. Query backend for user's grievances if token exists
      if (token) {
        try {
          const res = await fetch(`${apiBase}/citizen/grievances`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const list = data.data?.items || data.data || [];
            if (Array.isArray(list) && list.length > 0) {
              list.forEach((g: any) => {
                const mapStatus = (st: string) => {
                  if (st === "RESOLVED") return "Resolved";
                  if (st === "REJECTED") return "Rejected";
                  if (st === "TRIAGED" || st === "LAB_MATCHING" || st === "IN_PROGRESS") return "In Review";
                  return "Pending";
                };
                items.unshift({
                  id: g.ticket_id || g.id,
                  title: g.normalized_text || g.raw_text || `Grievance #${g.ticket_id}`,
                  submittedAt: g.created_at ? new Date(g.created_at).toLocaleDateString() : "Today",
                  status: mapStatus(g.status),
                });
              });
            }
          }
        } catch (err) {
          console.warn("[UserDashboard] Live grievance fetch notice:", err);
        }
      }

      if (isMounted) {
        // Deduplicate by ID
        const unique = items.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
        setProblems(unique);
        setLoading(false);
      }
    };

    fetchUserGrievances();
    return () => {
      isMounted = false;
    };
  }, [token, user]);

  // Logged-in citizen view
  const isCitizen = !user?.role || user.role.toUpperCase() === "CITIZEN";

  const profileData = {
    name: user?.name || "Citizen Contributor",
    role: isCitizen ? "Citizen" : (user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase()),
    id: user?.id ? (user.id.startsWith("usr-") || user.id.startsWith("USR-") ? user.id.toUpperCase() : `USR-${user.id.slice(-6).toUpperCase()}`) : "USR-CITIZEN-01",
    location: user?.district ? `${user.district}, India` : "Jharkhand, India",
    organization: user?.department || "Resident Contributor",
    email: user?.email || "citizen@pookar.gov.in",
    phone: user?.verifiedPhone || user?.phone || "Verified Mobile",
    avatarUrl: (user as any)?.avatarUrl,
  };

  return (
    <div className="space-y-4 p-4">
      <UserProfileCard {...profileData} />
      <UserProblems problems={problems} />
      <UserSettings
        email={profileData.email}
        phone={profileData.phone}
        name={user?.name || profileData.name}
        district={user?.district || "Ranchi"}
      />
    </div>
  );
}

export default UserDashboard;

