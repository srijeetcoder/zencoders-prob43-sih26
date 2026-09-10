import { Settings } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { rootCauses } from "../../../data/aiAnalysisData";

export default function RootCauseAnalysis() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-accent-wash flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-ink">Root Cause Analysis</h2>
      </div>

      <div className="space-y-4">
        {rootCauses.map((cause) => (
          <div
            key={cause.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-line hover:border-line-strong transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
              {cause.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-ink">
                  {cause.title}
                </h3>
                <Badge variant={cause.severity}>{cause.severity}</Badge>
              </div>
              <p className="text-xs text-ink-3 mt-1.5 leading-relaxed">
                {cause.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
