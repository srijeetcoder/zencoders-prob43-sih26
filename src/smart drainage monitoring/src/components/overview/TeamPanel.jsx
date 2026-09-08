import { Users, ArrowRight } from "lucide-react";
import { team } from "../../data/mockData";

const colorClasses = {
  blue: { bg: "bg-[#e6f2f1]", text: "text-[#1a5c5a]", border: "border-[#b8ddd9]", badge: "bg-[#d1ece9] text-[#1a5c5a]" },
  teal: { bg: "bg-[#e6f2f1]", text: "text-[#2d8a7a]", border: "border-[#b8ddd9]", badge: "bg-[#d1ece9] text-[#2d8a7a]" },
  green: { bg: "bg-[#e6f2f1]", text: "text-[#1a5c5a]", border: "border-[#b8ddd9]", badge: "bg-[#d1ece9] text-[#1a5c5a]" },
};

export default function TeamPanel() {
  const renderMember = (role, data) => {
    const colors = colorClasses[data.color];
    return (
      <div className="mb-4">
        <p className="text-[11px] text-gray-500 mb-2">{role}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center border ${colors.border}`}>
              <span className={`text-[11px] font-bold ${colors.text}`}>
                {data.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-900">{data.name}</p>
              <p className="text-[11px] text-gray-500">{data.subtitle}</p>
            </div>
          </div>
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
            {data.role}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Team</h3>
        </div>
        <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium flex items-center gap-1">
          Manage Team <ArrowRight size={12} />
        </button>
      </div>

      {renderMember("Academia Partner", team.academia)}
      {renderMember("Industry Partner", team.industry)}
      {renderMember("Government Team", team.government)}

      <button className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium mt-2">
        View all team members →
      </button>
    </div>
  );
}
