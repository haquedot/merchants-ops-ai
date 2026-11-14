import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stat({
  label,
  value,
  sub,
  delta,
  hero = false,
  tone = "neutral",
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  delta?: { value: string; positive: boolean } | null;
  hero?: boolean;
  tone?: "neutral" | "success" | "warning" | "accent" | "danger";
  className?: string;
}) {
  const toneText =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : tone === "danger"
          ? "text-red-600"
          : tone === "accent"
            ? "text-paytm-cyan"
            : "text-slate-900";
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs",
        className
      )}
    >
      <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-2 tracking-tight tnum",
          hero
            ? "text-[clamp(1.9rem,4vw,2.9rem)] font-bold leading-none"
            : "text-2xl font-semibold",
          toneText
        )}
      >
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[13px]">
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium tnum",
              delta.positive ? "text-emerald-600" : "text-red-600"
            )}
          >
            {delta.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta.value}
          </span>
        ) : null}
        {sub ? <span className="text-slate-500">{sub}</span> : null}
      </div>
    </div>
  );
}
