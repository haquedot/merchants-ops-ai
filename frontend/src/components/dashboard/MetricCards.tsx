import { Headphones, CheckCircle2, Users2, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardsProps {
  issuesHandled?: number;
  autoResolved?: number;
  autoResolvedPct?: string;
  escalatedToHuman?: number;
  escalatedPct?: string;
  avgResolutionTime?: string;
}

export function MetricCards({
  issuesHandled = 1740,
  autoResolved = 1402,
  autoResolvedPct = "80.6%",
  escalatedToHuman = 338,
  escalatedPct = "19.4%",
  avgResolutionTime = "4m 26s",
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Issues Handled */}
      <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-[#F0F9FF] to-[#E5F4FC]/50 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-500">
          <div className="flex size-7 items-center justify-center rounded-full bg-sky-100/80 text-sky-600">
            <Headphones size={15} />
          </div>
          <span className="text-[13px] font-semibold text-slate-600">Issues Handled</span>
        </div>
        <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 tnum">
          {issuesHandled.toLocaleString()}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <ArrowUpRight size={14} className="stroke-[2.5]" />
          <span>+12.4%</span>
          <span className="font-normal text-slate-400">vs yesterday</span>
        </div>
      </div>

      {/* 2. Auto-Resolved */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]/40 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-500">
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-600">
            <CheckCircle2 size={15} />
          </div>
          <span className="text-[13px] font-semibold text-slate-600">Auto-Resolved</span>
        </div>
        <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 tnum">
          {autoResolved.toLocaleString()}
        </div>
        <div className="mt-2.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{autoResolvedPct}</span> resolution rate
        </div>
      </div>

      {/* 3. Escalated to Human */}
      <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]/40 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-500">
          <div className="flex size-7 items-center justify-center rounded-full bg-amber-100/80 text-amber-600">
            <Users2 size={15} />
          </div>
          <span className="text-[13px] font-semibold text-slate-600">Escalated to Human</span>
        </div>
        <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 tnum">
          {escalatedToHuman.toLocaleString()}
        </div>
        <div className="mt-2.5 flex items-center gap-1 text-xs font-medium text-amber-700">
          <span className="text-amber-500">◆</span>
          <span>{escalatedPct} of total</span>
        </div>
      </div>

      {/* 4. Avg. Resolution Time */}
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-[#FAF5FF] to-[#F3E8FF]/40 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-500">
          <div className="flex size-7 items-center justify-center rounded-full bg-purple-100/80 text-purple-600">
            <Clock size={15} />
          </div>
          <span className="text-[13px] font-semibold text-slate-600">Avg. Resolution Time</span>
        </div>
        <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 tnum">
          {avgResolutionTime}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <ArrowDownRight size={14} className="stroke-[2.5]" />
          <span>-62%</span>
          <span className="font-normal text-slate-400">vs prev. week</span>
        </div>
      </div>
    </div>
  );
}

