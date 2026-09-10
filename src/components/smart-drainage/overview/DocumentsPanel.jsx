import { useState } from "react";
import { FileText, Download, MoreVertical, Upload, CheckCircle } from "lucide-react";
import { documents } from "../../../data/smartDrainageData";
import { institutionApi } from "../../../services/api";

const typeColors = {
  pdf: { bg: "bg-red-50", text: "text-red-600", label: "PDF" },
  xlsx: { bg: "bg-[#e6f2f1]", text: "text-[#1a5c5a]", label: "XLSX" },
};

export default function DocumentsPanel() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadDPR = async () => {
    setDownloading(true);
    try {
      const dpr = await institutionApi.getDPR("JS-2026-8812");
      const blob = new Blob([JSON.stringify(dpr, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bankable_DPR_JS-2026-8812.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-500" />
          <h3 className="text-[14px] font-semibold text-gray-900">Engineering Documents & DPR</h3>
        </div>
        <button
          onClick={handleDownloadDPR}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a5c5a] text-white text-[11px] font-medium rounded-lg hover:bg-[#15524f] transition-all disabled:opacity-60"
        >
          <Download size={12} />
          {downloading ? "Generating..." : "Export Live DPR"}
        </button>
      </div>

      <div className="space-y-0">
        {documents.map((doc, i) => {
          const typeStyle = typeColors[doc.type] || typeColors.pdf;
          return (
            <div
              key={doc.id}
              className={`flex items-center justify-between py-2.5 ${
                i < documents.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${typeStyle.bg} flex items-center justify-center`}>
                  <FileText size={16} className={typeStyle.text} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-800">{doc.name}</p>
                  <p className="text-[11px] text-gray-400">{doc.size} · {doc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDownloadDPR}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1a5c5a] hover:bg-gray-100 rounded"
                  title="Download Artifact"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleDownloadDPR}
        className="text-[12px] text-[#1a5c5a] hover:text-[#15524f] font-medium mt-3 flex items-center gap-1"
      >
        <span>Download Full Technical Specification (JSON) →</span>
      </button>
    </div>
  );
}

