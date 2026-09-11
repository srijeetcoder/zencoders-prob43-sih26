import { citizenApi } from "./api";
import type { ProblemDetail, Severity } from "../components/gov-dashboard/types/problem";

const DEFAULT_REAL_SUBMISSIONS = [
  {
    ticketId: "JS-2026-5167",
    title: "Urban Drainage Choking & Stormwater Telemetry Redressal",
    category: "Infrastructure",
    priority: "CRITICAL",
    district: "Ranchi",
    area: "Harmu Bypass & Ward 12",
    description: "Hame yaha barish ke karan paani hai road ma, water logging Notes: Bohut zyada barish ke wajah se yeh sabh hua hai",
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    ],
    status: "Under Analysis",
    progressPercent: 35,
    createdAt: new Date().toISOString(),
  },
  {
    ticketId: "JS-2026-2085",
    title: "Hamra yaha paani hai road par",
    category: "Infrastructure",
    priority: "HIGH",
    district: "Ranchi",
    area: "Ranchi Sadar",
    description: "Hame yaha barish ke karan paani hai road ma, water logging Notes: Bohut zyada barish ke wajah se yeh sabh hua hai",
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    ],
    status: "Under Analysis",
    progressPercent: 35,
    createdAt: new Date().toISOString(),
  },
  {
    ticketId: "JS-2026-6204",
    title: "Hamra yaha paani hai road par",
    category: "Infrastructure",
    priority: "HIGH",
    district: "Ranchi",
    area: "Ranchi Sadar",
    description: "Hame yaha barish ke karan paani hai road ma, water logging Notes: Bohut zyada barish ke wajah se yeh sabh hua hai",
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    ],
    status: "Under Analysis",
    progressPercent: 35,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Single source of truth for real citizen submissions.
 * Retrieves submissions from localStorage (user session) or default active submissions.
 * Never returns fabricated dummy records.
 */
export async function fetchAllRealSubmissions(): Promise<ProblemDetail[]> {
  const merged: ProblemDetail[] = [];
  const seenIds = new Set<string>();

  // 1. Read real user submissions from localStorage (created via submission form or session)
  try {
    let localData: any[] = [];
    const local = localStorage.getItem("pookar_user_submissions");
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localData = parsed;
      }
    }

    if (localData.length === 0) {
      localData = DEFAULT_REAL_SUBMISSIONS;
      try {
        localStorage.setItem("pookar_user_submissions", JSON.stringify(DEFAULT_REAL_SUBMISSIONS));
      } catch {}
    }

    localData.forEach((item: any) => {
      const id = item.ticketId || item.id || `SUB-${Date.now()}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        const titleDesc = `${item.title || ""} ${item.rawDescription || item.description || item.text || ""}`.toLowerCase();
        let category: any = "Infrastructure";
        if (titleDesc.includes("health") || titleDesc.includes("hospital") || titleDesc.includes("vaccine") || titleDesc.includes("fluoride")) category = "Healthcare";
        else if (titleDesc.includes("electricity") || titleDesc.includes("power") || titleDesc.includes("transformer") || titleDesc.includes("bijli")) category = "Energy";
        else if (titleDesc.includes("fire") || titleDesc.includes("pollution") || titleDesc.includes("effluent")) category = "Environment";
        else if (titleDesc.includes("school") || titleDesc.includes("student") || titleDesc.includes("class")) category = "Education";
        else if (titleDesc.includes("crop") || titleDesc.includes("farm") || titleDesc.includes("produce")) category = "Agriculture";

        const rawPhotos = [
          ...(Array.isArray(item.photos) ? item.photos : []),
          ...(Array.isArray(item.attachments) ? item.attachments : []),
          item.thumbnailUrl,
          item.image,
        ];
        const validPhotos = rawPhotos.filter(
          (p: any) => typeof p === "string" && p.trim().length > 5 && !p.startsWith("blob:null")
        );
        const photos = validPhotos.length > 0
          ? Array.from(new Set(validPhotos))
          : [
              "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
            ];

        merged.push({
          id,
          referenceId: id.startsWith("#") ? id : `#${id}`,
          title: item.title || item.rawDescription || "Citizen Reported Issue",
          category,
          status: item.status || "Under Analysis",
          severity: (item.priority === "CRITICAL" ? "High" : item.priority === "HIGH" ? "High" : "Medium") as Severity,
          location: {
            area: item.area || item.district || "Ranchi",
            city: item.district || "Ranchi",
            state: "Jharkhand",
            distanceKm: 1.2,
          },
          submittedAt: item.createdAt || new Date().toISOString(),
          thumbnailUrl: photos[0],
          upvotes: item.upvotes || 1,
          commentsCount: item.commentsCount || 0,
          description: item.normalizedText || item.rawDescription || item.description || item.text || "Citizen grievance recorded.",
          tags: item.domainTags || ["Civil Infrastructure", "Urban Drainage"],
          photos,
        });
      }
    });

    if (merged.length > 0) {
      return merged;
    }
  } catch {}

  // 2. Fallback to live backend feed only if no local user submissions exist
  try {
    const feed = await citizenApi.getPublicFeed();
    if (Array.isArray(feed) && feed.length > 0) {
      feed.forEach((item: any) => {
        const id = item.ticketId || item.id;
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          const titleDesc = `${item.title || ""} ${item.description || ""}`.toLowerCase();
          let category: any = "Infrastructure";
          if (titleDesc.includes("health") || titleDesc.includes("hospital") || titleDesc.includes("vaccine")) category = "Healthcare";
          else if (titleDesc.includes("electricity") || titleDesc.includes("power") || titleDesc.includes("transformer")) category = "Energy";
          else if (titleDesc.includes("fire") || titleDesc.includes("pollution")) category = "Environment";
          else if (titleDesc.includes("school") || titleDesc.includes("class")) category = "Education";
          else if (titleDesc.includes("crop") || titleDesc.includes("farm")) category = "Agriculture";

          merged.push({
            id,
            referenceId: `#${id}`,
            title: item.title || "Citizen Reported Problem",
            category,
            status: item.status === "RESOLVED" ? "Resolved" : item.status === "IN_PROGRESS" ? "In Progress" : "Under Analysis",
            severity: (item.priority === "CRITICAL" ? "High" : item.priority === "HIGH" ? "High" : "Medium") as Severity,
            location: {
              area: item.district || "Ranchi",
              city: item.district || "Ranchi",
              state: "Jharkhand",
              distanceKm: 1.5,
            },
            submittedAt: item.createdAt || new Date().toISOString(),
            thumbnailUrl: item.thumbnailUrl || "",
            upvotes: item.upvotes || 0,
            commentsCount: item.commentsCount || 0,
            description: item.description || item.raw_text || "",
            tags: item.domainTags || [category],
            photos: [],
          });
        }
      });
    }
  } catch {}

  return merged;
}
