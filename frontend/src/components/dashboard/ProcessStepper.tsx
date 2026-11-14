import {
  Search,
  Database,
  Sparkles,
  Zap,
  CheckCircle2,
  UserCheck,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Detect",
    description: "Issue from merchant\n(text/voice/app)",
    iconBg: "bg-sky-50 text-paytm-cyan border-sky-100",
  },
  {
    icon: Database,
    title: "Investigate",
    description: "Check txn, device\n& merchant context",
    iconBg: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    icon: Sparkles,
    title: "Decide",
    description: "Choose the best\nrecovery action",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: Zap,
    title: "Act",
    description: "Execute safe action\n(e.g. reset, replay)",
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
  {
    icon: CheckCircle2,
    title: "Verify",
    description: "Confirm the outcome\nwith system data",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: UserCheck,
    title: "Resolve",
    description: "Close or escalate\nto human team",
    iconBg: "bg-slate-100 text-paytm-navy border-slate-200",
  },
];

export function ProcessStepper() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      {/* Decorative top-right ambient wave */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-64 rounded-full bg-gradient-to-br from-[#E5F4FC]/80 to-transparent blur-2xl" />

      <h3 className="text-[15px] font-bold text-slate-900">
        How Paytm Saathi Resolves a Merchant Issue
      </h3>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {/* Step Icon */}
              <div
                className={`flex size-11 items-center justify-center rounded-full border shadow-2xs ${step.iconBg}`}
              >
                <Icon size={19} className="stroke-[2.2]" />
              </div>

              {/* Step Title */}
              <div className="mt-3 text-[13.5px] font-bold text-slate-800">
                {step.title}
              </div>

              {/* Step Description */}
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500 whitespace-pre-line">
                {step.description}
              </p>

              {/* Connector Arrow (desktop only) */}
              {idx < STEPS.length - 1 ? (
                <div className="absolute -right-2.5 top-3.5 hidden text-slate-300 lg:block">
                  <ArrowRight size={14} className="stroke-[2]" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

