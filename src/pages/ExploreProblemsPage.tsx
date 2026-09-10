import React from "react";
import Nav from "../components/landing/Nav";
import Footer from "../components/landing/Footer";
import ProblemsList from "../components/problems/ProblemsList";
import { Sparkles, Globe2 } from "lucide-react";

export default function ExploreProblemsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Nav />

      <main className="flex-1 py-10">
        <div className="container-page max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
              <Globe2 size={13} className="text-emerald-600" />
              Public Challenge Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10245e]">
              Explore Public Challenges & Societal Demands
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-3xl">
              Browse openly logged civic and societal bottlenecks from citizens across the nation. 
              Academic labs, universities, and industry partners can explore problem statements and match capabilities to drive solutions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
            <ProblemsList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
