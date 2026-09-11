import type { ProblemDetail } from "../types/problem";

// Empty base array - populated only from real user submissions
export const PROBLEMS: ProblemDetail[] = [];

export function getProblemById(id: string): ProblemDetail | undefined {
  try {
    const local = localStorage.getItem("pookar_user_submissions");
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const found = parsed.find((item: any) => item.ticketId === id || item.id === id || `#${item.ticketId}` === id);
        if (found) {
          return {
            id: found.ticketId || found.id,
            referenceId: `#${found.ticketId || found.id}`,
            title: found.title || found.rawDescription || "Citizen Problem",
            category: "Infrastructure",
            status: "Under Analysis",
            severity: "High",
            location: {
              area: found.district || "Ranchi",
              city: found.district || "Ranchi",
              state: "Jharkhand",
              distanceKm: 1.2,
            },
            submittedAt: found.createdAt || new Date().toISOString(),
            thumbnailUrl: "",
            upvotes: 1,
            commentsCount: 0,
            description: found.normalizedText || found.rawDescription || found.text || "",
            tags: found.domainTags || ["Civic Infrastructure"],
            photos: [],
          };
        }
      }
    }
  } catch {}

  return PROBLEMS.find((problem) => problem.id === id || problem.referenceId === id);
}