import { FlaskConical } from "lucide-react";
import { Page, PageHeader } from "@/components/layout/Shell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QueryBoundary } from "@/components/ui/QueryBoundary";
import { EmptyState } from "@/components/ui/States";
import { Meter } from "@/components/ui/Bars";
import { useExperimentAnalytics, useExperimentList } from "@/lib/queries";
import type { ExperimentListItem, ExperimentResult } from "@/lib/types";
import { multiplier, num, pct, pp, rupeesCompactFromString } from "@/lib/format";

export default function Experiments() {
  const analytics = useExperimentAnalytics();
  const list = useExperimentList();

  return (
    <Page>
      <PageHeader
        eyebrow="Experimentation"
        title="A/B Experiments"
        description="Each experiment holds out a randomised control arm so the lift attributed to an intervention is causal, not selection bias."
      />

      <QueryBoundary query={analytics} skeletonHeight={400}>
        {(d) => {
          const named = d.experiments.filter((e) => e.experiment_id != null);
          if (named.length === 0) {
            return (
              <Card>
                <EmptyState
                  icon={<FlaskConical size={18} />}
                  title="No experiments recorded"
                  description="Experiment results appear here once recovery events are assigned to an experiment."
                />
              </Card>
            );
          }
          const [lead, ...rest] = named;
          return (
            <div className="space-y-4">
              <ExperimentCard exp={lead} meta={list.data?.find((x) => x.id === lead.experiment_id)} lead />
              {rest.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {rest.map((exp) => (
                    <ExperimentCard
                      key={exp.experiment_id}
                      exp={exp}
                      meta={list.data?.find((x) => x.id === exp.experiment_id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        }}
      </QueryBoundary>
    </Page>
  );
}

function ExperimentCard({
  exp,
  meta,
  lead = false,
}: {
  exp: ExperimentResult;
  meta?: ExperimentListItem;
  lead?: boolean;
}) {
  const control = exp.variants.find((v) => v.variant === "control");
  const treatment = exp.variants.find((v) => v.variant === "treatment");
  const maxRate = Math.max(...exp.variants.map((v) => v.recovery_rate), 0.01);

  return (
    <Card className={lead ? "border-sky-200/80 shadow-xs" : undefined}>
      <CardHeader
        eyebrow={`Experiment ${exp.experiment_id}`}
        title={exp.experiment_name ?? "Untitled experiment"}
        action={
          <div className="flex items-center gap-2">
            {meta?.status ? (
              <Badge tone={meta.status === "active" ? "success" : "neutral"} dot>
                {meta.status}
              </Badge>
            ) : null}
            {exp.relative_lift != null ? (
              <Badge tone="success">{multiplier(exp.relative_lift)} lift</Badge>
            ) : null}
          </div>
        }
      />
      <CardBody className="space-y-4">
        {lead && exp.absolute_lift != null ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl bg-sky-50/70 px-4 py-3 border border-sky-100">
            <span className="font-mono text-2xl font-bold text-emerald-600 tnum">
              {pp(exp.absolute_lift)}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              absolute lift over control
            </span>
            {meta?.intervention_type ? (
              <span className="ml-auto text-xs text-slate-400">
                intervention: {meta.intervention_type.replace(/_/g, " ")}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className={lead ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
          {[control, treatment].filter(Boolean).map((v) => (
            <div key={v!.variant}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[13px] font-medium capitalize text-slate-800">
                  {v!.variant === "treatment" ? "AI-driven" : "Control"}
                </span>
                <span className="font-mono text-[13px] text-slate-700 tnum">
                  {pct(v!.recovery_rate)}
                </span>
              </div>
              <Meter
                value={v!.recovery_rate}
                max={maxRate}
                tone={v!.variant === "treatment" ? "accent" : "neutral"}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                {num(v!.recovered_events)} of {num(v!.recovery_events)} recovered ·{" "}
                {rupeesCompactFromString(v!.recovered_value)}
              </p>
            </div>
          ))}
        </div>

        {!lead && exp.absolute_lift != null ? (
          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-[13px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Absolute lift
            </span>
            <span className="font-mono font-semibold text-emerald-600 tnum">
              {pp(exp.absolute_lift)}
            </span>
            {meta?.intervention_type ? (
              <span className="ml-auto text-xs text-slate-400">
                intervention: {meta.intervention_type.replace(/_/g, " ")}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
