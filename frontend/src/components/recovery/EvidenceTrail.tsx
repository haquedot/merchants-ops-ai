import { Bot, ScrollText, Webhook, Zap } from "lucide-react";
import type { AgentEventListItem, RecoveryEventPaytm } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Row {
  actor: string;
  actorIcon: typeof Bot;
  event: string;
  detail: string;
  tone: "accent" | "success" | "neutral";
}

const EVENT_META: Record<
  string,
  { actor: string; icon: typeof Bot; label: (d: string | null) => string; tone: Row["tone"] }
> = {
  agent_recovery_run: {
    actor: "Recovery agent",
    icon: Bot,
    label: (d) => `Autonomous run — decision: ${d ?? "—"}`,
    tone: "accent",
  },
  paytm_webhook_recovery: {
    actor: "Paytm webhook",
    icon: Webhook,
    label: () => "Signature-verified payment_link.paid — recovery confirmed",
    tone: "success",
  },
  intervention_decision: {
    actor: "Recovery engine",
    icon: Zap,
    label: (d) => `Intervention selected — ${d ?? "—"}`,
    tone: "neutral",
  },
};

export function EvidenceTrail({
  agentEvents,
  paytm,
}: {
  agentEvents: AgentEventListItem[];
  paytm?: RecoveryEventPaytm;
}) {
  const rows: Row[] = [];

  const runs = agentEvents.filter((e) => e.event_type === "agent_recovery_run");
  const bestRun =
    runs.find((r) => /^(execute|escalate):/.test(r.decision ?? "")) ??
    [...runs].sort((a, b) => b.id - a.id)[0];
  const shown = agentEvents.filter(
    (e) => e.event_type !== "agent_recovery_run" || e.id === bestRun?.id
  );

  for (const ev of [...shown].sort((a, b) => a.id - b.id)) {
    const meta = EVENT_META[ev.event_type];
    if (!meta) continue;
    rows.push({
      actor: meta.actor,
      actorIcon: meta.icon,
      event: ev.event_type.replace(/_/g, " "),
      detail: meta.label(ev.decision),
      tone: meta.tone,
    });
  }

  const paid = paytm?.interventions.find((i) => i.outcome_payment_recovered);
  if (paid) {
    rows.push({
      actor: "Recovery engine",
      actorIcon: Zap,
      event: "outcome recorded",
      detail: `Outcome persisted — payment_recovered = true, amount from the Paytm payment entity${
        paid.paytm_payment_id ? ` (${paid.paytm_payment_id})` : ""
      }`,
      tone: "success",
    });
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-2 px-1 py-4 text-[13px] text-slate-500">
        <ScrollText size={14} className="text-slate-400" />
        No agent or webhook events have been recorded for this recovery yet.
      </div>
    );
  }

  return (
    <ol className="space-y-0">
      {rows.map((row, i) => {
        const Icon = row.actorIcon;
        return (
          <li
            key={i}
            className="grid animate-fade-up grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-b border-slate-100 py-3 last:border-0"
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <span
              className={cn(
                "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ring-1 ring-inset",
                row.tone === "success"
                  ? "bg-emerald-50 text-emerald-600 ring-emerald-200/60"
                  : row.tone === "accent"
                    ? "bg-sky-50 text-paytm-cyan ring-sky-200/60"
                    : "bg-slate-100 text-slate-400 ring-slate-200/60"
              )}
            >
              <Icon size={12} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[13px] font-semibold text-slate-800">{row.actor}</span>
                <span className="font-mono text-[11px] text-slate-400">{row.event}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{row.detail}</p>
            </div>
          </li>
        );
      })}
      <li className="pt-3 text-xs leading-relaxed text-slate-400">
        Every row is a real persisted record. Secrets, raw webhook payloads and model
        chain-of-thought are never stored.
      </li>
    </ol>
  );
}
