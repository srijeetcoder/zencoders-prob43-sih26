import { Megaphone } from "lucide-react";
import type { UpdateEntry } from "../data/submissions";

export type { UpdateEntry };

interface LatestUpdateProps {
  update: UpdateEntry;
}

function LatestUpdate({ update }: LatestUpdateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <Megaphone className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Latest Update</h2>
      </div>

      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:gap-6">
        <p className="shrink-0 text-sm text-slate-400 sm:w-28">{update.date}</p>
        <div>
          <p className="text-sm font-bold text-slate-900">{update.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{update.description}</p>
        </div>
      </div>
    </div>
  );
}

export default LatestUpdate;
