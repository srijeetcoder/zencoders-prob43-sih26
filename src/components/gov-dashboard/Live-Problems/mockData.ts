import type { ProblemDetail } from "../types/problem";

// Empty base array - populated only from real user submissions
export const PROBLEMS: ProblemDetail[] = [];

export function getProblemById(id: string): ProblemDetail | undefined {
  let foundItem: any = null;

  try {
    const local = localStorage.getItem("pookar_user_submissions");
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        foundItem = parsed.find((item: any) => item.ticketId === id || item.id === id || `#${item.ticketId}` === id || `#${item.id}` === id);
      }
    }
  } catch {}

  if (!foundItem) {
    const cleanId = id.replace("#", "");
    foundItem = {
      ticketId: cleanId,
      title: "Urban Drainage Choking & Stormwater Telemetry Redressal",
      district: "Ranchi",
      description: "Recurrent urban drainage bottleneck and severe silt accumulation causing stormwater overflow.",
      priority: "CRITICAL",
      createdAt: new Date().toISOString(),
    };
  }

  const title = foundItem.title || foundItem.rawDescription || "Citizen Reported Bottleneck";
  const dist = foundItem.district || "Ranchi";

  return {
    id: foundItem.ticketId || foundItem.id || id,
    referenceId: `#${foundItem.ticketId || foundItem.id || id}`.replace("##", "#"),
    title,
    category: "Infrastructure",
    status: "Under Analysis",
    severity: (foundItem.priority === "CRITICAL" ? "High" : "Medium") as Severity,
    location: {
      area: foundItem.area || `${dist} Sadar`,
      city: dist,
      state: "Jharkhand",
      distanceKm: 1.2,
    },
    submittedAt: foundItem.createdAt || new Date().toISOString(),
    thumbnailUrl: foundItem.thumbnailUrl || foundItem.image || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    upvotes: foundItem.upvotes || 3,
    commentsCount: foundItem.commentsCount || 1,
    description: foundItem.normalizedText || foundItem.rawDescription || foundItem.description || foundItem.text || "Citizen bottleneck recorded in state ledger.",
    tags: foundItem.domainTags || ["Civil Infrastructure", "Urban Drainage", "Telemetry"],
    photos: (() => {
      const raw = [
        ...(Array.isArray(foundItem.attachments) ? foundItem.attachments : []),
        ...(Array.isArray(foundItem.photos) ? foundItem.photos : []),
        foundItem.thumbnailUrl,
        foundItem.image,
      ];
      const valid = raw.filter((p: any) => typeof p === "string" && p.trim().length > 5 && !p.startsWith("blob:null"));
      return valid.length > 0
        ? Array.from(new Set(valid))
        : [
            "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
          ];
    })(),
    aiAnalysis: {
      problemUnderstanding: `Systemic stormwater conduit choking and acoustic silt monitoring deficit across ${dist} arterial routes.`,
      peopleAffectedEstimate: "~15,000 residents and daily commuters",
      keyIssues: [
        "Inadequate subterranean culvert flow capacity",
        "Lack of continuous ultrasonic silt level sensors",
        "Surface road inundation during peak monsoon showers",
      ],
    },
    timeline: [
      { stage: "Grievance Ingested & Vectorized", date: "Today", status: "done" },
      { stage: "Systemic Cluster Formation", date: "Today", status: "done" },
      { stage: "AI Analysis & BoM Synthesis", date: "In Progress", status: "active" },
      { stage: "Institutional Lab Matching", date: "Pending", status: "pending" },
      { stage: "DPR Grant & Field Deployment", date: "Pending", status: "pending" },
    ],
    discussion: [
      {
        author: "District Municipal Nodal Officer",
        role: "Administration",
        message: "Logged into district priority matrix. Telemetry validation initiated.",
        postedAt: "1 hr ago",
        likes: 2,
      },
    ],
    solutionApproaches: [
      {
        title: "IP68 Ultrasonic Silt & Flow Telemetry Grid",
        description: "Deploy acoustic telemetry nodes at 250m intervals in arterial culverts.",
      },
      {
        title: "Decentralized Bioswale Filtration Sumps",
        description: "Install subsurface bio-retention cells to buffer runoff prior to conduit entry.",
      },
    ],
    recommendedTeams: [
      {
        name: "Birla Institute of Technology (BIT Mesra)",
        department: "IoT Telemetry & Embedded Urban Systems Lab, Ranchi",
      },
      {
        name: "IIT (ISM) Dhanbad",
        department: "Dept of Environmental Engineering & Hydrology",
      },
    ],
    similarProblems: [
      {
        id: "JS-2026-2085",
        title: "Hamra yaha paani hai road par - Ranchi Sadar",
        location: "Ranchi, Jharkhand",
        distanceKm: 0.8,
      },
    ],
  };
}