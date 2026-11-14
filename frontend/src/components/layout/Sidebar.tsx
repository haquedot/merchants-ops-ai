import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  LifeBuoy,
  Users,
  Radio,
  Receipt,
  Sparkles,
  SlidersHorizontal,
  BarChart3,
  Settings,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/recoveries", label: "Cases & Tickets", icon: LifeBuoy },
  { to: "/merchants", label: "Merchants", icon: Users },
  { to: "/devices", label: "Devices (Soundbox)", icon: Radio },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/workflows", label: "AI Workflows", icon: Sparkles },
  { to: "/operations", label: "Operations", icon: SlidersHorizontal },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <aside
      className={cn(
        "flex h-screen w-[260px] flex-col border-r border-slate-200/80 bg-white px-4 py-5 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="px-2 pb-6">
        <Logo />
      </div>

      {/* Main Navigation Links */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                isActive
                  ? "bg-[#E5F4FC] text-paytm-navy font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-paytm-cyan"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Teammate Promo Widget */}
      <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-[#EBF7FD] to-[#E5F4FC] p-3.5 relative overflow-hidden shadow-xs">
        <div className="pr-12">
          <h4 className="text-[13px] font-bold text-paytm-navy">
            Paytm Saathi
          </h4>
          <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
            AI teammate for your merchants
          </p>
        </div>
        <img
          src="/images/soundbox.png"
          alt="Paytm Soundbox"
          className="absolute -right-1 -bottom-1 h-14 w-auto object-contain drop-shadow-sm"
        />
      </div>
    </aside>
  );
}

