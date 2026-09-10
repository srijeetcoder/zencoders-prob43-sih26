import type { ProblemDetail } from "../types/problem";

export const PROBLEMS: ProblemDetail[] = [
  {
    id: "1043",
    referenceId: "#PK-2026-1043",
    title: "Drinking Water Shortage in Ratu Road",
    category: "Infrastructure",
    status: "In Progress",
    severity: "High",
    location: { area: "Ratu Road", city: "Ranchi", state: "Jharkhand", distanceKm: 0.8 },
    submittedAt: "2026-08-02T10:24:00Z",
    thumbnailUrl: "",
    upvotes: 342,
    commentsCount: 12,
    description:
      "Residents of Ratu Road have been facing irregular and contaminated drinking water supply for over three weeks. Water tankers arrive only twice a day and supply is insufficient for 400+ households. The existing pipeline is old and leaks heavily.",
    tags: ["water", "supply", "rancid-pipeline"],
    photos: [],
    aiAnalysis: {
      problemUnderstanding:
        "Chronic water supply breakdown affecting a dense residential corridor. Leakage and poor pipeline health are primary physical causes.",
      peopleAffectedEstimate: "~1,800 residents across 400+ households",
      keyIssues: ["Aged pipeline network", "Intermittent supply schedule", "No secondary storage"],
    },
    solutionApproaches: [
      {
        title: "Pipeline Replacement Pilot",
        description:
          "Replace 2.4 km of corroded mains using SMART ductile pipes with pressure sensors.",
        imageUrl: "",
      },
      {
        title: "Community Water ATMs",
        description:
          "Install 4 solar RO water ATMs enabled for ration card billing.",
        imageUrl: "",
      },
    ],
    recommendedTeams: [
      { name: "IIT (ISM) Dhanbad", department: "Civil Engineering", logoUrl: "" },
      { name: "JUSCO Utilities", department: "Smart Water Grids", logoUrl: "" },
    ],
    discussion: [
      {
        author: "Meena Kumari",
        postedAt: "2026-08-03T09:00:00Z",
        message: "The tanker timing changed again this week, please note this.",
        likes: 21,
      },
      {
        author: "Rakesh Oraon",
        postedAt: "2026-08-04T18:30:00Z",
        message: "Ward councillor has been informed and a site inspection is scheduled.",
        likes: 14,
      },
    ],
    timeline: [
      { stage: "Reported", date: "2026-08-02", status: "done" },
      { stage: "Under Analysis", date: "2026-08-05", status: "done" },
      { stage: "Solution Planned", date: "2026-08-10", status: "done" },
      { stage: "In Progress", date: "2026-08-14", status: "active" },
    ],
    similarProblems: [
      { id: "1051", title: "Water tanker delays near Harmu", location: "Ranchi", distanceKm: 3.4, severity: "High" },
      { id: "1052", title: "Borewell contamination in Doranda", location: "Ranchi", distanceKm: 5.1, severity: "Medium" },
    ],
  },
  {
    id: "1044",
    referenceId: "#PK-2026-1044",
    title: "Broken Sewage Lines in Pardih",
    category: "Infrastructure",
    status: "Under Analysis",
    severity: "High",
    location: { area: "Pardih", city: "Jamshedpur", state: "Jharkhand", distanceKm: 1.1 },
    submittedAt: "2026-08-06T09:00:00Z",
    thumbnailUrl: "",
    upvotes: 289,
    commentsCount: 8,
    description:
      "Sewage pipeline along Pardih main road has collapsed at three points, causing wastewater overflow onto the street. Foul smell and open sewage are a health hazard for nearby schools and homes.",
    tags: ["sewage", "health", "overflow"],
    photos: [],
    aiAnalysis: {
      problemUnderstanding:
        "Multiple sewage main failures creating sanitory hazard. Requires urgent containment to prevent waterborne disease outbreak.",
      peopleAffectedEstimate: "~2,100 residents alongside the main road",
      keyIssues: ["Collapsed pipe sections", "Missing manhole covers", "Proximity to school"],
    },
    solutionApproaches: [
      {
        title: "Section Replacement + CCTV Survey",
        description:
          "Reline 600 m of trunk line with trenchless CIPP after a drone/CCTV survey.",
        imageUrl: "",
      },
    ],
    recommendedTeams: [
      { name: "NIT Jamshedpur", department: "Environmental Engineering", logoUrl: "" },
      { name: "JUSCO", department: "Sanitation & Drainage", logoUrl: "" },
    ],
    discussion: [
      {
        author: "Sanjay Verma",
        postedAt: "2026-08-06T12:00:00Z",
        message: "Children at the nearby school can't play outside because of the smell.",
        likes: 33,
      },
    ],
    timeline: [
      { stage: "Reported", date: "2026-08-06", status: "done" },
      { stage: "Under Analysis", status: "active" },
    ],
    similarProblems: [
      { id: "1053", title: "Drain overflow at Kadma", location: "Jamshedpur", distanceKm: 2.7, severity: "Medium" },
    ],
  },
  {
    id: "1045",
    referenceId: "#PK-2026-1045",
    title: "Unsafe Road near Bokaro Steel City",
    category: "Infrastructure",
    status: "Matching Teams",
    severity: "Medium",
    location: { area: "Sector 4", city: "Bokaro", state: "Jharkhand", distanceKm: 2.3 },
    submittedAt: "2026-08-04T14:30:00Z",
    thumbnailUrl: "",
    upvotes: 241,
    commentsCount: 5,
    description:
      "The internal road in Sector 4 has developed deep potholes and missing section of lane marking. Two-wheeler accidents have increased in the last month, especially after rains.",
    tags: ["road", "potholes", "accidents"],
    photos: [],
    aiAnalysis: {
      problemUnderstanding:
        "Deteriorating residential road surfacing; wet-season scouring is worsening potholes fast.",
      peopleAffectedEstimate: "~950 commuters daily",
      keyIssues: ["Pothole clusters", "No street markings", "Poor drainage on road edge"],
    },
    solutionApproaches: [
      {
        title: "CBP Green Road Paving",
        description:
          "Re-surface 1.8 km stretch with cold bituminous pavers and thermoplastic markings.",
        imageUrl: "",
      },
    ],
    recommendedTeams: [
      { name: "BIT Mesra", department: "Transportation Engineering", logoUrl: "" },
    ],
    discussion: [
      {
        author: "Poonam Singh",
        postedAt: "2026-08-05T08:15:00Z",
        message: "Please include the junction near the school in the repair scope.",
        likes: 18,
      },
    ],
    timeline: [
      { stage: "Reported", date: "2026-08-04", status: "done" },
      { stage: "Under Analysis", date: "2026-08-07", status: "done" },
      { stage: "Matching Teams", status: "active" },
    ],
    similarProblems: [
      { id: "1054", title: "Potholes on City Centre Road", location: "Bokaro", distanceKm: 1.9, severity: "Medium" },
    ],
  },
  {
    id: "1046",
    referenceId: "#PK-2026-1046",
    title: "Lack of Primary Healthcare Center",
    category: "Healthcare",
    status: "In Discussion",
    severity: "High",
    location: { area: "Kurdeg Block", city: "Simdega", state: "Jharkhand", distanceKm: 41.2 },
    submittedAt: "2026-08-03T05:00:00Z",
    thumbnailUrl: "",
    upvotes: 198,
    commentsCount: 9,
    description:
      "Kurdeg block lacks a functional PHC within 12 km. Villagers travel to Simdega Sadar hospital for even basic treatment, which is difficult for the elderly and pregnant women during monsoon.",
    tags: ["healthcare", "phc", "rural-access"],
    photos: [],
    aiAnalysis: {
      problemUnderstanding:
        "Severe healthcare access gap in a tribal-majority block; distance and seasonality amplify risk for maternal/child health.",
      peopleAffectedEstimate: "~12,000 people across 34 villages",
      keyIssues: ["No PHC in 12 km radius", "Monsoon road access", "Shortage of ANM staff"],
    },
    solutionApproaches: [
      {
        title: "Mobile Health Units (48 hrs)",
        description:
          "Deploy 2 MHUs with telemedicine while a PHC building is tendered.",
        imageUrl: "",
      },
      {
        title: "Ayushman Health & Wellness Centre",
        description:
          "Upgrade a government school wing into a model wellness centre.",
        imageUrl: "",
      },
    ],
    recommendedTeams: [
      { name: "RIMS Ranchi", department: "Community Medicine", logoUrl: "" },
      { name: "XISS Ranchi", department: "Rural Health Analytics", logoUrl: "" },
    ],
    discussion: [
      {
        author: "Mukesh Bhagat",
        postedAt: "2026-08-03T14:00:00Z",
        message: "Many tribal hamlets are disconnected during rains. MHUs would help immediately.",
        likes: 27,
      },
    ],
    timeline: [
      { stage: "Reported", date: "2026-08-03", status: "done" },
      { stage: "Under Analysis", date: "2026-08-06", status: "done" },
      { stage: "In Discussion", status: "active" },
    ],
    similarProblems: [
      { id: "1055", title: "ANM vacancy at Bano PHC", location: "Gumla", distanceKm: 63.0, severity: "High" },
    ],
  },
  {
    id: "1047",
    referenceId: "#PK-2026-1047",
    title: "Waste Management in Local Market",
    category: "Environment",
    status: "Solution Planned",
    severity: "Medium",
    location: { area: "Sadar Bazar", city: "Hazaribagh", state: "Jharkhand", distanceKm: 6.4 },
    submittedAt: "2026-08-01T11:15:00Z",
    thumbnailUrl: "",
    upvotes: 167,
    commentsCount: 6,
    description:
      "Daily vegetable and meat waste from Sadar Bazar is dumped on the roadside, attracting stray animals and causing odour. There is no segregated collection system for organic waste.",
    tags: ["garbage", "market", "segregation"],
    photos: [],
    aiAnalysis: {
      problemUnderstanding:
        "Unsegregated market waste stream; organic fraction >60% that can be composted locally.",
      peopleAffectedEstimate: "~3,000 market users daily",
      keyIssues: ["No segregation at source", "No compost facility", "Informal disposal habit"],
    },
    solutionApproaches: [
      {
        title: "Ward-Level Composting Hub",
        description:
          "Build a small aerobic compost yard with pushcart segregation system.",
        imageUrl: "",
      },
    ],
    recommendedTeams: [
      { name: "IIC-ECOTECH, BIT Mesra", department: "Solid Waste", logoUrl: "" },
    ],
    discussion: [
      {
        author: "Farzana Khatoon",
        postedAt: "2026-08-02T10:00:00Z",
        message: "Market association is willing to run the segregation pushcarts themselves.",
        likes: 11,
      },
    ],
    timeline: [
      { stage: "Reported", date: "2026-08-01", status: "done" },
      { stage: "Under Analysis", date: "2026-08-04", status: "done" },
      { stage: "Solution Planned", status: "active" },
    ],
    similarProblems: [
      { id: "1056", title: "Burning of leaves in Civic Line", location: "Hazaribagh", distanceKm: 3.2, severity: "Low" },
    ],
  },
  {
    id: "1048",
    referenceId: "#PK-2026-1048",
    title: "Need for Smart Classrooms",
    category: "Education",
    status: "Under Analysis",
    severity: "Low",
    location: { area: "Ranishwar", city: "Dumka", state: "Jharkhand", distanceKm: 22.1 },
    submittedAt: "2026-07-28T08:45:00Z",
    thumbnailUrl: "",
    upvotes: 92,
    commentsCount: 4,
    description:
      "The upgradable middle school in Ranishwar has no digital learning infrastructure. Teachers use blackboards only; students lack access to NCERT digital content despite functional solar power at the school.",
    tags: ["education", "digital", "school"],
    photos: [],
    aiAnalysis: {
      problemUnderstanding:
        "Digital access gap in school despite existing solar power — low-hanging infrastructure win.",
      peopleAffectedEstimate: "~420 students across 12 classes",
      keyIssues: ["No smart panels", "No internet/ed-tech training", "Solar power underused"],
    },
    solutionApproaches: [
      {
        title: "Solar-Powered Smart Desk Program",
        description:
          "Equip 2 classrooms with low-power interactive panels + offline NCERT content via local server.",
        imageUrl: "",
      },
    ],
    recommendedTeams: [
      { name: "Ranchi University", department: "Educational Technology", logoUrl: "" },
    ],
    discussion: [
      {
        author: "Asha Tudu",
        postedAt: "2026-07-29T09:30:00Z",
        message: "Offline content matters — internet is unreliable here.",
        likes: 9,
      },
    ],
    timeline: [
      { stage: "Reported", date: "2026-07-28", status: "done" },
      { stage: "Under Analysis", status: "active" },
    ],
    similarProblems: [
      { id: "1057", title: "Library books shortage in Jama", location: "Dumka", distanceKm: 15.6, severity: "Low" },
    ],
  },
];

export function getProblemById(id: string) {
  return PROBLEMS.find((problem) => problem.id === id);
}