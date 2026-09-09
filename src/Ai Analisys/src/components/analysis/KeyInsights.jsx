import { CloudRain, CloudLightning, Users, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import { keyInsights } from "../../data/mockData";

const iconMap = {
  "cloud-rain": CloudRain,
  "cloud-lightning": CloudLightning,
  users: Users,
  "alert-triangle": AlertTriangle,
};

const colorMap = {
  blue: "bg-cyan-50 text-cyan-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

export default function KeyInsights() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
          <span className="text-amber-500 text-xl">💡</span>
        </div>
        <h2 className="text-lg font-bold text-ink">
          Key Insights from AI Analysis
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {keyInsights.map((insight) => {
          const Icon = iconMap[insight.icon];
          return (
            <div
              key={insight.id}
              className="p-4 rounded-lg border border-line hover:border-line-strong transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    colorMap[insight.color] || colorMap.blue
                  }`}
                >
                  {Icon && <Icon className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-ink-3 mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
