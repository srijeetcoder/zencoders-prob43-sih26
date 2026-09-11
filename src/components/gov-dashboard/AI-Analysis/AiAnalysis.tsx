import { useState, useEffect, useMemo } from "react";
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  Target,
  Building2,
  TrendingUp,
  RefreshCw,
  Cpu,
  ShieldCheck,
  FileText,
  KeyRound,
  Send,
  CheckCircle2,
  Inbox,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { governmentApi } from "../../../services/api";

const DISTRICTS = [
  "All",
  "Dumka",
  "Ranchi",
  "Palamu",
  "Dhanbad",
  "Simdega",
  "West Singhbhum",
  "Bokaro",
  "Ramgarh",
  "Giridih",
  "East Singhbhum",
  "Hazaribagh",
  "Deoghar",
];

const DOMAINS = [
  "All",
  "Energy & Rural Electrification",
  "Civil Infrastructure",
  "Public Health & Water",
  "Education & Literacy",
  "Agriculture",
  "Environment",
];

const SECTOR_COLORS: Record<string, string> = {
  "Infrastructure": "#153157",
  "Civil Infrastructure": "#153157",
  "Public Health": "#0d9488",
  "Public Health & Water": "#0d9488",
  "Energy & Grid": "#f59e0b",
  "Energy & Rural Electrification": "#f59e0b",
  "Environment": "#10b981",
  "Education": "#6366f1",
  "Education & Literacy": "#6366f1",
  "Agriculture": "#84cc16",
  "Others": "#64748b",
};

