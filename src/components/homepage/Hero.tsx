import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, MapPin, Users, Cpu } from "lucide-react";

function Hero() {
  return (
    <section className="px-8 pt-4 pb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1f54] via-[#10245e] to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
        {/* Background decorative effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-64 w-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30 mb-5">
              <Sparkles size={14} className="text-emerald-400" />
              <span>PooKar • Autonomous Civic Intelligence & Governance Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Empowering Jharkhand. <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Civic Redressal & AI War Room.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
              Submit local problems with geotagged evidence, track live government progression stages in real time, and match university R&D consortiums with sanctioned state DPRs.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                to="/problem"
                className="
                  inline-flex items-center gap-2 rounded-xl
                  bg-gradient-to-r from-emerald-500 to-teal-600
                  px-6 py-3.5
                  text-sm font-bold text-white shadow-lg shadow-emerald-900/30
                  hover:from-emerald-600 hover:to-teal-700
                  transition-all duration-200 hover:scale-[1.02]
                "
              >
                <span>Report a Civic Problem</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/gov/ai-analysis"
                className="
                  inline-flex items-center gap-2 rounded-xl
                  bg-white/10 backdrop-blur-md
                  px-5 py-3.5
                  text-sm font-semibold text-white
                  border border-white/20
                  hover:bg-white/20 hover:border-white/30
                  transition-all duration-200
                "
              >
                <Cpu size={16} className="text-emerald-300" />
                <span>Government AI War Room</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-300">24</span>
                <p className="text-[11px] text-slate-400 font-medium">Districts Integrated</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-teal-300">100%</span>
                <p className="text-[11px] text-slate-400 font-medium">Real-Time Ledger</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-cyan-300">RAG + TRL</span>
                <p className="text-[11px] text-slate-400 font-medium">Verified Solutions</p>
              </div>
            </div>
          </div>

          {/* Right Visual / Image Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md p-3 shadow-2xl">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80"
                  alt="Jharkhand Urban Infrastructure"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-400" />
                    <span className="font-semibold">Ranchi Municipal Command</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/80 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold">
                    Live Telemetry
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2 bg-white/10 backdrop-blur-xs rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium text-slate-200">SDRMF Statutory Protocol Active</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300">SLA: 3 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

