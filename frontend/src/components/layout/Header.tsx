import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export function Header() {
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-sm">
      {/* Global Search Bar */}
      <div className="w-full max-w-md">
        <div className="relative flex items-center">
          <Search
            size={16}
            className="absolute left-3.5 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search merchant, txn ID, device or case..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-16 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-paytm-cyan focus:bg-white focus:outline-none focus:ring-2 focus:ring-paytm-cyan/20 transition-all"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 shadow-2xs">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Profile Capsule */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#002970] font-semibold text-white text-xs shadow-xs">
            MH
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[13px] font-semibold text-slate-800 leading-tight group-hover:text-paytm-navy transition-colors">
              MD Merajul Haque
            </span>
            <span className="text-[11px] text-slate-500 leading-tight">
              Operations Team
            </span>
          </div>
          <ChevronDown
            size={14}
            className="text-slate-400 group-hover:text-slate-600 transition-colors"
          />
        </div>
      </div>
    </header>
  );
}

