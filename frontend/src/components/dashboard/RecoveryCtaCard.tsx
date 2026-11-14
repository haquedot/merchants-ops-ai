import { Link } from "react-router-dom";
import { ArrowRight, Wifi } from "lucide-react";
import { VERIFIED_RECOVERY_EVENT_ID } from "@/lib/config";

export function RecoveryCtaCard() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-sky-200/70 bg-sky-50 p-6 shadow-xs">
      {/* Decorative top-right radio wave indicator */}
      <div className="absolute right-4 top-4 text-sky-400/80">
        <Wifi size={20} className="rotate-45" />
      </div>

      <div className="relative z-10 max-w-[230px]">
        <h3 className="text-xl font-bold tracking-tight text-paytm-navy">
          Run a Recovery with AI
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Investigate a merchant issue, take action, and get a verified resolution.
        </p>

        <div className="mt-6">
          <Link
            to={`/recoveries/${VERIFIED_RECOVERY_EVENT_ID}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#002970] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#002970]-hover hover:shadow-sm active:scale-98"
          >
            <span>Open Recovery</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 3D Soundbox Image Asset */}
      <div className="pointer-events-none absolute -bottom-2 -right-1 z-0 w-36 sm:w-40">
        <img
          src="/images/soundbox.png"
          alt="Paytm Soundbox Device"
          className="h-auto w-full object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}

