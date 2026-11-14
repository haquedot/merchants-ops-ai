import { Calendar, ChevronDown } from "lucide-react";
import { Page } from "@/components/layout/Shell";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ProcessStepper } from "@/components/dashboard/ProcessStepper";
import { RecoveryPerformanceCard } from "@/components/dashboard/RecoveryPerformanceCard";
import { RecoveryEventsDonut } from "@/components/dashboard/RecoveryEventsDonut";
import { InterventionPerformance } from "@/components/dashboard/InterventionPerformance";
import { MerchantHealthGauge } from "@/components/dashboard/MerchantHealthGauge";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { RecoveryCtaCard } from "@/components/dashboard/RecoveryCtaCard";
import {
  useSummary,
  useControlVsTreatment,
  useRecoveryImpact,
} from "@/lib/queries";

export default function Overview() {
  const summary = useSummary();
  const cvt = useControlVsTreatment();
  const impact = useRecoveryImpact();

  const s = summary.data;
  const issuesHandled = s ? s.total_recovery_events : 1740;
  const recoveredCount = s ? s.recovered_events : 198;
  const inRecoveryCount = s ? s.open_events : 349;
  const notRecoveredCount = s ? s.abandoned_events : 1193;

  const recoveredPaise = impact.data?.incremental_revenue_recovered_paise ?? 15900000;
  const atRiskPaise = s ? Number(s.total_failed_payment_value) * 100 : 133400000;
  const treatmentRate = cvt.data?.treatment.recovery_rate ?? 0.135;
  const controlRate = cvt.data?.control.recovery_rate ?? 0.033;
  const absoluteLift = cvt.data?.absolute_lift ?? 0.102;

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning!" : hour < 17 ? "Good afternoon!" : "Good evening!";

  return (
    <Page className="space-y-6">
      {/* ---- GREETING & DATE FILTER ----------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>👋</span>
            <span>{greeting}</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Merchant Operations Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-[13px]">
            Real-time status, AI actions and merchant support performance
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors sm:self-auto"
        >
          <Calendar size={14} className="text-paytm-cyan" />
          <span>Today, 14 Nov 2026</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* ---- ROW 1: 4 METRIC CARDS ----------------------------------- */}
      <MetricCards
        issuesHandled={issuesHandled}
        autoResolved={1402}
        autoResolvedPct="80.6%"
        escalatedToHuman={338}
        escalatedPct="19.4%"
        avgResolutionTime="4m 26s"
      />

      {/* ---- ROW 2: 6-STEP PROCESS STEPPER ---------------------------- */}
      <ProcessStepper />

      {/* ---- ROW 3: RECOVERY PERFORMANCE & DONUT ---------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecoveryPerformanceCard
            recoveredPaise={recoveredPaise}
            atRiskPaise={atRiskPaise}
            treatmentRate={treatmentRate}
            controlRate={controlRate}
            absoluteLift={absoluteLift}
          />
        </div>
        <div className="lg:col-span-1">
          <RecoveryEventsDonut
            recovered={recoveredCount}
            inRecovery={inRecoveryCount}
            notRecovered={notRecoveredCount}
          />
        </div>
      </div>

      {/* ---- ROW 4: INTERVENTIONS & MERCHANT HEALTH ------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InterventionPerformance />
        <MerchantHealthGauge
          healthPct={92}
          healthyCount={36824}
          atRiskCount={2346}
          issueCount={1971}
        />
      </div>

      {/* ---- ROW 5: RECENT ACTIVITY & SOUNDBOX CTA ------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityFeed />
        </div>
        <div className="lg:col-span-1">
          <RecoveryCtaCard />
        </div>
      </div>
    </Page>
  );
}
