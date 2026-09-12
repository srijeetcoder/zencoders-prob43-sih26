import { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  MapPin,
  Building2,
  Coins,
  Users,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sparkles,
  Radio,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStoredProblems, saveProblems, INITIAL_LIVE_PROBLEMS } from "../../data/mockData";
import type { LiveProblem } from "../../types";
import { useAuth, type AcademicRole } from "../../../../context/AuthContext";
import { citizenApi, institutionApi } from "../../../../services/api";
import { fetchAllRealSubmissions } from "../../../../services/realSubmissions";
import { realtimeService } from "../../../../services/realtimeService";

export default function LiveProblemsPage() {
  const { user } = useAuth();
  const academicRole: AcademicRole = user?.academicRole || "STUDENT";

  const [problems, setProblems] = useState<LiveProblem[]>(() => {
    const stored = getStoredProblems();
    return stored.length > 0 ? stored : INITIAL_LIVE_PROBLEMS;
  });
  const [activeTab, setActiveTab] = useState<"ALL" | "ACCEPTED">("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);
  const [liveStreamToast, setLiveStreamToast] = useState<string | null>(null);

  const loadAllProblems = async () => {
    try {
      // 1. Fetch real citizen ground submissions + backend open problems
      const realSubs = await fetchAllRealSubmissions();
      const currentStored = getStoredProblems();
      const baseList = currentStored.length > 0 ? currentStored : INITIAL_LIVE_PROBLEMS;

      if (realSubs && realSubs.length > 0) {
        const mappedFromReal: LiveProblem[] = realSubs.map((item) => {
          const matched = baseList.find(
            (s) => s.id === item.id || s.ticketId === item.referenceId?.replace("#", "") || s.ticketId === item.ticketId
          );
          let domainCategory: LiveProblem["domain"] = "Infrastructure";
          const dText = `${item.title} ${item.description || ""} ${item.category || ""}`.toLowerCase();
          if (dText.includes("water") || dText.includes("fluoride") || dText.includes("drainage")) domainCategory = "Water & Sanitation";
          else if (dText.includes("solar") || dText.includes("pv") || dText.includes("energy")) domainCategory = "Renewable Energy";
          else if (dText.includes("fire") || dText.includes("mine") || dText.includes("mining")) domainCategory = "Mining & Geology";
          else if (dText.includes("farm") || dText.includes("crop") || dText.includes("agro")) domainCategory = "Agriculture";

          return {
            id: item.id,
            ticketId: item.referenceId?.replace("#", "") || item.ticketId || item.id,
            title: item.title,
            description: item.description || "Citizen reported bottleneck requiring university R&D prototype intervention.",
            domain: domainCategory,
            urgency: item.severity === "High" ? "CRITICAL" : "HIGH",
            district: item.location?.city || item.location?.area || "Ranchi",
            department: "District Innovation & Redressal Authority",
            affectedPopulation: "30,000+ Local Residents",
            estimatedBudget: "₹ 1.80 Lakhs (DMF Sanctioned)",
            deadline: "21 Days",
            status: matched?.status || "OPEN",
            acceptedByTeam: matched?.acceptedByTeam,
            acceptedByStudent: matched?.acceptedByStudent,
          };
        });

        // Merge without duplicates
        const mergedMap = new Map<string, LiveProblem>();
        mappedFromReal.forEach((p) => mergedMap.set(p.ticketId || p.id, p));
        baseList.forEach((p) => {
          if (!mergedMap.has(p.ticketId || p.id)) {
            mergedMap.set(p.ticketId || p.id, p);
          }
        });

        const mergedArray = Array.from(mergedMap.values());
        setProblems(mergedArray);
        saveProblems(mergedArray);
      } else {
        setProblems(baseList);
      }
    } catch {
      const stored = getStoredProblems();
      setProblems(stored.length > 0 ? stored : INITIAL_LIVE_PROBLEMS);
    }
  };

  useEffect(() => {
    loadAllProblems();

    // Real-time SSE listeners
    const unsubNew = realtimeService.onProblemSubmitted((event) => {
      setLiveStreamToast(`New Citizen Problem Streamed: "${event.title || 'Civic Issue'}" (#${event.ticketId || 'New'})`);
      setTimeout(() => setLiveStreamToast(null), 6000);
      loadAllProblems();
    });

    const unsubAssigned = realtimeService.onUniversityAssigned((event) => {
      setLiveStreamToast(`Direct Directive from War Room: Assigned to ${event.universityName || 'University Lab'}!`);
      setTimeout(() => setLiveStreamToast(null), 6000);
      loadAllProblems();
    });

    const unsubStatus = realtimeService.onStatusUpdated(() => {
      loadAllProblems();
    });

    return () => {
      unsubNew();
      unsubAssigned();
      unsubStatus();
    };
  }, []);

  const handleAcceptProblem = async (problemId: string, title: string) => {
    const teamName = user?.name ? `Team ${user.name}` : "Student Innovation Team";
    const studentName = user?.name || "Student Innovator";

    // 1. Sync to backend API if problemId is valid UUID or ticket
    try {
      await institutionApi.acceptProblem(problemId, {
        teamName,
        proposal: "Interdisciplinary student prototype planned under DMF Grant",
      });
    } catch (err) {
      console.warn("Backend accept problem notice (local broadcast active):", err);
    }

    // 2. Broadcast real-time SSE event to Government and Citizen
    realtimeService.broadcastLocalEvent("university_accepted", {
      problemId,
      ticketId: problemId,
      universityName: teamName,
      acceptedAt: new Date().toISOString(),
      title,
    });

    // 3. Update local state and storage
    const updated = problems.map((p) => {
      if (p.id === problemId || p.ticketId === problemId) {
        return {
          ...p,
          status: "ACCEPTED" as const,
          acceptedByTeam: teamName,
          acceptedByStudent: studentName,
        };
      }
      return p;
    });

    setProblems(updated);
    saveProblems(updated);
    setAcceptedToast(`Problem "${title}" accepted! Proceed to Form a Team or Submit Plan.`);
    setTimeout(() => setAcceptedToast(null), 4000);
  };

  const filteredProblems = problems.filter((p) => {
    if (activeTab === "ACCEPTED" && p.status !== "ACCEPTED") return false;
    if (selectedDomain !== "ALL") {
      const pDomain = (p.domain || "").toLowerCase();
      const sDomain = selectedDomain.toLowerCase();
      if (!pDomain.includes(sDomain) && !sDomain.includes(pDomain)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (p.title || "").toLowerCase().includes(q) ||
        (p.ticketId || "").toLowerCase().includes(q) ||
        (p.district || "").toLowerCase().includes(q) ||
        (p.department || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const acceptedCount = problems.filter((p) => p.status === "ACCEPTED").length;
  const openCount = problems.filter((p) => p.status === "OPEN").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {acceptedToast && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{acceptedToast}</span>
          </div>
          <Link
            to="/university-dashboard/form-team"
            className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
          >
            Go to Form Team &rarr;
          </Link>
        </div>
      )}

      {/* Real-time Stream Banner */}
      {liveStreamToast && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-indigo-600 animate-pulse shrink-0" />
            <span>{liveStreamToast}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-200/70 text-indigo-800 px-2 py-0.5 rounded-md">
            Live SSE Stream
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Activity size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
              Live Civic Problem Ledger
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-world civic bottlenecks indexed by district authorities for academic research and prototype intervention.
          </p>
        </div>

        {academicRole === "STUDENT" && (
          <Link
            to="/university-dashboard/form-team"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#047d48] text-white text-xs font-bold hover:bg-[#03663a] transition-all shadow-sm"
          >
            <Users size={14} />
            <span>Form Team for Accepted Problem</span>
          </Link>
        )}
      </div>

      {/* Sub-division Tabs: All Live Problems vs Accepted Problems */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ALL"
                ? "border-indigo-600 text-indigo-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>All Live Problems</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {problems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ACCEPTED")}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ACCEPTED"
                ? "border-indigo-600 text-indigo-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Accepted Problems (Active Solutions)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {acceptedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, ticket ID, or district..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter size={12} /> Domain:
          </span>
          {["ALL", "Water & Sanitation", "Renewable Energy", "Mining & Geology", "Infrastructure", "Agriculture"].map(
            (domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDomain === domain
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {domain}
              </button>
            )
          )}
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProblems.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-white border border-slate-200 p-8">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Problems Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {activeTab === "ACCEPTED"
                ? "No problems accepted under this filter. Browse All Live Problems and click 'Accept Problem' to begin."
                : "No civic problems match your search criteria."}
            </p>
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const isAccepted = prob.status === "ACCEPTED";

            return (
              <div
                key={prob.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all hover:shadow-md ${
                  isAccepted
                    ? "border-emerald-200 bg-emerald-50/10"
                    : "border-slate-200/90 hover:border-indigo-200"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {prob.ticketId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          prob.urgency === "CRITICAL"
                            ? "bg-rose-100 text-rose-800"
                            : prob.urgency === "HIGH"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {prob.urgency}
                      </span>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {prob.domain}
                      </span>
                    </div>

                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
                        <CheckCircle2 size={11} />
                        ACCEPTED
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 shrink-0">
                        OPEN
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-bold text-[#10245e] leading-snug">
                    {prob.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {prob.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{prob.district}, Jharkhand</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate font-semibold text-slate-700">{prob.estimatedBudget}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Building2 size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{prob.department}</span>
                    </div>
                  </div>

                  {isAccepted && prob.acceptedByTeam && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-[11px] text-emerald-950">
                      <span className="font-semibold">Assigned Team: </span>
                      <span className="font-bold text-emerald-900">{prob.acceptedByTeam}</span>
                      {prob.acceptedByStudent && (
                        <span className="text-emerald-700"> (Lead: {prob.acceptedByStudent})</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock size={12} />
                    <span>Deadline: {prob.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <Link
                        to="/university-dashboard/form-team"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 text-xs font-bold transition-colors"
                      >
                        <span>Team & Plan Workspace</span>
                        <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAcceptProblem(prob.id, prob.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#047d48] hover:bg-[#03663a] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <CheckCircle2 size={13} />
                        <span>Accept Problem</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
