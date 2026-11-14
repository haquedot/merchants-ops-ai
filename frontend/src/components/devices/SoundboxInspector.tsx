import { useState } from "react";
import {
  Radio,
  BatteryCharging,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Signal,
  CheckCircle2,
  Clock,
  Store,
  Play,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SoundboxInspectorProps {
  deviceId?: string;
  merchantName?: string;
  merchantId?: string;
}

export function SoundboxInspector({
  deviceId = "SBX-99482",
  merchantName = "Sharma General Store",
  merchantId = "M88421",
}: SoundboxInspectorProps) {
  const [volume, setVolume] = useState(85);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAnnouncement] = useState("₹250 received on Paytm");
  const [rebooting, setRebooting] = useState(false);
  const [rebootSuccess, setRebootSuccess] = useState(false);

  const handlePlayChime = () => {
    setIsPlaying(true);
    // Simulate Soundbox voice prompt
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  };

  const handleRebootHeartbeat = () => {
    setRebooting(true);
    setTimeout(() => {
      setRebooting(false);
      setRebootSuccess(true);
      setTimeout(() => setRebootSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-[#EBF7FD] via-white to-white p-6 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#002970] text-white shadow-xs">
            <Radio size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Paytm Soundbox 4G Telemetry
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online & Heartbeat Active
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
              <span className="font-mono">Device ID: #{deviceId}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Store size={13} className="text-slate-400" />
                {merchantName} (#{merchantId})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRebootHeartbeat}
            loading={rebooting}
          >
            {rebootSuccess ? (
              <>
                <Check size={13} className="text-emerald-600" />
                Synced!
              </>
            ) : (
              <>
                <RotateCcw size={13} />
                Reset Heartbeat
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handlePlayChime}
            disabled={isPlaying}
          >
            <Play size={13} className="fill-current" />
            {isPlaying ? "Announcing..." : "Replay Chime (₹250)"}
          </Button>
        </div>
      </div>

      {/* Main Telemetry Cockpit */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Hardware Status Gauges */}
        <div className="space-y-4 rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Hardware Health & Signal
          </div>

          {/* 4G Signal */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <Signal size={15} className="text-paytm-cyan" />
              Cellular 4G Signal (Airtel)
            </span>
            <span className="font-semibold text-emerald-600">Excellent (4/4)</span>
          </div>

          {/* Battery */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <BatteryCharging size={15} className="text-emerald-600" />
              Battery Level
            </span>
            <span className="font-semibold text-slate-900 tnum">84% (Healthy)</span>
          </div>

          {/* Firmware */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <Sparkles size={15} className="text-purple-600" />
              Firmware
            </span>
            <span className="font-mono text-slate-600">v4.2.1-prod</span>
          </div>

          {/* Last Heartbeat */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <Clock size={15} className="text-slate-400" />
              Heartbeat Interval
            </span>
            <span className="font-mono text-slate-600">Every 15s (OK)</span>
          </div>
        </div>

        {/* Volume & Audio Configuration */}
        <div className="space-y-4 rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Speaker & Audio Controls
            </span>
            <span className="font-bold text-paytm-navy tnum text-xs">
              {volume}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            {volume === 0 ? (
              <VolumeX size={18} className="text-slate-400" />
            ) : (
              <Volume2 size={18} className="text-paytm-cyan" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-paytm-cyan"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setVolume(100)}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Set Max (100%)
            </button>
            <button
              onClick={() => setVolume(75)}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Reset to 75%
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Voice pack: <strong className="text-slate-800">Hindi (Female 1)</strong> • Multi-lingual audio enabled
          </div>
        </div>

        {/* Live Simulation Card with Soundbox Asset */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-sky-100 bg-white p-4 shadow-2xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-paytm-cyan">
              Simulated Announcement
            </div>
            <div className="mt-2 text-sm font-bold text-slate-900">
              &quot;{lastAnnouncement}&quot;
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Txn #TXN983421 • 11 mins ago
            </div>
          </div>

          {isPlaying ? (
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-paytm-cyan animate-pulse">
              <span className="size-2 rounded-full bg-paytm-cyan" />
              <span>Playing audio chime over speaker...</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600">
              <CheckCircle2 size={14} />
              <span>Chime acknowledged by merchant hardware</span>
            </div>
          )}

          <div className="pointer-events-none absolute -bottom-1 -right-1 w-24 opacity-90">
            <img
              src="/images/soundbox.png"
              alt="Paytm Soundbox"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
