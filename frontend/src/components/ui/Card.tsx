import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <As
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-xs",
        className
      )}
    >
      {children}
    </As>
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-paytm-cyan mb-0.5">
            {eyebrow}
          </div>
        ) : null}
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        <span className="h-3.5 w-0.5 rounded-full bg-paytm-cyan/60" aria-hidden />
        {children}
      </h2>
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </div>
  );
}
