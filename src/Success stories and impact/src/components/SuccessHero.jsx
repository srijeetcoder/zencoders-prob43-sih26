import { ChevronRight } from "lucide-react";

export default function SuccessHero() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1a5c5a]">
      <div className="relative z-10 flex">
        <div className="flex-1 p-8 pl-8 pb-6">
          <nav className="flex items-center gap-1.5 text-[12px] text-white/60 mb-4">
            <span className="hover:text-white cursor-pointer transition-colors">Home</span>
            <ChevronRight size={12} />
            <span className="text-white">Success Stories</span>
          </nav>

          <h1 className="text-[28px] font-bold text-white mb-2 leading-tight">
            Success Stories & Impact
          </h1>
          <p className="text-[14px] text-white/80 mb-1 font-medium">
            Real problems. Real solutions. Real change.
          </p>
          <p className="text-[13px] text-white/60 max-w-lg leading-relaxed">
            Explore how collaboration between government, universities and industry
            is creating measurable impact across India.
          </p>
        </div>

        <div className="relative w-[420px] h-[200px] flex-shrink-0 overflow-hidden">
          <img
            src="/Assets/india-gate.jpg"
            alt="India Gate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a5c5a]/40 to-[#1a5c5a]/90" />
          <div className="absolute inset-0 flex flex-col items-end justify-center pr-6">
            <p className="text-[13px] text-white/90 italic text-right leading-relaxed max-w-[200px]">
              "Innovation in governance today, a stronger India tomorrow."
            </p>
            <p className="text-[11px] text-white/60 mt-2 text-right">
              — Government of India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
