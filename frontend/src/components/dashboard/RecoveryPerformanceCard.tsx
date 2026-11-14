import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { rupeesCompact } from "@/lib/format";

interface RecoveryPerformanceProps {
  recoveredPaise?: number;
  atRiskPaise?: number;
  treatmentRate?: number;
  controlRate?: number;
  absoluteLift?: number;
}

export function RecoveryPerformanceCard({
  recoveredPaise = 15900000, // ₹1.59 L
  atRiskPaise = 133400000,   // ₹13.34 L
  treatmentRate = 0.135,     // 13.5%
  controlRate = 0.033,       // 3.3%
  absoluteLift = 0.102,      // +10.2pp
}: RecoveryPerformanceProps) {
  const [activeTab, setActiveTab] = useState<"revenue" | "issues">("revenue");

  // Format values
  const recoveredFormatted = rupeesCompact(recoveredPaise / 100);
  const atRiskFormatted = rupeesCompact(atRiskPaise / 100);
  const treatmentPct = (treatmentRate * 100).toFixed(1);
  const controlPct = (controlRate * 100).toFixed(1);
  const liftPp = (absoluteLift * 100).toFixed(1);

  // Axis maximum scale
  const maxScale = 14;
  const treatmentWidth = Math.min(100, (Number(treatmentPct) / maxScale) * 100);
  const controlWidth = Math.min(100, (Number(controlPct) / maxScale) * 100);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div>
        {/* Header with Segmented Tabs */}
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-900">
            Recovery Performance
          </h3>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/70 p-0.5">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                activeTab === "revenue"
                  ? "bg-white text-paytm-navy shadow-xs border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Revenue Recovered
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                activeTab === "issues"
                  ? "bg-white text-paytm-navy shadow-xs border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Issues Resolved
            </button>
          </div>
        </div>

        {/* Hero Value & Lift Pill */}
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <div className="text-3xl font-extrabold tracking-tight text-paytm-navy tnum">
            {activeTab === "revenue" ? "₹1,59 L" : "1,402"}
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
            <ArrowUpRight size={13} className="stroke-[2.5]" />
            <span>+{liftPp}pp</span>
            <span className="font-normal text-emerald-600/80">vs control</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-5 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-paytm-cyan" />
            <span>AI-driven ({recoveredFormatted})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-slate-300" />
            <span>Control ({atRiskFormatted} at risk)</span>
          </div>
        </div>
      </div>

      {/* Comparative Horizontal Bars */}
      <div className="mt-6 space-y-4">
        {/* AI-Driven Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span className="w-16">AI-driven</span>
            <div className="relative flex-1 px-2">
              <div className="h-6 w-full rounded-md bg-slate-50">
                <div
                  className="h-full rounded-md bg-paytm-cyan transition-all duration-700"
                  style={{ width: `${treatmentWidth}%` }}
                />
              </div>
            </div>
            <span className="w-12 text-right font-bold text-slate-900 tnum">
              {treatmentPct}%
            </span>
          </div>
        </div>

        {/* Control Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700">
            <span className="w-16">Control</span>
            <div className="relative flex-1 px-2">
              <div className="h-6 w-full rounded-md bg-slate-50">
                <div
                  className="h-full rounded-md bg-slate-300 transition-all duration-700"
                  style={{ width: `${controlWidth}%` }}
                />
              </div>
            </div>
            <span className="w-12 text-right font-bold text-slate-700 tnum">
              {controlPct}%
            </span>
          </div>
        </div>

        {/* Axis Ticks */}
        <div className="flex justify-between pl-16 pr-12 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400">
          <span>0%</span>
          <span>2%</span>
          <span>4%</span>
          <span>6%</span>
          <span>8%</span>
          <span>10%</span>
          <span>12%</span>
          <span>14%</span>
        </div>
      </div>
    </div>
  );
}

