import { useState } from "react";
import {
  Bot,
  Clock,
  Cpu,
  Flag,
  Play,
  RotateCw,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import type { AgentRunResult, ToolTraceEntry } from "@/lib/types";
import type { EventAgentRun } from "@/lib/queries";
import { useRunAgent } from "@/lib/queries";
import { AgentTimeline } from "./AgentTimeline";
import { stopReasonLabel } from "./toolMap";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ErrorState } from "../ui/States";
import { useToast } from "../ui/Toast";
import { actionLabel, ms, num } from "@/lib/format";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";

interface Props {
  recoveryEventId: number;
  persisted?: EventAgentRun;
}

function DecisionSummary({
  decision,
  chosenAction,
  reasoning,
  status,
  stopReason,
  escalationType,
  turns,
  latencyMs,
  tokens,
  model,
}: {
  decision: string;
  chosenAction: string | null;
  reasoning: string;
  status: string;
  stopReason: string;
  escalationType?: string | null;
  turns: number;
  latencyMs: number;
  tokens?: number;
  model: string;
}) {
  const escalated = status === "escalated";
  const failedSafe = status === "failed_safe";
  return (
    <div
      className={cn(
        "rounded-2xl border p-4.5 shadow-2xs",
        escalated
          ? "border-amber-200/80 bg-amber-50/60"
          : failedSafe
            ? "border-slate-200 bg-slate-50"
            : "border-sky-200/80 border-l-4 border-l-paytm-cyan bg-gradient-to-r from-sky-50/80 to-white",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "grid size-8 place-items-center rounded-xl",
            escalated
              ? "bg-amber-100 text-amber-700"
              : failedSafe
                ? "bg-slate-200 text-slate-600"
                : "bg-sky-100 text-paytm-cyan",
          )}
        >
          {escalated ? <Flag size={15} /> : failedSafe ? <TriangleAlert size={15} /> : <Sparkles size={15} />}
        </span>
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Agent Decision</p>
          <p className="text-[15px] font-bold text-slate-900">
            {chosenAction
              ? `Execute ${actionLabel(chosenAction)}`
              : escalated
                ? `Escalate — ${escalationType?.replace(/_/g, " ") ?? "human review"}`
                : stopReasonLabel(stopReason)}
          </p>
        </div>
      </div>

      {reasoning ? (
        <p className="mt-3 border-l-2 border-slate-200 pl-3 text-[13px] leading-relaxed text-slate-600">
          {reasoning}
        </p>
      ) : null}

      <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 font-medium text-slate-600">
          <Bot size={13} className="text-paytm-cyan" />{" "}
          {chosenAction
            ? `executed ${actionLabel(chosenAction)}`
            : decision.replace(/[:_]/g, " ")}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={12} /> {turns} turn{turns === 1 ? "" : "s"} · {ms(latencyMs)}
        </span>
        {tokens ? (
          <span className="inline-flex items-center gap-1">
            <Cpu size={12} /> {num(tokens)} tokens
          </span>
        ) : null}
        <span className="font-mono text-[11px] text-slate-500">{model}</span>
      </div>
    </div>
  );
}

