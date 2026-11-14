import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col select-none", className)}>
      <div className="flex items-center gap-1.5">
        <img
          src="/logos/logo.png"
          alt="Paytm"
          className="h-8 w-auto object-contain"
        />
      </div>
      <span className="text-[10.5px] font-medium tracking-tight text-ink-muted">
        AI Merchant Operations
      </span>
    </div>
  );
}
