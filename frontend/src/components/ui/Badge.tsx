import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONES: Record<Tone, string> = {
  neutral:
    "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/60",
  accent:
    "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/60",
  success:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/60",
  warning:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/60",
  danger:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/60",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        TONES[tone],
        className
      )}
    >
      {dot ? (
        <span
          className={cn(
            "size-1.5 rounded-full",
            tone === "neutral" ? "bg-slate-400" : "bg-current"
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

/** Maps a recovery-event / payment status to a tone + label. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: Tone; label: string }> = {
    open: { tone: "warning", label: "In recovery" },
    closed: { tone: "success", label: "Recovered" },
    abandoned: { tone: "neutral", label: "Not recovered" },
    success: { tone: "success", label: "Paid" },
    failed: { tone: "danger", label: "Failed" },
    paid: { tone: "success", label: "Paid" },
    created: { tone: "accent", label: "Awaiting payment" },
    expired: { tone: "neutral", label: "Expired" },
    cancelled: { tone: "neutral", label: "Cancelled" },
    partially_paid: { tone: "warning", label: "Partially paid" },
  };
  const m = map[status] ?? { tone: "neutral" as Tone, label: status };
  return (
    <Badge tone={m.tone} dot>
      {m.label}
    </Badge>
  );
}
