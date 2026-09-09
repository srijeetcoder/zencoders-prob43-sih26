import { ArrowRight } from "lucide-react";

function SustainableSolutions() {
  return (
    <div
      className="relative h-full min-h-[180px] overflow-hidden rounded-xl border border-slate-200 mx-5 my-1 shadow-sm"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=500&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-5">
        <h3 className="max-w-[220px] text-lg font-semibold leading-snug text-white">
          Sustainable Solutions for a Better Tomorrow
        </h3>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          View Impact Stories
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default SustainableSolutions;
