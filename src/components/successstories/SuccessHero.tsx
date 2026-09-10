import { ChevronRight, FilePlus2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessHero() {
  return (
    <section className="px-8 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-emerald-50 px-8 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <nav className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Link to="/main" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-emerald-700">Success Stories</span>
            </nav>

            <h1 className="text-4xl font-bold leading-tight text-[#10245e]">
              Success Stories & <span className="text-[#087f5b]">Impact</span>
            </h1>

            <p className="mt-2 text-base font-semibold text-emerald-700">
              Real problems. Real solutions. Real change.
            </p>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Explore how collaboration between citizens, universities, and industry partners
              is creating measurable impact across communities.
            </p>
          </div>

          <div className="relative h-44 w-full flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm lg:w-80">
            <div className="flex h-full flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-emerald-600">PooKar Vision</span>
                <p className="mt-1 text-xs italic text-slate-600">
                  "Innovation in governance today, a stronger community tomorrow."
                </p>
              </div>
              <p className="text-[11px] font-semibold text-[#10245e]">
                — Government & Citizen Partnership
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
