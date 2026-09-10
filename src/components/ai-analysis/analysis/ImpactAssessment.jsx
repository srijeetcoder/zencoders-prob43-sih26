import { Users, Clock, DollarSign, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import { impactData } from "../../../data/aiAnalysisData";

const stats = [
  {
    icon: Users,
    value: impactData.peopleAffected,
    label: impactData.peopleLabel,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Clock,
    value: impactData.avgDisruption,
    label: impactData.disruptionLabel,
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: DollarSign,
    value: impactData.economicLoss,
    label: impactData.lossLabel,
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: AlertTriangle,
    value: impactData.healthRisk,
    label: impactData.healthLabel,
    color: "bg-red-50 text-red-600",
  },
];

export default function ImpactAssessment() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-accent-wash flex items-center justify-center">
          <span className="text-accent text-lg">📊</span>
        </div>
        <h2 className="text-lg font-bold text-ink">Impact Assessment</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-ink leading-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-ink-3 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