export function AgentRunPanel({ recoveryEventId, persisted }: Props) {
  const toast = useToast();
  const runMut = useRunAgent();
  const [liveResult, setLiveResult] = useState<AgentRunResult | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  const ctx = persisted?.ctx ?? null;

  const trace: ToolTraceEntry[] = liveResult?.tool_trace ?? ctx?.tool_trace ?? [];
  const actionIncrementality =
    liveResult?.action_incrementality ?? ctx?.action_incrementality ?? null;
  const actionLiftTrend =
    liveResult?.action_lift_trend ?? ctx?.action_lift_trend ?? null;

  const executeReason = (() => {
    const ex = [...trace].reverse().find((t) => t.tool === "execute_recovery_action");
    const r = ex?.arguments?.reason;
    return typeof r === "string" && r.trim() ? r.trim() : null;
  })();
  const cleanReason = (raw: string): string => {
    if (/http\s*4\d\d|quota exceeded|rate limit|https?:\/\//i.test(raw)) {
      return (
        executeReason ??
        "The agent selected this action, then reached the Gemini free-tier rate limit and stopped safely before the run could formally conclude."
      );
    }
    return raw;
  };

  const summary = liveResult
    ? {
        decision: liveResult.decision,
        chosenAction: liveResult.chosen_action,
        reasoning: cleanReason(liveResult.reasoning_summary),
        status: liveResult.status,
        stopReason: liveResult.stop_reason,
        escalationType: liveResult.escalation_type,
        turns: liveResult.turns_used,
        latencyMs: liveResult.latency_ms,
        tokens: liveResult.token_usage?.total_tokens,
        model: liveResult.model,
      }
    : ctx
      ? {
          decision: ctx.decision,
          chosenAction: ctx.chosen_action,
          reasoning: cleanReason(ctx.reasoning_summary),
          status: ctx.status,
          stopReason: ctx.stop_reason,
          escalationType: ctx.escalation_type,
          turns: ctx.turns_used,
          latencyMs: ctx.latency_ms,
          tokens: ctx.token_usage?.total_tokens,
          model: ctx.model,
        }
      : null;

  const isScripted = summary?.model?.startsWith("demo-") ?? false;
  const run = (dryRun: boolean) => {
    setLiveResult(null);
    runMut.mutate(
      { id: recoveryEventId, dryRun },
      {
        onSuccess: (data) => {
          setLiveResult(data);
          setReplayKey((k) => k + 1);
          if (data.status === "failed_safe") {
            toast.push(
              data.stop_reason === "quota_or_api_failure"
                ? "The LLM provider is rate-limited right now — the agent degraded safely. Your data is untouched."
                : "The agent terminated safely. Nothing was changed.",
              "info",
            );
          } else if (!dryRun && data.chosen_action) {
            toast.push(
              `Live run complete — ${actionLabel(data.chosen_action)} executed. Check the Paytm card below for the real Payment Link.`,
              "success",
            );
          } else {
            toast.push("Live agent run complete.", "success");
          }
        },
        onError: (e) => {
          toast.push(
            e instanceof ApiError ? e.detail : "The live run could not start.",
            "error",
          );
        },
      },
    );
  };
  const runLive = () => run(true);
  const runLiveExecute = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "This runs the agent live and, if it decides to act, creates a REAL " +
          "Paytm Test Mode Payment Link. Continue?",
      )
    ) {
      return;
    }
    run(false);
  };

  return (
    <Card>
      <CardHeader
        eyebrow="Autonomous Operations Intelligence"
        title="Paytm Saathi Agent"
        action={
          <div className="flex items-center gap-2">
            {liveResult ? (
              <Badge tone="accent" dot>
                Live run
              </Badge>
            ) : persisted ? (
              <Badge tone="neutral" dot>
                Recorded run
              </Badge>
            ) : null}
          </div>
        }
      />
      <CardBody className="space-y-4">
        {!persisted && !liveResult && !runMut.isPending ? (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
            <p className="text-[13px] text-slate-500">
              No agent run is on record for this event. Run the autonomous agent to
              see it observe the context, score every action, and decide — one tool
              per turn.
            </p>
          </div>
        ) : null}

        {runMut.isPending ? (
          <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/70 p-4">
            <span className="grid size-8 place-items-center rounded-full bg-sky-100">
              <span className="size-2.5 animate-pulse rounded-full bg-paytm-cyan" />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-paytm-cyan">
                AI Agent Active & Investigating
              </p>
              <p className="text-xs text-slate-500">
                Calling Gemini in real time — inspecting telemetry and transaction context...
              </p>
            </div>
          </div>
        ) : null}

        {runMut.isError && !liveResult ? (
          <ErrorState error={runMut.error} onRetry={runLive} compact />
        ) : null}

        {summary ? (
          <>
            <div key={replayKey}>
              <AgentTimeline
                trace={trace}
                live={!!liveResult}
                animate
                actionIncrementality={actionIncrementality}
                actionLiftTrend={actionLiftTrend}
              />
            </div>

            <DecisionSummary {...summary} />

            {summary.status === "failed_safe" ? (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-800">
                <TriangleAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
                <span>
                  This run ended in a <span className="font-semibold">safe stop</span> (
                  {stopReasonLabel(summary.stopReason)}). Guardrails and the database are
                  unaffected — a created Payment Link is never treated as a recovery, and
                  no state is corrupted.
                </span>
              </div>
            ) : null}

            {isScripted ? (
              <p className="text-xs text-slate-400">
                Recorded with a deterministic provider. Use{" "}
                <span className="font-medium text-slate-600">Run again</span> for a real
                Gemini run.
              </p>
            ) : null}
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
          <Button variant="primary" size="sm" onClick={runLive} loading={runMut.isPending}>
            {liveResult || persisted ? <RotateCw size={13} /> : <Play size={13} />}
            {liveResult || persisted ? "Run again" : "Run recovery agent"}
          </Button>
          <Button variant="secondary" size="sm" onClick={runLiveExecute} loading={runMut.isPending} className="border-sky-200 text-paytm-navy hover:bg-sky-50">
            <Zap size={13} className="text-paytm-cyan fill-current" />
            Run live + create Paytm Payment Link
          </Button>
        </div>
        <p className="text-[11px] text-slate-400">
          <strong className="text-slate-600">Run recovery agent</strong> — dry run, real LLM reasoning, no external side effect.{" "}
          <strong className="text-paytm-navy">Run live + create Paytm Payment Link</strong> — executes safe real-world action on Paytm Test Mode.
        </p>
      </CardBody>
    </Card>
  );
}
