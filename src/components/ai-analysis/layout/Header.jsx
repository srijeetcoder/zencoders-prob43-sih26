import {
  Search,
  Download,
  Share2,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { problemData } from "../../../data/aiAnalysisData";

export default function Header() {
  return (
    <header className="bg-white border-b border-line sticky top-0 z-40">
      <div className="flex items-center justify-between h-14 px-6 border-b border-line">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <Search className="w-4 h-4 text-ink-3" />
          <input
            type="text"
            placeholder="Search problems, locations, keywords..."
            className="w-full text-sm bg-transparent outline-none placeholder:text-ink-3"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-ink-2">
            <MapPin className="w-4 h-4" />
            <span>India</span>
            <ChevronRight className="w-3 h-3 text-ink-3" />
          </div>

          <div className="relative">
            <Bell className="w-5 h-5 text-ink-2 cursor-pointer hover:text-ink transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </div>

          <Link to="/userdashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-ink leading-tight">
                Arun Mehta
              </p>
              <p className="text-[11px] text-ink-3 leading-tight">
                Government Official
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-ink-3 mb-3">
          <Link to="/" className="hover:text-accent cursor-pointer">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/trackprogress" className="hover:text-accent cursor-pointer">
            Citizen Submissions
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/problemlist" className="hover:text-accent cursor-pointer">
            Water Logging in Ward 12
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink font-medium">AI Analysis</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-wash flex items-center justify-center mt-0.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-lg">✦</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink tracking-tight">
                {problemData.title}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-ink-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {problemData.location}
                </span>
                <span className="text-sm text-ink-3">|</span>
                <span className="text-sm font-mono text-accent">
                  Submission ID: #{problemData.id}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-ink-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Submitted on {problemData.submittedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Analyzed on {problemData.analyzedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-success-wash text-success px-3 py-1.5 rounded-lg text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Analysis Complete
            </div>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Analysis Methodology
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-line rounded-lg hover:bg-paper-3 transition-colors">
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-line rounded-lg hover:bg-paper-3 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="p-2 border border-line rounded-lg hover:bg-paper-3 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
