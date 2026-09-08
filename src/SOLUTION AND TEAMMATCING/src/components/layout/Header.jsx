import {
  Search,
  Share2,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  MapPin,
  Clock,
  Link2,
  Bell,
  Users,
} from "lucide-react";
import { problemData } from "../../data/mockData";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Top bar */}
      <div className="flex items-center justify-between h-14 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems, solutions, universities, partners..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">India</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </div>

          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">Arun Mehta</p>
              <p className="text-[11px] text-gray-500 leading-tight">Government Official</p>
              <p className="text-[11px] text-gray-500 leading-tight">Ministry of Jal Shakti</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="px-6 py-4">
        {/* Breadcrumbs + Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="hover:text-cyan-600 cursor-pointer">Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-cyan-600 cursor-pointer">AI Analysis</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium">Solution & Team Matching</span>
          </div>
          <span className="text-xs text-gray-500">Thursday, 12 March 2026</span>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mt-0.5 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-gray-900 tracking-tight leading-tight">
                {problemData.title}
              </h1>
              <p className="text-[13px] text-gray-500 mt-0.5">
                {problemData.subtitle}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-[13px] text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  {problemData.location}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-[13px] font-mono text-emerald-600 font-medium">
                  #{problemData.id}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span>Submitted on {problemData.submittedDate}</span>
                <span>·</span>
                <span>Analyzed on {problemData.analyzedDate}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Matching updated {problemData.updatedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Matching Complete badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">Matching Complete</span>
              </div>
              <p className="text-[11px] text-emerald-600/70 mt-0.5 ml-7">
                Based on problem analysis, domain expertise and past project outcomes.
              </p>
            </div>
            <a href="#" className="flex items-center gap-1.5 text-sm text-cyan-600 hover:underline font-medium whitespace-nowrap">
              <Link2 className="w-4 h-4" />
              View Matching Methodology
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
