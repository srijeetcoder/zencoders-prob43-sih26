import type {
  LiveProblem,
  TeamApplication,
  ProblemSolutionPlan,
  ResourceItem,
  AlertNotification,
} from "../types";

export const INITIAL_LIVE_PROBLEMS: LiveProblem[] = [];

export const INITIAL_APPLICATIONS: TeamApplication[] = [];

export const INITIAL_PLANS: ProblemSolutionPlan[] = [];

export const INITIAL_RESOURCES: ResourceItem[] = [];

export const INITIAL_ALERTS: AlertNotification[] = [];

// LocalStorage Persistence Helpers
export const getStoredProblems = (): LiveProblem[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_problems");
    return raw ? JSON.parse(raw) : INITIAL_LIVE_PROBLEMS;
  } catch {
    return INITIAL_LIVE_PROBLEMS;
  }
};

export const saveProblems = (problems: LiveProblem[]) => {
  try {
    localStorage.setItem("pookar_univ_problems", JSON.stringify(problems));
  } catch (e) {
    console.error("Failed to persist problems", e);
  }
};

export const getStoredApplications = (): TeamApplication[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_teams");
    return raw ? JSON.parse(raw) : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

export const saveApplications = (teams: TeamApplication[]) => {
  try {
    localStorage.setItem("pookar_univ_teams", JSON.stringify(teams));
  } catch (e) {
    console.error("Failed to persist team applications", e);
  }
};

export const getStoredPlans = (): ProblemSolutionPlan[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_plans");
    return raw ? JSON.parse(raw) : INITIAL_PLANS;
  } catch {
    return INITIAL_PLANS;
  }
};

export const savePlans = (plans: ProblemSolutionPlan[]) => {
  try {
    localStorage.setItem("pookar_univ_plans", JSON.stringify(plans));
  } catch (e) {
    console.error("Failed to persist solution plans", e);
  }
};

export const getStoredAlerts = (): AlertNotification[] => {
  try {
    const raw = localStorage.getItem("pookar_univ_alerts");
    return raw ? JSON.parse(raw) : INITIAL_ALERTS;
  } catch {
    return INITIAL_ALERTS;
  }
};

export const saveAlerts = (alerts: AlertNotification[]) => {
  try {
    localStorage.setItem("pookar_univ_alerts", JSON.stringify(alerts));
  } catch (e) {
    console.error("Failed to persist alerts", e);
  }
};
