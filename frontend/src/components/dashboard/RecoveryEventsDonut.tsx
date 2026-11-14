interface RecoveryEventsDonutProps {
  recovered?: number;
  inRecovery?: number;
  notRecovered?: number;
}

export function RecoveryEventsDonut({
  recovered = 198,
  inRecovery = 349,
  notRecovered = 1193,
}: RecoveryEventsDonutProps) {
  const total = recovered + inRecovery + notRecovered;

  // Arc calculation for SVG donut
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Percentages & dash offsets
  const recoveredPct = total > 0 ? recovered / total : 0;
  const inRecoveryPct = total > 0 ? inRecovery / total : 0;
  const notRecoveredPct = total > 0 ? notRecovered / total : 0;

  const recoveredDash = recoveredPct * circumference;
  const inRecoveryDash = inRecoveryPct * circumference;
  const notRecoveredDash = notRecoveredPct * circumference;

  // Offsets
  const recoveredOffset = 0;
  const inRecoveryOffset = -recoveredDash;
  const notRecoveredOffset = -(recoveredDash + inRecoveryDash);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h3 className="text-[15px] font-bold text-slate-900">
        Recovery Events
      </h3>

      <div className="mt-4 flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Donut Chart with Center Text */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg
            width={size}
            height={size}
            className="-rotate-90 transform"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />

            {/* Recovered Arc (Green) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#16A34A"
              strokeWidth={strokeWidth}
              strokeDasharray={`${recoveredDash} ${circumference}`}
              strokeDashoffset={recoveredOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />

            {/* In Recovery Arc (Amber) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={strokeWidth}
              strokeDasharray={`${inRecoveryDash} ${circumference}`}
              strokeDashoffset={inRecoveryOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />

            {/* Not Recovered Arc (Slate) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#94A3B8"
              strokeWidth={strokeWidth}
              strokeDasharray={`${notRecoveredDash} ${circumference}`}
              strokeDashoffset={notRecoveredOffset}
              className="transition-all duration-700"
            />
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 tnum">
              {total.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Total Cases
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex w-full flex-col justify-center space-y-3 sm:w-auto">
          <div className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#16A34A]" />
              <span className="text-slate-600">Recovered</span>
            </div>
            <span className="font-bold text-slate-900 tnum">
              {recovered.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-slate-600">In Recovery</span>
            </div>
            <span className="font-bold text-slate-900 tnum">
              {inRecovery.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#94A3B8]" />
              <span className="text-slate-600">Not Recovered</span>
            </div>
            <span className="font-bold text-slate-900 tnum">
              {notRecovered.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

