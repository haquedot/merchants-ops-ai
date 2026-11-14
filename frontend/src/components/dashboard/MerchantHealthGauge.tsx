import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

interface MerchantHealthProps {
  healthPct?: number; // 92
  healthyCount?: number; // 36824
  atRiskCount?: number; // 2346
  issueCount?: number; // 1971
}

export function MerchantHealthGauge({
  healthPct = 92,
  healthyCount = 36824,
  atRiskCount = 2346,
  issueCount = 1971,
}: MerchantHealthProps) {
  // SVG Semi-Circle Arc Calculation
  const width = 180;
  const height = 110;
  const strokeWidth = 16;
  const radius = 70;
  const cx = width / 2;
  const cy = height - 10;

  // Half-circle circumference is PI * radius
  const halfCircumference = Math.PI * radius;
  const progressOffset = halfCircumference * (1 - healthPct / 100);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Merchant Health
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Overall device & payment health
            </p>
          </div>
          <Link
            to="/merchants"
            className="inline-flex items-center gap-1 text-xs font-semibold text-paytm-cyan hover:text-sky-600 transition-colors"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {/* Content: Gauge + Breakdown */}
        <div className="mt-4 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Semi-Circle SVG Gauge */}
          <div className="relative flex flex-col items-center justify-end">
            <svg width={width} height={height} className="overflow-visible">
              {/* Background semi-circle track */}
              <path
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Foreground green arc */}
              <path
                d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                fill="none"
                stroke="#16A34A"
                strokeWidth={strokeWidth}
                strokeDasharray={halfCircumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Gauge Center Callout */}
            <div className="absolute bottom-1 flex flex-col items-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tnum">
                {healthPct}%
              </span>
              <span className="text-[11.5px] font-medium text-slate-500">
                Healthy Merchants
              </span>
            </div>
          </div>

          {/* Status Breakdown List */}
          <div className="flex w-full flex-col justify-center space-y-3 sm:w-auto">
            {/* Healthy */}
            <div className="flex items-center justify-between gap-8 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <CheckCircle2 size={15} className="text-[#16A34A]" />
                <span>Healthy</span>
              </div>
              <span className="font-bold text-slate-900 tnum">
                {healthyCount.toLocaleString()}
              </span>
            </div>

            {/* At Risk */}
            <div className="flex items-center justify-between gap-8 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <AlertTriangle size={15} className="text-[#F59E0B]" />
                <span>At Risk</span>
              </div>
              <span className="font-bold text-slate-900 tnum">
                {atRiskCount.toLocaleString()}
              </span>
            </div>

            {/* Issue */}
            <div className="flex items-center justify-between gap-8 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <XCircle size={15} className="text-[#DC2626]" />
                <span>Issue</span>
              </div>
              <span className="font-bold text-slate-900 tnum">
                {issueCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

