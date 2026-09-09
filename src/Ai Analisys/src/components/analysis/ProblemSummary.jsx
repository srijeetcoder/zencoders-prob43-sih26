import { FileText, MapPin, Folder, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { problemData } from "../../data/mockData";

export default function ProblemSummary() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent-wash flex items-center justify-center">
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-ink">Problem Summary</h2>
      </div>

      <p className="text-sm text-ink-2 leading-relaxed mb-6">
        {problemData.description}
      </p>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-line">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink-3 font-medium">Location</p>
            <p className="text-sm text-ink font-medium mt-0.5">
              {problemData.location}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Folder className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink-3 font-medium">Category</p>
            <p className="text-sm text-ink font-medium mt-0.5">
              {problemData.category}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink-3 font-medium">Severity Level</p>
            <div className="mt-1">
              <Badge variant={problemData.severity}>
                {problemData.severity}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
