import { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Page, PageHeader } from "@/components/layout/Shell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SoundboxInspector } from "@/components/devices/SoundboxInspector";

interface DeviceRecord {
  id: string;
  merchantName: string;
  merchantId: string;
  model: string;
  status: "online" | "warning" | "offline";
  signal: string;
  battery: number;
  lastHeartbeat: string;
  city: string;
}

const SAMPLE_DEVICES: DeviceRecord[] = [
  {
    id: "SBX-99482",
    merchantName: "Sharma General Store",
    merchantId: "M88421",
    model: "Soundbox 4G",
    status: "online",
    signal: "4G (4 bars)",
    battery: 84,
    lastHeartbeat: "12s ago",
    city: "Hyderabad",
  },
  {
    id: "SBX-99419",
    merchantName: "Sri Krishna Sweets",
    merchantId: "M77219",
    model: "Soundbox 4G",
    status: "online",
    signal: "4G (4 bars)",
    battery: 92,
    lastHeartbeat: "18s ago",
    city: "Bengaluru",
  },
  {
    id: "SBX-88310",
    merchantName: "New Fashion Apparels",
    merchantId: "M66301",
    model: "Soundbox 3.0",
    status: "warning",
    signal: "3G (2 bars)",
    battery: 18,
    lastHeartbeat: "2m ago",
    city: "Delhi NCR",
  },
  {
    id: "SBX-77402",
    merchantName: "Balaji Medical Store",
    merchantId: "M55104",
    model: "Soundbox 4G",
    status: "online",
    signal: "4G (3 bars)",
    battery: 76,
    lastHeartbeat: "45s ago",
    city: "Mumbai",
  },
  {
    id: "SBX-66190",
    merchantName: "Gupta Electricals",
    merchantId: "M44208",
    model: "Pocket Soundbox",
    status: "offline",
    signal: "No signal",
    battery: 0,
    lastHeartbeat: "4h ago",
    city: "Jaipur",
  },
];

export default function Devices() {
  const [q, setQ] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<DeviceRecord>(SAMPLE_DEVICES[0]);
  const [filter, setFilter] = useState<"all" | "online" | "warning" | "offline">("all");

  const filtered = SAMPLE_DEVICES.filter((d) => {
    if (filter !== "all" && d.status !== filter) return false;
    if (
      q &&
      !d.id.toLowerCase().includes(q.toLowerCase()) &&
      !d.merchantName.toLowerCase().includes(q.toLowerCase()) &&
      !d.merchantId.toLowerCase().includes(q.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <Page className="space-y-6">
      <PageHeader
        eyebrow="Hardware Operations"
        title="Devices (Soundbox)"
        description="Monitor live device health, cellular connectivity, volume levels, and execute remote troubleshooting actions across merchant hardware."
      />

      {/* Hero Telemetry Inspector for the Selected Soundbox */}
      <SoundboxInspector
        deviceId={selectedDevice.id}
        merchantName={selectedDevice.merchantName}
        merchantId={selectedDevice.merchantId}
      />

      {/* Fleet Overview Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Online & Active</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tnum">34,120</div>
          <div className="mt-1 text-xs text-slate-500">98.2% fleet operational</div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertTriangle size={15} className="text-amber-600" />
            <span>Low Battery / Weak Signal</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tnum">412</div>
          <div className="mt-1 text-xs text-slate-500">AI auto-nudges scheduled</div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-800">
            <XCircle size={15} className="text-red-600" />
            <span>Offline Devices</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tnum">198</div>
          <div className="mt-1 text-xs text-slate-500">Assigned to field engineers</div>
        </div>
      </div>

      {/* Device Fleet Table */}
      <Card className="overflow-hidden">
        <CardHeader
          eyebrow="Fleet Inventory"
          title="Merchant Soundboxes"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search device, merchant ID..."
                  className="h-8 w-48 sm:w-60 rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 text-xs outline-none focus:border-paytm-cyan focus:bg-white"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all")}
                className="h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="warning">Low Battery/Signal</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Device ID</th>
                  <th className="px-5 py-3">Merchant</th>
                  <th className="px-5 py-3">Model</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Signal</th>
                  <th className="px-5 py-3">Battery</th>
                  <th className="px-5 py-3">Heartbeat</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((device) => {
                  const isSelected = selectedDevice.id === device.id;
                  return (
                    <tr
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50/70 ${
                        isSelected ? "bg-sky-50/50" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                        #{device.id}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        <div>{device.merchantName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          #{device.merchantId} • {device.city}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{device.model}</td>
                      <td className="px-5 py-3">
                        <Badge
                          tone={
                            device.status === "online"
                              ? "success"
                              : device.status === "warning"
                                ? "warning"
                                : "danger"
                          }
                          dot
                        >
                          {device.status === "online"
                            ? "Online"
                            : device.status === "warning"
                              ? "Alert"
                              : "Offline"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{device.signal}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800 tnum">
                        {device.battery}%
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-400">
                        {device.lastHeartbeat}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDevice(device);
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-paytm-cyan text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? "Inspecting" : "Inspect"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Page>
  );
}
