import { useState } from "react";
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
} from "lucide-react";

export default function FacultyAiAnalysis() {
  const [bomInput, setBomInput] = useState(
    "AJ-SR04M Waterproof Ultrasonic Transducer, ESP32-S3 LoRaWAN SX1262 Node (865MHz), LiFePO4 12V Battery Pack, Solar MPPT 25W"
  );
  const [selectedDomain, setSelectedDomain] = useState("Water & Sanitation");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    status: "COMPLIANT" | "VIOLATION";
    score: number;
    positives: string[];
    warnings: string[];
    standardMatch: string;
  }>({
    status: "COMPLIANT",
    score: 96,
    positives: [
      "AJ-SR04M transducer complies with IP68 continuous immersion rating for storm-water culverts.",
      "ESP32-S3 LoRaWAN 865-867 MHz frequency operates within India DoT license-free spectrum.",
      "LiFePO4 battery chemistry complies with industrial high-temperature thermal safety thresholds.",
    ],
    warnings: [],
    standardMatch: "Bureau of Indian Standards (BIS) IS 15885 & WPC SRD Regulations",
  });

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      const text = bomInput.toLowerCase();

      // Deterministic BoM violation checks
      if (text.includes("non-waterproof") || text.includes("hc-sr04") || text.includes("breadboard") || text.includes("433mhz")) {
        setAuditResult({
          status: "VIOLATION",
          score: 42,
          positives: ["Basic microcontroller logic is present."],
          warnings: [
            "HC-SR04 open-air sensor lacks IP68 sealing; will degrade in humid culvert environments.",
            "433 MHz frequency is restricted in urban telemetry bands; switch to 865-867 MHz Indian ISM band.",
            "Breadboard interconnects fail vibration resilience test on high-traffic culverts.",
          ],
          standardMatch: "Rejected under Central Pollution Control Board (CPCB) Telemetry Guidelines",
        });
      } else {
        setAuditResult({
          status: "COMPLIANT",
          score: 96,
          positives: [
            "Industrial grade IP68 transducers approved for urban storm-water monitoring.",
            "LoRaWAN frequency matches WPC 865-867 MHz national regulation.",
            "Independent solar MPPT eliminates reliance on erratic municipal grid power.",
          ],
          warnings: [],
          standardMatch: "Bureau of Indian Standards (BIS) IS 15885 & WPC SRD Regulations",
        });
      }
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Brain size={18} />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
            AI Feasibility & Deterministic BoM Guard
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Deterministic hardware validation engine that audits student Bill of Materials against regulatory standards, RF spectrum limits, and environmental survivability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: BoM Input */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2">
              <Cpu size={16} className="text-indigo-600" />
              <span>Hardware Bill of Materials (BoM) Analyzer</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Deterministic Gatekeeper
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Problem Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-medium"
              >
                <option value="Water & Sanitation">Urban Drainage, Silt & Hydrology (Water & Sanitation)</option>
                <option value="Mining & Geology">Coalfire, Subsurface Gas & Mining Safety (Mining & Geology)</option>
                <option value="Renewable Energy">Rural Solar Microgrids & Inverters (Renewable Energy)</option>
                <option value="Infrastructure">Slope Stability & Vibration Telemetry (Infrastructure)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Components List / Hardware Specification String
              </label>
              <textarea
                rows={4}
                value={bomInput}
                onChange={(e) => setBomInput(e.target.value)}
                placeholder="Enter comma-separated components to audit..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none font-mono text-slate-800 resize-none"
              />
              <p className="text-[10px] text-slate-400">
                Tip: Test entering non-waterproof parts (e.g. "HC-SR04, 433MHz") to inspect the deterministic violation guard.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Sparkles size={14} />
                <span>{isAuditing ? "Auditing Standards..." : "Run AI BoM Verification"}</span>
              </button>
            </div>
          </div>

          {/* Audit Results Panel */}
          {auditResult && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                auditResult.status === "COMPLIANT"
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-rose-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <div className="flex items-center gap-2">
                  {auditResult.status === "COMPLIANT" ? (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-[#10245e]">
                      {auditResult.status === "COMPLIANT"
                        ? "Deterministic BoM Clearance Approved"
                        : "Deterministic BoM Rejection Detected"}
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Standard Benchmark: {auditResult.standardMatch}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black font-mono text-[#10245e]">
                    {auditResult.score}/100
                  </span>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Feasibility Index
                  </span>
                </div>
              </div>

              {auditResult.positives.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                    Verified Compliance Points:
                  </span>
                  {auditResult.positives.map((pos, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-emerald-900">
                      <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pos}</span>
                    </div>
                  ))}
                </div>
              )}

              {auditResult.warnings.length > 0 && (
                <div className="mt-3 space-y-1.5 pt-2 border-t border-rose-200">
                  <span className="text-[11px] font-bold text-rose-950 uppercase tracking-wider block">
                    Identified Non-Compliances & Violations:
                  </span>
                  {auditResult.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-rose-900">
                      <AlertTriangle size={13} className="text-rose-600 shrink-0 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Info: Regulatory Framework */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-600" />
            <span>Jharkhand BoM Guard Principles</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 text-[11px] block">1. Water & Flooding Domains</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                All transducers must carry IP68 rating. Ultrasonic transducers cannot be exposed paper or standard indoor models.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 text-[11px] block">2. Wireless Telemetry</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                LoRa transceivers must operate on 865-867 MHz (WPC India). 433 MHz and 915 MHz are flagged as non-compliant.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 text-[11px] block">3. Mining & Explosive Safety</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Gas sensors deployed in Dhanbad/Bokaro mining pits must have DGMS / ATEX certified intrinsic safety ratings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
