import { ArrowUpRight, Check, CircleDashed, ShieldCheck } from "lucide-react";
import type { PaytmInterventionView, PaytmConfigStatus } from "@/lib/types";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { CopyButton } from "../ui/CopyButton";
import { rupeesFromPaise, truncateId, actionLabel } from "@/lib/format";
import { cn } from "@/lib/cn";

const FLOW = ["Link created", "Awaiting payment", "Payment confirmed", "Recovered"];

function flowIndex(iv: PaytmInterventionView): number {
  if (iv.outcome_payment_recovered) return 3;
  if (iv.payment_link_paid) return 2;
  if (iv.payment_link_created) return 1;
  return 0;
}

export function PaytmCard({
  interventions,
  config,
  amountPaise,
}: {
  interventions: PaytmInterventionView[];
  config: PaytmConfigStatus;
  amountPaise: number;
}) {
  const linked = interventions.filter((iv) => iv.payment_link_created);
  const primary = linked[0];

  return (
    <Card>
      <CardHeader
        eyebrow="Payment infrastructure"
        title="Paytm recovery"
        action={
          config.test_mode ? (
            <Badge tone="accent" dot>
              Test Mode
            </Badge>
          ) : null
        }
      />
      <CardBody className="space-y-4">
        {primary ? (
          <>
            {/* State Flow */}
            <div className="flex items-center gap-1.5">
              {FLOW.map((label, i) => {
                const active = i <= flowIndex(primary);
                const isRecovered = i === 3 && flowIndex(primary) === 3;
                return (
                  <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full items-center">
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full text-[10px] ring-1 ring-inset transition-colors",
                          active
                            ? isRecovered
                              ? "bg-emerald-50 text-emerald-600 ring-emerald-200/60"
                              : "bg-sky-50 text-paytm-cyan ring-sky-200/60"
                            : "bg-slate-100 text-slate-400 ring-slate-200/60"
                        )}
                      >
                        {active ? <Check size={11} strokeWidth={3} /> : i + 1}
                      </span>
                      {i < FLOW.length - 1 ? (
                        <span
                          className={cn(
                            "h-px flex-1",
                            i < flowIndex(primary) ? "bg-paytm-cyan/40" : "bg-slate-200"
                          )}
                        />
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "text-center text-[10px] leading-tight",
                        active ? "text-slate-600" : "text-slate-400"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {primary.outcome_payment_recovered ? (
              <div className="flex animate-fade-up items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900 tnum">
                    {rupeesFromPaise(primary.recovered_amount_paise ?? amountPaise, true)}{" "}
                    recovered
                  </p>
                  <p className="text-xs text-slate-500">
                    Payment confirmed by a signature-verified Paytm webhook.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <CircleDashed size={18} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Paytm Payment Link created — not yet paid
                  </p>
                  <p className="text-xs text-slate-500">
                    Recovery stays <span className="font-medium">unconfirmed</span> until a
                    verified <code className="font-mono">payment_link.paid</code> webhook
                    arrives.
                  </p>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
              <Detail label="Action">{actionLabel(primary.action_type)}</Detail>
              <Detail label="Link status">
                <span className="capitalize">{primary.last_paytm_status ?? "—"}</span>
              </Detail>
              <Detail label="Amount">{rupeesFromPaise(amountPaise, true)}</Detail>
              <Detail label="Amount paid">
                {primary.payment_link_paid
                  ? rupeesFromPaise(primary.recovered_amount_paise ?? amountPaise, true)
                  : "₹0.00"}
              </Detail>
              <Detail label="Payment Link ID">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono text-[12px]">
                    {truncateId(primary.paytm_payment_link_id)}
                  </span>
                  {primary.paytm_payment_link_id ? (
                    <CopyButton value={primary.paytm_payment_link_id} label="" />
                  ) : null}
                </span>
              </Detail>
              <Detail label="Paytm Payment ID">
                {primary.paytm_payment_id ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-mono text-[12px]">
                      {truncateId(primary.paytm_payment_id)}
                    </span>
                    <CopyButton value={primary.paytm_payment_id} label="" />
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </Detail>
              <Detail label="Reference ID" full>
                <span className="font-mono text-[12px] text-slate-500">
                  {primary.paytm_reference_id ?? "—"}
                </span>
              </Detail>
            </dl>

            {primary.paytm_short_url ? (
              <a
                href={primary.paytm_short_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-paytm-cyan hover:underline"
              >
                Open Paytm Payment Link
                <ArrowUpRight size={14} />
              </a>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-[13px] text-slate-500">
            This recovery ran a direct intervention —{" "}
            <span className="font-medium text-slate-800">no Paytm Payment Link</span> was
            created for it. The Paytm execution path is exercised by the verified
            recovery and the live agent run.
          </div>
        )}

        <p className="border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-400">
          Test Mode only. Amount and currency come from the authoritative payment
          record, never from the model. No API keys or webhook secrets are exposed.
        </p>
      </CardBody>
    </Card>
  );
}

function Detail({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
        {label}
      </dt>
      <dd className="text-slate-800">{children}</dd>
    </div>
  );
}