function AiAnalysis() {
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [clusters, setClusters] = useState<any[]>([]);
  const [overviewMetrics, setOverviewMetrics] = useState<any | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isLoadingClusters, setIsLoadingClusters] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [activeTab, setActiveTab] = useState<"cabinet" | "bom" | "scurve" | "partners" | "directive">("cabinet");

  // Fetch dynamic overview stats directly from backend database SQL aggregates
  const fetchOverview = async () => {
    try {
      const data = await governmentApi.getStats();
      const overview = await governmentApi.getEscalations();
      // Also fetch sectors
      const sectors = await governmentApi.getSectors();
      setOverviewMetrics({
        total: data.totalSubmissions || 0,
        resolved: data.resolvedCases || 0,
        active: data.activeProjects || 0,
        critical: data.criticalEscalations || 0,
        sectors: sectors || [],
      });
    } catch {
      setOverviewMetrics({
        total: 0,
        resolved: 0,
        active: 0,
        critical: 0,
        sectors: [],
      });
    }
  };

  // Load vector clusters dynamically from backend API
  const loadClusters = async () => {
    setIsLoadingClusters(true);
    try {
      const data = await governmentApi.getClusters(selectedDistrict, selectedDomain);
      if (Array.isArray(data)) {
        setClusters(data);
        if (data.length > 0) {
          if (!selectedCluster || !data.some((c) => c.clusterId === selectedCluster.clusterId)) {
            setSelectedCluster(data[0]);
            executeAnalysis(data[0]);
          }
        } else {
          setSelectedCluster(null);
          setAnalysisResult(null);
        }
      } else {
        setClusters([]);
        setSelectedCluster(null);
        setAnalysisResult(null);
      }
    } catch {
      setClusters([]);
      setSelectedCluster(null);
      setAnalysisResult(null);
    } finally {
      setIsLoadingClusters(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [selectedDistrict]);

  useEffect(() => {
    loadClusters();
  }, [selectedDistrict, selectedDomain]);

  // Execute Cabinet-Level AI Analysis
  const executeAnalysis = async (clusterToAnalyze?: any) => {
    const target = clusterToAnalyze || selectedCluster;
    if (!target) return;

    setIsLoadingAnalysis(true);
    try {
      const res = await governmentApi.runCabinetAiAnalysis({
        title: target.clusterTitle,
        district: target.district || (selectedDistrict !== "All" ? selectedDistrict : "Ranchi"),
        domain: target.domain || (selectedDomain !== "All" ? selectedDomain : "Civil Infrastructure"),
        description: target.representativeProblemSummary || target.underlyingRootCauseHypothesis,
        clusterId: target.clusterId,
        apiKey: geminiApiKey.trim() || undefined,
      });

      if (res) {
        setAnalysisResult(res);
      }
    } catch (e: any) {
      console.warn("AI Analysis execution notice:", e.message);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Derive Dynamic Charts directly from live database metrics
  const domainChartData = useMemo(() => {
    if (overviewMetrics?.sectors && overviewMetrics.sectors.length > 0) {
      return overviewMetrics.sectors.map((s: any) => ({
        name: s.name || "General",
        count: s.count || 0,
        color: SECTOR_COLORS[s.name] || "#3b82f6",
      }));
    }

    if (clusters.length > 0) {
      const counts: Record<string, number> = {};
      clusters.forEach((c) => {
        counts[c.domain] = (counts[c.domain] || 0) + (c.submissionCount || 1);
      });
      return Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        color: SECTOR_COLORS[name] || "#3b82f6",
      }));
    }

    return [];
  }, [overviewMetrics, clusters]);

  const totalGrievancesCount = useMemo(() => {
    if (overviewMetrics?.total) return overviewMetrics.total;
    return clusters.reduce((acc, c) => acc + (c.submissionCount || 0), 0);
  }, [overviewMetrics, clusters]);

  const severityChartData = useMemo(() => {
    if (clusters.length === 0) return [];
    const criticalCount = clusters.filter((c) => (c.hazardScore || 0) >= 80).reduce((acc, c) => acc + (c.submissionCount || 1), 0);
    const highCount = clusters.filter((c) => (c.hazardScore || 0) >= 50 && (c.hazardScore || 0) < 80).reduce((acc, c) => acc + (c.submissionCount || 1), 0);
    const modCount = clusters.filter((c) => (c.hazardScore || 0) < 50).reduce((acc, c) => acc + (c.submissionCount || 1), 0);
    const total = criticalCount + highCount + modCount || 1;

    return [
      { name: "Critical Risk (Hazard >= 80)", value: Math.round((criticalCount / total) * 100), count: criticalCount, color: "#ef4444" },
      { name: "High Risk (Hazard 50-79)", value: Math.round((highCount / total) * 100), count: highCount, color: "#f59e0b" },
      { name: "Moderate Risk (Hazard < 50)", value: Math.round((modCount / total) * 100), count: modCount, color: "#10b981" },
    ].filter((item) => item.count > 0);
  }, [clusters]);

  const highHazardPercentage = useMemo(() => {
    if (clusters.length === 0) return 0;
    const highCount = clusters.filter((c) => (c.hazardScore || 0) >= 70).length;
    return Math.round((highCount / clusters.length) * 100);
  }, [clusters]);

  const sCurveData = useMemo(() => {
    if (analysisResult?.sCurveTrajectory && analysisResult.sCurveTrajectory.length > 0) {
      return analysisResult.sCurveTrajectory;
    }
    return [];
  }, [analysisResult]);

  return (
    <div className="px-6 py-6 sm:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header with Title & API Key Pairing */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10245e] to-teal-700 text-white shadow-md">
            <BrainCircuit size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-900">
                Cabinet-Level Government AI Intelligence War Room
              </h1>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                Live Gemini Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              PostgreSQL Vector Clustering (text-embedding-004) &bull; Strict Domain RAG &bull; Hardware BoMs &bull; S-Curve Trajectories &bull; DMF Allocation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <KeyRound size={14} className="text-teal-600" />
            {geminiApiKey ? "Gemini Key Configured" : "Pair Gemini API Key"}
          </button>

          <button
            onClick={() => executeAnalysis()}
            disabled={isLoadingAnalysis || !selectedCluster}
            className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-navy-800 disabled:opacity-50 transition-all"
          >
            <RefreshCw size={14} className={isLoadingAnalysis ? "animate-spin text-teal-300" : "text-white"} />
            {isLoadingAnalysis ? "Synthesizing AI Report..." : "Execute AI Analysis"}
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showApiKeyInput && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 animate-in fade-in duration-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-teal-600" />
                Google Gemini API Key (Runtime Configuration)
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use backend environment key)"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs outline-none focus:border-teal-500"
              />
            </div>
            <div className="self-end sm:self-auto pt-4 sm:pt-0">
              <span className="text-[11px] text-slate-500 block">
                Direct structured output reasoning with negative BoM constraint enforcement
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Live Cluster Selector Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              District Filter:
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-900 outline-none focus:border-teal-500"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">
              Domain:
            </span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-900 outline-none focus:border-teal-500"
            >
              {DOMAINS.map((dm) => (
                <option key={dm} value={dm}>
                  {dm}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {isLoadingClusters && <Loader2 size={14} className="animate-spin text-teal-600" />}
            <span className="text-xs font-medium text-slate-500">
              {clusters.length} Systemic Clusters Discovered in Database
            </span>
          </div>
        </div>

        {/* Dynamic Database Cluster Selector Pills */}
        {clusters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
            {clusters.map((c) => {
              const isSelected = selectedCluster?.clusterId === c.clusterId;
              return (
                <button
                  key={c.clusterId}
                  onClick={() => {
                    setSelectedCluster(c);
                    executeAnalysis(c);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-400"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold font-mono text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                      {c.clusterId} &bull; {c.district}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      Hazard: {c.hazardScore}/100
                    </span>
                  </div>
                  <p className="text-xs font-bold text-navy-900 mt-1.5 line-clamp-1">
                    {c.clusterTitle}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{c.submissionCount} merged reports</span>
                    <span className="font-semibold text-slate-700">
                      Priority: {c.clusterPriorityWeight}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center border-t border-slate-100">
            <Inbox size={24} className="mx-auto text-slate-400 mb-1.5" />
            <p className="text-xs font-bold text-slate-700">No active systemic clusters in database for selected filter</p>
            <p className="text-[11px] text-slate-500">Incoming citizen grievances will automatically be clustered here via pgvector similarity.</p>
          </div>
        )}
      </div>

      {/* Dynamic Metric Cards (Calculated from Real Database Data) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <BrainCircuit size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-navy-900">{totalGrievancesCount.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium">Grievances Ingested & Vectorized</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-rose-600">{highHazardPercentage}%</p>
            <p className="text-xs text-slate-500 font-medium">High/Critical Hazard Share</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-teal-700">
              {analysisResult ? `${analysisResult.bomComplianceScore}%` : "100%"}
            </p>
            <p className="text-xs text-slate-500 font-medium">Negative BoM Compliance Gate</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Target size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-amber-700">
              {analysisResult ? `${(analysisResult.confidence * 100).toFixed(1)}%` : "94.0%"}
            </p>
            <p className="text-xs text-slate-500 font-medium">Gemini AI Model Confidence</p>
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Charts (Cases by Domain & Severity Donut) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Domain Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-navy-900">Cases & Clusters by Domain</h2>
              <p className="text-xs text-slate-500">Live distribution computed from PostgreSQL</p>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Total {totalGrievancesCount.toLocaleString()}
            </span>
          </div>

          <div className="h-64 w-full">
            {domainChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} angle={-15} textAnchor="end" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val} cases`, "Volume"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {domainChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No domain records in database for this filter.
              </div>
            )}
          </div>
        </div>

        {/* Severity Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-navy-900">Severity & Hazard Distribution</h2>
              <p className="text-xs text-slate-500">Computed risk weighting across active clusters</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {severityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {severityChartData.map((entry: any) => (
                      <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.count} items)`, name]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-slate-700 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No active hazard clusters to distribute.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cabinet AI Output Section Tabs */}
      {selectedCluster && analysisResult ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                  AI
                </span>
                <h2 className="text-lg font-bold text-navy-900">
                  {analysisResult.title || selectedCluster.clusterTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                District: <strong className="text-navy-900">{analysisResult.district || selectedCluster.district}</strong> &bull; Domain: <strong className="text-navy-900">{analysisResult.domain || selectedCluster.domain}</strong>
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("cabinet")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "cabinet" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                Executive Report
              </button>
              <button
                onClick={() => setActiveTab("bom")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "bom" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                Hardware BoM (INR)
              </button>
              <button
                onClick={() => setActiveTab("scurve")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "scurve" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                S-Curve 12M Trajectory
              </button>
              <button
                onClick={() => setActiveTab("partners")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "partners" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                Institutional Matches
              </button>
              <button
                onClick={() => setActiveTab("directive")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "directive" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                District Directive
              </button>
            </div>
          </div>

          {/* Tab 1: Executive Cabinet Synthesis */}
          {activeTab === "cabinet" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={15} className="text-teal-600" />
                  Cabinet Executive Summary
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
                  {analysisResult.executiveSummary}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-4">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={15} className="text-amber-600" />
                  Systemic Root Cause Synthesis (Rural Block Analysis)
                </h3>
                <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                  {analysisResult.systemicRootCauseSynthesis || selectedCluster.underlyingRootCauseHypothesis}
                </p>
                {analysisResult.affectedBlocksOrPanchayats && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-600">Affected Blocks:</span>
                    {analysisResult.affectedBlocksOrPanchayats.map((b: string) => (
                      <span key={b} className="text-[11px] font-semibold bg-white border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* DMF Funding Strategy Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-teal-50/70 border border-teal-200 p-4">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                    DMF Grant Allocation
                  </span>
                  <p className="mt-1 text-2xl font-bold text-teal-900">
                    ₹ {analysisResult.dmfAllocationStrategy?.dmfGrantAmountLakhs || 0} Lakhs
                  </p>
                  <p className="text-[11px] text-teal-700 mt-1">
                    District Mineral Foundation Trust (MMDR Act Sec 9B)
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-4">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    State SDRF / Co-Funding
                  </span>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {analysisResult.dmfAllocationStrategy?.stateSdrfSharePercentage || 0}% SDRF Share
                  </p>
                  <p className="text-[11px] text-blue-700 mt-1">
                    CSR Co-Funding: ₹ {analysisResult.dmfAllocationStrategy?.csrPartnerCoFundingLakhs || 0}L
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-4">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Financial Viability Score
                  </span>
                  <p className="mt-1 text-2xl font-bold text-purple-900">
                    {analysisResult.dmfAllocationStrategy?.financialViabilityScore || 0} / 100
                  </p>
                  <p className="text-[11px] text-purple-700 mt-1">
                    High return-on-capital societal impact
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Hardware Bill of Materials (BoM) */}
          {activeTab === "bom" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                    <Cpu size={16} className="text-teal-600" />
                    Consolidated Hardware Bill of Materials (BoM) with INR Pricing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Domain-filtered BoM with strict negative constraint validation
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                    BoM Compliance: {analysisResult.bomComplianceScore}%
                  </span>
                  <span className="rounded-full bg-navy-900 text-white px-3 py-1 text-xs font-bold">
                    Total: ₹ {(analysisResult.bomTotalCostINR || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Hardware Item & Specs</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Cost (INR)</th>
                      <th className="p-3 text-right">Total Cost (INR)</th>
                      <th className="p-3">Engineering Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(analysisResult.hardwareBoM || []).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-navy-900">
                          {item.item}
                          {item.specifications && (
                            <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                              {item.specifications}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {item.category || "Hardware"}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-navy-900">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-700">₹ {(item.unitCostINR || 0).toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right font-mono font-bold text-teal-700">₹ {(item.totalCostINR || 0).toLocaleString("en-IN")}</td>
                        <td className="p-3 text-slate-600 text-[11px] leading-relaxed max-w-xs">
                          {item.purposeBoundJustification}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: S-Curve 12-Month Trajectory */}
          {activeTab === "scurve" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <TrendingUp size={16} className="text-teal-600" />
                  12-Month S-Curve Impact & Beneficiary Adoption Trajectory
                </h3>
                <p className="text-xs text-slate-500">
                  Month-by-month adoption % vs hazard index reduction % and cumulative beneficiaries
                </p>
              </div>

              {sCurveData.length > 0 ? (
                <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorHazard" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
                      <Tooltip
                        formatter={(val: any, name: any) => [`${val}%`, name === "adoptionRatePercentage" ? "Adoption Rate" : "Hazard Reduction"]}
                        contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Area
                        type="monotone"
                        dataKey="adoptionRatePercentage"
                        name="Adoption Rate (%)"
                        stroke="#0d9488"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorAdoption)"
                      />
                      <Area
                        type="monotone"
                        dataKey="hazardIndexReductionPercentage"
                        name="Hazard Reduction (%)"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorHazard)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : null}
            </div>
          )}

          {/* Tab 4: Institutional Matches Matrix */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <Building2 size={16} className="text-teal-600" />
                  Institutional Partner Matching Matrix (Jharkhand Academic Labs)
                </h3>
                <p className="text-xs text-slate-500">
                  Automated matching based on geospatial proximity and R&D specialization scores
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(analysisResult.institutionalPartnerMatchingMatrix || []).map((partner: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {partner.districtLocation} &bull; {partner.geospatialProximityKm} km
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {partner.specializationScore}% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-navy-900">{partner.institutionName}</h4>
                    <p className="text-xs text-slate-600 font-medium">{partner.departmentOrLab}</p>

                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                      <strong className="text-slate-700">Proposed Role:</strong> {partner.proposedRole}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(partner.coreCapabilities || []).map((cap: string) => (
                        <span key={cap} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {cap}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">{partner.trlReadinessLevel}</span>
                      <span className="text-teal-600 font-bold hover:underline cursor-pointer">
                        Initiate Collaboration &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: District Action Directive */}
          {activeTab === "directive" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-300 bg-slate-50/80 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      ADMINISTRATIVE ORDER #{analysisResult.districtActionDirective?.orderReference}
                    </span>
                    <h3 className="text-base font-bold text-navy-900 mt-1">
                      Cabinet State War Room Executive Action Directive
                    </h3>
                  </div>
                  <button
                    onClick={() => alert("Administrative Directive Dispatched to District Magistrate & War Room Ledger.")}
                    className="flex items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-navy-800 transition-colors"
                  >
                    <Send size={13} />
                    Dispatch Order
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong className="text-slate-500 block">Designated Nodal Officer:</strong>
                    <span className="text-sm font-bold text-navy-900">
                      {analysisResult.districtActionDirective?.designatedNodalOfficer}
                    </span>
                  </div>
                  <div>
                    <strong className="text-slate-500 block">Mandated SLA Window:</strong>
                    <span className="text-sm font-bold text-rose-600">
                      {analysisResult.districtActionDirective?.mandatedSlaDays} Calendar Days
                    </span>
                  </div>
                </div>

                <div>
                  <strong className="text-xs text-slate-700 block mb-1.5 uppercase tracking-wider font-bold">
                    Immediate Directives:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {(analysisResult.districtActionDirective?.immediateDirectives || []).map((dir: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-3 text-xs text-rose-900">
                  <strong>Statutory Compliance Warning:</strong> {analysisResult.districtActionDirective?.penalConsequencesOfDefault}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default AiAnalysis;