import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ScrollText, ShieldCheck } from "lucide-react";
import { Page, PageHeader } from "@/components/layout/Shell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import {
  useAuditLogList,
  useEventAgentRun,
  useRecoveryPaytm,
  useAgentEventList,
} from "@/lib/queries";
import { EvidenceTrail } from "@/components/recovery/EvidenceTrail";
import { VERIFIED_RECOVERY_EVENT_ID } from "@/lib/config";
import { dateTime, num, titleCase } from "@/lib/format";
import { cn } from "@/lib/cn";

const PAGE = 40;

export default function Audit() {
  const logs = useAuditLogList();
  const [q, setQ] = useState("");
  const [actor, setActor] = useState("all");
  const [page, setPage] = useState(0);

  const verifiedRun = useEventAgentRun(VERIFIED_RECOVERY_EVENT_ID);
  const verifiedRzp = useRecoveryPaytm(VERIFIED_RECOVERY_EVENT_ID);
  const agentEvents = useAgentEventList();

  const actors = useMemo(
    () => [...new Set(logs.data?.map((l) => l.actor) ?? [])].sort(),
    [logs.data],
  );

  const filtered = useMemo(() => {
    const rows = [...(logs.data ?? [])].reverse();
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (actor !== "all" && r.actor !== actor) return false;
      if (query && !r.action.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [logs.data, q, actor]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE));
  const clamped = Math.min(page, pageCount - 1);
  const rows = filtered.slice(clamped * PAGE, clamped * PAGE + PAGE);

  const verifiedEvents =
    agentEvents.data?.filter((e) => e.recovery_event_id === VERIFIED_RECOVERY_EVENT_ID) ?? [];

  return (
    <Page>
      <PageHeader
        eyebrow="Trust & Compliance"
        title="Audit Trail"
        description="Every decision, execution and recovery is a persisted record. No secrets, no raw payloads, no model chain-of-thought are ever stored."
      />

      {/* Verified Recovery Spotlight */}
      <Card className="mb-8 border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-white shadow-xs">
        <CardHeader
          eyebrow="Verified Operations Story"
          title={
            <span className="inline-flex items-center gap-2 text-emerald-800">
              <ShieldCheck size={16} className="text-emerald-600" />
              Recovery #{VERIFIED_RECOVERY_EVENT_ID} — Paytm Test Mode, End to End
            </span>
          }
          action={
            <Link
              to={`/recoveries/${VERIFIED_RECOVERY_EVENT_ID}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-paytm-cyan hover:underline"
            >
              Open case file <ArrowRight size={13} />
            </Link>
          }
        />
        <CardBody>
          {verifiedRun.isLoading || verifiedRzp.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <EvidenceTrail agentEvents={verifiedEvents} paytm={verifiedRzp.data} />
          )}
        </CardBody>
      </Card>

      {/* System-wide activity */}
      <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        <span className="h-3.5 w-0.5 rounded-full bg-paytm-cyan/60" aria-hidden />
        System Log & Agent Telemetry
      </h2>
      <Card className="overflow-hidden">
        <CardHeader
          eyebrow="System"
          title="Activity Log"
          action={
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
                placeholder="Filter actions…"
                aria-label="Filter audit actions"
                className="h-8 w-44 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-paytm-cyan focus:bg-white focus:ring-2 focus:ring-paytm-cyan/20"
              />
              <select
                value={actor}
                onChange={(e) => {
                  setActor(e.target.value);
                  setPage(0);
                }}
                aria-label="Filter by actor"
                className="h-8 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-paytm-cyan focus:ring-2 focus:ring-paytm-cyan/20"
              >
                <option value="all">Any actor</option>
                {actors.map((a) => (
                  <option key={a} value={a}>
                    {titleCase(a)}
                  </option>
                ))}
              </select>
            </div>
          }
        />
        <CardBody className="p-0">
          {logs.isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : logs.isError ? (
            <div className="p-5">
              <ErrorState error={logs.error} onRetry={() => logs.refetch()} />
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={<ScrollText size={18} />}
              title="No matching entries"
              description="Adjust the filter or actor."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="grid grid-cols-[120px_1fr_auto] items-center gap-3 px-5 py-2.5 text-[13px] hover:bg-slate-50/60 transition-colors"
                >
                  <Badge
                    tone={
                      row.actor.includes("agent")
                        ? "accent"
                        : row.actor.includes("webhook")
                          ? "success"
                          : "neutral"
                    }
                  >
                    {titleCase(row.actor)}
                  </Badge>
                  <span
                    className={cn(
                      "min-w-0 truncate",
                      row.actor.includes("webhook") || row.actor.includes("execution")
                        ? "font-medium text-slate-800"
                        : "text-slate-600",
                    )}
                  >
                    {row.action.replace(/_/g, " ")}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-slate-400 tnum">
                    {dateTime(row.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {!logs.isLoading && filtered.length > PAGE ? (
        <div className="mt-4 flex items-center justify-between text-[13px] text-slate-500">
          <span className="tnum">
            {clamped * PAGE + 1}–{Math.min((clamped + 1) * PAGE, filtered.length)} of{" "}
            {num(filtered.length)}
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              className="text-slate-500 hover:text-slate-800 disabled:opacity-40"
              disabled={clamped === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span className="text-slate-400">
              {clamped + 1} / {pageCount}
            </span>
            <button
              className="text-slate-500 hover:text-slate-800 disabled:opacity-40"
              disabled={clamped >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </Page>
  );
}
