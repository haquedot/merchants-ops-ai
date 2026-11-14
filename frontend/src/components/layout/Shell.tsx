import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

export function Shell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-800">
      <div className="flex">
        {/* Desktop Sidebar (Fixed 260px) */}
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Logo />
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar onNavigate={() => setMobileOpen(false)} className="border-r-0 w-full" />
              </div>
            </div>
          </div>
        ) : null}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 pt-14 lg:pt-0">
          <Header />
          <main className="flex-1 min-w-0 pb-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1340px] px-4 py-6 sm:px-8 sm:py-8", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="text-[11px] font-bold uppercase tracking-wider text-paytm-cyan mb-1">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
