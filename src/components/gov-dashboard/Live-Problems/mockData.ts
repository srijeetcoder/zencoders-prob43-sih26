import type { ProblemDetail } from "../types/problem";

export const PROBLEMS: ProblemDetail[] = [];

export function getProblemById(id: string) {
  return PROBLEMS.find((problem) => problem.id === id);
}