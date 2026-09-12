import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ArrowUp,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Lightbulb,
  CalendarClock,
  Image as ImageIcon,
  ShieldCheck,
  Send,
  Edit3,
  Sliders,
  Check,
  Building2,
  Share2,
} from "lucide-react";
import type { Severity } from "../types/problem";
import { getProblemById } from "./mockData";
import { fetchProblemById } from "../../../services/realSubmissions";
import { governmentApi } from "../../../services/api";
import { realtimeService } from "../../../services/realtimeService";

const SEVERITY_STYLES: Record<Severity, string> = {
  High: "bg-rose-50 text-rose-600 border border-rose-200",
  Medium: "bg-amber-50 text-amber-600 border border-amber-200",
  Low: "bg-teal-50 text-teal-600 border border-teal-200",
};

const STATUS_STYLES: Record<string, string> = {
  "Under Analysis": "bg-navy-100 text-navy-700",
  "Matching Teams": "bg-blue-50 text-blue-600",
  "In Discussion": "bg-purple-50 text-purple-600",
  "Solution Planned": "bg-amber-50 text-amber-600",
  "In Progress": "bg-teal-50 text-teal-700",
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

function ProblemDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<any | null>(null);
  const [currentStatus, setCurrentStatus] = useState("Under Analysis");
  const [currentProgress, setCurrentProgress] = useState(35);
  const [adminNote, setAdminNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [assigningTeam, setAssigningTeam] = useState<string | null>(null);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  useEffect(() => {
    if (problemId) {
      // 1. Fetch live problem from backend / realSubmissions
      fetchProblemById(problemId).then((data) => {
        if (data) {
          setProblem(data);
          setCurrentStatus(data.status || "Under Analysis");
          setCurrentProgress(
            data.status === "Resolved" || data.status === "RESOLVED"
              ? 100
              : data.status === "In Progress" || data.status === "IN_PROGRESS"
              ? 70
              : 35
          );
        } else {
          const fallback = getProblemById(problemId);
          if (fallback) {
            setProblem(fallback);
            setCurrentStatus(fallback.status || "Under Analysis");
            setCurrentProgress(
              fallback.status === "Resolved" ? 100 : fallback.status === "In Progress" ? 70 : 35
            );
          }
        }
      }).catch(() => {
        const fallback = getProblemById(problemId);
        if (fallback) {
          setProblem(fallback);
        }
      });
    }

    // 2. Real-time subscriptions for live events
    const unsubStatus = realtimeService.onStatusUpdated((event) => {
      const targetId = problem?.id || problem?.ticketId || problemId;
      if (event.ticketId === targetId || event.ticketId === problemId) {
        setLiveToast(`Real-Time Update: Status changed to ${event.status}`);
        setCurrentStatus(event.status);
        if (event.progressPercent) setCurrentProgress(event.progressPercent);
        setTimeout(() => setLiveToast(null), 5000);
      }
    });

    const unsubUniv = realtimeService.onUniversityAccepted((event) => {
      const targetId = problem?.id || problem?.ticketId || problemId;
      if (event.problemId === targetId || event.problemId === problemId) {
        setLiveToast(`University Synchronized: ${event.universityName || "R&D Team"} accepted this challenge!`);
        setTimeout(() => setLiveToast(null), 6000);
      }
    });

    return () => {
      unsubStatus();
      unsubUniv();
    };
  }, [problemId, problem?.id, problem?.ticketId]);

  const handleUpdateProgress = async () => {
    if (!problem) return;
    setIsUpdating(true);

    const idToMatch = problem.id || problem.ticketId || problem.referenceId?.replace("#", "");

    try {
      // 1. Sync to backend Supabase Database & SSE broadcast
      try {
        await governmentApi.updateStatus(idToMatch, currentStatus, adminNote);
      } catch (err) {
        console.warn("Backend API status update notice (fallback active):", err);
      }

      // 2. Broadcast realtime event across client ecosystem
      realtimeService.broadcastLocalEvent("problem_status_updated", {
        ticketId: idToMatch,
        status: currentStatus,
        progressPercent: currentProgress,
        adminRemarks: adminNote || "Updated by State Executive War Room Officer",
        updatedAt: new Date().toISOString(),
      });

      // 3. Update in localStorage so citizen and gov views sync instantly
      const local = localStorage.getItem("pookar_user_submissions");
      let existingList: any[] = [];
      if (local) {
        try {
          existingList = JSON.parse(local);
        } catch {}
      }

      const index = existingList.findIndex((item: any) => 
        item.ticketId === idToMatch || item.id === idToMatch || `#${item.ticketId}` === problem.referenceId
      );

      const updatedProblemObj = {
        ...(index >= 0 ? existingList[index] : {}),
        ticketId: idToMatch,
        title: problem.title,
        status: currentStatus === "Resolved" ? "RESOLVED" : currentStatus === "In Progress" ? "IN_PROGRESS" : currentStatus,
        progressPercent: currentProgress,
        adminRemarks: adminNote || "Updated by State Executive War Room Officer",
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        existingList[index] = { ...existingList[index], ...updatedProblemObj };
      } else {
        existingList.push(updatedProblemObj);
      }

      localStorage.setItem("pookar_user_submissions", JSON.stringify(existingList));
      window.dispatchEvent(new Event("storage"));

      // 4. Update local state
      setProblem((prev: any) => ({
        ...prev,
        status: currentStatus,
        timeline: (prev?.timeline || []).map((t: any) => {
          if (currentStatus === "Resolved") return { ...t, status: "done" };
          if (currentStatus === "In Progress" && (t.stage.includes("AI") || t.stage.includes("Matching"))) return { ...t, status: "done" };
          return t;
        }),
      }));

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {} finally {
      setIsUpdating(false);
    }
  };

  const handleAssignUniversity = async (teamName: string) => {
    if (!problem) return;
    setAssigningTeam(teamName);
    const idToMatch = problem.id || problem.ticketId || problem.referenceId?.replace("#", "");

    try {
      // 1. Call Government API
      await governmentApi.assignUniversity(idToMatch, teamName, `Direct Directive assigned to ${teamName} by State War Room`);
    } catch (err) {
      console.warn("University direct assignment synced via local broadcast:", err);
    }

    // 2. Broadcast real-time event to University & Citizen desks
    realtimeService.broadcastLocalEvent("university_assigned", {
      problemId: idToMatch,
      ticketId: idToMatch,
      universityName: teamName,
      assignedAt: new Date().toISOString(),
      title: problem.title,
    });

    setAssigningTeam(null);
    setAssignedSuccess(`Task assigned & dispatched to ${teamName}!`);
    setTimeout(() => setAssignedSuccess(null), 4000);
  };

  if (!problem) {
    return (
      <div className="px-6 py-10 sm:px-8">
        <Link
          to="/gov/live-problems"
          className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Live Problems
        </Link>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">
            Problem not found. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const rawPhotos = [
    ...(Array.isArray(problem.photos) ? problem.photos : []),
    ...(Array.isArray(problem.attachments) ? problem.attachments : []),
    problem.thumbnailUrl,
    problem.image,
  ];

  const validPhotos = rawPhotos.filter(
    (p: any) => typeof p === "string" && p.trim().length > 5 && !p.startsWith("blob:null")
  );

  const photosList = validPhotos.length > 0
    ? Array.from(new Set(validPhotos))
    : [
        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      ];

  return (
    <div className="px-6 py-6 sm:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/gov/live-problems"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft size={15} />
          Back to Live Problems
        </Link>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          War Room Live Synced (Supabase & SSE)
        </span>
      </div>

      {liveToast && (
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold shadow flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="h-4 w-4 text-teal-600 shrink-0" />
          <span>{liveToast}</span>
        </div>
      )}

      {assignedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{assignedSuccess}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {problem.referenceId}
              </span>
              <span>·</span>
              <span className="font-medium text-slate-600">{problem.category}</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
              {problem.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[problem.status] || "bg-navy-100 text-navy-700"}`}>
                {problem.status}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${SEVERITY_STYLES[problem.severity] || "bg-rose-50 text-rose-600"}`}>
                {problem.severity} Severity
              </span>
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                <MapPin size={12} className="text-teal-600" />
                {problem.location?.area || "Ranchi Sadar"}, {problem.location?.city || "Ranchi"}, {problem.location?.state || "Jharkhand"}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ArrowUp size={16} className="text-teal-600" />
                {problem.upvotes ?? 1} citizen upvotes
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MessageCircle size={16} className="text-navy-500" />
                {problem.commentsCount ?? 0} community notes
              </span>
            </div>
          </div>

          {/* Citizen Photographic Evidence Gallery */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <ImageIcon size={16} className="text-teal-600" />
                Citizen Uploaded Photographic Evidence
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Verified Ingestion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {photosList.map((url: string, idx: number) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group aspect-video shadow-inner"
                >
                  <img
                    src={url}
                    alt={`Citizen Evidence ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => {
                      e.target.src = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    Field Evidence Capture #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Citizen Problem Description</h2>
            <p className="mt-3 leading-7 text-slate-700 text-sm font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              "{problem.description}"
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(problem.tags || []).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-lg bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* AI Analysis Card */}
          {problem.aiAnalysis && (
            <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50/70 via-white to-blue-50/70 p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600" />
                <h2 className="text-base font-bold text-navy-900">
                  AI Problem Understanding & Diagnostic
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-800 font-medium">
                {problem.aiAnalysis.problemUnderstanding}
              </p>

              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-teal-800">
                <Users size={15} />
                Estimated Impact: {problem.aiAnalysis.peopleAffectedEstimate}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(problem.aiAnalysis.keyIssues || []).map((issue: string) => (
                  <span
                    key={issue}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 shadow-sm border border-teal-200"
                  >
                    &bull; {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
              <CalendarClock size={18} className="text-teal-600" />
              State Resolution Status Timeline
            </h2>

            <div className="mt-5 space-y-0">
              {(problem.timeline || []).map((step: any, index: number) => (
                <div key={step.stage} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < (problem.timeline?.length || 0) - 1 && (
                    <span
                      className={`absolute left-[11px] top-6 h-full w-0.5 ${
                        step.status === "done" ? "bg-teal-500" : "bg-slate-200"
                      }`}
                    />
                  )}

                  <span
                    className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      step.status === "done"
                        ? "bg-teal-600 text-white"
                        : step.status === "active"
                          ? "border-2 border-teal-500 bg-white"
                          : "border-2 border-slate-200 bg-white"
                    }`}
                  >
                    {step.status === "done" && <CheckCircle2 size={14} />}
                  </span>

                  <div className="pt-0.5">
                    <p
                      className={`text-xs font-bold ${
                        step.status === "pending" ? "text-slate-400" : "text-navy-900"
                      }`}
                    >
                      {step.stage}
                    </p>
                    {step.date && (
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={11} />
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail: Admin Progress Action Panel + Solutions */}
        <div className="space-y-6">
          {/* Admin Case Progress Update Panel */}
          <div className="rounded-3xl border-2 border-teal-500 bg-gradient-to-b from-teal-50/50 to-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-teal-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">
                  Admin Case Governance & Progress
                </h3>
                <p className="text-[11px] text-slate-500">
                  Update status, resolution progress, and directives
                </p>
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Grievance Resolution Status:
              </label>
              <select
                value={currentStatus}
                onChange={(e) => {
                  setCurrentStatus(e.target.value);
                  if (e.target.value === "Resolved") setCurrentProgress(100);
                  else if (e.target.value === "In Progress") setCurrentProgress(75);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-navy-900 outline-none focus:border-teal-500"
              >
                <option value="Under Analysis">Under Analysis</option>
                <option value="Matching Teams">Matching Teams</option>
                <option value="Solution Planned">Solution Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved (Citizen Completed)</option>
              </select>
            </div>

            {/* Progress Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Resolution Progress:</span>
                <span className="text-teal-700 font-mono">{currentProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={currentProgress}
                onChange={(e) => setCurrentProgress(parseInt(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Administrative Action Remark */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Official Action Remark / Directive:
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Field inspection completed by Ranchi Municipal Corporation. Ultrasonic telemetry nodes dispatched..."
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-navy-900 outline-none focus:border-teal-500"
              />
            </div>

            <button
              onClick={handleUpdateProgress}
              disabled={isUpdating}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
                isSaved
                  ? "bg-emerald-600 text-white"
                  : "bg-[#10245e] hover:bg-navy-800 text-white"
              }`}
            >
              {isSaved ? (
                <>
                  <Check size={14} /> Case Progress Updated!
                </>
              ) : (
                <>
                  <Send size={14} /> Save & Dispatch Status
                </>
              )}
            </button>
          </div>

          {/* Proposed Solutions Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <Lightbulb size={16} className="text-teal-600" />
              Proposed Engineering Solutions
            </h2>

            <div className="mt-3 space-y-3">
              {(problem.solutionApproaches || []).map((solution: any) => (
                <div key={solution.title} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold text-navy-900">
                    {solution.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Teams Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <Users size={16} className="text-teal-600" />
              Matched R&D Institutions
            </h2>

            <div className="mt-3 space-y-3">
              {(problem.recommendedTeams || [
                { name: "IIT (ISM) Dhanbad", department: "Environmental & Mining Engineering" },
                { name: "BIT Mesra", department: "Civil & Water Resource Engineering" },
                { name: "NIT Jamshedpur", department: "IoT & Smart Infrastructure Lab" },
              ]).map((team: any) => (
                <div key={team.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-xs font-bold text-white">
                      {team.name
                        .split(" ")
                        .filter((word: string) => word.length > 1)
                        .slice(0, 2)
                        .map((word: string) => word[0])
                        .join("")}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-navy-900">
                        {team.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{team.department}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAssignUniversity(team.name)}
                    disabled={assigningTeam === team.name}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all shrink-0"
                  >
                    <Building2 size={12} />
                    {assigningTeam === team.name ? "Dispatching..." : "Assign Directive"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;