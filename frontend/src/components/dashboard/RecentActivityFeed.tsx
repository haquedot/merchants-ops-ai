import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, UserCheck } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "resolved" | "action" | "escalated";
  title: string;
  timeAgo: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "resolved",
    title: "Soundbox volume reset for Merchant #M88421",
    timeAgo: "7m ago",
  },
  {
    id: "act-2",
    type: "action",
    title: "Replayed ₹250 announcement for Txn #TXN983421",
    timeAgo: "11m ago",
  },
  {
    id: "act-3",
    type: "escalated",
    title: "Hardware issue detected · Assigned to field ops",
    timeAgo: "18m ago",
  },
  {
    id: "act-4",
    type: "resolved",
    title: "Pending settlement reconciled (₹3,400)",
    timeAgo: "26m ago",
  },
  {
    id: "act-5",
    type: "action",
    title: "Device reconnected and heartbeat restored",
    timeAgo: "31m ago",
  },
];

export function RecentActivityFeed() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Recent Activity
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Latest actions taken by Paytm Saathi
            </p>
          </div>
          <Link
            to="/audit"
            className="inline-flex items-center gap-1 text-xs font-semibold text-paytm-cyan hover:text-sky-600 transition-colors"
          >
            View full log <ArrowRight size={13} />
          </Link>
        </div>

        {/* Activity Rows */}
        <div className="mt-5 divide-y divide-slate-100">
          {DEFAULT_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between py-2.5 text-xs transition-colors hover:bg-slate-50/60 rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Badge based on type */}
                {act.type === "resolved" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 shrink-0">
                    <CheckCircle2 size={11} className="stroke-[2.5]" />
                    Resolved
                  </span>
                ) : act.type === "action" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-200/60 shrink-0">
                    <ArrowRight size={11} className="stroke-[2.5]" />
                    Action
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200/60 shrink-0">
                    <UserCheck size={11} className="stroke-[2.5]" />
                    Escalated
                  </span>
                )}

                <span className="truncate text-slate-700 font-medium">
                  {act.title}
                </span>
              </div>

              <span className="shrink-0 text-slate-400 font-mono text-[11px] pl-3">
                {act.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
