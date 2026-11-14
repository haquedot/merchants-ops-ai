import { Link } from "react-router-dom";
import { ArrowLeftRight, MessageCircle, MessageSquare, RefreshCw, ArrowRight } from "lucide-react";

interface ActionItem {
  id: string;
  name: string;
  icon: typeof ArrowLeftRight;
  iconBg: string;
  rate: number; // e.g. 12.7
  recovered: string;
  cost: string;
}

const DEFAULT_ACTIONS: ActionItem[] = [
  {
    id: "switch",
    name: "Payment method switch",
    icon: ArrowLeftRight,
    iconBg: "bg-sky-50 text-sky-600 border-sky-100",
    rate: 12.7,
    recovered: "₹24.1 K",
    cost: "₹12",
  },
  {
    id: "whatsapp",
    name: "WhatsApp nudge",
    icon: MessageCircle,
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rate: 10.7,
    recovered: "₹32.3 K",
    cost: "₹8",
  },
  {
    id: "sms",
    name: "SMS nudge",
    icon: MessageSquare,
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
    rate: 10.2,
    recovered: "₹37.0 K",
    cost: "₹2",
  },
  {
    id: "retry",
    name: "Smart retry",
    icon: RefreshCw,
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    rate: 9.7,
    recovered: "₹54.8 K",
    cost: "₹6",
  },
];

export function InterventionPerformance() {
  const maxRate = 14;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Intervention Performance
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              By recovery method
            </p>
          </div>
          <Link
            to="/analytics"
            className="inline-flex items-center gap-1 text-xs font-semibold text-paytm-cyan hover:text-sky-600 transition-colors"
          >
            View details <ArrowRight size={13} />
          </Link>
        </div>

        {/* Action List */}
        <div className="mt-6 space-y-4">
          {DEFAULT_ACTIONS.map((item) => {
            const Icon = item.icon;
            const barWidth = Math.min(100, (item.rate / maxRate) * 100);

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <div
                      className={`flex size-6 items-center justify-center rounded-md border ${item.iconBg}`}
                    >
                      <Icon size={13} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 tnum">
                    {item.rate.toFixed(1)}%
                  </span>
                </div>

                {/* Progress track */}
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#002970] transition-all duration-700"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400">
                  {item.recovered} recovered · {item.cost} per recovery
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

