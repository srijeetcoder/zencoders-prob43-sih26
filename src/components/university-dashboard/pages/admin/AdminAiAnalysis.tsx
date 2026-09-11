import { useState } from "react";
import { Brain, Sparkles, ShieldCheck, CheckCircle2, Search, Layers, FileText, ArrowRight } from "lucide-react";

export default function AdminAiAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleRunDeepAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Brain size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
              Institutional AI Analysis & Intellectual Property Hub
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Cross-departmental engineering synthesis, patent novelty benchmarking, and state development alignment scoring.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunDeepAnalysis}
          disabled={analyzing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Sparkles size={14} />
          <span>{analyzing ? "Running Cross-Lab Synthesis..." : "Run Institutional AI Synthesis"}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Patent Novelty Index</span>
            <span className="text-emerald-700 font-mono">92%</span>
          </div>
          <p className="text-lg font-bold text-[#10245e]">High IP Uniqueness</p>
          <p className="text-xs text-slate-500">
            Zero prior-art patent collisions in Indian Patent Office (IPO) database for LoRaWAN dual ultrasonic silt profiler.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>State Priority Alignment</span>
            <span className="text-indigo-700 font-mono">96/100</span>
          </div>
          <p className="text-lg font-bold text-[#10245e]">Tier-1 Civic Urgency</p>
          <p className="text-xs text-slate-500">
            Directly redresses Ranchi Municipal Corporation Ward 24 monsoon inundation mandate and Disaster Management targets.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Commercial Feasibility</span>
            <span className="text-amber-700 font-mono">88%</span>
          </div>
          <p className="text-lg font-bold text-[#10245e]">Commercial Bankability</p>
          <p className="text-xs text-slate-500">
            Projected production cost (₹ 14,900/node) is 64% cheaper than imported SCADA flow monitors with 5-year battery reserve.
          </p>
        </div>
      </div>

      {/* Synthesis Details */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers size={16} className="text-indigo-600" />
          <span>Cross-Departmental Synergy Recommendations</span>
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#10245e]">
                Synergy 1: IoT Hydrology Lab &bull; Renewable Energy Center
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                High Synergistic Value
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrate Dr. Sunita Murmu's high-efficiency MPPT solar firmware with Team HydroSense's ultrasonic nodes to reduce battery mass by 35% during prolonged monsoon overcast.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#10245e]">
                Synergy 2: CSIR-CIMFR Dhanbad &bull; BIT Mesra Embedded Center
              </span>
              <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                Joint Field Trial
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share Jharia mine thermal mesh sensor telemetry with Ranchi municipal telemetry gateways for unified state emergency dispatch protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
