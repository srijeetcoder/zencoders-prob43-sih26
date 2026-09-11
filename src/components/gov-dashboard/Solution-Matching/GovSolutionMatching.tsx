import { useState, useEffect, useMemo } from "react";
import {
  BrainCircuit,
  Sparkles,
  Target,
  Layers,
  Building2,
  RefreshCw,
  AlertTriangle,
  Radio,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import SolutionStats from "../../solution-matching/solution/SolutionStats";
import FilterPanel from "../../solution-matching/solution/FilterPanel";
import SolutionList from "../../solution-matching/solution/SolutionList";
import TopMatchedTeam from "../../solution-matching/teams/TopMatchedTeam";
import OtherMatchedTeams from "../../solution-matching/teams/OtherMatchedTeams";
import { filterOptions } from "../../../data/solutionMatchingData";
import { fetchAllRealSubmissions } from "../../../services/realSubmissions";

// Domain-specific solution catalog template dynamically resolved by problem cluster
function getDomainSolutions(domain: string, district: string, sampleTitle: string) {
  const titleLower = sampleTitle.toLowerCase();
  const domainLower = domain.toLowerCase();

  const isDrainageOrCivic =
    domainLower.includes("infra") ||
    domainLower.includes("civil") ||
    titleLower.includes("drain") ||
    titleLower.includes("waterlog") ||
    titleLower.includes("water log") ||
    titleLower.includes("paani") ||
    titleLower.includes("silt") ||
    titleLower.includes("culvert") ||
    titleLower.includes("flood");

  const isEnergy =
    domainLower.includes("energy") ||
    domainLower.includes("power") ||
    titleLower.includes("power") ||
    titleLower.includes("transformer") ||
    titleLower.includes("voltage") ||
    titleLower.includes("grid");

  const isHealth =
    !isDrainageOrCivic &&
    (domainLower.includes("health") ||
      titleLower.includes("fluoride") ||
      titleLower.includes("arsenic") ||
      titleLower.includes("contamination") ||
      titleLower.includes("potable"));

  if (isEnergy) {
    return [
      {
        id: 1,
        title: `Decentralized Solar Microgrid & Solid-State Transformer Grid - ${district}`,
        matchType: "High Match",
        matchPercent: 95,
        description: `Deploy resilient 250 kVA solid-state step-down transformers and solar microgrid backup across ${district} rural feeder corridors.`,
        tags: ["Energy & Grid", "IoT Telemetry", "Rural Electrification"],
        duration: "3 – 5 months",
        cost: "₹ 85 Lakh – 1.4 Cr",
        impact: "High Impact",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: 2,
        title: `SCADA Line Surge & Oil Temperature Telemetry System`,
        matchType: "High Match",
        matchPercent: 88,
        description: `Install IoT vibration and oil degradation monitors on overloaded distribution transformers with automated circuit cutoff.`,
        tags: ["IoT Telemetry", "Power Systems", "Predictive Maintenance"],
        duration: "2 – 4 months",
        cost: "₹ 30 – 55 Lakh",
        impact: "High Impact",
        image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: 3,
        title: `Community Energy Storage & Off-Peak Balancing Unit`,
        matchType: "Medium Match",
        matchPercent: 79,
        description: `Install containerized 500 kWh LiFePO4 battery storage banks to buffer peak agriculture and domestic loads.`,
        tags: ["Renewables", "Energy Storage", "Grid Resilience"],
        duration: "4 – 7 months",
        cost: "₹ 60 – 95 Lakh",
        impact: "Moderate Impact",
        image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80",
      },
    ];
  }

  if (isHealth) {
    return [
      {
        id: 1,
        title: `Electrochemical Arsenic & Fluoride Remediation Unit - ${district}`,
        matchType: "High Match",
        matchPercent: 96,
        description: `Install solar-assisted continuous electrochemical coagulator (EC) filtration plants in affected rural panchayat borewells.`,
        tags: ["Public Health", "Water Filtration", "Bio-remediation"],
        duration: "2 – 4 months",
        cost: "₹ 45 – 80 Lakh",
        impact: "High Impact",
        image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: 2,
        title: `Real-time Potable Water Quality GSM Telemetry Grid`,
        matchType: "High Match",
        matchPercent: 90,
        description: `Deploy optical TDS, pH, and bacterial contamination sensor probes connected to district health war room.`,
        tags: ["IoT Telemetry", "Early Warning", "Water Resources"],
        duration: "1 – 3 months",
        cost: "₹ 25 – 45 Lakh",
        impact: "High Impact",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
      },
    ];
  }

  // Default: Civil Infrastructure & Stormwater Drainage / Waterlogging
  return [
    {
      id: 1,
      title: `Smart Drainage & Permeable Pavement Acoustic Telemetry - ${district}`,
      matchType: "High Match",
      matchPercent: 94,
      description: `Upgrade urban conduit drainage in ${district} with IP68 ultrasonic silt sensors, non-invasive Doppler flow telemetry, and permeable pavements.`,
      tags: ["Infrastructure", "IoT & Telemetry", "Urban Planning"],
      duration: "4 – 6 months",
      cost: "₹ 1.2 – 1.8 Cr",
      impact: "High Impact",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: `Real-time Silt Depth & Water Level Ultrasonic Monitoring`,
      matchType: "High Match",
      matchPercent: 89,
      description: `Install solar LoRaWAN ultrasonic level sensors and early flash warning telemetry nodes for ${district} municipal war room dispatch.`,
      tags: ["IoT & Telemetry", "Early Warning", "Data Analytics"],
      duration: "2 – 4 months",
      cost: "₹ 35 – 65 Lakh",
      impact: "High Impact",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: `Decentralized Bioswale & Rainwater Percolation Grid`,
      matchType: "Medium Match",
      matchPercent: 78,
      description: `Deploy community bioswales and decentralized subsurface filtration sumps in ${district} to catch runoff before entering choked arterial conduits.`,
      tags: ["Nature-based", "Sustainability", "Community Driven"],
      duration: "6 – 9 months",
      cost: "₹ 45 – 90 Lakh",
      impact: "Moderate Impact",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: `Automated Trash Rack & Heavy Silt Dredging Plan`,
      matchType: "Medium Match",
      matchPercent: 74,
      description: `Mechanical trash barriers at key ${district} stormwater junctions paired with scheduled AI-guided hydraulic desilting rotations.`,
      tags: ["Policy & Operations", "Municipal Management", "Clearing Grid"],
      duration: "1 – 3 months",
      cost: "₹ 20 – 45 Lakh",
      impact: "Moderate Impact",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    },
  ];
}

function getDomainTeams(domain: string, district: string) {
  const isEnergy = domain.toLowerCase().includes("energy");
  const isHealth = domain.toLowerCase().includes("health");

  if (isEnergy) {
    return {
      top: {
        name: "IIT (ISM) Dhanbad",
        matchPercent: 95,
        department: "Dept. of Electrical & Renewable Energy Engineering",
        description: `Pioneers in high-voltage microgrid stabilization, transformer health diagnostic modeling, and rural telemetry in Jharkhand.`,
        stats: [
          { value: "6", label: "Grid Projects" },
          { value: "11", label: "Faculty Experts" },
          { value: "4", label: "Field Pilots" },
        ],
      },
      other: [
        { id: 1, name: "NIT Jamshedpur", department: "Power Electronics & Smart Grid Lab", matchPercent: 91 },
        { id: 2, name: "BIT Mesra", department: "Dept. of Electrical & Electronics", matchPercent: 87 },
        { id: 3, name: "JUSNL Grid Research Cell", department: "State Transmission Innovation Unit", matchPercent: 83 },
      ],
    };
  }

  if (isHealth) {
    return {
      top: {
        name: "AIIMS Deoghar",
        matchPercent: 96,
        department: "Community Medicine & Environmental Toxicology Lab",
        description: `Specialized in regional waterborne disease vectors, heavy metal remediation protocols, and rural telemedicine integration.`,
        stats: [
          { value: "4", label: "Health Trials" },
          { value: "9", label: "Medical Experts" },
          { value: "5", label: "District Labs" },
        ],
      },
      other: [
        { id: 1, name: "RIMS Ranchi", department: "Epidemiology & Public Health Cell", matchPercent: 92 },
        { id: 2, name: "Birsa Agricultural University", department: "Soil & Water Resource Center", matchPercent: 86 },
        { id: 3, name: "CSIR-NML Jamshedpur", department: "Water Purification Division", matchPercent: 82 },
      ],
    };
  }

  // Default: Civil / Drainage / Urban Infrastructure
  return {
    top: {
      name: "Birla Institute of Technology (BIT Mesra)",
      matchPercent: 94,
      department: "IoT, Telemetry & Embedded Urban Systems Lab, Ranchi",
      description: `Specialized in urban conduit telemetry, LoRaWAN mesh communication, and stormwater modeling. Successfully deployed 5 municipal sensor pilots across Jharkhand.`,
      stats: [
        { value: "5", label: "Similar Projects" },
        { value: "8", label: "Faculty Experts" },
        { value: "3", label: "Delivery Pilots" },
      ],
    },
    other: [
      { id: 1, name: "IIT (ISM) Dhanbad", department: "Dept. of Environmental Science & Hydrology", matchPercent: 91 },
      { id: 2, name: "NIT Jamshedpur", department: "Dept. of Civil & Smart Sensors", matchPercent: 86 },
      { id: 3, name: "Tata Steel Urban Innovation Hub", department: "Infrastructure Innovation Division", matchPercent: 82 },
    ],
  };
}

export default function GovSolutionMatching() {
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState(JSON.parse(JSON.stringify(filterOptions)));
  const [rawProblems, setRawProblems] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedClusterIndex, setSelectedClusterIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load real citizen submissions and build dynamic clusters
  const loadData = async () => {
    setLoading(true);
    try {
      const realSubs = await fetchAllRealSubmissions();
      setRawProblems(realSubs);

      if (realSubs.length > 0) {
        // Group by District + Domain
        const grouped = new Map<string, any[]>();
        realSubs.forEach((item) => {
          const district = item.location?.city || "Ranchi";
          const domain = item.category === "Infrastructure" ? "Civil Infrastructure" : item.category;
          const key = `${district}::${domain}`;
          if (!grouped.has(key)) {
            grouped.set(key, []);
          }
          grouped.get(key)!.push(item);
        });

        const dynamicClusters: any[] = [];
        let idx = 1;
        for (const [key, items] of grouped.entries()) {
          const [dist, dom] = key.split("::");
          const rep = items[0];
          dynamicClusters.push({
            id: `CLUST-${dist.toUpperCase().slice(0, 3)}-${idx.toString().padStart(3, "0")}`,
            title: `${dom} Systemic Issue - ${dist}`,
            district: dist,
            domain: dom,
            submissionsCount: items.length,
            representativeTitle: rep.title || "Urban Drainage & Stormwater Ingress Redressal",
            representativeSnippet: rep.description || "Citizen grievance recorded.",
            items,
          });
          idx++;
        }
        setClusters(dynamicClusters);
      } else {
        setClusters([]);
      }
    } catch {
      setClusters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeCluster = clusters[selectedClusterIndex] || clusters[0] || null;

  // Derive solutions from the active cluster
  const dynamicBaseSolutions = useMemo(() => {
    if (!activeCluster) {
      return getDomainSolutions("Civil Infrastructure", "Ranchi", "Urban drainage water logging");
    }
    return getDomainSolutions(
      activeCluster.domain,
      activeCluster.district,
      activeCluster.representativeTitle + " " + activeCluster.representativeSnippet
    );
  }, [activeCluster]);

  const [filteredSolutions, setFilteredSolutions] = useState(dynamicBaseSolutions);

  // Update filtered solutions when base solutions change
  useEffect(() => {
    setFilteredSolutions(dynamicBaseSolutions);
  }, [dynamicBaseSolutions]);

  const teamsData = useMemo(() => {
    if (!activeCluster) return getDomainTeams("Civil Infrastructure", "Ranchi");
    return getDomainTeams(activeCluster.domain, activeCluster.district);
  }, [activeCluster]);

  // Derived dynamic stats
  const dynamicStats = useMemo(() => {
    const totalSolutions = filteredSolutions.length;
    const highFeasibility = filteredSolutions.filter((s) => s.matchType === "High Match" || s.matchPercent >= 85).length;
    const totalTeams = (teamsData.other?.length || 0) + 1;

    return [
      {
        id: 1,
        value: totalSolutions.toString(),
        label: "Potential Solutions",
        sub: `Tailored to ${activeCluster ? activeCluster.domain : "Active Problem"}`,
        icon: "lightbulb",
        color: "#f59e0b",
      },
      {
        id: 2,
        value: totalTeams.toString(),
        label: "Matched Teams",
        sub: "Verified Jharkhand R&D Labs",
        icon: "users",
        color: "#0891b2",
      },
      {
        id: 3,
        value: highFeasibility.toString(),
        label: "High Feasibility",
        sub: "Bankable DPR Solutions",
        icon: "target",
        color: "#ef4444",
      },
      {
        id: 4,
        value: "2 – 6 months",
        label: "Estimated Time",
        sub: "For top pilot deployments",
        icon: "clock",
        color: "#164e63",
      },
    ];
  }, [filteredSolutions, teamsData, activeCluster]);

  const handleFilterChange = (category: string, id: string, type: string) => {
    setFilters((prev: any) => {
      const updated = { ...prev };
      if (type === "checkbox") {
        updated[category] = prev[category].map((item: any) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        );
      } else {
        updated[category] = prev[category].map((item: any) =>
          item.id === id ? { ...item, checked: true } : { ...item, checked: false }
        );
      }
      return updated;
    });
  };

  const handleReset = () => {
    setFilters(JSON.parse(JSON.stringify(filterOptions)));
    setFilteredSolutions(dynamicBaseSolutions);
  };

  const handleApply = () => {
    let result = [...dynamicBaseSolutions];

    const activeDomains = filters.domains.filter((d: any) => d.checked).map((d: any) => d.id);
    if (activeDomains.length > 0) {
      result = result.filter((s) =>
        s.tags.some((t) => {
          const tagLower = t.toLowerCase();
          return activeDomains.some((d: string) => {
            if (d === "infrastructure") return tagLower.includes("infrastructure") || tagLower.includes("urban") || tagLower.includes("civil");
            if (d === "iot-monitoring") return tagLower.includes("iot") || tagLower.includes("monitoring") || tagLower.includes("telemetry") || tagLower.includes("data");
            if (d === "nature-based") return tagLower.includes("nature") || tagLower.includes("sustainability") || tagLower.includes("filtration");
            if (d === "policy") return tagLower.includes("municipal") || tagLower.includes("operations") || tagLower.includes("policy");
            if (d === "community") return tagLower.includes("community");
            return false;
          });
        })
      );
    }

    const activeFeasibility = filters.feasibility.find((f: any) => f.checked);
    if (activeFeasibility && activeFeasibility.id !== "any") {
      if (activeFeasibility.id === "high") {
        result = result.filter((s) => s.matchPercent >= 85);
      } else if (activeFeasibility.id === "medium") {
        result = result.filter((s) => s.matchPercent >= 70 && s.matchPercent < 85);
      }
    }

    setFilteredSolutions(result);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredSolutions];
    switch (value) {
      case "match-high":
        sorted.sort((a, b) => b.matchPercent - a.matchPercent);
        break;
      case "match-low":
        sorted.sort((a, b) => a.matchPercent - b.matchPercent);
        break;
      case "cost-low":
        sorted.sort((a, b) => {
          const getCost = (c: any) => { const m = c.cost.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
          return getCost(a) - getCost(b);
        });
        break;
      case "cost-high":
        sorted.sort((a, b) => {
          const getCost = (c: any) => { const m = c.cost.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
          return getCost(b) - getCost(a);
        });
        break;
      default:
        sorted.sort((a, b) => b.matchPercent - a.matchPercent);
    }
    setFilteredSolutions(sorted);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#10245e]">
              Solution & Team Matching
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live AI Matching
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            AI-powered recommendations connecting citizen challenges with verified research labs, universities, and enterprise innovators across Jharkhand.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Submissions
        </button>
      </div>

      {/* Dynamic Active Cluster Banner */}
      {activeCluster ? (
        <div className="bg-gradient-to-r from-[#10245e] to-teal-900 rounded-2xl p-5 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  <Target className="w-3 h-3 text-teal-300" />
                  Active Clustered Problem
                </span>
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-300" />
                  {activeCluster.district}, Jharkhand
                </span>
                <span className="text-xs font-semibold bg-white/10 px-2 py-0.5 rounded text-slate-200">
                  {activeCluster.domain}
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {activeCluster.submissionsCount} Citizen Reports Integrated
                </span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeCluster.representativeTitle}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-4xl">
                {activeCluster.representativeSnippet}
              </p>

              {activeCluster.items && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Integrated Grievances:</span>
                  {activeCluster.items.map((item: any) => (
                    <span
                      key={item.id}
                      className="text-[10px] font-mono font-semibold bg-black/30 border border-white/10 px-2 py-0.5 rounded text-teal-200"
                    >
                      {item.referenceId || item.id}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Cluster Switcher if multiple clusters exist */}
            {clusters.length > 1 && (
              <div className="shrink-0 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Switch Problem Cluster ({clusters.length})
                </p>
                <div className="flex flex-col gap-1">
                  {clusters.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClusterIndex(idx)}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedClusterIndex === idx
                          ? "bg-teal-500 text-white shadow-sm"
                          : "text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {c.district} — {c.domain} ({c.submissionsCount})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs">
            No citizen submissions found in this session. Solutions are mapped to baseline Jharkhand Civic Infrastructure benchmarks.
          </p>
        </div>
      )}

      {/* Real-Time Dynamic Stats */}
      <SolutionStats stats={dynamicStats} />

      {/* Main Grid: Filters + Solutions List + Matched Teams */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onApply={handleApply}
          />
        </div>

        <div className="flex-1 min-w-0">
          <SolutionList
            solutions={filteredSolutions}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        <div className="w-full lg:w-[320px] shrink-0 space-y-4">
          <TopMatchedTeam team={teamsData.top} />
          <OtherMatchedTeams teams={teamsData.other} />
        </div>
      </div>
    </div>
  );
}
